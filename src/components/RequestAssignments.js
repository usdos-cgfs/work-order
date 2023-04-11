import { Assignment } from "../entities/Assignment.js";

export class RequestAssignments {
  constructor({ request, context }) {
    this.RequestId = request.ID;
    this.RequestTitle = request.Title;
    this._context = context;
  }

  List = ko.pureComputed(async () => {
    return await this._context.Assignments.FindAll(Assignment.Fields);
  });
}
