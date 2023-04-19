import { mapObjectPropsToViewFields } from "../infrastructure/ApplicationDbContext.js";

export class Assignment {
  constructor() {}

  ID;
  Title;
  Role;

  FieldMap = {
    ID: { get: () => this.ID, set: (val) => (this.ID = val) },
    Title: { get: () => this.Title, set: (val) => (this.Title = val) },
    Role: { get: () => this.Role, set: (val) => (this.Role = val) },
  };

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
