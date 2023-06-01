import { RequestOrg } from "./RequestOrg.js";
// import { currentUser } from "../infrastructure/Authorization.js";

export const assignmentStates = {
  InProgress: "In Progress",
  Completed: "Completed",
  Approved: "Approved",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};

export const assignmentRoles = {
  ActionResolver: "Action Resolver",
  Approver: "Approver",
  Viewer: "Viewer",
  Subscriber: "Subscriber",
};

export const assignmentRoleComponentMap = {
  "Action Resolver": "resolver-actions",
  Approver: "approver-actions",
};

export const activeAssignmentsError = {
  source: "current-stage-active-assignments",
  type: "current-stage",
  description: "Please complete all assignments",
};

export class Assignment {
  constructor() {}

  ID;
  Title;
  Role;

  userIsDirectlyAssigned = (user) => {
    return this.Assignee?.ID == user.ID || user.isInGroup(this.Assignee);
  };

  userIsInRequestOrg = (user) => {
    return user.isInRequestOrg(this.RequestOrg);
  };

  static CreateFromObject = function (assignment) {
    assignment.RequestOrg = RequestOrg.FindInStore(assignment.RequestOrg);
    const newAssignment = new Assignment();
    Object.assign(newAssignment, assignment);
    return newAssignment;
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "Assignee",
      "Role",
      "Status",
      "ActionOffice",
      "RequestOrg",
      "IsActive",
      "Comment",
      "CompletionDate",
      "CanDelegate",
      "ActionTaker",
      "PipelineStage",
      "Request",
    ],
    Dashboard: ["Role", "Assignee", "Status", "Request"],
  };

  static ListDef = {
    name: "Assignment",
    title: "Assignment",
    fields: Assignment.Views.All,
  };
}
