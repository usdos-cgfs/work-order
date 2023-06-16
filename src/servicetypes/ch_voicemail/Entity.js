import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    Employee: new PeopleField({
      displayName: "Employee Name",
      isRequired: true,
    }),
    Phone: new TextField({
      displayName: "Phone Number",
      isRequired: true,
    }),
    Location: new TextField({
      displayName: "Location",
    }),
  };

  static Views = {
    All: ["ID", "Title", "Employee", "Phone", "Location"],
  };

  static ListDef = {
    name: "st_ch_voicemail",
    title: "st_ch_voicemail",
    fields: Entity.Views.All,
  };
}
