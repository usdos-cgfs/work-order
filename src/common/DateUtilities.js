import { holidayStore } from "../entities/Holidays.js";

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

function businessDays(startDate, endDate) {
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
