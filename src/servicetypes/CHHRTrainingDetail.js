import {
  DateField,
  PeopleField,
  SelectField,
  TextField,
} from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_HR_Training extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
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
    Date1: new DateField({ displayName: "Course Date", isRequired: true }),
    Cost: new TextField({
      displayName: "Training Cost",
    }),
    HiringManager: new PeopleField({
      displayName: "Hiring Manager",
      isRequired: true,
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
      "HiringManager",
    ],
  };

  static ListDef = {
    name: "st_ch_hr_training",
    title: "st_ch_hr_training",
    fields: CH_HR_Training.Views.All,
  };

  static uid = "ch_hr_training";
}
