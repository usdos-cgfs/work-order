import { requestStates } from "../entities/Request.js";
import { currentUser } from "../infrastructure/Authorization.js";
import { assignmentsStore } from "../stores/Assignments.js";
import { requestsByStatusMap } from "../stores/Requests.js";

import { makeDataTable } from "../common/DataTableExtensions.js";

export default class MyAssignmentsView {
  constructor() {
    this.init();
  }

  init = async () => {
    await assignmentsStore.init();
    makeDataTable("my-assignments-table");
  };

  MyOpenAssignmentsByRequest = ko.pureComputed(() => {
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
}
