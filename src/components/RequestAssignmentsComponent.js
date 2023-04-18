import { Assignment } from "../entities/Assignment.js";

export class RequestAssignmentsComponent {
  constructor({ request, context }) {
    this.RequestId = request.ID;
    this.RequestTitle = request.Title;
    this.RequestAssignmentsBlob = request.AssignmentsBlob;
    this._context = context;
  }

  StoredAssignments = ko.pureComputed({
    write: (arr) => {
      this.RequestAssignmentsBlob(JSON.stringify(arr));
    },
    read: () => {
      return JSON.parse(this.RequestAssignmentsBlob());
    },
  });

  Assignments = ko.observableArray();

  IsLoading = ko.observable();

  Refresh = async () => {
    this.IsLoading(true);
    // const assignments = await this._context.Assignments.Find(
    //   {
    //     ID: this.RequestId(),
    //     Title: this.RequestTitle(),
    //   },
    //   Assignment.Views.All
    // );
    // this.Assignments(assignments);
    this.IsLoading(false);
  };
}
