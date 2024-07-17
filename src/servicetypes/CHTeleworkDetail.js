import { PeopleField, SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Telework extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  departmentOptions = requestOrgStore()
    .filter((org) => org.OrgType == OrgTypes.Department)
    .map((org) => org.Title);

  FieldMap = {
    ...this.FieldMap,
    FullName: new PeopleField({
      displayName: "Contractor",
      isRequired: true,
    }),
    ManagerDept: new PeopleField({
      displayName: "Dept Manager",
    }),
    ManagerTask: new PeopleField({
      displayName: "Task Manager",
      isRequired: true,
    }),
    Department: new SelectField({
      displayName: "Department",
      options: this.departmentOptions,
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
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "FullName",
      "ManagerDept",
      "ManagerTask",
      "Department",
      "RequisitionOrder",
      "LaborCategory",
      "ContractorType",
      "TeleworkType",
      "MaxEligibility",
    ],
  };

  static ListDef = {
    name: "st_ch_telework",
    title: "st_ch_telework",
    fields: CH_Telework.Views.All,
  };

  static uid = "ch_telework";
}
