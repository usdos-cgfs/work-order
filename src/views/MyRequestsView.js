import { getUrlParam, setUrlParam } from "../common/Router.js";
import { requestStates } from "../entities/Request.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";
import { requestsByStatusMap } from "../stores/Requests.js";

const tableComponentMap = {};
tableComponentMap[requestStates.open] = "open-requests-table";
tableComponentMap[requestStates.fulfilled] = "closed-requests-table";
tableComponentMap[requestStates.cancelled] = "closed-requests-table";
tableComponentMap[requestStates.rejected] = "closed-requests-table";

export class MyRequestsView {
  constructor() {
    this.RequestsByStatusMap = requestsByStatusMap;
    this.init();
    this.ActiveKey(requestStates.open);
  }

  async init() {
    const openRequests = this.RequestsByStatusMap.get(requestStates.open);
    await openRequests.init();
    this.HasLoaded(true);
  }

  HasLoaded = ko.observable(false);
  ActiveKey = ko.observable();

  ActiveTableComponentName = ko.pureComputed(
    () => tableComponentMap[this.ActiveKey()]
  );

  ActiveTableParams = ko.pureComputed(() => {
    const activeRequestSet = this.RequestsByStatusMap.get(this.ActiveKey());
    const filteredRequests = activeRequestSet.List;
    return {
      activeRequestSet,
      filteredRequests,
      key: "my",
    };
  });

  StatusOptions = ko.pureComputed(() => {
    return [...this.RequestsByStatusMap.keys()];
  });
}
