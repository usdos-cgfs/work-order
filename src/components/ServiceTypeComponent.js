import {
  registerServiceTypeComponent,
  registerServiceTypeTemplate,
} from "../common/KnockoutExtensions.js";
import {
  getTemplateElementId,
  getTemplateFilePath,
  getModuleFilePath,
} from "../entities/ServiceType.js";

import { DisplayModes } from "../views/RequestDetailView.js";
const DEBUG = true;

export class ServiceTypeComponent {
  constructor({
    request,
    Def,
    Entity,
    IsLoading,
    refreshEntity,
    instantiateEntity,
    displayMode,
  }) {
    this.request = request;
    this.RequestDescription = this.request.RequestDescription;
    this.DisplayMode = displayMode;

    this.Def = Def;
    this.ElementId = this.Def()?.UID;
    this.Entity = Entity;
    this.IsLoading = IsLoading;
    this.refreshEntity = refreshEntity;
    this.instantiateEntity = instantiateEntity;

    this.Def.subscribeChanged(this.serviceTypeWatcher);

    if (Def()) {
      this.loadTemplate(Def());
    }
  }

  DisplayModes = DisplayModes;
  ElementId = null;
  ComponentsAreLoading = ko.observable();

  Entity;

  HasComponent = ko.pureComputed(
    () => this.Def()?.HasTemplate && this.Def()?.UID
  );

  CurrentComponentName = ko.pureComputed(() => {
    if (!this.Def()?.HasTemplate) return null;
    return this.Def()?.UID;
  });

  CurrentComponentParams = ko.pureComputed(() => {
    return {
      entity: this.Entity(),
      displayMode: this.DisplayMode,
    };
  });

  registerComponents = (newSvcType) => {
    registerServiceTypeComponent({
      componentName: newSvcType.UID,
      moduleName: newSvcType.UID,
      serviceTypeUid: newSvcType.UID,
    });
  };

  loadTemplate = async (newSvcType) => {
    // This should only be triggered when a new RequestDetailView is created
    // or when the user changes the request from the drop down.
    if (!newSvcType?.HasTemplate) {
      this.Entity(null);
      return;
    }

    this.ComponentsAreLoading(true);

    this.ElementId = await registerServiceTypeTemplate(
      newSvcType.UID,
      newSvcType.UID
    );
    // await this.instantiateEntity(newSvcType);
    this.ComponentsAreLoading(false);
  };

  TemplateData = ko.pureComputed(() => {
    return { DisplayMode: this.DisplayMode, DisplayModes, ...this.Entity() };
  });
  serviceTypeWatcher = (newSvcType, oldSvcType) => {
    if (newSvcType?.UID == oldSvcType?.UID) return;
    if (DEBUG)
      console.log("ServiceTypeComponent: ServiceType Changed", newSvcType);
    this.loadTemplate(newSvcType);
    //this.registerComponents();
  };
}

class ServiceTypeEntityComponent {
  constructor(entity, displayMode) {
    this.DisplayMode = displayMode;
    Object.assign(this, entity);
  }
}
