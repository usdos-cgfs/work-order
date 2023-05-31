import { makeDataTable } from "../../common/DataTableExtensions.js";
import { RequestEntity } from "../../entities/Request.js";

export default class RequestsByStatusComponent {
  constructor({ status, view }) {
    this.filter = status;
    this.view = view;
  }
  filter = null;
  TemplateId = "tmpl-requests-by-status";

  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);

  FilteredRequests = ko.observableArray();

  Cursor = null;

  Table = null;

  myPostProcessingLogic = (nodes) => {
    this.Init();
  };
  tableHasUpdated = (nodes) => {
    console.log("table updated");
  };

  loadMore = async () => {
    if (!this.Cursor) return;
    const nextPage = await this.view._context.Requests.LoadNextPage(
      this.Cursor
    );
    this.FilteredRequests.push(...nextPage.results);
    this.Cursor = nextPage;
  };

  refreshRequests = async () => {
    this.IsLoading(true);
    const start = new Date();
    // this.FilteredRequests(
    //   await this.view._context.Requests.FindAll(
    //     RequestEntity.Views.ByStatus,
    //     this.query()
    //   )
    // );
    const requestsByStatus =
      await this.view._context.Requests.FindByLookupColumn(
        { column: "RequestStatus", value: this.filter },
        { orderByColumn: "Title", sortAsc: false },
        {},
        RequestEntity.Views.ByStatus,
        false
      );

    this.FilteredRequests(requestsByStatus.results);
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
    await this.refreshRequests();
    this.Table = makeDataTable(this.getTableElementId());
  };
}
