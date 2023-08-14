import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Voicemail extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
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
    fields: CH_Voicemail.Views.All,
  };
}
