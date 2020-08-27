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
window.console = window.console || { log: function () {} };

//Add a method for peeking the last element of an array
// Similar to .pop(), but doesn't remove the element
// Array.prototype.peek = function() {
//    return this[this.length - 1];
// }

function convertModelToViewfield(model) {
  vf = "<ViewFields>";
  for (i = 0; i < model.length; i++) {
    vf = vf + "<FieldRef Name='" + model[i] + "'/>";
  }

  vf += "</ViewFields>";

  return vf;
}

function updateUrlParam(param, val) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  urlParams.set(param, val);

  window.history.pushState({}, "", "?" + urlParams.toString());
}

function getUrlParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

var pageViewModel = ["Title", "ViewArea", "ViewBody"];

var linkViewModel = ["Title", "LinkType", "LinkUrl"];

function makeDataTable(id) {
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
          //var columnValues = [];
          //var columnTitle = $(column.header()).html();
          // $(column.header()).append("<br>");
          var select = $('<select><option value=""></option></select>')
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
        });
    },
  });
}

function businessDaysFromDate(date, businessDays) {
  var counter = 0,
    tmp = new Date(date);
  while (businessDays >= 0) {
    tmp.setTime(date.getTime() + counter * 86400000);
    if (isBusinessDay(tmp) && !isConfigHoliday(tmp)) {
      --businessDays;
    }
    ++counter;
  }
  return tmp;
}

function isConfigHoliday(date) {
  let isHoliday = vm.configHolidays().find((hol) => {
    let day = hol.Date.getUTCDate() == date.getUTCDate();
    let month = hol.Date.getUTCMonth() == date.getUTCMonth();
    let year = hol.Date.getUTCFullYear() == date.getUTCFullYear();

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

function timedNotification(message, timeout = 2000) {
  let notifyId = SP.UI.Notify.addNotification(message, true);

  window.setTimeout(() => SP.UI.Notify.removeNotification(notifyId), timeout);
}

function loadListDefsToSP() {
  $.each(woViews, function (name, view) {
    //vm["listRef" + name]().setValuePairs(["ListDef", JSON.stringify(view.listDef]));

    if (view.spid && view.spid != null) {
      console.log("Saving: ", view.name);
      vm.listRefConfigServiceType().updateListItem(
        view.spid,
        [["ListDef", JSON.stringify(view.listDef)]],
        () => console.log("saved")
      );
    }
  });
}

function loadPipelinesToSP() {
  $.each(vm.configServiceTypes(), function (index, serviceType) {
    console.log(serviceType);
    let vp = [
      ["Title", "Assigned"],
      ["ServiceType", serviceType.ID.toString()],
      ["Step", 2],
      ["ActionType", "Pending Resolution"],
    ];
    vm.listRefConfigPipelines().createListItem(vp, function (idx) {
      console.log("Index Created", idx);
    });
  });
}

function buildROFoldersServiceTypes() {
  // Build a folder for each Requesting Office in each of our lists
  window.alert = function () {};
  vm.configServiceTypes().forEach((stype) => {
    if (stype.listRef) {
      console.log("Creating ", stype.Title);
      buildROFolders(stype.listRef);
    }
  });
}

function buildROFoldersAssocLists() {
  buildROFolders(vm.listRefAction());
  buildROFolders(vm.listRefApproval());
  buildROFolders(vm.listRefAssignment());
  buildROFolders(vm.listRefComment());
  buildROFolders(vm.listRefWO());
  buildROFolders(vm.libRefWODocs());
}

function buildROFolders(listRef) {
  // Build a folder for each Requesting Office in each of our lists
  window.alert = function () {};

  let actionOffices = [
    ...new Set(
      vm.configActionOffices().map((ao) => ao.AOGroup.get_lookupValue())
    ),
  ];

  vm.configRequestingOffices().forEach((ro) => {
    let vp = [[]];
    listRef.createListFolder(ro.Title, (id) => {
      console.log(`Create Folder Success:  ${ro.Title} id: ${id}`);
      let vp = [[ro.ROGroup.get_lookupValue(), "Restricted Contribute"]];
      vp.push(["workorder Owners", "Full Control"]);
      vp.push(["workorder Members", "Contribute"]);
      actionOffices.forEach((ao) => vp.push([ao, "Restricted Contribute"]));
      listRef.setItemPermissions(id, vp);
      console.log(`Setting Permissions: ${vp[0][0]} - ${vp[0][1]}`);
    });
  });
}

function createROGroups() {
  // Create a group for each RO and assign the restricted read role.
  vm.configRequestingOffices().forEach((ro) => {
    createSiteGroup("RO_" + ro.Title, ["Restricted Read"], "workorder Owners");
  });
}

//For Each open request, get the servicetyp
function fetchServiceTypesfromRequest() {
  vm.allOpenOrders().forEach((req) => {
    vm.listRefConfigServiceType().getListItems(
      '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
        req.ServiceType.get_lookupValue() +
        "</Value></Eq></Where></Query></View>",
      (val) =>
        console.log(
          "Found Match: " +
            req.ServiceType.get_lookupValue() +
            " == " +
            val[0].Title
        )
    );
  });
}

function syncListDefs() {
  let cnt = 0;
  vm.listDefs().forEach((listDef) => {
    let strListDef = JSON.stringify(listDef);
    let stype = vm
      .configServiceTypes()
      .find((stype) => stype.UID == listDef.uid);
    if (stype.ListDef != strListDef) {
      cnt++;
      //Our listdefs don't match, update the sharepoint item.
      vm.listRefConfigServiceType().updateListItem(
        stype.ID,
        [["ListDef", strListDef]],
        () => {
          console.log("updated: ", stype.Title);
          if (!--cnt) {
            alert("Synchronized all lists, reloading");
            location.reload();
          }
        }
      );
    }
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
  var intersection = new Set([...setA].filter((x) => setB.has(x)));
  return Array.from(intersection);
}
