var configActionOfficesListDef = {
  name: "ConfigActionOffices",
  title: "ConfigActionOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    //AOGroup: { type: "Person", koMap: "empty" },
    Active: { type: "Bool", koMap: "empty" },
    CanAssign: { type: "Bool", koMap: "empty" },
    PreferredEmail: { type: "Text", koMap: "empty" },
    RequestOrg: { type: "Lookup", koMap: "empty" },
    SysAdmin: { type: "Bool", koMap: "empty" },
    UserAddress: { type: "Person", koMap: "empty" },
  },
};

var configHolidaysListDef = {
  name: "ConfigHolidays",
  title: "ConfigHolidays",
  viewFields: {},
};
var configPipelinesListDef = {
  name: "ConfigPipelines",
  title: "ConfigPipelines",
  viewFields: {},
};

var configRequestingOfficesListDef = {
  name: "ConfigRequestingOffices",
  title: "ConfigRequestingOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
    ROGroup: { type: "Person", koMap: "empty" },
  },
};

var configRequestOrgsListDef = {
  name: "ConfigRequestOrgs",
  title: "ConfigRequestOrgs",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    OrgType: {
      type: "Text",
      koMap: "empty",
      opts: {
        ACTIONOFFICES: "Action Offices",
        REQUESTINGOFFICE: "Requesting Office",
        DEPARTMENT: "Department",
        BUDGETPMO: "Budget PMO",
      },
    },
    BreakAccess: { type: "Bool", koMap: "empty" },
    UserGroup: { type: "Person", koMap: "empty" },
    ContactInfo: { type: "Text", koMap: "empty" },
  },
};

var configServiceTypesListDef = {
  name: "ConfigServiceTypes",
  title: "ConfigServiceTypes",
  viewFields: {},
};

var configPagesListDef = {
  name: "Pages",
  title: "Pages",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    FileLeafRef: { type: "Text", koMap: "empty" },
  },
};

var PAGES = {
  ADMIN: "admin.aspx",
  APP: "app.aspx",
};

var ORGOPTS = configRequestOrgsListDef.viewFields.OrgType.opts;

var vm = {};
var app = {};

var Report = Report || {};
var Common = Common || {};
var sal = sal || {};

Report.Init = async function () {
  initSal();
  //Common.Init();
  Report.Report = await Report.NewReport();
};

Report.NewReport = async function () {
  console.log("new report");

  app = this;

  function initStaticListRefs() {
    app.listRefs = {};
    app.listRefs.requestOrgs = new sal.NewSPList(configRequestOrgsListDef);
    app.listRefs.requestingOffices = new sal.NewSPList(
      configRequestingOfficesListDef
    );
    app.listRefs.actionOffices = new sal.NewSPList(configActionOfficesListDef);
    app.listRefs.pages = new sal.NewSPList(configPagesListDef);
  }

  initStaticListRefs();

  function ViewModel() {
    var self = this;
    self.recordExists = [];

    self.allRecords = [];
  }
  vm = new ViewModel();

  async function loadAllRecords() {
    var camlQ = "<View Scope='RecursiveAll'></View>";

    vm.allRequestOrgs = await app.listRefs.requestOrgs
      .getListItemsAsync(camlQ)
      .catch((e) => {
        console.warn(e);
      });

    vm.allRequestingOffices = await app.listRefs.requestingOffices
      .getListItemsAsync(camlQ)
      .catch((e) => {
        console.warn(e);
      });

    vm.allActionOffices = await app.listRefs.actionOffices
      .getListItemsAsync(camlQ)
      .catch((e) => {
        console.warn(e);
      });

    vm.allPages = await app.listRefs.pages
      .getListItemsAsync(camlQ)
      .catch((e) => {
        console.warn(e);
      });
  }

  await loadAllRecords();

  async function assignPagePermissions(pageName, role, userArr) {
    console.log(`assigning ${role} on ${pageName} to`, userArr);
    var pageId = vm.allPages.find(function (page) {
      return page.FileLeafRef === pageName;
    }).ID;
    console.log(pageId);

    var permissionsArr = userArr.map(function (user) {
      return [user.get_lookupValue(), role];
    });
    var ownerGroup = sal.globalConfig.defaultGroups.owners;
    permissionsArr.push([
      ownerGroup.get_title(),
      sal.config.siteRoles.roles.FullControl,
    ]);
    await app.listRefs.pages.setItemPermissionsAsync(
      pageId,
      permissionsArr,
      false
    );
  }

  async function synchronize() {
    console.log("synchronizing");
    await loadAllRecords();

    let actionOffices = vm.allRequestOrgs
      .filter(function (org) {
        return org.OrgType === ORGOPTS.ACTIONOFFICES && org.UserGroup !== null;
      })
      .map(function (org) {
        return org.UserGroup;
      });

    let submittersViewers = vm.allRequestingOffices
      .filter(function (org) {
        return org.Active;
      })
      .map(function (org) {
        return org.ROGroup;
      });

    var restrictedRead = sal.config.siteRoles.roles.RestrictedRead;

    // PAGES
    // ADMIN
    //assignPagePermissions(PAGES.ADMIN, restrictedRead, actionOffices);

    // APP
    //assignPagePermissions(PAGES.APP, restrictedRead, submittersViewers);

    // CONFIGURATION LISTS:
    let permissionValuePairs = [];
    let customLists = [];

    actionOffices.concat(submittersViewers).map((user) => {
      permissionValuePairs.push([user.get_lookupValue(), restrictedRead]);
    });

    // Add site owners
    var ownerGroup = sal.globalConfig.defaultGroups.owners;
    permissionValuePairs.push([
      ownerGroup.get_title(),
      sal.config.siteRoles.roles.FullControl,
    ]);

    customLists.push(new sal.NewSPList(configActionOfficesListDef));
    customLists.push(new sal.NewSPList(configHolidaysListDef));
    customLists.push(new sal.NewSPList(configPipelinesListDef));
    customLists.push(new sal.NewSPList(configRequestingOfficesListDef));
    customLists.push(new sal.NewSPList(configRequestOrgsListDef));

    customLists.forEach(async (list) => {
      console.log(list.config.title);
      await list.setListPermissionsAsync(permissionValuePairs, false);
    });
  }
  document.getElementById("sync").onclick = synchronize;
};

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(Report.Init, "SP.JS")
  );
});
