import TextField from "../../fields/TextField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    Location: new TextField({
      displayName: "Location",
      isRequired: true,
    }),
    LockType: new TextField({
      displayName: "Lock Type",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_locksmith",
    title: "st_locksmith",
    fields: Entity.Views.All,
  };
}
