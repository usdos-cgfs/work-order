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
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  ViewModel = ko.pureComputed(async () => {
    const stype = this.ServiceType ? this.ServiceType() : null;

    if (!stype?.HasTemplate) {
      return false;
    }

    this.ComponentsAreLoading(true);

    this.ElementId = getElementId(stype.UID);
    if (!document.getElementById(this.ElementId)) {
      await loadServiceTypeTemplate(stype.UID);
    }
    const service = await import(modulePath(stype.UID));
    if (!service) {
      console.logError("Could not find service module");
    }
    // this.ViewModel();
    this.ComponentsAreLoading(false);
    return new service.default(this.Request);
  });
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
