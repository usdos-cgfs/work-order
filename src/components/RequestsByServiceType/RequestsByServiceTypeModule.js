import { serviceTypeStore } from "../../entities/ServiceType.js";
import { currentUser } from "../../infrastructure/Authorization.js";
import { BaseComponent } from "../BaseComponent.js";
import { requestsByServiceTypeTemplate } from "./RequestsServiceTypeTemplate.js";

export class RequestsByServiceTypeModule extends BaseComponent {
  constructor(params) {
    super();
    this.key = params.key;
  }

  ServiceTypes = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  SelectedService = ko.observable();

  static name = "requests-by-service-type";
  static template = requestsByServiceTypeTemplate;
}
