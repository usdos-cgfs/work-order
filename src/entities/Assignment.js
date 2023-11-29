import { ValidationError } from "../primitives/ValidationError.js";
import { RequestOrg } from "./RequestOrg.js";
import Entity from "../primitives/Entity.js";

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

  Errors = ko.observableArray();

  getComponentName = () => {
    return this.CustomComponent ?? assignmentRoleComponentMap[this.Role];
  };

  getComponent = ({ request }) => {
    return {
      request: request,
      assignment: this,
      addAssignment: request.Assignments.addNew,
      completeAssignment: request.Assignments.complete,
      errors: this.Errors,
      actionComponentName: this.getComponentName(),
    };
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

  isUserActionable = (user) => {
    if (!user) user = window.WorkOrder.App.CurrentUser();
    if (!this.isActionable()) return false;
    return this.userIsDirectlyAssigned(user) || this.userIsInRequestOrg(user);
  };

  // Should we really be storing observables here?
  isExpanded = ko.observable(true);

  toggleExpanded = () => this.isExpanded(!this.isExpanded());

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
      "ActionTaker",
      "PipelineStage",
      "CustomComponent",
      "Request",
    ],
    Dashboard: ["Role", "Assignee", "Status", "Request"],
  };

  static ListDef = {
    name: "Assignments",
    title: "Assignments",
    fields: Assignment.Views.All,
  };
}
