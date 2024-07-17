import { PeopleField, SelectField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class Mobile extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    User: new PeopleField({
      displayName: "User Name",
      isRequired: true,
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["FTE", "Contractor"],
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Broken/Lost/Stolen", "Accessories"],
      isRequired: true,
    }),
    PlanType: new SelectField({
      displayName: "Plan Type",
      options: ["Domestic", "Global"],
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "User", "EmployeeType", "RequestType", "PlanType"],
  };

  static ListDef = {
    name: "st_mobile_phone",
    title: "st_mobile_phone",
    fields: Mobile.Views.All,
  };

  static uid = "mobile";
}
