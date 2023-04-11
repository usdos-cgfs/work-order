import { People } from "../../../components/People.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
  }

  Fields = {
    FullName: {
      obs: ko.observable(),
      factory: People.Create,
    },
    ManagerDept: {
      obs: ko.observable(),
      factory: People.Create,
    },
    GTM: {
      obs: ko.observable(),
      factory: People.Create,
    },
    APM: {
      obs: ko.observable(),
      factory: People.Create,
    },
    Date: {
      obs: ko.observable(),
    },
    Hours: {
      obs: ko.observable(),
    },
  };

  Submit = () => this.Request.Fields.RequestStage.obs(2);
}
