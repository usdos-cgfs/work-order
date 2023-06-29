import { registerServiceTypeActionComponent } from "../../common/KnockoutExtensions.js";
import SelectField from "../../fields/SelectField.js";
import TextField from "../../fields/TextField.js";
import BlobField from "../../fields/BlobField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Requisition extends ConstrainedEntity {
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
    RequisitionType: new SelectField({
      displayName: "Requisition Type",
      isRequired: true,
      options: ["Requisition", "De-Obligation", "Re-Alignment"],
    }),
    Quantity: new TextField({
      displayName: "Quantity of requisitions",
      isRequired: true,
    }),
    ItemsBlob: new BlobField({
      displayName: "Procurement Items",
      isRequired: false,
      width: 12,
      entity: RequisitionItem,
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
}

class RequisitionItem extends ConstrainedEntity {
  constructor() {
    super();
  }

  FieldMap = {
    title: new TextField({ displayName: "Title", isRequired: true }),
    vendor: new TextField({ displayName: "Vendor", isRequired: true }),
    description: new TextField({
      displayName: "Description",
      isRequired: true,
    }),
    quantity: new TextField({
      displayName: "Quantity",
      isRequired: true,
      attr: { type: "number" },
    }),
    unit: new TextField({
      displayName: "Unit",
      isRequired: true,
    }),
    price: new TextField({ displayName: "Price", isRequired: true }),
    Amount: new TextField({ displayName: "Amount", isRequired: true }),
  };
}
