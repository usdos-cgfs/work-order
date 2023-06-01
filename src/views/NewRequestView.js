import { serviceTypeStore } from "../entities/ServiceType.js";

import { currentUser } from "../infrastructure/Authorization.js";
// Show the available service types
export class NewRequestView {
  templateId = "tmpl-request-detail";

  ServiceTypeStore = serviceTypeStore;

  ActiveServiceTypes = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  constructor() {}
}
