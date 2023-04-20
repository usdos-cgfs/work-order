import {
  getTemplateElementId,
  templatePath,
  modulePath,
} from "../entities/ServiceType.js";

export class ServiceTypeComponent {
  constructor({ request, serviceType, context }) {
    this.ServiceType = serviceType;
    this.ElementId = this.ServiceType()?.UID;
    this.Request = request;
    this.ServiceType.subscribe(this.serviceTypeWatcher);

    if (serviceType()) {
      this.serviceTypeWatcher(serviceType());
    }
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  ServiceTypeEntity = ko.observable();

  IsLoading = ko.observable();

  refreshServiceTypeEntity = async () => {
    console.log("ServiceTypeComponent: refresh Triggered");
    this.IsLoading(true);
    var template = this.ServiceTypeEntity();
    template.Title = this.Request.ObservableTitle();
    await this.ServiceType()
      ?.getListRef()
      ?.LoadEntityByRequestId(template, this.Request.ObservableID());
    this.IsLoading(false);
  };

  submitServiceTypeEntity = async () => {
    if (!this.ServiceTypeEntity()) return;

    const newEntity = this.ServiceTypeEntity();
    newEntity.Title = this.Request.ObservableTitle();

    const folderPath = this.Request.getRelativeFolderPath();
    const newSvcTypeItemId = await this.ServiceType()
      .getListRef()
      .AddEntity(newEntity, folderPath, this.Request);

    return newSvcTypeItemId;
  };

  serviceTypeWatcher = async (newSvcType) => {
    console.log("ServiceTypeComponent: ServiceType Changed", newSvcType);
    // This should only be triggered when a new RequestDetailView is created
    // or when the user changes the request from the drop down.
    if (!newSvcType?.HasTemplate) {
      this.ServiceTypeEntity(null);
      return;
    }
    this.ComponentsAreLoading(true);

    this.ElementId = getTemplateElementId(newSvcType.UID);
    if (!document.getElementById(this.ElementId)) {
      await loadServiceTypeTemplate(newSvcType.UID);
    }
    const service = await import(modulePath(newSvcType.UID));
    if (!service) {
      console.logError("Could not find service module");
    }

    this.ServiceTypeEntity(new service.default(this.Request));
    this.ComponentsAreLoading(false);

    if (this.Request.ObservableID()) this.refreshServiceTypeEntity();
  };
}

async function loadServiceTypeTemplate(uid) {
  const templateId = getTemplateElementId(uid);
  const response = await fetch(templatePath(uid));

  if (!response.ok) {
    throw new Error(
      `Fetching the HTML file went wrong - ${response.statusText}`
    );
  }

  const text = await response.text();
  const element = document.createElement("script");

  element.setAttribute("type", "text/html");
  element.setAttribute("id", templateId);
  element.text = text;

  document.getElementById("service-type-templates").append(element);
}
