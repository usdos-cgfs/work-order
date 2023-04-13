import { appRoot } from "../common/Router.js";

const getElementId = (uid) => `tmpl-${uid}`;

const assetsPath = (uid) =>
  `${appRoot}/SiteAssets/wo/entities/serviceTypeTemplates/${uid}/`;
const templatePath = (uid) => assetsPath(uid) + `${uid}-template.html`;
const modulePath = (uid) => assetsPath(uid) + `${uid}-module.js`;

export class ServiceTypeComponent {
  constructor({ request, serviceType }) {
    this.ServiceType = serviceType;
    this.ElementId = this.ServiceType()?.UID;
    this.Request = request;
    this.ServiceType.subscribe(this.serviceTypeWatcher);
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  ViewModel = ko.observable();

  serviceTypeWatcher = async (newSvcType) => {
    if (!newSvcType?.HasTemplate) return;

    this.ComponentsAreLoading(true);

    this.ElementId = getElementId(newSvcType.UID);
    if (!document.getElementById(this.ElementId)) {
      await loadServiceTypeTemplate(newSvcType.UID);
    }
    const service = await import(modulePath(newSvcType.UID));
    if (!service) {
      console.logError("Could not find service module");
    }
    // this.ViewModel();
    this.ViewModel(new service.default(this.Request));
    this.ComponentsAreLoading(false);
  };
}

async function loadServiceTypeTemplate(uid) {
  const templateId = getElementId(uid);
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
