import { PeopleField, SelectField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class Ironkey extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    UserName: new PeopleField({
      displayName: "User Name",
      isRequired: true,
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor"],
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Replacement"],
      isRequired: true,
    }),
    Supervisor: new PeopleField({
      displayName: "COR/Supervisor",
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "UserName",
      "EmployeeType",
      "RequestType",
      "Supervisor",
    ],
  };

  static ListDef = {
    name: "st_ironkey",
    title: "st_ironkey",
    fields: Ironkey.Views.All,
  };

  static uid = "ironkey";
}
