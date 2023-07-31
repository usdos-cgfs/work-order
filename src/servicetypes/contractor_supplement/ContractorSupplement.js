import SelectField from "../../fields/SelectField.js";
import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";

import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class ContractorSupplement extends ConstrainedEntity {
  constructor(params) {
    super(params);
    if (window.DEBUG) console.log("new contractor supplement", params);
  }

  ObservableID = ko.observable();
  get ID() {
    return this.ObservableID();
  }
  set ID(val) {
    return this.ObservableID(val);
  }

  Title = "";

  TaskOrderNumber = new TextField({
    displayName: "Task Order Number",
    isRequired: true,
  });
  RequisitionNumber = new TextField({
    displayName: "Requisition Number",
    isRequired: true,
  });
  LaborCategory = new TextField({
    displayName: "Labor Category",
    isRequired: true,
  });
  ContractorType = new SelectField({
    displayName: "Contractor Type",
    options: ["SCA", "Non-SCA"],
    isRequired: true,
  });
  Contractor = new PeopleField({
    displayName: "Contractor",
    isRequired: true,
    Visible: ko.observable(false),
  });

  FieldMap = {
    TaskOrderNumber: this.TaskOrderNumber,
    RequisitionNumber: this.RequisitionNumber,
    LaborCategory: this.LaborCategory,
    ContractorType: this.ContractorType,
    Contractor: this.Contractor,
  };

  // IsValid = ko.pureComputed(() => {
  //   return (
  //     this.ContractorType() &&
  //     this.LaborCategory() &&
  //     this.RequisitionNumber() &&
  //     this.TaskOrderNumber()
  //   );
  // });

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
