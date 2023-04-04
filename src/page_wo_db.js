import WorkOrder from "./models/workorder.js";

export default {
  data() {
    return { count: 0, workOrder: new WorkOrder() };
  },
  template: `<div>count is {{ count }}</div>`,
};
