import DateField from "../../fields/DateField.js";
import SelectField from "../../fields/SelectField.js";
import TextField from "../../fields/TextField.js";
import BaseEntity from "../BaseEntity.js";

export default class Access extends BaseEntity {
  constructor(params) {
    super(params);
  }

  accessTypeOpts = ["Normal work day", "24/7", "FLETC", "Other"];

  employeeTypeOpts = ["CGFS Government", "CGFS Contractor", "Other"];

  AccessType = new SelectField({
    isRequired: true,
    displayName: "Access Type",
    options: this.accessTypeOpts,
  });
  EmployeeType = new SelectField({
    isRequired: true,
    displayName: "Employee Type",
    options: this.employeeTypeOpts,
  });
  FullName = new TextField({ displayName: "Full Name", isRequired: true });
  BadgeNum = new TextField({ displayName: "Badge Num", isRequired: true });
  ExpirationDate = new DateField({
    displayName: "Expiration Date",
    isRequired: true,
  });
  Locations = new TextField({ displayName: "Locations", isRequired: true });

  FieldMap = {
    AccessType: this.AccessType,
    EmployeeType: this.EmployeeType,
    FullName: this.FullName,
    BadgeNum: this.BadgeNum,
    ExpirationDate: this.ExpirationDate,
    Locations: this.Locations,
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "AccessType", // CHS
      "EmployeeType",
      "FullName",
      "BadgeNum",
      "ExpirationDate", // DC
      "Locations",
      "Request",
    ],
  };

  static ListDef = {
    name: "st_access",
    title: "st_access",
    isServiceType: true,
    fields: Access.Views.All,
  };
}
