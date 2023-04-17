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
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  ViewModel = ko.observable();

  serviceTypeWatcher = async (newSvcType) => {
    if (!newSvcType?.HasTemplate) {
      this.ViewModel(null);
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

    this.ViewModel(new service.default(this.Request));
    this.ComponentsAreLoading(false);
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
