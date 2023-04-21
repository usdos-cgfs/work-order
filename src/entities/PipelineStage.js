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

  static Views = {
    All: [
      "ID",
      "Title",
      "ServiceType",
      "Step",
      "ActionType",
      "RequestOrg",
      "WildCardAssignee",
      "AssignmentFunction",
    ],
  };

  static ListDef = {
    name: "ConfigPipelines",
    title: "ConfigPipelines",
    fields: PipelineStage.Views.All,
  };
}

export const pipelineStageStore = ko.observableArray();
