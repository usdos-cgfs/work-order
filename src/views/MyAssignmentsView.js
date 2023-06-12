import { assignmentsStore } from "../stores/Assignments.js";

export default class MyAssignmentsView {
  constructor() {
    this.init();
  }

  HasLoaded = ko.observable(false);

  init = async () => {
    await assignmentsStore.init();
    this.HasLoaded(true);
  };
}
