import { requestStates } from "../../entities/Request.js";

export default class PipelineModule {
  constructor({ request, ShowActionsArea }) {
    this.request = request;
    this.Pipeline = request.Pipeline;
    this.ShowActionsArea = ShowActionsArea;
  }

  // TODO: Show the completion date of each stage
  listItemShowBorderlessBottom = (stage) => {
    return this.Pipeline.Stage()?.Step == stage.Step && this.ShowActionsArea();
  };

  listItemTypeClass = (stage) => {
    if (stage.Step < this.Pipeline.Stage()?.Step)
      return "list-group-item-secondary";
    if (this.Pipeline.Stage()?.ID == stage.ID) {
      switch (this.request.State.Status()) {
        case requestStates.open:
          return "list-group-item-primary";
        case requestStates.cancelled:
        case requestStates.rejected:
          return "list-group-item-danger";
        case requestStates.fulfilled:
          return "list-group-item-success";
        default:
          break;
      }
    }
  };

  listItemTextClass = (stage) => {
    if (this.Pipeline.Stage()?.ID == stage.ID) {
      switch (this.request.State.Status()) {
        case requestStates.open:
          return "text-primary";
        case requestStates.rejected:
        case requestStates.cancelled:
          return "text-danger";
        case requestStates.fulfilled:
          return "text-success";
        default:
          break;
      }
    }
  };
}
