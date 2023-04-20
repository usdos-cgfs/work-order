import { Assignment, assignmentStates } from "../entities/Assignment.js";
import { NewAssignmentComponent } from "./NewAssignmentComponent.js";

export class RequestAssignmentsComponent {
  constructor({ request, assignments, context }) {
    this.request = request;
    this._context = context;
    this.Assignments = assignments;
    this.request.ObservableID.subscribe(this.requestIdWatcher);
  }

  // StoredAssignments = ko.pureComputed({
  //   write: (arr) => {
  //     this.RequestAssignmentsBlob(JSON.stringify(arr));
  //   },
  //   read: () => {
  //     return JSON.parse(this.RequestAssignmentsBlob());
  //   },
  // });

  AssignmentStates = assignmentStates;

  Assignments;

  IsLoading = ko.observable();

  InProgress = ko.pureComputed(() =>
    this.Assignments().filter(
      (assignment) => assignment.Status == assignmentStates.InProgress
    )
  );

  requestIdWatcher = (newId) => {
    this.refreshAssignments();
  };

  refreshAssignments = async () => {
    if (!this.request.ID) return;
    this.IsLoading(true);
    const assignments = await this._context.Assignments.FindByRequestId(
      this.request.ID,
      Assignment.Views.All
    );
    this.Assignments(assignments);
    this.IsLoading(false);
  };

  addAssignment = async (assignment = null) => {
    if (!this.request.ID || !assignment) return;
    // assignment = {
    //   ID: 12,
    //   Title: "Test Assignment",
    //   Role: "SuperAdmin",
    // };
    // const assignmentObj = Assignment.CreateFromObject(assignment);
    if (!assignment.RequestOrg) {
      const reqOrg = this.request.PipelineComponent.CurrentStage()?.RequestOrg;
      assignment.RequestOrg = reqOrg;
    }
    const folderPath = this.request.getRelativeFolderPath();
    const newAssignmentId = await this._context.Assignments.AddEntity(
      assignment,
      folderPath,
      this.request
    );
    this.refreshAssignments();
  };

  removeAssignment = async (assignment) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;
    try {
      await this._context.Assignments.RemoveEntity(assignment);
    } catch (e) {
      console.error("Unable to remove assignment", e);
      return;
    }
    this.refreshAssignments();
  };

  newAssignmentComponent = new NewAssignmentComponent({
    addAssignment: this.addAssignment,
  });
}
