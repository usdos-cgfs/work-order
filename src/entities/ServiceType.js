import { siteRoot } from "../infrastructure/SAL.js";

const getTemplateElmId = (uid) => `tmpl-${uid}`;

const assetsPath = (uid) =>
  `${siteRoot}/SiteAssets/wo/entities/serviceTypeTemplates/${uid}/`;
const templatePath = (uid) => assetsPath(uid) + `${uid}-template.html`;
const modulePath = (uid) => assetsPath(uid) + `${uid}-module.js`;

export const serviceTypeStore = ko.observableArray();

export class ServiceType {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;

    this.Loaded = false;
  }

  LoadFromStore = () => {
    if (this.Loaded) {
      return;
    }
    this.Loaded = true;
    const storedEntity = serviceTypeStore().find(
      (service) => service.ID == this.ID
    );
    if (!storedEntity) {
      console.warn("Entity was not stored");
      return;
    }

    Object.assign(this, storedEntity);
  };

  static Create = function ({ ID, LookupValue }) {
    const newServiceType = new ServiceType({ ID, Title: LookupValue });
    const serviceType = serviceTypeStore().find((service) => service.ID == ID);
    return Object.assign(newServiceType, serviceType);
  };

  static Fields = [
    "ID",
    "Title",
    "Active",
    "HasTemplate",
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
  constructor(request, serviceType) {
    this.Request = request;
    this.UID = serviceType.UID;
    this.TemplateElmId = getTemplateElmId(serviceType.UID);
    this.ServiceType = serviceType;
  }

  IsLoading = ko.observable();

  UID = null;
  TemplateElmId = null;

  TemplateViewModel = ko.observable();

  Load = async function () {
    if (!this.ServiceType.HasTemplate) {
      return;
    }
    this.IsLoading(true);
    if (!document.getElementById(this.TemplateElmId)) {
      await loadServiceTypeTemplate(this.UID);
    }
    const service = await import(modulePath(this.UID));
    if (!service) {
      console.logError("Could not find service module");
    }
    this.TemplateViewModel(new service.default(this.Request));
    this.IsLoading(false);
  };

  static Create = function (request, serviceType) {
    var serviceTypeTemplate = new ServiceTypeTemplate(request, serviceType);
    serviceTypeTemplate.Load();
    return serviceTypeTemplate;
  };

  static CreateAsync = async function () {
    var serviceTypeTemplate = new ServiceTypeTemplate(request, serviceType);
    await serviceTypeTemplate.Load();
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
