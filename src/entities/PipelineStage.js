import { RequestOrg } from "./RequestOrg.js";

export const stageActionTypes = {
  PendingAssignment: "Pending Assignment",
  PendingApproval: "Pending Approval",
  PendingAction: "Pending Action",
  PendingResolution: "Pending Resolution",
  Notification: "Notification",
  Closed: "Closed",
};

export class PipelineStage {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    return new PipelineStage({ ID, Title: LookupValue });
  };

  static FindInStore = function (props) {
    if (!props || !props.ID) return null;
    return pipelineStageStore().find((stage) => stage.ID == props.ID);
  };

  static GetCompletedStage = function () {
    return pipelineStageStore().find(
      (stage) => stage.ActionType == stageActionTypes.Closed
    );
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "ServiceType",
      "Step",
      "ActionType",
      "ActionTargetStage",
      "Assignee",
      "RequestOrg",
      "AssignmentFunction",
      "ActionComponentName",
    ],
  };

  static ListDef = {
    name: "ConfigPipelines",
    title: "ConfigPipelines",
    fields: PipelineStage.Views.All,
  };
}

export const pipelineStageStore = ko.observableArray();
