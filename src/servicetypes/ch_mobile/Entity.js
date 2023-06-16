import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    Supervisor: new PeopleField({
      displayName: "Supervisor",
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
    }),
    Serial: new TextField({
      displayName: "Serial Number",
    }),
    Carrier: new TextField({
      displayName: "Carrier",
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
