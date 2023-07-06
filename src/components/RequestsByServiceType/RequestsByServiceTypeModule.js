import { serviceTypeStore } from "../../entities/ServiceType.js";

export default class RequestsByServiceTypeModule {
  constructor() {}

  ServiceTypes = serviceTypeStore;

  SelectedService = ko.observable();
}
