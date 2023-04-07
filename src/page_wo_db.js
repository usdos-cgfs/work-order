import { RequestDetail } from "./models/RequestDetail.js";
import { InitSal } from "./infrastructure/SAL.js";
import { RequestOrg } from "./entities/RequestOrg.js";
import "./infrastructure/ApplicationDbContext.js";
import ApplicationDbContext from "./infrastructure/ApplicationDbContext.js";
import { PipelineStage } from "./entities/Pipelines.js";

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
  WorkOrder.Report = new NewReport();
  await WorkOrder.Report.Init();
  ko.applyBindings(WorkOrder.Report);
}

class NewReport {
  constructor() {
    this._context = new ApplicationDbContext();
  }
  Config = {};
  Tab = ko.observable();
  RequestDetail = ko.observable();
  OpenRequests = ko.observableArray();

  Init = async function () {
    configLists: {
      var requestOrgsPromise = this._context.ConfigRequestOrgs.FindAll(
        RequestOrg.Fields
      ).then((val) => (this.Config.RequestOrgs = val));

      var pipelinesPromise = this._context.ConfigPipelines.FindAll(
        PipelineStage.Fields
      ).then((val) => (this.Config.PipelineStages = val));

      const configResults = await Promise.all([
        requestOrgsPromise,
        pipelinesPromise,
      ]);
    }
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
