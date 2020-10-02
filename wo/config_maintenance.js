var configServiceTypeListDef = {
  name: "ConfigServiceTypes",
  title: "ConfigServiceTypes",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
    st_list: { type: "Text", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    DescriptionRequired: { type: "Bool", koMap: "empty" },
    AttachmentRequired: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    ListDef: { type: "Text", koMap: "empty" },
    ElementID: { type: "Text", koMap: "empty" },
    DaysToCloseBusiness: { type: "Text", koMap: "empty" },
    DaysToCloseDisp: { type: "Text", koMap: "empty" },
    KPIThresholdYellow: { type: "Text", koMap: "empty" },
    KPIThresholdGreen: { type: "Text", koMap: "empty" },
    Icon: { type: "Text", koMap: "empty" },
    UID: { type: "Text", koMap: "empty" },
  },
};

function koviewmodel() {
  var self = this;

  self.selectedServiceType = ko.observable();
  self.serviceTypeOptions = ko.observableArray();

  self.newDef = ko.observable();

  self.serviceTypeList = ko.observable(new SPList(configServiceTypeListDef));

  self.prettifyJson = ko.pureComputed({
    read: function () {
      return JSON.stringify(
        JSON.parse(self.selectedServiceType().listDef),
        undefined,
        4
      );
    },
    write: function (newJson) {
      self.newDef(JSON.stringify(JSON.parse(newJson)));
    },
  });
}

function updateServiceDef() {
  let vp = [["ListDef", vm.newDef()]];

  vm.serviceTypeList().updateListItem(vm.selectedServiceType().ID, vp, () =>
    console.log("success")
  );
}

function initApp() {
  // Initialize ViewModel
  vm = new koviewmodel();
  ko.applyBindings(vm);

  vm.serviceTypeList().getListItems("<Query></Query>", (items) =>
    vm.serviceTypeOptions(items)
  );
}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
