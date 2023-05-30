import { RequestEntity } from "../entities/Request.js";

export class RequestsByStatusComponent {
  constructor({ status, view }) {
    this.filter = status;
    this.view = view;
  }

  TemplateId = "tmpl-requests-by-status";

  query = () =>
    '<View Scope="RecursiveAll"><Query><Where><And>' +
    `<Eq><FieldRef Name="RequestStatus"/><Value Type="Text">${this.filter}</Value></Eq>` +
    '<Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq>' +
    "</And></Where><OrderBy><FieldRef Name='ID' Ascending='FALSE'/></OrderBy></Query></View>";

  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);

  FilteredRequests = ko.observableArray();

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
        { startIndex: null, count: 10 },
        RequestEntity.Views.ByStatus,
        false
      );

    this.FilteredRequests(requestsByStatus.results);
    const end = new Date();
    console.log(`Request by status ${this.filter}:`, end - start);
    this.HasLoaded(true);
    this.IsLoading(false);
  };

  Init = async () => {
    if (this.HasLoaded() || this.IsLoading()) {
      return;
    }
    await this.refreshRequests();
  };
}
