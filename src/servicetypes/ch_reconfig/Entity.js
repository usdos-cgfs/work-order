import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Reconfig extends BaseServiceDetail {
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
  };

  static Views = {
    All: ["ID", "Title", "Location", "ReconfigType"],
  };

  static ListDef = {
    name: "st_ch_reconfig",
    title: "st_ch_reconfig",
    fields: CH_Reconfig.Views.All,
  };
}
