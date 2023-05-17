import { registerServiceTypeTemplate } from "../common/KnockoutExtensions.js";
import {
  getTemplateElementId,
  getTemplateFilePath,
  modulePath,
} from "../entities/ServiceType.js";

const DEBUG = true;

export class ServiceTypeComponent {
  constructor({
    request,
    Def,
    Entity,
    IsLoading,
    refreshEntity,
    instantiateEntity,
  }) {
    this.Def = Def;
    this.ElementId = this.Def()?.UID;
    this.Request = request;
    this.Entity = Entity;
    this.IsLoading = IsLoading;
    this.refreshEntity = refreshEntity;
    this.instantiateEntity = instantiateEntity;

    this.Def.subscribeChanged(this.serviceTypeWatcher);

    if (Def()) {
      this.loadTemplate(Def());
    }
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  Entity;

  // submitServiceTypeEntity = async () => {
  //   if (!this.Entity()) return;

  //   const newEntity = this.Entity();
  //   newEntity.Title = this.Request.ObservableTitle();

  //   const folderPath = this.Request.getRelativeFolderPath();
  //   const newSvcTypeItemId = await this.Def()
  //     .getListRef()
  //     .AddEntity(newEntity, folderPath, this.Request);

  //   return newSvcTypeItemId;
  // };

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

  serviceTypeWatcher = (newSvcType, oldSvcType) => {
    if (newSvcType?.UID == oldSvcType?.UID) return;
    if (DEBUG)
      console.log("ServiceTypeComponent: ServiceType Changed", newSvcType);
    this.loadTemplate(newSvcType);
  };
}
