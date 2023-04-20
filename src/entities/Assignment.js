export const assignmentStates = {
  InProgress: "In Progress",
  Completed: "Completed",
  Approved: "Approved",
  Rejected: "Rejected",
};
export class Assignment {
  constructor() {}

  ID;
  Title;
  Role;

  static CreateFromObject = function (assignment) {
    const newAssignment = new Assignment();
    //mapObjectPropsToViewFields(assignment, newAssignment.FieldMap);
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
      "IsActive",
      "Comment",
      "CompletionDate",
      "CanDelegate",
      "ActionTaker",
      "PipelineStage",
    ],
  };
}

export class AssignmentBlob {
  constructor() {}
}
