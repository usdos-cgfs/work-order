import { RequestDetailView, DisplayModes } from "./views/RequestDetailView.js";
import { NewRequestView } from "./views/NewRequestView.js";
import { InitSal } from "./infrastructure/SAL.js";
import { RequestOrg, requestOrgStore } from "./entities/RequestOrg.js";
import "./infrastructure/ApplicationDbContext.js";
import ApplicationDbContext from "./infrastructure/ApplicationDbContext.js";
import { PipelineStage, pipelineStageStore } from "./entities/Pipelines.js";
import { ServiceType, serviceTypeStore } from "./entities/ServiceType.js";

var WorkOrder = window.WorkOrder || {};

document.addEventListener("DOMContentLoaded", function (event) {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitDB, "sp.js")
  );
});

async function InitDB() {
  //const { WorkOrder } = await import("./models/WorkOrder.js");
  await InitSal();
  WorkOrder.Report = await NewReport.Create();
  ko.applyBindings(WorkOrder.Report);
}

export const Tabs = {
  MyRequests: "my-requests-tab",
  RequestDetail: "request-detail-tab",
};

class NewReport {
  constructor() {
    this._context = new ApplicationDbContext();
    this.Tab.subscribe(tabHasChanged);
  }

  Tab = ko.observable();
  TabClicked = (data, e) => this.Tab(e.target.getAttribute("id"));

  RequestDetail = ko.observable();
  OpenRequests = ko.observableArray();

  Config = {
    pipelineStageStore,
    requestOrgStore,
    serviceTypeStore,
  };

  // Views
  NewRequestView = new NewRequestView();
  RequestDetailView = ko.observable();

  Init = async function () {
    configLists: {
      var pipelinesPromise = this._context.ConfigPipelines.FindAll(
        PipelineStage.Fields
      ).then((val) => this.Config.pipelineStageStore);

      var requestOrgsPromise = this._context.ConfigRequestOrgs.FindAll(
        RequestOrg.Fields
      ).then(this.Config.requestOrgStore);

      var serviceTypePromise = this._context.ConfigServiceTypes.FindAll(
        ServiceType.Fields
      ).then((arr) => this.Config.serviceTypeStore(arr.sort(sortByTitle)));

      const configResults = await Promise.all([
        requestOrgsPromise,
        pipelinesPromise,
        serviceTypePromise,
      ]);
    }
  };

  static Create = async function () {
    const report = new NewReport();
    await report.Init();
    return report;
  };

  NewRequest = (data, e) => {
    const props = { _context: this._context, displayMode: DisplayModes.New };
    if (data && data.ID) {
      props.serviceType = data;
    }
    this.RequestDetailView(new RequestDetailView(props));
    this.Tab(Tabs.RequestDetail);
  };

  ViewRequest = async function () {
    var title = "230330-6165";
    this.RequestDetailView(
      await RequestDetailView.ViewRequest({
        title,
        _context: this._context,
      })
    );
  };
}

const tabHasChanged = (newTab) => {
  var tabTriggerElement = document.getElementById(newTab);
  var tab = new bootstrap.Tab(tabTriggerElement);
  tab.show();
};

const sortByTitle = (a, b) => {
  if (a.Title > b.Title) {
    return 1;
  }
  if (a.Title < b.Title) {
    return -1;
  }
  return 0;
};
