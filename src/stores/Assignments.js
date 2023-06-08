import { Assignment, assignmentStates } from "../entities/Assignment.js";

import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

class AssignmentsSet {
  constructor() {}
  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);

  List = ko.observableArray();

  getByRequest = (request) => {
    return this.List().filter(
      (assignment) => assignment.Request.ID == request.ID
    );
  };

  getOpenByUser = (user) =>
    ko.pureComputed(() =>
      this.List().filter(
        (assignment) =>
          assignment.Status == assignmentStates.InProgress &&
          assignment.userIsDirectlyAssigned(user)
      )
    );

  load = async () => {
    this.IsLoading(true);
    const start = new Date();

    const allAssignments = await getAppContext().Assignments.FindByColumnValue(
      [{ column: "Request/ID", op: "gt", value: 0 }],
      { orderByColumn: "Title", sortAsc: false },
      {},
      Assignment.Views.Dashboard,
      false
    );

    this.List(allAssignments.results);

    const end = new Date();
    if (window.DEBUG)
      console.log(
        `All Assignments loaded: ${allAssignments.results.length} cnt in ${
          end - start
        }`
      );
    this.HasLoaded(true);
    this.IsLoading(false);
  };

  init = async () => {
    if (this.HasLoaded()) {
      return;
    }
    if (this.IsLoading()) {
      // TODO: Dispose of subscription
      return new Promise((resolve, reject) => {
        this.IsLoading.subscribe((isLoading) => resolve());
      });
    }
    await this.load();
  };
}

export const assignmentsStore = new AssignmentsSet();
