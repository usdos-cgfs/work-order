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
  const workorder = await RequestDetail({ title: "230330-6165" });
  const test = ko.observable("test 2");

  const publicMembers = {
    workorder,
    test,
  };

  return publicMembers;
};

// export default {
//   data() {
//     return { count: 0, workOrder: new WorkOrder() };
//   },
//   template: `<div>count is {{ count }}</div>`,
// };
