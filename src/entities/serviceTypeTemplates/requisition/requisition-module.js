export default class Requisition {
  constructor(request) {
    this.Request = request;
  }

  TypeOpts = requisitionTypes;

  Type = ko.observable();
  Quantity = ko.observable();

  FieldMap = {
    RequisitionType: this.Type,
    Quantity: this.Quantity,
  };
}

const requisitionTypes = ["Requisition", "De-Obligation", "Re-Alignment"];
