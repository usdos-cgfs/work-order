import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    Location: new TextField({
      displayName: "Location",
    }),
    RepairType: new SelectField({
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
    fields: Entity.Views.All,
  };
}
