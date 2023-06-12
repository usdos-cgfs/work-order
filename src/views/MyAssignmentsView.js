import { assignmentsStore } from "../stores/Assignments.js";

export default class MyAssignmentsView {
  constructor() {
    this.init();
    this.IsLoading = assignmentsStore.IsLoading;
  }

  HasLoaded = ko.observable(false);

  init = async () => {
    await assignmentsStore.init();
    this.HasLoaded(true);
  };
}
