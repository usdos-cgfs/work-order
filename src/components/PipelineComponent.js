import { pipelineStageStore } from "../entities/Pipelines.js";
import { sortByField } from "../common/EntityUtilities.js";

export class PipelineComponent {
  constructor({ request, serviceType }) {
    this.request = request;
    this.serviceType = serviceType;
  }

  Stages = ko.pureComputed(() => {
    if (!this.serviceType()) return [];
    return pipelineStageStore()
      .filter((stage) => stage.ServiceType.ID == this.serviceType()?.ID)
      .sort(sortByField("Step"));
  });

  CurrentStage = ko.pureComputed(() =>
    this.Stages()?.find((stage) => stage.Step == this.request.State.Stage())
  );

  Icon = ko.pureComputed(() => this.serviceType()?.Icon);

  AdvancePromptIsVisible = ko.observable(false);
}
