import { siteRoot } from "../infrastructure/SAL.js";

const getTemplateElmId = (uid) => `tmpl-${uid}`;

const assetsPath = (uid) =>
  `${siteRoot}/SiteAssets/wo/entities/serviceTypeTemplates/${uid}/`;
const templatePath = (uid) => assetsPath(uid) + `${uid}-template.html`;
const modulePath = (uid) => assetsPath(uid) + `${uid}-module.js`;

export class ServiceType {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static Fields = [
    "ID",
    "Title",
    "Active",
    "st_list",
    "DescriptionRequired",
    "DescriptionTitle",
    "Description",
    "Icon",
    "AttachmentsRequiredCnt",
    "AttachmentDescription",
    "DaysToCloseBusiness",
    "ReminderDays",
    "KPIThresholdYellow",
    "KPIThresholdGreen",
    "UID",
    "TemplateName", //Deprecate
    "RequestOrgs",
    "ActionOffices", // Which one?
    "SupervisorRequired",
    "EmailPipelineOnClose",
    "HideReport",
  ];
}

export class ServiceTypeTemplate {
  IsLoading = ko.observable();

  UID = null;
  TemplateElmId = null;

  TemplateViewModel = ko.observable();

  constructor(serviceType) {
    this.UID = serviceType.UID;
    this.TemplateElmId = getTemplateElmId(serviceType.UID);
    this.ServiceType = serviceType;
  }

  Load = async function () {
    this.IsLoading(true);
    if (!document.getElementById(this.TemplateElmId)) {
      await loadServiceTypeTemplate(this.UID);
    }
    const service = await import(modulePath(this.UID));
    if (!service) {
      console.logError("Could not find service module");
    }
    this.TemplateViewModel(service.default);
    this.IsLoading(false);
  };

  static Create = async function (uid) {
    const serviceTypeTemplate = new ServiceTypeTemplate(uid);
    if (!document.getElementById(serviceTypeTemplate.TemplateElmId)) {
      await loadServiceTypeTemplate(uid);
    }
    const service = await import(modulePath(uid));
    if (!service) {
      console.logError("Could not find service module");
    }
    serviceTypeTemplate.TemplateViewModel = service.default;
    return serviceTypeTemplate;
  };
}

async function loadServiceTypeTemplate(uid) {
  const templateId = getTemplateElmId(uid);
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

export const serviceTypeStore = ko.observableArray();
