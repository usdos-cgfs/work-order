import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
    PhoneNum: new TextField({
      displayName: "Phone Number",
    }),
    ServiceType: new SelectField({
      displayName: "Service Type",
      options: [
        "New Temporary (include dates in Justification)",
        "Replacement/Upgrade",
        "Return/Deactivation",
        "Other",
      ],
      isRequired: true,
    }),
    Serial: new TextField({
      displayName: "Serial Number",
    }),
    Carrier: new TextField({
      displayName: "Carrier",
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "Supervisor",
      "PhoneNum",
      "ServiceType",
      "Serial",
      "Carrier",
    ],
  };

  static ListDef = {
    name: "st_ch_mobile",
    title: "st_ch_mobile",
    fields: Entity.Views.All,
  };
}
