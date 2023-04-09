import { RequestDetail } from "./views/RequestDetail.js";
import { InitSal } from "./infrastructure/SAL.js";
import { RequestOrg, requestOrgStore } from "./entities/RequestOrg.js";
import "./infrastructure/ApplicationDbContext.js";
import ApplicationDbContext from "./infrastructure/ApplicationDbContext.js";
import { PipelineStage } from "./entities/Pipelines.js";
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
    requestOrgStore,
    serviceTypeStore,
  };

  Init = async function () {
    configLists: {
      var requestOrgsPromise = this._context.ConfigRequestOrgs.FindAll(
        RequestOrg.Fields
      ).then(this.Config.requestOrgStore);

      var pipelinesPromise = this._context.ConfigPipelines.FindAll(
        PipelineStage.Fields
      ).then((val) => (this.Config.PipelineStages = val));

      var serviceTypePromise = this._context.ConfigServiceTypes.FindAll(
        ServiceType.Fields
      ).then(this.Config.serviceTypeStore);

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

  NewRequest = function () {
    this.RequestDetail(new RequestDetail({ _context: this._context }));
  };
  ViewRequest = async function () {
    var title = "230330-6165";
    this.RequestDetail(
      await RequestDetail.ViewRequest({
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
