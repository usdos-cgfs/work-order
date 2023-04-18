import { People } from "../../../components/People.js";
import { DateField } from "../../../components/DateField.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
  }

  Contractor = ko.observable();
  DepartmentManager = ko.observable();
  GTM = ko.observable();
  APM = ko.observable();

  DateStart = ko.observable();
  DateEnd = new DateField();

  Hours = ko.observable();

  FieldMap = {
    FullName: {
      obs: this.Contractor,
      factory: People.Create,
    },
    ManagerDept: {
      obs: this.DepartmentManager,
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
      set: (val) => this.DateStart(val ? new Date(val) : null),
      get: () => new Date(this.DateStart()).toISOString(),
    },
    DateEnd: {
      set: this.DateEnd.set,
      get: this.DateEnd.get,
    },
    Hours: this.Hours,
  };

  Submit = () => this.Request.Fields.RequestStage.obs(2);
}
