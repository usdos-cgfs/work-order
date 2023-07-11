import { getUrlParam, setUrlParam } from "../common/Router.js";
import { requestStates } from "../entities/Request.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";
import { requestsByStatusMap } from "../stores/Requests.js";

const byServiceTypeKey = "By Service Type";

// These are all registered component names
const tableComponentMap = {};
tableComponentMap[requestStates.open] = "open-requests-table";
tableComponentMap[requestStates.fulfilled] = "closed-requests-table";
tableComponentMap[requestStates.cancelled] = "closed-requests-table";
tableComponentMap[requestStates.rejected] = "closed-requests-table";
tableComponentMap[byServiceTypeKey] = "requests-by-service-type";

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
    if (this.RequestsByStatusMap.has(this.ActiveKey())) {
      const activeRequestSet = this.RequestsByStatusMap.get(this.ActiveKey());
      return {
        activeRequestSet,
        filteredRequests: activeRequestSet.List,
        key: "my",
      };
    }
    return {
      key: "my",
    };
  });

  StatusOptions = ko.pureComputed(() => {
    return [...this.RequestsByStatusMap.keys()];
  });
}
