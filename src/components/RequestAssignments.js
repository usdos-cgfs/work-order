import { Assignment } from "../entities/Assignment.js";

export class RequestAssignments {
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
    const assignments = await this._context.Assignments.FindByTitle(
      this.RequestTitle()
    );
    this.Assignments(assignments);
    this.IsLoading(false);
  };

  static Create = function (props) {
    const requestAssignments = new RequestAssignments(props);
    requestAssignments.Refresh();
    return requestAssignments;
  };
}
