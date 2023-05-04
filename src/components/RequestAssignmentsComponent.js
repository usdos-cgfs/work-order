import { Assignment, assignmentStates } from "../entities/Assignment.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { actionTypes } from "../entities/Action.js";

import { NewAssignmentComponent } from "./NewAssignmentComponent.js";
import {
  roles,
  AssignmentFunctions,
  stageActionRoleMap,
  currentUser,
} from "../infrastructure/Authorization.js";
import { assignmentRoles } from "../entities/Assignment.js";

const assignmentRoleComponentMap = {
  "Action Resolver": "resolver-actions",
  Approver: "approver-actions",
};

export class RequestAssignmentsComponent {
  constructor({ request, assignments, context }) {
    this.request = request;
    this._context = context;
    this.Assignments = assignments;
    this.activityLog = request.ActivityLog;
    this.request.ObservableID.subscribe(this.requestIdWatcher);

    if (this.request.ID) {
      this.refreshAssignments();
    }
  }

  Assignments;

  IsLoading = ko.observable();

  InProgress = ko.pureComputed(() =>
    this.Assignments().filter(
      (assignment) => assignment.Status == assignmentStates.InProgress
    )
  );

  requestIdWatcher = (newId) => {
    this.refreshAssignments();
  };

  refreshAssignments = async () => {
    if (!this.request.ID) return;
    this.IsLoading(true);
    const assignments = await this._context.Assignments.FindByRequestId(
      this.request.ID,
      Assignment.Views.All
    );
    this.Assignments(assignments);
    this.IsLoading(false);
  };

  addAssignment = async (assignment = null) => {
    if (!this.request.ID || !assignment) return;

    if (!assignment.RequestOrg) {
      const reqOrg = this.request.State.Stage()?.RequestOrg;
      assignment.RequestOrg = reqOrg;
    }

    if (!assignment.PipelineStage) {
      assignment.PipelineStage = this.request.State.Stage();
    }

    assignment.Status = assignment.Role.initialStatus;

    const folderPath = this.request.getRelativeFolderPath();

    const newAssignmentId = await this._context.Assignments.AddEntity(
      assignment,
      folderPath,
      this.request
    );
    this.refreshAssignments();

    //this.request.ActivityLog.assignmentAdded(assignment);
    this.request.ActivityQueue.push({
      activity: actionTypes.Assigned,
      data: assignment,
    });
  };

  removeAssignment = async (assignment) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;
    try {
      await this._context.Assignments.RemoveEntity(assignment);
    } catch (e) {
      console.error("Unable to remove assignment", e);
      return;
    }
    this.refreshAssignments();

    //this.request.ActivityLog.assignmentRemoved(assignment);
    this.request.ActivityQueue.push({
      activity: actionTypes.Unassigned,
      data: assignment,
    });
  };

  async createStageAssignments(stage = null) {
    stage = stage ?? this.request.State.Stage();
    const newAssignment = {
      RequestOrg: stage.RequestOrg,
      PipelineStage: stage,
      IsActive: true,
      Role: stageActionRoleMap[stage.ActionType],
    };

    if (
      stage.AssignmentFunction &&
      AssignmentFunctions[stage.AssignmentFunction]
    ) {
      const people = AssignmentFunctions[stage.AssignmentFunction].bind(
        this.request
      )();
      if (people && people.Title) {
        newAssignment.Assignee = people;
        //TODO: Trigger permissions update based on role
      }
    } else {
      newAssignment.Assignee = RequestOrg.FindInStore(
        stage.RequestOrg
      )?.UserGroup;
    }

    await this.addAssignment(newAssignment);
  }

  newAssignmentComponent = new NewAssignmentComponent({
    addAssignment: this.addAssignment,
  });

  async approveUserAssignments(user) {
    const userAssignments = await Promise.all(
      this.Assignments()
        .filter(
          (assignment) =>
            assignment.Role == assignmentRoles.Approver &&
            assignment.Status == assignmentStates.InProgress &&
            assignment.Assignee?.ID == user.ID
        )
        .map(this.approveAssignment)
    );
    this.refreshAssignments();
  }

  approveAssignment = async (assignment) => {
    const updateEntity = {
      ID: assignment.ID,
      Status: assignmentStates.Approved,
      CompletionDate: new Date().toISOString(),
      ActionTaker: currentUser(),
    };
    await this._context.Assignments.UpdateEntity(updateEntity);

    this.request.ActivityQueue.push({
      activity: actionTypes.Approved,
      data: updateEntity,
    });
  };

  rejectAssignment = async (assignment) => {
    const updateEntity = {
      ID: assignment.ID,
      Status: assignmentStates.Rejected,
      CompletionDate: new Date().toISOString(),
      ActionTaker: currentUser(),
    };
    await this._context.Assignments.UpdateEntity(updateEntity);

    this.request.ActivityQueue.push({
      activity: actionTypes.Rejected,
      data: updateEntity,
    });
  };

  completeAssignment = async (assignment, action) => {
    const updateEntity = {
      ID: assignment.ID,
      Status: assignmentStates[action],
      CompletionDate: new Date().toISOString(),
      ActionTaker: currentUser(),
    };
    await this._context.Assignments.UpdateEntity(updateEntity);

    this.request.ActivityQueue.push({
      activity: actionTypes[action],
      data: updateEntity,
    });
  };
}
