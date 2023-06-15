import { Assignment, assignmentStates } from "../entities/Assignment.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { actionTypes } from "../entities/Action.js";
import { assignmentRoles } from "../entities/Assignment.js";

import { NewAssignmentComponent } from "./NewAssignmentComponent.js";

import {
  roles,
  AssignmentFunctions,
  stageActionRoleMap,
  currentUser,
} from "../infrastructure/Authorization.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

import { registerServiceTypeComponent } from "../common/KnockoutExtensions.js";

export class RequestAssignmentsComponent {
  constructor(params) {
    Object.assign(this, params);
    this.newAssignmentComponent = new NewAssignmentComponent({
      addAssignment: this.addNew,
    });
  }

  // Section for pipeline Assignments area
}
