import { WorkOrder } from "./models/WorkOrder.js";

document.addEventListener("DOMContentLoaded", function (event) {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitDB, "sp.js")
  );
});

function InitDB() {
  new WorkOrder();
}

// export default {
//   data() {
//     return { count: 0, workOrder: new WorkOrder() };
//   },
//   template: `<div>count is {{ count }}</div>`,
// };
