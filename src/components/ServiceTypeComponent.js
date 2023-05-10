import {
  getTemplateElementId,
  getTemplateFilePath,
  modulePath,
} from "../entities/ServiceType.js";

const DEBUG = false;

export class ServiceTypeComponent {
  constructor({ request, Def, Entity, context }) {
    this.ServiceType = Def;
    this.ElementId = this.ServiceType()?.UID;
    this.Request = request;
    this.ServiceType.subscribe(this.serviceTypeWatcher);

    this.Entity = Entity;

    if (Def()) {
      this.serviceTypeWatcher(Def());
    }
  }

  ElementId = null;
  ComponentsAreLoading = ko.observable();

  Entity;

  IsLoading = ko.observable();

  refreshServiceTypeEntity = async () => {
    if (DEBUG) console.log("ServiceTypeComponent: refresh Triggered");
    if (!this.Entity()) return;
    this.IsLoading(true);
    var template = this.Entity();
    template.Title = this.Request.ObservableTitle();
    await this.ServiceType()
      ?.getListRef()
      ?.LoadEntityByRequestId(template, this.Request.ObservableID());
    this.IsLoading(false);
  };

  submitServiceTypeEntity = async () => {
    if (!this.Entity()) return;

    const newEntity = this.Entity();
    newEntity.Title = this.Request.ObservableTitle();

    const folderPath = this.Request.getRelativeFolderPath();
    const newSvcTypeItemId = await this.ServiceType()
      .getListRef()
      .AddEntity(newEntity, folderPath, this.Request);

    return newSvcTypeItemId;
  };

  serviceTypeWatcher = async (newSvcType) => {
    if (DEBUG)
      console.log("ServiceTypeComponent: ServiceType Changed", newSvcType);
    // This should only be triggered when a new RequestDetailView is created
    // or when the user changes the request from the drop down.
    if (!newSvcType?.HasTemplate) {
      this.Entity(null);
      return;
    }
    this.ComponentsAreLoading(true);

    this.ElementId = getTemplateElementId(newSvcType.UID);
    if (!document.getElementById(this.ElementId)) {
      await loadServiceTypeTemplate(newSvcType.UID);
    }
    const service = await import(modulePath(newSvcType.UID));
    if (!service) {
      console.logError("Could not find service module");
    }

    this.Entity(new service.default(this.Request));
    this.ComponentsAreLoading(false);

    if (this.Request.ObservableID()) this.refreshServiceTypeEntity();
  };
}

async function loadServiceTypeTemplate(uid) {
  const templateId = getTemplateElementId(uid);
  const response = await fetch(getTemplateFilePath(uid));

  if (!response.ok) {
    console.error(
      `Fetching the HTML file went wrong - ${response.statusText}`,
      getTemplateFilePath(uid)
    );
    // throw new Error(
    //   `Fetching the HTML file went wrong - ${response.statusText}`
    // );
  }

  const text = await response.text();
  const element = document.createElement("script");

  element.setAttribute("type", "text/html");
  element.setAttribute("id", templateId);
  element.text = text;

  document.getElementById("service-type-templates").append(element);
}
