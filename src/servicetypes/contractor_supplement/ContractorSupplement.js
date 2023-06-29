import { People } from "../../entities/People.js";

export default class ContractorSupplement {
  constructor(params) {}
  ObservableID = ko.observable();
  get ID() {
    return this.ObservableID();
  }
  set ID(val) {
    return this.ObservableID(val);
  }

  Title = "";

  TaskOrderNumber = ko.observable();
  RequisitionNumber = ko.observable();
  LaborCategory = ko.observable();
  ContractorType = ko.observable();
  Contractor = ko.observable();

  FieldMap = {
    ID: this.ID,
    TaskOrderNumber: this.TaskOrderNumber,
    RequisitionNumber: this.RequisitionNumber,
    LaborCategory: this.LaborCategory,
    ContractorType: this.ContractorType,
    Contractor: {
      obs: this.Contractor,
      factory: People.Create,
    },
  };

  IsValid = ko.pureComputed(() => {
    return (
      this.ContractorType() &&
      this.LaborCategory() &&
      this.RequisitionNumber() &&
      this.TaskOrderNumber()
    );
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "TaskOrderNumber",
      "LaborCategory",
      "RequisitionNumber",
      "ContractorType",
      "Request",
      "Contractor",
    ],
    APMUpdate: [
      "TaskOrderNumber",
      "LaborCategory",
      "ContractorType",
      "RequisitionNumber",
    ],
  };

  static ListDef = {
    name: "st_ch_overtime_supplement",
    title: "st_ch_overtime_supplement",
    fields: ContractorSupplement.Views.All,
  };

  ContractorTypeOptsArr = ["SCA", "Non-SCA"];
}
