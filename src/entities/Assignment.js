import { ValidationError } from "../primitives/ValidationError.js";
import { RequestOrg } from "./RequestOrg.js";
import Entity from "../primitives/Entity.js";
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
  Assigner: "Assigner",
  Viewer: "Viewer",
  Subscriber: "Subscriber",
};

export const assignmentRoleComponentMap = {
  "Action Resolver": "resolver-actions",
  Approver: "approver-actions",
  Assigner: "assigner-actions",
};

export const activeAssignmentsError = {
  source: "current-stage-active-assignments",
  type: "current-stage",
  description: "Please complete all assignments",
};

export class Assignment extends Entity {
  constructor({
    ID,
    Title,
    Assignee,
    RequestOrg,
    PipelineStage,
    IsActive = true,
    Role,
    CustomComponent = null,
  }) {
    super({ ID, Title });

    this.Assignee = Assignee;
    this.RequestOrg = RequestOrg;
    this.PipelineStage = PipelineStage;
    this.IsActive = IsActive;
    this.Role = Role;
    this.CustomComponent = CustomComponent;
  }

  Role;

  getComponentName = () => {
    return this.CustomComponent ?? assignmentRoleComponentMap[this.Role];
  };

  userIsDirectlyAssigned = (user) => {
    return this.Assignee?.ID == user.ID || user.isInGroup(this.Assignee);
  };

  userIsInRequestOrg = (user) => {
    return user.isInRequestOrg(this.RequestOrg);
  };

  isActionable = () => {
    return [
      assignmentRoles.ActionResolver,
      assignmentRoles.Approver,
      assignmentRoles.Assigner,
    ].includes(this.Role);
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
      "RequestOrg",
      "IsActive",
      "Comment",
      "CompletionDate",
      "CanDelegate",
      "ActionTaker",
      "PipelineStage",
      "CustomComponent",
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
