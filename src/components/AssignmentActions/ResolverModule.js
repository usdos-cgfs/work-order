import { assignmentStates } from "../../entities/Assignment.js";
import { currentUser } from "../../infrastructure/Authorization.js";
import { BaseComponent } from "../index.js";
import { resolverTemplate } from "./ResolverTemplate.js";

export class ResolverModule extends BaseComponent {
  constructor(params) {
    super();
    console.log("hello from resolver module", params);

    this.assignment = params.assignment;
    this.completeAssignment = params.completeAssignment;
  }
  assignmentStates = assignmentStates;

  complete = async () => {
    console.log("complete");
    this.completeAssignment(this.assignment, assignmentStates.Completed);
  };

  completeHandler = () => {
    console.log("approved");
    // Check if we have been directly assigned or as an action office
    const assignment = this.assignment;
    if (assignment.userIsDirectlyAssigned(currentUser())) {
      this.complete();
      return;
    }

    if (assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This assignment is assigned to ${assignment.Assignee.Title}. Do you want to complete on their behalf? `
        )
      ) {
        this.complete();
      }
      return;
    }

    alert("You are not authorized to approve this request!");
  };

  static name = "resolver-actions";
  static template = resolverTemplate;
}
