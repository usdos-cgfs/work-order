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

  MyOpenAssignments = assignmentsStore.getOpenByUser(currentUser());

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
