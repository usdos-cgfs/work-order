import { registerServiceTypeComponent } from "../common/KnockoutExtensions.js";
import {
  assignmentStates,
  assignmentRoleComponentMap,
} from "../entities/Assignment.js";

export default class PipelineStageAssignments {
  constructor({
    stage,
    assignments,
    activityQueue,
    context,
    serviceTypeEntity,
    serviceType,
  }) {
    this.ServiceTypeEntity = serviceTypeEntity;
    this.ServiceType = serviceType;
    this.Stage = stage;
    this.Assignments = assignments;
    this.ActivityQueue = activityQueue;
    this._context = context;
  }

  getActiveAssignmentComponents = ko.pureComputed(() => {
    const stage = this.Stage();
    const assignments = this.Assignments()
      .filter(
        (assignment) =>
          assignment.PipelineStage?.ID == stage.ID &&
          assignment.Status == assignmentStates.InProgress
      )
      .map((assignment) => {
        return {
          assignment,
          completeAssignment: this.completeAssignment,
          actionComponentName: ko.observable(
            assignmentRoleComponentMap[assignment.Role]
          ),
        };
      });

    return assignments;
  });

  getCustomAssignmentComponent = ko.pureComputed(() => {
    const stage = this.Stage();
    const serviceType = this.ServiceType();
    if (!stage || !serviceType || !stage.ActionTemplateId) {
      return;
    }
    registerServiceTypeComponent(
      stage.ActionTemplateId,
      this.ServiceType().UID
    );
    return stage.ActionTemplateId;
  });

  completeAssignment = async (assignment, action) => {
    const updateEntity = {
      ID: assignment.ID,
      Status: assignmentStates[action],
      CompletionDate: new Date().toISOString(),
      ActionTaker: currentUser(),
    };
    await this._context.Assignments.UpdateEntity(updateEntity);

    this.ActivityQueue.push({
      activity: actionTypes[action],
      data: updateEntity,
    });
  };
}
