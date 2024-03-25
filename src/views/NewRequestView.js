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
    const desc = this.SelectedServiceType()?.AttachmentDescription;
    if (desc && Boolean(desc.trim())) {
      return desc;
    }
    return "<i>Not applicable.</i>";
  };

  getDescriptionModal = () =>
    document.getElementById("dialog-new-request-detail");

  selectServiceTypeHandler = (data, e) => {
    this.SelectedServiceType(data);
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 460);
    // const descModal = this.getDescriptionModal();
    // descModal.showModal();
  };

  cancelCreateServiceType = () => {
    this.SelectedServiceType(null);
    // const descModal = this.getDescriptionModal();
    // descModal.close();
  };

  confirmCreateServiceType = async () => {
    const serviceType = this.SelectedServiceType();
    this.SelectedServiceType(null);

    // const descModal = this.getDescriptionModal();
    // descModal.close();

    await serviceType.initializeEntity();

    const newRequest = new RequestEntity({
      ServiceType: serviceType,
    });

    window.WorkOrder.App.NewRequest({ request: newRequest });
  };

  constructor() {
    console.log("new");
  }
}
