import { SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";
import { ConstrainedEntity } from "../primitives/ConstrainedEntity.js";

export class Requisition extends BaseServiceDetail {
  constructor(request) {
    super(request);
    this.Request = request;
    // registerServiceTypeActionComponent({
    //   uid: "requisition",
    //   componentName: "items-table-edit",
    //   moduleName: "ItemsTable",
    //   templateName: "ItemsTableEdit",
    // });
    // registerServiceTypeActionComponent({
    //   uid: "requisition",
    //   componentName: "items-table-view",
    //   moduleName: "ItemsTable",
    //   templateName: "ItemsTableView",
    // });

    // console.log("TypeOpts", this.TypeOpts);
    // console.log("TypeOpts Static", this);
  }

  Type = ko.observable();
  Quantity = ko.observable();
  Items = ko.observableArray();

  FieldMap = {
    ...this.FieldMap,
    RequisitionType: new SelectField({
      displayName: "Requisition Type",
      isRequired: false,
      options: ["Requisition", "De-Obligation", "Re-Alignment"],
    }),
    Quantity: new TextField({
      displayName: "Quantity of requisitions",
      isRequired: false,
    }),
    ItemsBlob: new BlobField({
      displayName: "Procurement Items",
      isRequired: false,
      width: 12,
      multiple: true,
      entityType: ko.observable(RequisitionItem),
    }),
  };

  static Views = {
    All: ["ID", "Title", "RequisitionType", "Quantity", "ItemsBlob"],
  };

  static ListDef = {
    name: "st_requisition",
    title: "st_requisition",
    fields: Requisition.Views.All,
  };

  static uid = "requisition";
}

class RequisitionItem extends ConstrainedEntity {
  constructor() {
    super();
  }

  FieldMap = {
    title: new TextField({ displayName: "Title", isRequired: true }),
    // vendor: new TextField({ displayName: "Vendor", isRequired: true }),
    // description: new TextField({
    //   displayName: "Description",
    //   isRequired: true,
    // }),
    // quantity: new TextField({
    //   displayName: "Quantity",
    //   isRequired: true,
    //   attr: { type: "number" },
    // }),
    // unit: new TextField({
    //   displayName: "Unit",
    //   isRequired: true,
    // }),
    // price: new TextField({ displayName: "Price", isRequired: true }),
    // Amount: new TextField({ displayName: "Amount", isRequired: true }),
  };
}
