import { makeDataTable } from "../../common/DataTableExtensions.js";
import { requestStates } from "../../entities/Request.js";
import { Assignment } from "../../entities/Assignment.js";

import { assignmentsStore } from "../../stores/Assignments.js";

// TODO: Medium - Add Current Stage to Open Orders table

export default class RequestsByStatusTableModule {
  constructor({ activeRequestSet, filteredRequests = null, key = "office" }) {
    this.key = key;
    this.ActiveSet = activeRequestSet;
    this.filter = this.ActiveSet.filter;
    this.FilteredRequests = filteredRequests ?? this.ActiveSet.List;
    this.IsLoading = this.ActiveSet.IsLoading;
    this.HasLoaded = this.ActiveSet.HasLoaded;
    this.listBeforeChangeSubscriber = this.FilteredRequests.subscribe(
      this.listBeforeChangeWatcher,
      this,
      "beforeChange"
    );
    this.listChangeSubscriber = this.FilteredRequests.subscribe(
      this.listWatcher
    );
  }

  hasInitialized = false;

  requestDateBackground = (request) => {
    if (new Date() > request.Dates.EstClosed.Value()) return "table-danger";
  };

  getTableElementId = () =>
    "tbl-requests-status-" + this.key + this.filter?.toLowerCase();

  refresh = async () => {
    await this.ActiveSet.load();
  };

  getRequestAssignments = assignmentsStore.getByRequest;

  listBeforeChangeWatcher = () => {
    if (!this.Table) return;
    this.Table.clear().destroy();
  };

  listWatcher = () => {
    if (this.hasInitialized)
      setTimeout(
        () => (this.Table = makeDataTable(this.getTableElementId())),
        20
      );
    //this.Table.draw();
  };

  myPostProcessingLogic = (nodes) => {
    this.init();
  };

  init = async () => {
    await this.ActiveSet.init();
    this.Table = makeDataTable(this.getTableElementId());
    this.hasInitialized = true;
  };

  dispose = () => {
    this.listBeforeChangeSubscriber.dispose();
    this.listChangeSubscriber.dispose();
  };
}
