import { serviceTypeStore } from "../../entities/ServiceType.js";
import { currentUser } from "../../infrastructure/Authorization.js";

export default class RequestsByServiceTypeModule {
  constructor(params) {
    this.key = params.key;
  }

  ServiceTypes = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  SelectedService = ko.observable();
}
