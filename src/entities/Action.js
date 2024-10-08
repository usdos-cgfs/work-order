import { PipelineStage } from "./PipelineStage.js";

export const actionTypes = {
  Paused: "Paused",
  Resumed: "Resumed",
  Assigned: "Assigned",
  Unassigned: "Unassigned",
  Created: "Created",
  Advanced: "Advanced",
  Approved: "Approved",
  Completed: "Completed",
  Rejected: "Rejected",
  Closed: "Closed",
};

export class Action {
  constructor() {}

  PipelineStage;
  //   FieldMap = {
  //     Description: {
  //       get: () => encodeURIComponent(this.Description),
  //       set: (val) => (this.Description = decodeURIComponent(val)),
  //     },
  //   };

  FieldMap = {
    PipelineStage: {
      get: () => this.PipelineStage,
      set: (val) => {
        this.PipelineStage = PipelineStage.FindInStore(val);
      },
    },
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "PipelineStage",
      "ActionType",
      "Description",
      "Author",
      "Created",
    ],
  };

  static ListDef = {
    name: "Actions",
    title: "Actions",
    fields: this.Views.All,
  };
}
