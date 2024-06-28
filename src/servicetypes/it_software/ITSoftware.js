import { TextField, SelectField } from "../../fields/index.js";

import { defaultComponents } from "../../primitives/ConstrainedEntity.js";

import { BaseServiceDetail } from "../BaseServiceDetail.js";
import { ConstrainedEntityViewModule } from "../../components/index.js";
import { itSoftwareViewTemplate } from "./views/View.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import { CreateProcurementAction } from "./components/CreateProcurementAction.js";

registerComponentFromConstructor(CreateProcurementAction);

export class ITSoftware extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  CostThreshold = ko.pureComputed(
    () => parseInt(this.FieldMap.Cost.Value()) > 500
  );

  FieldMap = {
    ...this.FieldMap,
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
  };

  static Views = {
    All: ["ID", "Title", "Request"],
  };

  static ListDef = {
    name: "st_it_software",
    title: "st_it_software",
    fields: ITSoftware.Views.All,
  };

  static uid = "it_software";
}
