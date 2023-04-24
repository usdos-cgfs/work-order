export const actionTypes = {
  Assigned: "Assigned",
  Unassigned: "Unassigned",
  Created: "Created",
  Advanced: "Advanced",
  Approved: "Approved",
  Rejected: "Rejected",
  Closed: "Closed",
};

export class Action {
  constructor() {}

  //   FieldMap = {
  //     Description: {
  //       get: () => encodeURIComponent(this.Description),
  //       set: (val) => (this.Description = decodeURIComponent(val)),
  //     },
  //   };

  static Views = {
    All: ["ID", "Title", "ActionType", "Description", "Author", "Created"],
  };

  static ListDef = {
    name: "Action",
    title: "Action",
    fields: this.Views.All,
  };
}
