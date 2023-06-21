import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    Name: new TextField({
      displayName: "Software Name",
      isRequired: true,
    }),
    Quantity: new TextField({
      displayName: "Quantity",
      isRequired: true,
    }),
    POC: new TextField({
      displayName: "POC",
      isRequired: true,
    }),
    Cost: new TextField({
      displayName: "Cost (USD)",
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
      displayName: "Fuding Source",
      options: ["Project", "Contract", "Other"],
      isRequired: true,
    }),
    PRNumber: new TextField({
      displayName: "PR #",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_it_software",
    title: "st_it_software",
    fields: Entity.Views.All,
  };
}
