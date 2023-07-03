import { registerServiceTypeViewComponents } from "../infrastructure/RegisterComponents.js";
import { assetsPath } from "../env.js";
import ApplicationDbContext from "../infrastructure/ApplicationDbContext.js";

export const getTemplateElementId = (uid) => `tmpl-${uid}`;

const getServiceTypePathByUid = (uid) => `${assetsPath}/servicetypes/${uid}/`;

export const getTemplateFilePath = (uid) =>
  getServiceTypePathByUid(uid) + `${uid}-template.html`;

export const getModuleFilePath = (uid) =>
  getServiceTypePathByUid(uid) + `Entity.js`;

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
    if (!this._initialized) {
      throw new Error("Accessing constructor before initialization");
    }
    // Memoization
    if (!this._listRef)
      this._listRef = ApplicationDbContext.Set(this._constructor);
    return this._listRef;
  };

  _components = null;
  getViewComponents = () => {
    if (this._components) return this._components;
    if (!this.UID) {
      return null;
    }
    this._components = {
      View: "svc-view-" + this.UID,
      Edit: "svc-edit-" + this.UID,
    };

    registerServiceTypeViewComponents({
      uid: this.UID,
      components: this._components,
    });
    // TODO: Minor - this is hacky, maybe we should pass the filename as well when we register
    this._components.New = this._components.Edit;
    return this._components;
  };

  _constructor = null;

  instantiateEntity = async (requestContext) => {
    if (!this.HasTemplate || !this.UID) {
      return null;
    }

    if (!this._initialized) {
      await this.initializeEntity();
    }

    return this._constructor ? new this._constructor(requestContext) : null;
  };

  _initialized = false;
  initializeEntity = async () => {
    if (this._initialized) return;
    if (!this.HasTemplate || !this.UID) {
      return;
    }
    if (this._constructor) {
      console.warn("Service type was already initialized");
      this._initialized = true;
      return;
    }
    // this.ServiceType.IsLoading(true);
    try {
      const serviceModule = await import(getModuleFilePath(this.UID));
      if (!serviceModule) {
        console.error("Could not find service module");
        return null;
      }
      this._initialized = true;
      this._constructor = serviceModule.default;
    } catch (e) {
      console.error("Cannot import service type module", e);
    }
  };

  // TODO: Minor - this should be in a servicetype manager service
  userCanInitiate = (user) => {
    if (!this.Active) return false;
    return true;
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

  // TODO: Major - ReportingRequestOrgs
  static Views = {
    All: [
      "ID",
      "Title",
      "Active",
      "HasTemplate",
      "DescriptionTitle",
      "Description",
      "Icon",
      "AttachmentsRequiredCnt",
      "DescriptionRequired",
      "AttachmentDescription",
      "DaysToCloseBusiness",
      "UID",
      "ReportingOrgs",
    ],
  };

  static ListDef = {
    name: "ConfigServiceTypes",
    title: "ConfigServiceTypes",
    fields: ServiceType.Views.All,
  };
}
