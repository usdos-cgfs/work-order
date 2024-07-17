import { SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class ITHardware extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    Name: new TextField({
      displayName: "Hardware Name",
      isRequired: true,
    }),
    Quantity: new TextField({
      displayName: "Quantity",
      isRequired: true,
    }),
    POCName: new TextField({
      displayName: "POC",
      isRequired: true,
    }),
    Cost: new TextField({
      displayName: "Cost",
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Maintenance Renewal"],
      isRequired: true,
    }),
    PurchaseFrequency: new SelectField({
      displayName: "Purchase Frequency",
      options: ["One Time", "Recurring"],
      isRequired: true,
    }),
    ApprovedPurchase: new SelectField({
      displayName: "Approved Purchase",
      options: ["Yes", "No"],
      isRequired: true,
    }),
    FundingSource: new SelectField({
      displayName: "Funding Source",
      options: ["Project", "Contract", "Other"],
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "Name",
      "Quantity",
      "POCName",
      "Cost",
      "RequestType",
      "PurchaseFrequency",
      "ApprovedPurchase",
      "FundingSource",
    ],
  };

  static ListDef = {
    name: "st_IT_hardware",
    title: "st_IT_hardware",
    fields: ITHardware.Views.All,
  };

  static uid = "it_hardware";
}
