import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

import { currentUser } from "../../infrastructure/Authorization.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  CostThreshold = ko.pureComputed(
    () => parseInt(this.FieldMap.Cost.Value()) > 500
  );

  FieldMap = {
    Name: new TextField({
      displayName: "Software Name",
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
      isRequired: this.CostThreshold,
    }),
    ApprovedPurchase: new SelectField({
      displayName: "Approved Purchase",
      options: ["Yes", "No"],
      isRequired: this.CostThreshold,
    }),
    FundingSource: new SelectField({
      displayName: "Funding Source",
      options: ["Project", "Contract", "Other"],
      isRequired: this.CostThreshold,
    }),
    PRNumber: new TextField({
      displayName: "PR #",
      isRequired: false,
      Visible: currentUser().IsActionOffice,
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
