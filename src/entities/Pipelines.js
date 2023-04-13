export class PipelineStage {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    return new PipelineStage({ ID, Title: LookupValue });
  };

  static Fields = [
    "ID",
    "Title",
    "ServiceType",
    "Step",
    "ActionType",
    "RequestOrg",
    "WildCardAssignee",
    "AssignmentFunction",
  ];
}

export const pipelineStageStore = ko.observableArray();
