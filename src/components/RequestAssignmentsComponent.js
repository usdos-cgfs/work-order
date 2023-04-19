import { Assignment } from "../entities/Assignment.js";

export class RequestAssignmentsComponent {
  constructor({ request, getFolderPath, context }) {
    this.requestEntity = request;
    this._context = context;
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

  refresh = async () => {
    this.IsLoading(true);
    const assignments = await this._context.Assignments.FindByRequestId(
      this.requestEntity.ID,
      Assignment.Views.All
    );
    this.Assignments(assignments);
    this.IsLoading(false);
  };

  addAssignment = (assignment) => {};
}
