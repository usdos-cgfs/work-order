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

  formatAttachmentDescription = () => {
    return (
      this.SelectedServiceType()?.AttachmentDescription ??
      "<i>Not applicable.</i>"
    );
  };

  getDescriptionModal = () =>
    document.getElementById("dialog-new-request-detail");

  selectServiceTypeHandler = (data, e) => {
    this.SelectedServiceType(data);
    const descModal = this.getDescriptionModal();
    descModal.showModal();
  };

  cancelCreateServiceType = () => {
    this.SelectedServiceType(null);
    const descModal = this.getDescriptionModal();
    descModal.close();
  };

  confirmCreateServiceType = () => {
    const serviceType = this.SelectedServiceType();
    this.SelectedServiceType(null);

    const descModal = this.getDescriptionModal();
    descModal.close();

    const newRequest = new RequestEntity({
      serviceType,
    });

    window.WorkOrder.App.NewRequest({ request: newRequest });
  };

  constructor() {
    console.log("new");
  }
}
