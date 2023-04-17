import { People } from "../../../components/People.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
  }

  Contractor = ko.observable();
  DepartmentManager = ko.observable();
  GTM = ko.observable();
  APM = ko.observable();

  DateStart = ko.observable();
  DateEnd = ko.observable();
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
      set: this.DateStart,
      get: () => new Date(this.DateStart()).toISOString(),
    },
    Hours: this.Hours,
  };

  Submit = () => this.Request.Fields.RequestStage.obs(2);
}
