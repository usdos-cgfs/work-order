import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Equip_Repair extends BaseServiceDetail {
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
}
