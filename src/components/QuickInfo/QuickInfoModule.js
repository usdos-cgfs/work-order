import { assignmentStates } from "../../entities/Assignment.js";
import { requestStates } from "../../entities/Request.js";
import { currentUser } from "../../infrastructure/Authorization.js";

import { requestsByStatusMap } from "../../stores/Requests.js";
import { assignmentsStore } from "../../stores/Assignments.js";

export default class QuickInfoModule {
  constructor({ ShowActionOfficeFeatures, ToggleActionOfficeFeatures }) {
    this.ShowActionOfficeFeatures = ShowActionOfficeFeatures;
    this.ToggleActionOfficeFeatures = ToggleActionOfficeFeatures;
  }

  ShowActionOfficeToggle = ko.pureComputed(() => {
    return currentUser()?.IsActionOffice() && false;
  });

  MyOpenAssignments = ko.pureComputed(() => {
    const openAssignments = [];
    const openRequests =
      requestsByStatusMap.get(requestStates.open)?.List() ?? [];

    openRequests.map((request) => {
      openAssignments.push(
        ...assignmentsStore.getByRequest(request).filter((assignment) => {
          return (
            assignment.Status == assignmentStates.InProgress &&
            assignment.userIsDirectlyAssigned(currentUser())
          );
        })
      );
    });
    return openAssignments;
    //assignmentsStore.getOpenByUser(currentUser());
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
