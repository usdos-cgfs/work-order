import { Assignment, assignmentStates } from "../entities/Assignment.js";
import { requestStates } from "../constants/index.js";
import { requestsByStatusMap } from "./Requests.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";
import { currentUser } from "../infrastructure/Authorization.js";

class AssignmentsSet {
  constructor() {}
  IsLoading = ko.observable();
  HasLoaded = ko.observable(false);

  AllOpenRequests = requestsByStatusMap.get(requestStates.open).List;

  MyAssignedRequests = ko.pureComputed(() =>
    this.AllOpenRequests().filter(
      (request) =>
        request.Assignments.CurrentStage.list.UserActionAssignments().length
    )
  );

  MyActiveAssignments = ko.pureComputed(() =>
    this.MyAssignedRequests()
      .flatMap((request) =>
        request.Assignments.CurrentStage.list.UserActionAssignments()
      )
      .filter(
        (assignment) =>
          assignment.Status == assignmentStates.InProgress &&
          assignment.userIsDirectlyAssigned(currentUser())
      )
  );

  // List = ko.pureComputed(() =>
  //   this.AllOpenRequests().flatMap(request.Assignments.list.All())
  // );
  List = ko.observableArray();

  getByRequest = (request) => {
    return this.List().filter(
      (assignment) => assignment.Request.ID == request.ID
    );
  };

  getOpenByRequest = ko.pureComputed(() => {
    const openAssignments = [];
    const openRequests =
      requestsByStatusMap.get(requestStates.open)?.List() ?? [];

    //const openRequestIds = openRequests.map(request => request.ID)

    const inProgress = this.List().filter(
      (assignment) => assignment.Status == assignmentStates.InProgress
    );

    openRequests.map((request) => {
      openAssignments.push(
        ...assignmentsStore.getByRequest(request).filter((assignment) => {
          return (
            assignment.Status == assignmentStates.InProgress &&
            assignment.userIsDirectlyAssigned(currentUser())
          );
        })
      );
    });
    return openAssignments;
    //assignmentsStore.getOpenByUser(currentUser());
  });

  getOpenByUser = (user) =>
    ko.pureComputed(() =>
      this.List().filter(
        (assignment) =>
          assignment.Status == assignmentStates.InProgress &&
          assignment.userIsDirectlyAssigned(user)
      )
    );

  remove = (assignmentToRemove) => {
    this.List.remove((assignment) => assignment.ID == assignmentToRemove);
  };

  load = async () => {
    this.IsLoading(true);
    const start = new Date();

    const allAssignments = await getAppContext().Assignments.FindByColumnValue(
      [{ column: "Status", op: "eq", value: assignmentStates.InProgress }],
      { orderByColumn: "Title", sortAsc: false },
      {},
      Assignment.Views.Dashboard,
      false
    );

    this.List(allAssignments.results);

    const end = new Date();
    if (window.DEBUG)
      console.log(
        `All Assignments loaded: ${allAssignments.results.length} cnt in ${
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

  dispose = () => {
    if (this.isLoadingSubscription) this.isLoadingSubscription.dispose();
  };
}

export const assignmentsStore = new AssignmentsSet();
