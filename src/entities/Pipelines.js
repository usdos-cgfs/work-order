export class PipelineStage {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static Create = function ({ id, value }) {
    return new PipelineStage({ id, title: value });
  };

  static Fields = [
    "ID",
    "Title",
    "ServiceType",
    "Step",
    "ActionType",
    "RequestOrg",
    "WildCardAssignee",
  ];
}

export const pipelineStageStore = ko.observableArray();
