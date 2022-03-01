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
  Workorder.Common.Components = new Workorder.Common.NewComponents();
}

Workorder.Common.NewUtilities = function () {
  var queries = {};
  queries.itemsByTitle = function (title) {
    return (
      '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
      '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
      '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
      title +
      "</Value></Eq></And></Where></Query></View>"
    );
  };

  function peoplePickerIsEmpty(id) {
    var pickerControl =
      SPClientPeoplePicker.SPClientPeoplePickerDict[id + "_TopSpan"];
    var editId = "#" + pickerControl.EditorElementId;
    jQuery(editId).val(userName);

    // Resolve the User
    return pickerControl.HasResolvedUsers();
  }

  function setPeoplePicker(id, userName) {
    var pickerControl =
      SPClientPeoplePicker.SPClientPeoplePickerDict[id + "_TopSpan"];

    // Check if this has been set, if so, remove
    while (pickerControl.HasResolvedUsers()) {
      pickerControl.DeleteProcessedUser();
    }
    var editId = "#" + pickerControl.EditorElementId;
    jQuery(editId).val(userName);

    // Resolve the User
    pickerControl.AddUnresolvedUserFromEditor(true);
  }

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

  publicMembers = {
    queries: queries,
    peoplePickerIsEmpty: peoplePickerIsEmpty,
    setPeoplePicker: setPeoplePicker,
    createElementFromHTML: createElementFromHTML,
  };

  return publicMembers;
};

Workorder.Common.NewComponents = function () {
  function DocumentStore() {
    var doc = ko.observableArray([]);

    function setValue(initialValue) {
      if (initialValue) {
        doc(JSON.parse(initialValue));
        return;
      }
      doc([]);
    }

    function getValue() {
      return JSON.stringify(doc());
    }

    function clearValue() {
      doc([]);
    }

    function getValueHuman() {
      // Overload this in your component object, see DateTable
      if (!this.getValueHumanComponent) {
        return getValue();
      }
      return this.getValueHumanComponent();
    }

    // function commitChanges() {
    //   var currCtx = new SP.ClientContext.get_current();
    //   var web = currCtx.get_web();
    //   //Now push to the request item:
    //   var requestList = web.get_lists().getByTitle(listTitle);
    //   oListItem = requestList.getItemById(itemId);
    //   oListItem.set_item(columnName, JSON.stringify(record()));
    //   oListItem.update();

    //   currCtx.load(oListItem);

    //   currCtx.executeQueryAsync(
    //     function onSuccess() {
    //       // console.log("Added User");
    //     },
    //     function onFailure(args, sender) {
    //       console.error("Failed to commit changes - " + columnName, args);
    //     }
    //   );
    // }

    var publicMembers = {
      doc,
      setValue,
      getValue,
      getValueHuman,
      clearValue,
      // commitChanges,
    };
    return publicMembers;
  }

  function DateTable() {
    let self = this;
    let newDate = new DateComponent();
    let documentStore = new DocumentStore();

    var getValueHumanComponent = function () {
      // TODO: refactor to human readable table
      return this.getValue();
    };

    var deleteEntry = function (entryToDelete) {
      let tempArr = this.doc().filter(function (dateEntry) {
        return dateEntry.identifier != entryToDelete.identifier;
      });

      this.doc(tempArr);
    };

    var publicMembers = {
      ...documentStore,
      newDate,
      deleteEntry,
    };
    return publicMembers;
  }

  function DateComponent() {
    var date = new DateField();
    var label = ko.observable();
    var save = function () {
      this.doc.push({
        identifier: Date.now(),
        date: date.date(),
        label: label(),
      });
    };
    var publicMembers = {
      date,
      label,
      save,
    };
    return publicMembers;
  }

  var publicMembers = {
    DateTable,
    DocumentStore: DocumentStore,
  };

  return publicMembers;
};

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
  var results = new RegExp("[?&]" + param + "=([^&#]*)").exec(
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
      dom:
        "<'ui stackable grid'" +
        "<'row'" +
        "<'eight wide column'l>" +
        "<'right aligned eight wide column'f>" +
        ">" +
        "<'row dt-table'" +
        "<'sixteen wide column'tr>" +
        ">" +
        "<'row'" +
        "<'six wide column'i>" +
        "<'center aligned four wide column'B>" +
        "<'right aligned six wide column'p>" +
        ">" +
        ">",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      order: [[0, "desc"]],
      iDisplayLength: 25,
      deferRender: true,
      bDestroy: true,
      // columnDefs: [{ width: "10%", targets: 0 }],
      initComplete: function () {
        this.api()
          .columns()
          .every(function () {
            var column = this;
            var tbl = $(column.header()).closest("table");
            // Set the row we want our filter to show up in
            // var filterCell = tbl.find("thead tr:eq(1) th").eq(column.index());
            var filterCell = $(column.footer());

            var select = $(
              '<select class="ui long compact dropdown search selection multiple"><option value=""></option></select>'
            );
            switch (filterCell.attr("data-filter")) {
              case "select-filter":
                select.attr("multiple", "true");
              case "single-select-filter":
                select.appendTo(filterCell.empty()).on("change", function () {
                  var vals = $(this).val();
                  if (!vals) {
                    vals = [];
                  } else {
                    vals = vals.map(function (value) {
                      return value
                        ? "^" + $.fn.dataTable.util.escapeRegex(value) + "$"
                        : null;
                    });
                  }
                  var val = vals.join("|");
                  column.search(val, true, false).draw();
                });
                // Populate our select option values based on column cells.
                column
                  .data()
                  .unique()
                  .sort()
                  .each(function (optionText, j) {
                    // first try to parse html
                    try {
                      let parsedElement = $(optionText);

                      if (parsedElement.is("a")) {
                        optionText = parsedElement.text();
                      }
                    } catch (e) {
                      //Nothing to do here, it's not valid html
                    }
                    select.append(
                      '<option value="' +
                        optionText +
                        '">' +
                        optionText +
                        "</option>"
                    );
                  });
                break;
              case "search-filter":
                $(
                  '<div class="ui fluid input">' +
                    '<input type="text" placeholder="Search..." style="width: 100%"/>' +
                    "</div>"
                )
                  .appendTo(filterCell.empty())
                  .on("keyup change clear", function () {
                    const inputSearchText =
                      this.getElementsByTagName("input")[0].value;
                    if (column.search() !== inputSearchText) {
                      column.search(inputSearchText).draw();
                    }
                  });
                break;
              case "bool-filter":
                // Does this row contain data?
                var checkbox = $('<input type="checkbox"></input>')
                  .appendTo(filterCell.empty())
                  .change(function () {
                    if (this.checked) {
                      column.search("true").draw();
                    } else {
                      column.search("").draw();
                    }
                  });
                break;
              default:
            }
            if (filterCell.attr("clear-width")) {
              // Clear width to contents
              tbl.find("thead tr:eq(0) th").eq(column.index()).width("");
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
