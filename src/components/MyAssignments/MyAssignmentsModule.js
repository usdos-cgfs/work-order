import { requestStates } from "../../entities/Request.js";

import { requestsByStatusMap } from "../../stores/Requests.js";
import { assignmentsStore } from "../../stores/Assignments.js";

import { currentUser } from "../../infrastructure/Authorization.js";

import { makeDataTable } from "../../common/DataTableExtensions.js";

export default class MyAssignmentsModule {
  constructor(Assignments) {
    this.listBeforeChangeSubscritption = this.MyAssignments.subscribe(
      this.listBeforeChangeWatcher,
      this,
      "beforeChange"
    );
    this.listAfterChangeSubscription = this.MyAssignments.subscribe(
      this.listAfterChangeWatcher
    );
  }
  HasLoaded = ko.observable(false);

  MyAssignments = ko.pureComputed(() => {
    const requestsAssignmentMap = new Map();
    const requestsMap = {};
    const myOpenRequests = requestsByStatusMap.get(requestStates.open).List();

    const myOpenAssignments = assignmentsStore.getOpenByUser(currentUser());
    myOpenAssignments().map((assignment) => {
      // if (!requestsMap[assignment.Request.Title])
      //   requestsMap[assignment.Request.Title] = myOpenRequests.find(
      //     (req) => req.ID == assignment.Request.ID
      //   );

      requestsAssignmentMap.has(assignment.Request.Title)
        ? requestsAssignmentMap.get(assignment.Request.Title).push(assignment)
        : requestsAssignmentMap.set(assignment.Request.Title, [assignment]);
    });

    const results = [];
    requestsAssignmentMap.forEach((value, key, map) => {
      const req = myOpenRequests.find((req) => req.Title == key);
      if (req) results.push({ request: req, assignments: value });
    });
    return results;
  });

  listBeforeChangeWatcher = () => {
    if (!this.Table) return;
    this.Table.clear().destroy();
  };

  listAfterChangeWatcher = () => {
    setTimeout(() => (this.Table = makeDataTable("my-assignments-table")), 20);
    //this.Table.draw();
  };

  myPostProcessingLogic = (nodes) => {
    this.init();
  };

  init = async () => {
    this.HasLoaded(true);
    this.Table = makeDataTable("my-assignments-table");
  };

  dispose = () => {
    this.listAfterChangeSubscription.dispose();
    this.listAfterChangeSubscription.dispose();
  };
}
