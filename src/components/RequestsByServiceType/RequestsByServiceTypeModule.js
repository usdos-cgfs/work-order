import { serviceTypeStore } from "../../entities/ServiceType.js";

export default class RequestsByServiceTypeModule {
  constructor(params) {
    this.key = params.key;
  }

  ServiceTypes = serviceTypeStore;

  SelectedService = ko.observable();
}
