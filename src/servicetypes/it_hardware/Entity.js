import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class ITHardware extends BaseServiceDetail {
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
}
