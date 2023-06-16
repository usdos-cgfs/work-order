import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor"],
    }),
    CourseTitle: new TextField({
      displayName: "Course Title",
    }),
    CourseNumber: new TextField({
      displayName: "Course Number",
    }),
    Vendor: new TextField({
      displayName: "Training Provider/Vendor",
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
