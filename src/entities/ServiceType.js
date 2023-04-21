import { siteRoot } from "../infrastructure/SAL.js";
import { appRoot } from "../common/Router.js";
import ApplicationDbContext from "../infrastructure/ApplicationDbContext.js";

export const getTemplateElementId = (uid) => `tmpl-${uid}`;

const componentsPath = (uid) =>
  `${appRoot}/SiteAssets/wo/entities/ServiceTypeTemplates/${uid}/`;

export const templatePath = (uid) =>
  componentsPath(uid) + `${uid}-template.html`;
export const modulePath = (uid) => componentsPath(uid) + `${uid}-module.js`;

export const getRepositoryListName = (serviceType) => `st_${serviceType.UID}`;

export const serviceTypeStore = ko.observableArray();

export class ServiceType {
  constructor(serviceType) {
    this.ID = serviceType.ID;
    this.Title = serviceType.Title;
    this.LookupValue = serviceType.Title;

    this.Loaded = false;
    Object.assign(this, serviceType);
  }

  getListDef = () => {
    if (!this.HasTemplate) {
      return null;
    }
    const listName = getRepositoryListName(this);
    return { title: listName, name: listName };
  };

  getListRef = () => {
    if (!this.HasTemplate) {
      return null;
    }
    return ApplicationDbContext.Set(this.getListDef());
  };

  static Create = function ({ ID, LookupValue }) {
    const newServiceType = new ServiceType({ ID, Title: LookupValue });
    const serviceType = serviceTypeStore().find((service) => service.ID == ID);
    return Object.assign(newServiceType, serviceType);
  };

  static FindInStore = function (serviceType) {
    if (!serviceType || !serviceType.ID) return null;
    return serviceTypeStore().find((service) => service.ID == serviceType.ID);
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

  static ListDef = {
    name: "ConfigServiceTypes",
    title: "ConfigServiceTypes",
    fields: this.Views.All,
  };
}
