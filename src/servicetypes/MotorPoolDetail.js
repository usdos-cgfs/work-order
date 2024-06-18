import { DateField, dateFieldTypes, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class MotorPool extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    DateAndTime: new DateField({
      displayName: "Date and Time",
      type: dateFieldTypes.datetime,
      isRequired: true,
    }),
    DriverPOC: new TextField({
      displayName: "Driver POC",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "DateAndTime", "DriverPOC"],
  };

  static ListDef = {
    name: "st_motor_pool",
    title: "st_motor_pool",
    fields: MotorPool.Views.All,
  };

  static uid = "motor_pool";
}
