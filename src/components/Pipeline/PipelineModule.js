import { actionTypes } from "../../entities/Action.js";
import { requestStates } from "../../entities/Request.js";

export default class PipelineModule {
  constructor({ request }) {
    this.request = request;
    this.Pipeline = request.Pipeline;
    this.Pipeline.Stage.subscribe(this.SelectedStage);
    this.SelectedStage(this.Pipeline.Stage());
  }

  ShowActionsArea = ko.pureComputed(
    () =>
      this.request.State.IsActive() &&
      !this.request.IsLoading() &&
      !this.request.Assignments.AreLoading() &&
      this.request.Assignments.CurrentStage.list.UserActionAssignments().length
  );

  // TODO: Minor - Show the completion date of each stage
  listItemShowBorderlessBottom = (stage) => {
    return this.Pipeline.Stage()?.Step == stage.Step && this.ShowActionsArea();
  };

  listItemTypeClass = (stage) => {
    if (this.SelectedStage()?.ID == stage.ID) {
      return "bg-primary text-white pointer";
    }

    if (stage.Step < this.Pipeline.Stage()?.Step)
      return "bg-secondary text-white pointer";

    if (this.Pipeline.Stage()?.ID == stage.ID) {
      switch (this.request.State.Status()) {
        case requestStates.open:
          return "bg-primary-subtle pointer";
        case requestStates.cancelled:
        case requestStates.rejected:
          return "bg-danger text-white pointer";
        case requestStates.fulfilled:
          return "bg-success text-white pointer";
        default:
          break;
      }
    }
  };

  setSelected = (stage) => {
    if (stage.Step > this.Pipeline.Stage()?.Step) return;
    this.SelectedStage(stage);
  };

  SelectedStage = ko.observable();
}

class PipelineComponentStage {
  constructor({ request, stage }) {
    this.request = request;
    this.stage = stage;
  }

  active;
  classList = ko.pureComputed(() => {
    if (stage.Step < this.Pipeline.Stage()?.Step)
      return "bg-secondary text-white";
    if (this.Pipeline.Stage()?.ID == stage.ID) {
      switch (this.request.State.Status()) {
        case requestStates.open:
          return "bg-primary text-white";
        case requestStates.cancelled:
        case requestStates.rejected:
          return "bg-danger text-white";
        case requestStates.fulfilled:
          return "bg-success text-white";
        default:
          break;
      }
    }
  });
}
