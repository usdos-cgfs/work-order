import { actionTypes } from "../entities/Action.js";
import { holidayStore } from "../entities/Holiday.js";

const ONE_DAY = 1000 * 60 * 60 * 24;

export function calculateEffectiveSubmissionDate(submissionDate = null) {
  // Check the submitted date, if it's between 3 pm, (19 UTC) and midnight (4 UTC)
  // it needs to be set as submitted the next business day
  const now = submissionDate ? submissionDate : new Date();
  if (now.getUTCHours() >= 19 || now.getUTCHours() < 4) {
    console.log("its after 3, this is submitted tomorrow");
    const tomorrow = businessDaysFromDate(now, 1);
    tomorrow.setUTCHours(13);
    tomorrow.setUTCMinutes(0);
    return tomorrow;
  } else {
    return now;
  }
}

export function calculateEffectiveTimeToClose(request) {
  /** Effective Closed Date
   * - EffectiveSubmittedDate
   * - NonBusinessDays * ONE_DAY
   * - Effective Paused Duration
   */
  const closeDate = request.Dates.Closed.Value() ?? new Date();

  const effectiveClosedDate = nextBusinessDate(closeDate, -1);
  const effectiveSubmittedDate = request.Dates.Submitted.Value();

  const nonBusinessDays = calculateNonBusinessDays(
    effectiveSubmittedDate,
    effectiveClosedDate
  );
  const nonBusinessMs = nonBusinessDays * ONE_DAY;

  // get all paused/resumed actions
  const actions = request.Actions.list
    .All()
    .filter((action) =>
      [actionTypes.Paused, actionTypes.Resumed].includes(action.ActionType)
    );

  const effectivePauseDurations = [];
  let effectivePauseDuration = 0;

  for (let i = 0; i < actions.length; i++) {
    // Calculate effective paused time:
    // Get the start and end of the pause period
    // If it's paused or resumed on a non-business day
    // use the previous or next business date respectively
    //
    const pauseAction = actions[i];
    if (pauseAction.ActionType != actionTypes.Paused) {
      console.warn("Not a pause action");
    }

    const pauseActionEffectiveDate = prevBusinessDate(
      new Date(pauseAction.Created)
    );

    const effectivePauseDate =
      pauseActionEffectiveDate > effectiveSubmittedDate
        ? pauseActionEffectiveDate
        : effectiveSubmittedDate;

    const resumeAction = actions[++i];

    const resumeActionDate = resumeAction
      ? new Date(resumeAction.Created)
      : effectiveClosedDate;

    const effectiveResumeDate = nextBusinessDate(resumeActionDate);

    // Calculate the time paused that would have been accounted for by non-business days
    const pausedNonBusinessDays = calculateNonBusinessDays(
      effectivePauseDate,
      effectiveResumeDate
    );

    const pausedNonBusinessMs = pausedNonBusinessDays * ONE_DAY;

    // effective pause time
    effectivePauseDuration +=
      effectiveResumeDate - effectivePauseDate - pausedNonBusinessMs;

    // effectivePauseDuration.push(effectivePauseDuration);
  }

  const effectiveMs =
    effectiveClosedDate -
    effectiveSubmittedDate -
    nonBusinessMs -
    effectivePauseDuration;

  return effectiveMs;
}

function prevBusinessDate(date) {
  return nextBusinessDate(date, -1);
}

/**
 * If current date is a business day, returns immediately, otherwise
 * calculates next or previous business midnight
 * @param {*} date
 * @param {*} stepDir 1 or -1 for next and previous business date respectively
 * @returns
 */
function nextBusinessDate(date, stepDir = 1) {
  if (isBusinessDay(date) && !isConfigHoliday(date)) return date;
  const temp = new Date(date);
  const hours = stepDir > 0 ? 0 : 24;

  while (!isBusinessDay(temp) || isConfigHoliday(temp)) {
    temp.setDate(temp.getDate() + 1 * stepDir);
  }
  if (stepDir > 0) {
    temp.setHours(0, 0, 0, 0);
  } else {
    temp.setHours(23, 59, 59, 0);
  }
  return temp;
}

