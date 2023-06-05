import { makeDataTable } from "../../common/DataTableExtensions.js";
import { RequestEntity } from "../../entities/Request.js";
import { Assignment } from "../../entities/Assignment.js";

export default class RequestsByStatusTableModule {
  constructor({
    activeRequestSet,
    filteredRequests = null,
    enableActionOfficeFeatures = false,
    showAssignees = false,
  }) {
    this.enableActionOfficeFeatures = enableActionOfficeFeatures;
    this.ActiveSet = activeRequestSet;
    console.log("New active Table Module");
    this.filter = this.ActiveSet.filter;
    this.FilteredRequests = filteredRequests ?? this.ActiveSet.List;
    this.IsLoading = this.ActiveSet.IsLoading;
    this.HasLoaded = this.ActiveSet.HasLoaded;
    this.ShowAssignees(showAssignees);
  }

  ShowAssignees = ko.observable();

  getTableElementId = () => "tbl-requests-status-" + this.filter?.toLowerCase();

  refresh = async () => {
    this.Table.clear();
    this.Table.destroy();
    await this.ActiveSet.load();
    this.Table = makeDataTable(this.getTableElementId());
  };

  myPostProcessingLogic = (nodes) => {
    this.init();
  };

  init = async () => {
    await this.ActiveSet.init();
    this.Table = makeDataTable(this.getTableElementId());
  };
}
