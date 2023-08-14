import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Mobile extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
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
    fields: CH_Mobile.Views.All,
  };
}
