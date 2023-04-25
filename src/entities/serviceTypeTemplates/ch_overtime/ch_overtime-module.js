import { People } from "../../../components/People.js";
import { DateField } from "../../../components/DateField.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
  }

  Contractor = ko.observable();
  GovManager = ko.observable();
  GTM = ko.observable();
  APM = ko.observable();

  DateStart = new DateField();
  DateEnd = new DateField();

  Hours = ko.observable();

  TaskOrder = ko.observable();
  RequisitionNumber = ko.observable();
  LaborCategory = ko.observable();
  ContractorType = ko.observable();

  FieldMap = {
    FullName: {
      obs: this.Contractor,
      factory: People.Create,
    },
    ManagerDept: {
      obs: this.GovManager,
      factory: People.Create,
    },
    GTM: {
      obs: this.GTM,
      factory: People.Create,
    },
    APM: {
      obs: this.APM,
      factory: People.Create,
    },
    DateStart: {
      set: this.DateStart.set,
      get: this.DateStart.get,
    },
    DateEnd: {
      set: this.DateEnd.set,
      get: this.DateEnd.get,
    },
    Hours: this.Hours,
  };

  Submit = () => this.Request.Fields.RequestStage.obs(2);
}
