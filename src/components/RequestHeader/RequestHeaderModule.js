import { serviceTypeStore } from "../../entities/ServiceType.js";

import { currentUser } from "../../infrastructure/Authorization.js";

export default class RequestHeaderModule {
  constructor(request) {
    Object.assign(this, request);
  }

  AvailableRequestorOffices = ko.pureComputed(() => {
    return currentUser()?.RequestingOffices();
  });

  AvailableServiceTypes = ko.pureComputed(() => {
    return serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    );
  });
}
