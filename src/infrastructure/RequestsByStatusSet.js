import { getAppContext } from "./ApplicationDbContext.js";
import { RequestEntity } from "../entities/Request.js";
import { Assignment } from "../entities/Assignment.js";

export class RequestsByStatusSet {
  constructor(status) {
    this.filter = status;
  }

  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);

  List = ko.observableArray();

  load = async () => {
    this.IsLoading(true);
    const start = new Date();

    const requestsByStatus = await getAppContext().Requests.FindByColumnValue(
      [{ column: "RequestStatus", value: this.filter }],
      { orderByColumn: "Title", sortAsc: false },
      {},
      RequestEntity.Views.ByStatus,
      false
    );

    this.List(requestsByStatus.results);

    const end = new Date();
    if (window.DEBUG)
      console.log(
        `Request by status Set - ${this.filter}: ${
          requestsByStatus.results.length
        } cnt in ${end - start}`
      );
    this.HasLoaded(true);
    this.IsLoading(false);
  };

  init = async () => {
    if (this.HasLoaded()) {
      return;
    }
    if (this.IsLoading()) {
      // TODO: Dispose of subscription
      return new Promise((resolve, reject) => {
        this.IsLoading.subscribe((isLoading) => resolve());
      });
    }
    await this.load();
  };

  includeAssignments = async () => {};
}
