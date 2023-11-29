import { actionTypes } from "../../entities/Action.js";
import { stageActionTypes } from "../../entities/PipelineStage.js";
import { requestStates } from "../../entities/Request.js";
import { currentUser } from "../../infrastructure/Authorization.js";

export default class PipelineModule {
  constructor({ request }) {
    this.request = request;
    this.Pipeline = request.Pipeline;
    this.Pipeline.Stage.subscribe(this.SelectedStage);
    this.SelectedStage(this.Pipeline.Stage());
  }

  ShowActionsArea = ko.pureComputed(
    () => this.SelectedStage()?.ActionType != stageActionTypes.Closed
  );

  // TODO: Minor - Show the completion date of each stage
  listItemShowBorderlessBottom = (stage) => {
    return this.Pipeline.Stage()?.Step == stage.Step && this.ShowActionsArea();
  };

  listItemTypeClass = (stage) => {
    if (this.SelectedStage()?.ID == stage.ID) {
      return "bg-primary text-white pointer active";
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

  SelectedStageDetail = ko.pureComputed(
    () =>
      new PipelineStageDetail({
        request: this.request,
        stage: this.SelectedStage(),
      })
  );
}

class PipelineStageDetail {
  constructor({ request, stage }) {
    this.request = request;
    this.stage = stage;
  }

  IsCurrentStage = ko.pureComputed(
    () => this.request.Pipeline.Stage()?.ID == this.stage.ID
  );

  AllStageAssignments = ko.pureComputed(() => {
    return this.request.Assignments.list
      .All()
      .filter((assignment) => assignment.PipelineStage.ID == this.stage.ID);
  });

  CurrentUserActionableAssignments = ko.pureComputed(() =>
    this.AllStageAssignments().filter((assignment) =>
      assignment.isUserActionable()
    )
  );

  view = (assignment) => this.request.Assignments.view(assignment);

  remove = (assignment) => this.request.Assignments.remove(assignment);

  userCanAssign = ko.pureComputed(() => this.IsCurrentStage());
}
