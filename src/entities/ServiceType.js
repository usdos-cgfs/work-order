import { registerServiceTypeComponent } from "../common/KnockoutExtensions.js";
import { assetsPath } from "../app.js";
import ApplicationDbContext from "../infrastructure/ApplicationDbContext.js";

export const getTemplateElementId = (uid) => `tmpl-${uid}`;

const getServiceTypePathByUid = (uid) =>
  `${assetsPath}/entities/ServiceTypeTemplates/${uid}/`;

export const getTemplateFilePath = (uid) =>
  getServiceTypePathByUid(uid) + `${uid}-template.html`;

export const modulePath = (uid) =>
  getServiceTypePathByUid(uid) + `${uid}-module.js`;

export const serviceTypeStore = ko.observableArray();

export class ServiceType {
  constructor(serviceType) {
    this.ID = serviceType.ID;
    this.Title = serviceType.Title;
    this.LookupValue = serviceType.Title;

    this.Loaded = false;
    Object.assign(this, serviceType);
  }

  getRepositoryListName = () => `st_${this.UID}`;

  getListDef = () => {
    if (!this.HasTemplate) {
      return null;
    }
    const listName = this.getRepositoryListName();
    return { title: listName, name: listName };
  };

  _listRef = null;

  getListRef = () => {
    if (!this.HasTemplate) {
      return null;
    }
    // Memoization
    if (!this._listRef)
      this._listRef = ApplicationDbContext.Set(this.getListDef());
    return this._listRef;
  };

  _componentName = null;
  getComponentName = () => {
    if (this._componentName) return this._componentName;
    if (!this.UID) {
      return null;
    }
    this._componentName = this.UID;
    registerServiceTypeComponent(
      this._componentName,
      this._componentName,
      this.UID
    );
    return this._componentName;
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
