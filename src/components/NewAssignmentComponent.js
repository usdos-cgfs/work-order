import { assignmentStates } from "../entities/Assignment.js";
import { roles } from "../infrastructure/Authorization.js";

export class NewAssignmentComponent {
  constructor({ addAssignment }) {
    this.addAssignment = addAssignment;
  }

  Assignee = ko.observable();
  Role = ko.observable();

  Roles = Object.keys(roles).map((key) => {
    return {
      key,
      value: roles[key].LookupValue,
    };
  });

  submit = async () => {
    const assignment = {
      Role: roles[this.Role().key],
      Assignee: this.Assignee(),
    };
    try {
      await this.addAssignment(assignment);
    } catch (e) {
      console.error("Unable to save assignment", e);
      alert("Something went wrong saving the assignment");
      return;
    }
    this.Assignee(null);
    this.Role(null);
  };
}
