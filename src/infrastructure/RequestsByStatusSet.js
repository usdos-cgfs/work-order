import { getAppContext } from "./ApplicationDbContext.js";
import { RequestEntity } from "../entities/Request.js";

export class RequestsByStatusSet {
  constructor(status, includeAssignments) {
    this.includeAssignments = includeAssignments;
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

    const requests = requestsByStatus.results;
    if (this.includeAssignments) {
      requests.map((request) => request.Assignments.refresh());
    }
    this.List(requests);

    const end = new Date();
    if (window.DEBUG)
      console.log(
        `Request by status Set - ${this.filter}: ${requests.length} cnt in ${
          end - start
        }`
      );
    this.HasLoaded(true);
    this.IsLoading(false);
  };

  init = async () => {
    if (this.HasLoaded()) {
      return;
    }
    if (this.IsLoading()) {
      return new Promise((resolve, reject) => {
        this.isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
          this.isLoadingSubscription.dispose();
          resolve();
        });
      });
    }
    await this.load();
  };

  dispose() {
    if (this.isLoadingSubscription) this.isLoadingSubscription.dispose();
  }

  includeAssignments = async () => {};
}
