import TextField from "../../fields/TextField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
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
    InStock: new CheckboxField({
      displayName: "In Stock",
    }),
    SpecialOrder: new CheckboxField({
      displayName: "Special Order",
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "Vendor",
      "ItemNum",
      "Quantity",
      "InStock",
      "SpecialOrder",
    ],
  };

  static ListDef = {
    name: "st_ch_supplies",
    title: "st_ch_supplies",
    fields: Entity.Views.All,
  };
}
