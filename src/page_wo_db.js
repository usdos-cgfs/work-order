import { RequestDetail } from "./models/ServiceRequest.js";
import { InitSal } from "./common/sal.js";

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
  const requestDetail = await RequestDetail({ title: "230330-6165" });

  const publicMembers = {
    requestDetail,
  };

  return publicMembers;
};
