import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";
import PeopleField from "../../fields/PeopleField.js";

export default class CH_Furniture extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }
  FieldMap = {
    ...this.FieldMap,
    Location: new TextField({
      isRequired: true,
      displayName: "Location",
    }),
    FurnitureType: new SelectField({
      isRequired: true,
      displayName: "Type",
      options: [
        "Desk Adjustment",
        "Chair Adjustment",
        "Filing Cabinet",
        "Other",
      ],
    }),
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "Location", "FurnitureType", "Supervisor"],
  };

  static ListDef = {
    name: "st_ch_furniture",
    title: "st_ch_furniture",
    fields: CH_Furniture.Views.All,
  };
}