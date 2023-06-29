import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }
  FieldMap = {
    ReconfigType: new SelectField({
      displayName: "Service Type",
      options: [
        "Office Furniture",
        "Construction",
        "Electrical Cabling",
        "Other",
      ],
      isRequired: true,
    }),
    Location: new TextField({
      displayName: "Location",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "Location", "ReconfigType"],
  };

  static ListDef = {
    name: "st_ch_reconfig",
    title: "st_ch_reconfig",
    fields: Entity.Views.All,
  };
}
