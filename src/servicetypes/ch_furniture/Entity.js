import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }
  FieldMap = {
    Location: new TextField({
      isRequired: true,
      displayName: "Location",
    }),
    FurnitureType: new SelectField({
      isRequired: true,
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
