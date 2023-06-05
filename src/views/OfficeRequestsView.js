import { requestStates } from "../entities/Request.js";
import { currentUser } from "../infrastructure/Authorization.js";

import { requestsByStatusMap } from "../stores/Requests.js";

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
    this.HasLoaded(true);
  }

  HasLoaded = ko.observable(false);
  ShowAssignments = ko.observable(false);
  ActiveKey = ko.observable();

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
      enableActionOfficeFeatures: true,
      showAssignees: true,
    };
  });

  showAssignmentsWatcher = (showAssignments) => {
    console.log("assignments toggled");
  };

  StatusOptions = ko.pureComputed(() => {
    return [...this.RequestsByStatusMap.keys()];
  });
}
