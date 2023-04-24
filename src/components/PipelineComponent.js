import {
  pipelineStageStore,
  stageActionTypes,
} from "../entities/PipelineStage.js";
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

  CurrentStage = ko.pureComputed(
    () => this.request.State.Stage()
    // this.Stages()?.find((stage) => stage.ID == this.request.State.Stage()?.ID)
  );

  getActionTemplateId = ko.pureComputed(() => {
    const stage = this.CurrentStage();
    if (!stage) {
      return;
    }
    return stageActionTypeTemplateMap[stage.ActionType];
  });

  getCustomActionTemplateId = ko.pureComputed(() => {
    const stage = this.CurrentStage();
    if (!stage || !stage.ActionTemplateId) {
      return;
    }
    if (!document.getElementById(stage.ActionTemplateId)) {
      return;
    }
    return stage.ActionTemplateId;
  });

  templateData = ko.pureComputed(() => {
    return {
      request: this.request,
      serviceType: this.request.ServiceTypeComponent.ServiceTypeEntity,
    };
  });

  getNextStage() {
    const thisStepNum = this.request.State.Stage()?.Step ?? 0;
    const nextStepNum = thisStepNum + 1;

    return this.Stages()?.find((stage) => stage.Step == nextStepNum);
  }

  Icon = ko.pureComputed(() => this.serviceType()?.Icon);
}

const stageActionTypeTemplateMap = {
  "Pending Assignment": "tmpl-stage-assignment",
  "Pending Approval": "tmpl-stage-approval",
  "Pending Action": "tmpl-stage-action",
  "Pending Resolution": "tmpl-stage-close",
};
