import TextField from "../../fields/TextField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
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
    fields: Entity.Views.All,
  };
}
