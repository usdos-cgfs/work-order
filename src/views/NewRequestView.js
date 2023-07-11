import { serviceTypeStore } from "../entities/ServiceType.js";
import { RequestEntity } from "../entities/Request.js";

import { currentUser } from "../infrastructure/Authorization.js";
// Show the available service types
export class NewRequestView {
  templateId = "tmpl-request-detail";

  ServiceTypeStore = serviceTypeStore;

  SelectedServiceType = ko.observable();

  ActiveServiceTypes = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  selectServiceTypeHandler = (data, e) => {
    this.SelectedServiceType(data);

    // TODO: Show servicetype description
    this.confirmCreateServiceType();
  };

  confirmCreateServiceType = () => {
    const newRequest = new RequestEntity({
      serviceType: this.SelectedServiceType(),
    });
    window.WorkOrder.App.NewRequest({ request: newRequest });
  };

  constructor() {}
}
