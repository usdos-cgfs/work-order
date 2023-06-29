import TextField from "../../fields/TextField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
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
