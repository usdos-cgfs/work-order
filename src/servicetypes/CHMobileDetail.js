import { PeopleField, SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Mobile extends BaseServiceDetail {
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
      isRequired: false,
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

  static uid = "ch_mobile";
}
