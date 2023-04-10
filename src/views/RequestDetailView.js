import { Person } from "../components/Person.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import {
  serviceTypeStore,
  ServiceTypeTemplate,
  ServiceType,
} from "../entities/ServiceType.js";

export const DisplayModes = {
  New: "New",
  Edit: "Edit",
  View: "View",
};

const templates = {
  New: "tmpl-request-header-new",
  View: "tmpl-request-header-view",
  Edit: "tmpl-request-header-edit",
};

export class RequestDetailView {
  Fields = {
    ID: { obs: ko.observable() },
    Title: { obs: ko.observable() },
    RequestSubject: { obs: ko.observable() },
    RequestDescription: { obs: ko.observable() },
    Requestor: { factory: Person.Create, obs: ko.observable() },
    RequestorName: { obs: ko.observable() },
    RequestorPhone: { obs: ko.observable() },
    RequestorEmail: { obs: ko.observable() },
    RequestorSupervisor: { factory: Person.Create, obs: ko.observable() },
    RequestorOffice: { factory: RequestOrg.Create, obs: ko.observable() },
    ManagingDirector: { factory: Person.Create, obs: ko.observable() },

    IsActive: { obs: ko.observable() },
    RequestStage: { obs: ko.observable() },
    RequestStagePrev: { obs: ko.observable() },
    RequestStatus: { obs: ko.observable() },
    RequestStatusPrev: { obs: ko.observable() },
    InternalStatus: { obs: ko.observable() },
    RequestSubmitted: { obs: ko.observable() },
    EstClosedDate: { obs: ko.observable() },
    ClosedDate: { obs: ko.observable() },

    RequestOrgs: { factory: RequestOrg.Create, obs: ko.observableArray() },

    ServiceType: { factory: ServiceType.Create, obs: ko.observable() }, // {id, title},
  };

  FieldMap = this.Fields; // This is a one to one for this entity

  ServiceTypeTemplate = ko.computed(() => {
    console.log("Loading Template for:", this.Fields.ServiceType.obs());
    if (!this.Fields.ServiceType.obs()) {
      return null;
    }

    const serviceTypeLookup = this.Fields.ServiceType.obs();
    const serviceType = serviceTypeStore().find(
      (service) => service.ID == serviceTypeLookup.ID
    );

    return ServiceTypeTemplate.Create(this, serviceType);
  });

  IsLoading = ko.observable();
  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  Refresh = async () => {
    this.IsLoading(true);
    await this._context.Requests.Load(this);
    this.IsLoading(false);
  };

  SubmitNewRequest = async () => {
    await this._context.Requests.Add(this);
  };

  EditRequest = async () => {
    this.DisplayMode(DisplayModes.Edit);
  };

  UpdateRequest = async () => {
    this.DisplayMode(DisplayModes.View);
  };

  CancelChanges = async () => {
    //Refresh
    this.DisplayMode(DisplayModes.Edit);
  };

  constructor({
    displayMode = DisplayModes.View,
    ID = null,
    Title = null,
    serviceType = null,
    _context,
  }) {
    this._context = _context;
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;

    this.Fields.ID.obs(ID);
    this.Fields.Title.obs(Title);

    if (serviceType) {
      this.Fields.ServiceType.obs(
        serviceTypeStore().find((service) => service.ID == serviceType.ID)
      );
    }

    this.DisplayMode(displayMode);

    if (displayMode == DisplayModes.View) {
      this.Refresh();
    }
  }
}
