import {
  CheckboxField,
  PeopleField,
  SelectField,
  TextField,
} from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

import { currentUser } from "../infrastructure/Authorization.js";

export class Telework extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  OfficeOptions = currentUser()
    .RequestingOffices()
    .map((office) => office.Title);

  FieldMap = {
    ...this.FieldMap,
    FullName: new PeopleField({
      displayName: "Contractor",
      isRequired: true,
    }),
    ManagerDept: new PeopleField({
      displayName: "Dept Manager",
      isRequired: false,
    }),
    ManagerTechnical: new PeopleField({
      displayName: "Government Technical Monitor",
      isRequired: true,
      Visible: ko.pureComputed(() => !this.FieldMap.NoGTM.Value()),
    }),
    NoGTM: new CheckboxField({
      displayName: "Check here if no GTM for this contract",
    }),
    COR: new PeopleField({
      displayName: "COR",
      isRequired: true,
    }),
    Office: new SelectField({
      displayName: "Office",
      options: this.OfficeOptions,
      isRequired: true,
    }),
    RequisitionOrder: new TextField({
      displayName: "Requisition Number/Task Order",
      isRequired: true,
    }),
    LaborCategory: new TextField({
      displayName: "Labor Category (LCAT)",
      isRequired: true,
    }),
    ContractorType: new SelectField({
      displayName: "Contractor Type",
      options: ["SCA", "Non-SCA"],
      isRequired: true,
    }),
    TeleworkType: new SelectField({
      displayName: "Telework Type",
      options: ["Core", "Situational"],
      isRequired: true,
    }),
    MaxEligibility: new SelectField({
      displayName: "Max Eligibility",
      options: ["80%", "60%", "40%", "20%", "None"],
      isRequired: true,
    }),
    DaysWeek1: new SelectField({
      displayName: "Week 1",
      options: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
      multiple: true,
      isRequired: false,
    }),
    DaysWeek2: new SelectField({
      displayName: "Week 2",
      options: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      multiple: true,
      isRequired: false,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "FullName",
      "ManagerDept",
      "ManagerTechnical",
      "NoGTM",
      "COR",
      "Office",
      "RequisitionOrder",
      "LaborCategory",
      "ContractorType",
      "TeleworkType",
      "MaxEligibility",
      "DaysWeek1",
      "DaysWeek2",
    ],
  };

  static ListDef = {
    name: "st_telework",
    title: "st_telework",
    fields: Telework.Views.All,
  };

  static uid = "telework";
}