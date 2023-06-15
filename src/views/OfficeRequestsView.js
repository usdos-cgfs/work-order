import { requestStates } from "../entities/Request.js";
import { currentUser } from "../infrastructure/Authorization.js";

import { requestsByStatusMap } from "../stores/Requests.js";
import { assignmentsStore } from "../stores/Assignments.js";

const tableComponentMap = {};
tableComponentMap[requestStates.open] = "open-office-requests-table";
tableComponentMap[requestStates.fulfilled] = "closed-requests-table";
tableComponentMap[requestStates.cancelled] = "closed-requests-table";
tableComponentMap[requestStates.rejected] = "closed-requests-table";

export class OfficeRequestsView {
  constructor() {
    this.RequestsByStatusMap = requestsByStatusMap;
    this.ShowAssignments.subscribe(this.showAssignmentsWatcher);
    this.init();
    this.ActiveKey(requestStates.open);
  }

  async init() {
    const openRequests = this.RequestsByStatusMap.get(requestStates.open);
    await openRequests.init();
    await assignmentsStore.init();

    this.HasLoaded(true);
  }

  HasLoaded = ko.observable(false);
  ShowAssignments = ko.observable(false);
  ActiveKey = ko.observable();

  ActiveTableComponentName = ko.pureComputed(
    () => tableComponentMap[this.ActiveKey()]
  );
  ActiveTableParams = ko.pureComputed(() => {
    const activeRequestSet = this.RequestsByStatusMap.get(this.ActiveKey());
    const filteredRequests = ko.pureComputed(() =>
      activeRequestSet
        .List()
        .filter((request) =>
          request.RequestOrgs().find(currentUser().isInRequestOrg)
        )
    );
    return {
      activeRequestSet,
      filteredRequests,
      key: "office",
    };
  });

  showAssignmentsWatcher = (showAssignments) => {
    console.log("assignments toggled");
  };

  StatusOptions = ko.pureComputed(() => {
    return [...this.RequestsByStatusMap.keys()];
  });
}
