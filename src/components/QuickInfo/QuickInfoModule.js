import { assignmentStates } from "../../entities/Assignment.js";
import { requestStates } from "../../entities/Request.js";
import { currentUser } from "../../infrastructure/Authorization.js";

import { requestsByStatusMap } from "../../stores/Requests.js";

export default class QuickInfoModule {
  constructor({ allOpenAssignments }) {
    this.AllOpenAssignments = allOpenAssignments;
  }

  ShowActionOfficeInfo = ko.pureComputed(() => {
    return currentUser()?.ActionOffices().length;
  });

  MyOpenAssignments = ko.pureComputed(() => {
    return this.AllOpenAssignments().filter(
      (assignment) =>
        assignment.Status == assignmentStates.InProgress &&
        assignment.userIsDirectlyAssigned(currentUser())
    );
  });

  LateRequests = ko.pureComputed(() => {
    return (
      requestsByStatusMap
        .get(requestStates.open)
        ?.List()
        ?.filter((request) => {
          return request.Dates.EstClosed.ObservableDateTime() <= new Date();
        }) ?? []
    );
  });
}
