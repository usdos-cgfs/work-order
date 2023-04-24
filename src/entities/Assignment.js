export const assignmentStates = {
  InProgress: "In Progress",
  Completed: "Completed",
  Approved: "Approved",
  Rejected: "Rejected",
};

export const assignmentRoles = {
  ActionResolver: "Action Resolver",
  Approver: "Approver",
  Viewer: "Viewer",
  Subscriber: "Subscriber",
};

export class Assignment {
  constructor() {}

  ID;
  Title;
  Role;

  static CreateFromObject = function (assignment) {
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
  };

  static ListDef = {
    name: "Assignment",
    title: "Assignment",
    fields: Assignment.Views.All,
  };
}
