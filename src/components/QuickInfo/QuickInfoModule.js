import { assignmentStates } from "../../entities/Assignment.js";
import { currentUser } from "../../infrastructure/Authorization.js";
export default class QuickInfoModule {
  constructor({ allOpenAssignments, allOpenRequests }) {
    this.AllOpenRequests = allOpenRequests;
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
    return this.AllOpenRequests().filter((request) => {
      return request.Dates.EstClosed.ObservableDateTime() <= new Date();
    });
  });
}
