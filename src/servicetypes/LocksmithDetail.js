import { TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class Locksmith extends BaseServiceDetail {
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

  static uid = "locksmith";
}
