import { makeDataTable } from "../../common/DataTableExtensions.js";
import { RequestEntity } from "../../entities/Request.js";
import { Assignment } from "../../entities/Assignment.js";

export default class RequestsByStatusModule {
  // TODO: each request could be a subcomponent
  constructor({ status, view, showAssignments, data, openAssignments }) {
    this.filter = status;
    this.view = view;
    this.ShowAssignees(showAssignments);
    this.OpenAssignments = openAssignments;
    this.FilteredRequests = data;
  }
  filter = null;

  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);
  ShowAssignees = ko.observable(true);
  // FilteredRequests = ko.observableArray();

  Cursor = null;

  Table = null;

  myPostProcessingLogic = (nodes) => {
    this.Init();
  };

  loadAssignments = async () => {
    this.ShowAssignees(true);
    await Promise.all(
      this.FilteredRequests().map((request) => {
        return request.Assignments.refresh(Assignment.Views.Dashboard);
      })
    );
    this.OpenAssignments([]);
    this.FilteredRequests().map((request) =>
      this.OpenAssignments.push(...request.Assignments.list.All())
    );
  };

  refreshRequests = async () => {
    this.IsLoading(true);
    const start = new Date();

    const requestsByStatus =
      await this.view._context.Requests.FindByLookupColumn(
        { column: "RequestStatus", value: this.filter },
        { orderByColumn: "Title", sortAsc: false },
        {},
        RequestEntity.Views.ByStatus,
        false
      );

    this.FilteredRequests(requestsByStatus.results);
    if (this.ShowAssignees()) {
      await this.loadAssignments();
    }
    this.Cursor = requestsByStatus;
    const end = new Date();
    console.log(`Request by status ${this.filter}:`, end - start);
    this.HasLoaded(true);
    this.IsLoading(false);
  };

  getTableElementId = () => "tbl-status-" + this.filter?.toLowerCase();

  Init = async () => {
    if (this.HasLoaded() || this.IsLoading()) {
      return;
    }
    if (!this.FilteredRequests().length) {
      await this.refreshRequests();
    }
    this.Table = makeDataTable(this.getTableElementId());
  };
}
