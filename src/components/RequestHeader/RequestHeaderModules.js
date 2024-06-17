import { serviceTypeStore } from "../../entities/ServiceType.js";

import { currentUser } from "../../infrastructure/Authorization.js";
import { BaseComponent } from "../index.js";
import { requestHeaderEditTemplate } from "./RequestHeaderEditTemplate.js";
import { requestHeaderViewTemplate } from "./RequestHeaderViewTemplate.js";

class RequestHeaderModule extends BaseComponent {
  constructor(request) {
    super();
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

export class RequestHeaderViewModule extends RequestHeaderModule {
  constructor(request) {
    super(request);
  }

  static name = "request-header-view";
  static template = requestHeaderViewTemplate;
}

export class RequestHeaderEditModule extends RequestHeaderModule {
  constructor(request) {
    super(request);
  }

  static name = "request-header-edit";
  static template = requestHeaderEditTemplate;
}
