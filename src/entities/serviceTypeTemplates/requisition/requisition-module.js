import { registerServiceTypeComponent } from "../../../common/KnockoutExtensions.js";
export default class Requisition {
  constructor(request) {
    this.Request = request;
    registerServiceTypeComponent(
      "items-table-edit",
      "items-table",
      "requisition"
    );
    registerServiceTypeComponent(
      "items-table-view",
      "items-table",
      "requisition"
    );
    console.log("TypeOpts", this.TypeOpts);
    console.log("TypeOpts Static", this);
  }

  TypeOpts = requisitionTypes;

  Type = ko.observable();
  Quantity = ko.observable();
  Items = ko.observableArray();

  FieldMap = {
    RequisitionType: this.Type,
    Quantity: this.Quantity,
    ItemsBlob: {
      get: () => JSON.stringify(this.Items()),
      set: (val) => this.Items(JSON.parse(val)),
    },
  };

  static Views = {
    All: ["ID", "Title", "RequisitionType", "Quantity", "ItemsBlob"],
  };

  static ListDef = {
    name: "st_requisition",
    title: "st_requisition",
    fields: Requisition.Views.All,
  };
}

const requisitionTypes = ["Requisition", "De-Obligation", "Re-Alignment"];
