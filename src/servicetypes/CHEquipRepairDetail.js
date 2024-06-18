import { SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Equip_Repair extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }
  FieldMap = {
    ...this.FieldMap,
    Location: new TextField({
      displayName: "Location",
      isRequired: true,
    }),
    RepairType: new SelectField({
      isRequired: true,
      displayName: "Type",
      options: ["Copier", "Fax Machine", "Appliance", "Furniture", "Other"],
    }),
  };

  static Views = {
    All: ["ID", "Title", "Location", "RepairType"],
  };

  static ListDef = {
    name: "st_ch_equip_repair",
    title: "st_ch_equip_repair",
    fields: CH_Equip_Repair.Views.All,
  };

  static uid = "ch_equip_repair";
}
