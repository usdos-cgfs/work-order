import TextField from "../../fields/TextField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor"],
      isRequired: true,
    }),
    CourseTitle: new TextField({
      displayName: "Course Title",
      isRequired: true,
    }),
    CourseNumber: new TextField({
      displayName: "Course Number",
    }),
    Vendor: new TextField({
      displayName: "Training Provider/Vendor",
      isRequired: true,
    }),
    Date1: new DateField({ displayName: "Course Date" }),
    Cost: new TextField({
      displayName: "Training Cost",
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "EmployeeType",
      "CourseTitle",
      "CourseNumber",
      "Vendor",
      "Date1",
      "Cost",
    ],
  };

  static ListDef = {
    name: "st_ch_hr_training",
    title: "st_ch_hr_training",
    fields: Entity.Views.All,
  };
}
