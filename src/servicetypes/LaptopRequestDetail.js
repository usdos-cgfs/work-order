import {
  CheckboxField,
  PeopleField,
  SelectField,
  TextAreaField,
} from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class LaptopRequest extends BaseServiceDetail {
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
      options: [
        "Civil Service - Current",
        "Civil Service - New Hire",
        "Contractor",
        "Domestically Employeed Teleworking Overseas (DETO)",
        "Foreign Service",
        "Intern",
      ],
      isRequired: true,
    }),
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
    FullTimeRemote: new CheckboxField({
      displayName:
        "Full Time Remote employee located outside of the National Capital Region",
      options: ["New", "Broken/Lost/Stolen", "Accessories"],
      isRequired: true,
    }),
    ShippingAddress: new TextAreaField({
      displayName: "Shipping Address",
      Visible: ko.pureComputed(() => {
        return this.FieldMap.FullTimeRemote.Value();
      }),
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "User",
      "EmployeeType",
      "Supervisor",
      "FullTimeRemote",
      "ShippingAddress",
    ],
  };

  static ListDef = {
    name: "st_laptop_request",
    title: "st_laptop_request",
    fields: LaptopRequest.Views.All,
  };

  static uid = "laptop";
}
