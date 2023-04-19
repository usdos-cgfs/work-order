import { Assignment } from "../entities/Assignment.js";

export class RequestAssignmentsComponent {
  constructor({ request, context }) {
    this.request = request;
    this._context = context;
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

  Assignments = ko.observableArray();

  IsLoading = ko.observable();

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
    assignment = {
      ID: 12,
      Title: "Test Assignment",
      Role: "SuperAdmin",
    };
    const assignmentObj = Assignment.CreateFromObject(assignment);
    const folderPath = this.request.getRelativeFolderPath();
    const newAssignmentId = await this._context.Assignments.AddEntity(
      assignmentObj,
      folderPath,
      this.request
    );
    this.refreshAssignments();
  };
}
