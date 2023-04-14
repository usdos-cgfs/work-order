import { siteRoot } from "../infrastructure/SAL.js";
import { appRoot } from "../common/Router.js";

export const getTemplateElementId = (uid) => `tmpl-${uid}`;

const componentsPath = (uid) =>
  `${appRoot}/SiteAssets/wo/entities/ServiceTypeTemplates/${uid}/`;

export const templatePath = (uid) =>
  componentsPath(uid) + `${uid}-template.html`;
export const modulePath = (uid) => componentsPath(uid) + `${uid}-module.js`;

export const getRepositoryListName = (serviceType) => `st_${serviceType.UID}`;

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

  static Views = {
    All: [
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
    ],
  };
}
