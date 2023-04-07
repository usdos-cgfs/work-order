import { RequestDetail } from "./models/ServiceRequest.js";
import { InitSal } from "./infrastructure/SAL.js";
import { RequestOrg } from "./entities/RequestOrg.js";
import "./infrastructure/ApplicationDbContext.js";
import ApplicationDbContext from "./infrastructure/ApplicationDbContext.js";

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
  WorkOrder.Report = await WorkOrder.NewReport();
  ko.applyBindings(WorkOrder.Report);
}

WorkOrder.NewReport = async function () {
  const requestDetail = ko.observable();
  const openRequests = ko.observableArray();

  const _context = new ApplicationDbContext();

  const config = {
    RequestOrgs: await _context.ConfigRequestOrgs.FindAll(RequestOrg.Fields),
  };

  async function viewRequest() {
    var title = "230330-6165";
    requestDetail(
      await RequestDetail.viewRequest({
        title,
        _context,
      })
    );
  }

  const publicMembers = {
    requestDetail,
    viewRequest,
  };

  return publicMembers;
};
