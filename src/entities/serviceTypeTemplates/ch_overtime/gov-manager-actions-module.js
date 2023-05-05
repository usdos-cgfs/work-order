export default class ActionGovManager {
  constructor(params) {
    this.serviceType = params.ServiceTypeEntity;
  }

  isValid = ko.pureComputed(() => {
    result = {};
    if (!this.APM()) {
      result.errors = "Please set an APM!";
      return result;
    }
    return result;
  });
}
