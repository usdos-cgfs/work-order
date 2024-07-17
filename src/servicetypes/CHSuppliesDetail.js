import { CheckboxField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Supplies extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    Vendor: new TextField({
      displayName: "Supplies Requested",
      isRequired: true,
    }),
    ItemNum: new TextField({
      displayName: "Item/Product Num",
    }),
    Quantity: new TextField({
      displayName: "Quantity",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "Vendor", "ItemNum", "Quantity"],
  };

  static ListDef = {
    name: "st_ch_supplies",
    title: "st_ch_supplies",
    fields: CH_Supplies.Views.All,
  };

  static uid = "ch_supplies";
}
