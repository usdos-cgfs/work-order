import TextField from "../../fields/TextField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
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
