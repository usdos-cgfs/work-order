import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    Location: new TextField({
      displayName: "Location",
    }),
    FurnitureType: new SelectField({
      displayName: "Type",
      options: [
        "Desk Adjustment",
        "Chair Adjustment",
        "Filing Cabinet",
        "Other",
      ],
    }),
  };

  static Views = {
    All: ["ID", "Title", "Location", "FurnitureType"],
  };

  static ListDef = {
    name: "st_ch_furniture",
    title: "st_ch_furniture",
    fields: Entity.Views.All,
  };
}