/* Business days start at 0, i.e. a workorder opened and closed
 on the same day will result in 0 days passed
 */
export function businessDaysFromDate(date, businessDays) {
  var counter = 0,
    tmp = new Date(date);
  var dayCnt = Math.abs(businessDays);

  var sign = Math.sign(businessDays);

  while (dayCnt >= 0) {
    tmp.setTime(date.getTime() + sign * counter * 86400000);
    if (isBusinessDay(tmp) && !isConfigHoliday(tmp)) {
      --dayCnt;
    }
    ++counter;
  }
  return tmp;
}

export function calculateBusinessDays(startDate, endDate) {
  var counter = 0;
  var temp = new Date(startDate);
  var stepDir = Math.sign(endDate - startDate);

  while (temp.format("yyyy-MM-dd") != endDate.format("yyyy-MM-dd")) {
    if (isBusinessDay(temp) && !isConfigHoliday(temp)) {
      counter++;
    }
    temp.setDate(temp.getDate() + 1 * stepDir);
  }
  return counter * stepDir;
}

export function calculateNonBusinessDays(startDate, endDate) {
  var counter = 0;
  var temp = new Date(startDate);
  var stepDir = Math.sign(endDate - startDate);

  while (temp.format("yyyy-MM-dd") != endDate.format("yyyy-MM-dd")) {
    if (!isBusinessDay(temp) || isConfigHoliday(temp)) {
      counter++;
    }
    temp.setDate(temp.getDate() + 1 * stepDir);
  }
  return counter * stepDir;
}

function isConfigHoliday(date) {
  var isHoliday = holidayStore().find(function (hol) {
    var day = hol.Date.getUTCDate() == date.getUTCDate();
    var month = hol.Date.getUTCMonth() == date.getUTCMonth();
    var year = hol.Date.getUTCFullYear() == date.getUTCFullYear();

    if (hol.Repeating) {
      year = true;
    }
    return day && month && year;
  });

  return isHoliday;
}

function isBusinessDay(date) {
  var dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend
    return false;
  }

  const holidays = [
    "12/31+5", // New Year's Day on a saturday celebrated on previous friday
    "1/1", // New Year's Day
    "1/2+1", // New Year's Day on a sunday celebrated on next monday
    "1-3/1", // Birthday of Martin Luther King, third Monday in January
    "2-3/1", // Washington's Birthday, third Monday in February
    "5~1/1", // Memorial Day, last Monday in May
    "7/3+5", // Independence Day
    "7/4", // Independence Day
    "7/5+1", // Independence Day
    "9-1/1", // Labor Day, first Monday in September
    "10-2/1", // Columbus Day, second Monday in October
    "11/10+5", // Veterans Day
    "11/11", // Veterans Day
    "11/12+1", // Veterans Day
    "11-4/4", // Thanksgiving Day, fourth Thursday in November
    "12/24+5", // Christmas Day
    "12/25", // Christmas Day
    "12/26+1", // Christmas Day
  ];

  var dayOfMonth = date.getDate(),
    month = date.getMonth() + 1,
    monthDay = month + "/" + dayOfMonth;

  if (holidays.indexOf(monthDay) > -1) {
    return false;
  }

  var monthDayDay = monthDay + "+" + dayOfWeek;
  if (holidays.indexOf(monthDayDay) > -1) {
    return false;
  }

  var weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1,
    monthWeekDay = month + "-" + weekOfMonth + "/" + dayOfWeek;
  if (holidays.indexOf(monthWeekDay) > -1) {
    return false;
  }

  var lastDayOfMonth = new Date(date);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  var negWeekOfMonth =
      Math.floor((lastDayOfMonth.getDate() - dayOfMonth - 1) / 7) + 1,
    monthNegWeekDay = month + "~" + negWeekOfMonth + "/" + dayOfWeek;
  if (holidays.indexOf(monthNegWeekDay) > -1) {
    return false;
  }

  return true;
}
