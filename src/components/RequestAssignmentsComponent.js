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
  constructor({
    request,
    stage,
    list,
    addNew,
    remove,
    view,
    complete,
    CurrentStage,
    AreLoading,
    refresh,
    activityQueue,
  }) {
    this.request = request;
    this.Stage = stage;
    this.Assignments = list.All;
    this.addNew = addNew;
    this.removeAssignment = remove;
    this.view = view;
    this.completeAssignment = complete;
    this.ActivityQueue = activityQueue;
    this.ServiceType = request.ServiceType;
    this._context = getAppContext();
    this.refreshAssignments = refresh;
    this.AreLoading = AreLoading;
    this.CurrentStage = CurrentStage;

    this.request.ObservableID.subscribe(this.requestIdWatcher);

    // if (this.request.ID) {
    //   this.refreshAssignments();
    // }
    this.newAssignmentComponent = new NewAssignmentComponent({
      addAssignment: this.addNew,
    });
  }

  Assignments;

  requestIdWatcher = (newId) => {
    this.refreshAssignments();
  };

  async approveUserAssignments(user) {
    const userAssignments = await Promise.all(
      this.Assignments()
        .filter(
          (assignment) =>
            assignment.Role == assignmentRoles.Approver &&
            assignment.Status == assignmentStates.InProgress &&
            assignment.Assignee?.ID == user.ID
        )
        .map((asg) => this.completeAssignment(asg, assignmentStates.Approved))
    );
    //this.refreshAssignments();
  }

  // Section for pipeline Assignments area
}
