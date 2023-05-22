import { serviceTypeStore } from "../entities/ServiceType.js";

// Show the available service types
export class NewRequestView {
  templateId = "tmpl-request-detail";

  ServiceTypeStore = serviceTypeStore;

  ActiveServiceTypes = ko.pureComputed(() => {
    return serviceTypeStore().filter((serviceType) => serviceType.Active);
  });

  constructor() {}
}
