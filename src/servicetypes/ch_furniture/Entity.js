import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
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
