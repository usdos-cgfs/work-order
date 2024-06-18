import { PeopleField, SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Reconfig extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }
  FieldMap = {
    ...this.FieldMap,
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
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "Location", "ReconfigType", "Supervisor"],
  };

  static ListDef = {
    name: "st_ch_reconfig",
    title: "st_ch_reconfig",
    fields: CH_Reconfig.Views.All,
  };

  static uid = "ch_reconfig";
}
