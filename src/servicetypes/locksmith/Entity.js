import TextField from "../../fields/TextField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class Locksmith extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
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
    fields: Locksmith.Views.All,
  };
}
