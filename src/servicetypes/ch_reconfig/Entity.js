import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    ReconfigType: new SelectField({
      displayName: "Service Type",
      options: [
        "Office Furniture",
        "Construction",
        "Electrical Cabling",
        "Other",
      ],
    }),
    Location: new TextField({
      displayName: "Location",
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
