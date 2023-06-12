import { assignmentRoles } from "../../entities/Assignment.js";
import {
  roles,
  stageActionRoleMap,
} from "../../infrastructure/Authorization.js";

export default class NewAssignmentComponent {
  constructor({ addAssignment, stage = null }) {
    this.stage = stage;
    this.addAssignment = addAssignment;

    if (this.stage) {
      this.Role(stageActionRoleMap[this.stage.ActionType]);
    }
  }

  Assignee = ko.observable();
  Role = ko.observable();

  Roles = Object.values(roles);
  // .map((key) => {
  //   return {
  //     key,
  //     value: roles[key].LookupValue,
  //   };
  // });

  submit = async () => {
    const assignment = {
      Role: this.Role(),
      Assignee: this.Assignee(),
      PipelineStage: this.stage,
      RequestOrg: this.stage.RequestOrg,
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
