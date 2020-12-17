/* 
    viewmodel.js

    Define the viewmodels that we will be using for the application.
    This will be included on every page, so let's load it up.

*/
/*****************************************************************************/
/*                          Bindings                                         */
/*****************************************************************************/

/*****************************************************************************/
/*                          Models                                           */
/*****************************************************************************/
window.console = window.console || {
  log: function () {},
  error: function () {},
};

//Add a method for peeking the last element of an array
// Similar to .pop(), but doesn't remove the element
// Array.prototype.peek = function() {
//    return this[this.length - 1];
// }

var Workorder = window.Workorder || {};
Workorder.Common = Workorder.Common || {};

function InitCommon() {
  Workorder.Common.Utilities = new Workorder.Common.NewUtilities();
}

Workorder.Common.NewUtilities = function () {};

function convertModelToViewfield(model) {
  vf = "<ViewFields>";
  for (i = 0; i < model.length; i++) {
    vf = vf + "<FieldRef Name='" + model[i] + "'/>";
  }

  vf += "</ViewFields>";

  return vf;
}

function updateUrlParam(param, newval) {
  var search = window.location.search;
  //var urlParams = new URLSearchParams(queryString);

  var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
  var query = search.replace(regex, "$1").replace(/&$/, "");

  urlParams =
    (query.length > 2 ? query + "&" : "?") +
    (newval ? param + "=" + newval : "");

  window.history.pushState({}, "", urlParams.toString());
}

function getUrlParam(param) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  } else {
    return decodeURI(results[1]) || 0;
  }
}

var pageViewModel = ["Title", "ViewArea", "ViewBody"];

var linkViewModel = ["Title", "LinkType", "LinkUrl"];

function makeDataTable(id) {
  if ($(id).length) {
    $(id).DataTable({
      order: [[0, "desc"]],
      iDisplayLength: 25,
      deferRender: true,
      bDestroy: true,
      columnDefs: [{ width: "10%", targets: 0 }],
      initComplete: function () {
        //this.api().columns([1, 3, 4]).every( function () {
        // this.api()
        //   .columns()
        //   .every(function () {
        //     var tempCol = this;
        //     $("").appendTo($(tempCol.header()));
        //   });
        this.api()
          .columns()
          .every(function () {
            //this.api().columns([0, 2, 5]).every( function () {
            // colum filtering from https://datatables.net/examples/api/multi_filter_select.html
            var column = this;
            if (
              ["Assignees", "Description"].indexOf($(column.header()).html()) <
              0
            ) {
              var className = "";
              if ($(column.header()).html()) {
                className =
                  "dataTableSelect" +
                  $(column.header()).html().replace(/\s+/g, "");
              }
              //var columnValues = [];
              //var columnTitle = $(column.header()).html();
              // $(column.header()).append("<br>");
              var select = $(
                '<select class="' +
                  className +
                  '"><option value=""></option></select>'
              )
                .appendTo($(column.footer()).empty())
                //.appendTo($(column.header()))
                .on("change", function () {
                  var val = $.fn.dataTable.util.escapeRegex($(this).val());

                  column.search(val ? "^" + val + "$" : "", true, false).draw();
                });

              column
                .data()
                .unique()
                .sort()
                .each(function (d, j) {
                  select.append('<option value="' + d + '">' + d + "</option>");
                });
            }
          });
      },
    });
  }
}

function randString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/* Business days start at 0, i.e. a workorder opened and closed
 on the same day will result in 0 days passed
 */
function businessDaysFromDate(date, businessDays) {
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
  var isHoliday = vm.configHolidays().find(function (hol) {
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

  holidays = [
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

function timedNotification(message, timeout) {
  timeout = timeout === undefined ? 2000 : timeout;

  var notifyId = SP.UI.Notify.addNotification(message, true);

  window.setTimeout(function () {
    SP.UI.Notify.removeNotification(notifyId);
  }, timeout);
}

//For Each open request, get the servicetyp
function fetchServiceTypesfromRequest() {
  vm.allOpenOrders().forEach(function (req) {
    vm.listRefConfigServiceType().getListItems(
      '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
        req.ServiceType.get_lookupValue() +
        "</Value></Eq></Where></Query></View>",
      function (val) {
        console.log(
          "Found Match: " +
            req.ServiceType.get_lookupValue() +
            " == " +
            val[0].Title
        );
      }
    );
  });
}

function sortByTitle(a, b) {
  var titleA = a.Title.toUpperCase();
  var titleB = b.Title.toUpperCase();

  if (titleA < titleB) {
    return -1;
  }
  if (titleB < titleA) {
    return 1;
  }
  return 0;
}

/* Returns the intersect of two arrays */
function intersect(a, b) {
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set(
    setA
      .map(function (y) {
        return y;
      })
      .filter(function (x) {
        return setB.has(x);
      })
  );
  return Array.from(intersection);
}

function stripHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// function isFunction(possibleFunction) {
//   return typeof possibleFunction === typeof Function;
// }
