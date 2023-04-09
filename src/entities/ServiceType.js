const getTemplateId = (uid) => `tmpl-${uid}`;

const assetsPath = (uid) => `./serviceTypeTemplates/${uid}/`;
const templatePath = (uid) => assetsPath(uid) + `${uid}-template.html`;
const modulePath = (uid) => assetsPath(uid) + `${uid}-module.js`;

export class ServiceType {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static Fields = [
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
  constructor(uid) {
    this.UID = uid;
    this.TemplateId = getTemplateId(uid);
  }

  static Create = async function (uid) {
    const serviceType = new ServiceType(uid);
    if (!document.getElementById(serviceType.TemplateId)) {
      await loadServiceTypeTemplate(uid);
    }
    const service = await import(modulePath(uid));
    if (!service) {
      console.logError("Could not find service module");
    }
    serviceType.ViewModel = service.default;
    return serviceType;
  };
}

async function loadServiceTypeTemplate(uid) {
  const templateId = getTemplateId(uid);
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
