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

const assignmentRoleComponentMap = {
  "Action Resolver": "resolver-actions",
  Approver: "approver-actions",
};

export class RequestAssignmentsComponent {
  constructor({ request, stage, assignments, activityQueue }) {
    this.request = request;
    this.Stage = stage;
    this.Assignments = assignments;
    this.ActivityQueue = activityQueue;
    this.ServiceType = request.ServiceType;
    this._context = getAppContext();

    this.request.ObservableID.subscribe(this.requestIdWatcher);

    if (this.request.ID) {
      this.refreshAssignments();
    }
  }

  Assignments;

  IsLoading = ko.observable(false);

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
    assignments?.forEach(
      (asg) => (asg.RequestOrg = RequestOrg.FindInStore(asg.RequestOrg))
    );
    this.Assignments(assignments);
    this.IsLoading(false);
  };

  addAssignment = async (assignment = null) => {
    if (!this.request.ID || !assignment) return;

    if (!assignment.RequestOrg) {
      const reqOrg = this.Stage()?.RequestOrg;
      assignment.RequestOrg = reqOrg;
    }

    if (!assignment.PipelineStage) {
      assignment.PipelineStage = this.Stage();
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
    this.ActivityQueue.push({
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
    this.ActivityQueue.push({
      activity: actionTypes.Unassigned,
      data: assignment,
    });
  };

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
        .map((asg) => this.completeAssignment(asg, assignmentStates.Approved))
    );
    //this.refreshAssignments();
  }

  completeAssignment = async (assignment, action) => {
    const updateEntity = {
      ID: assignment.ID,
      Status: assignmentStates[action],
      Comment: assignment.Comment,
      CompletionDate: new Date().toISOString(),
      ActionTaker: currentUser(),
    };
    await this._context.Assignments.UpdateEntity(updateEntity);

    this.refreshAssignments();
    this.request.ActivityQueue.push({
      activity: actionTypes[action],
      data: updateEntity,
    });
  };

  // Section for pipeline Assignments area

  CurrentStage = {
    Validation: {
      IsValid: ko.pureComputed(
        () => !this.CurrentStage.Validation.Errors().length
      ),
      Errors: ko.observableArray(),
      setActiveAssignmentsError: (activeAssignments) => {
        if (activeAssignments) {
          // If we have assignment components and there isn't already a variable set
          if (
            this.CurrentStage.Validation.Errors.indexOf(
              activeAssignmentsError
            ) < 0
          ) {
            this.CurrentStage.Validation.Errors.push(activeAssignmentsError);
          }
        } else {
          this.CurrentStage.Validation.Errors.remove(activeAssignmentsError);
        }
      },
    },
    userCanAdvance: ko.pureComputed(() => {
      return this.CurrentStage.userActionAssignments();
    }),
    userActionAssignments: ko.pureComputed(() => {
      // Return all assignments that require action e.g. Approve/Reject, Action Resolver
      const stage = this.Stage();
      if (!stage) {
        return [];
      }

      const userAssignments = this.Assignments().filter(
        (assignment) =>
          assignment.PipelineStage?.ID == stage.ID &&
          assignment.Assignee?.ID == currentUser()?.ID
      );
      this.CurrentStage.Validation.setActiveAssignmentsError(
        userAssignments.find(
          (assignment) => assignment.Status == assignmentStates.InProgress
        )
      );
      return userAssignments;
    }),
    AssignmentComponents: {
      Generic: ko.pureComputed(() => {
        const stage = this.Stage();
        if (!stage) {
          return [];
        }
        const assignmentComponents =
          this.CurrentStage.userActionAssignments().map((assignment) => {
            return {
              assignment,
              completeAssignment: this.completeAssignment,
              errors: this.CurrentStage.Validation.Errors,
              actionComponentName: ko.observable(
                assignmentRoleComponentMap[assignment.Role]
              ),
            };
          });

        return assignmentComponents;
      }),
      Custom: ko.pureComputed(() => {
        const stage = this.Stage();
        const serviceType = this.ServiceType.Def();
        const serviceTypeEntity = this.ServiceType.Entity();
        if (
          !stage ||
          !serviceType ||
          !serviceType.UID ||
          !stage.ActionComponentName ||
          !serviceTypeEntity
        ) {
          return;
        }
        try {
          registerServiceTypeComponent(
            stage.ActionComponentName,
            serviceType.UID
          );
          return {
            actionComponentName: stage.ActionComponentName,
            serviceType: this.ServiceType,
            request: this.request,
            errors: this.CurrentStage.Validation.Errors,
          };
        } catch (e) {
          console.error(
            `Error registering declared assignment action: ${stage.ActionComponentName}`,
            e
          );
        }
      }),
      Any: ko.pureComputed(
        () =>
          this.CurrentStage.AssignmentComponents.Generic().length ||
          this.CurrentStage.AssignmentComponents.Custom()
      ),
    },
  };

  async createStageAssignments(stage = null) {
    stage = stage ?? this.Stage();
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
}

const activeAssignmentsError = {
  source: "current-stage-active-assignments",
  type: "current-stage",
  description: "Please complete all assignments",
};
