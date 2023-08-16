import { requestStates } from "../../entities/Request.js";

import { requestsByStatusMap } from "../../stores/Requests.js";
import { assignmentsStore } from "../../stores/Assignments.js";

import { currentUser } from "../../infrastructure/Authorization.js";

import { makeDataTable } from "../../common/DataTableExtensions.js";

export default class MyAssignmentsModule {
  constructor(Assignments) {
    // this.listBeforeChangeSubscritption = this.MyAssignments.subscribe(
    //   this.listBeforeChangeWatcher,
    //   this,
    //   "beforeChange"
    // );
    // this.listAfterChangeSubscription = this.MyAssignments.subscribe(
    //   this.listAfterChangeWatcher
    // );
  }
  HasLoaded = ko.observable(false);

  IsLoading = requestsByStatusMap.get(requestStates.open).IsLoading;
  AllOpenRequests = requestsByStatusMap.get(requestStates.open).List;

  MyAssignments = ko.pureComputed(() => {
    if (window.DEBUG)
      console.log("All open requests: ", this.AllOpenRequests());
    const myAssignedRequests = this.AllOpenRequests().filter(
      (request) => request.Assignments.list.CurrentUserAssignments().length
    );
    if (window.DEBUG) console.log("My assigned Requests: ", myAssignedRequests);
    return myAssignedRequests;
  });

  listBeforeChangeWatcher = () => {
    if (window.DEBUG) console.log("destroying table");
    if (!this.Table) return;
    this.Table.clear().destroy();
  };

  listAfterChangeWatcher = () => {
    if (window.DEBUG) console.log("creating table");
    setTimeout(() => (this.Table = makeDataTable("my-assignments-table")), 20);
  };

  myPostProcessingLogic = (nodes) => {
    this.Table = makeDataTable("my-assignments-table");
  };

  init = async () => {
    this.HasLoaded(true);
  };

  dispose = () => {
    this.listAfterChangeSubscription.dispose();
    this.listAfterChangeSubscription.dispose();
  };
}
