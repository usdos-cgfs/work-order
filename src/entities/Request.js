import { RequestOrg } from "./RequestOrg.js";
import { People } from "../components/People.js";
import { ServiceType } from "./ServiceType.js";
import { PipelineStage } from "./PipelineStage.js";

import { DateField } from "../components/DateField.js";

export const requestStates = {
  draft: "Draft",
  open: "Open",
  cancelled: "Cancelled",
  closed: "Closed",
  rejected: "Rejected",
  fulfilled: "Fulfilled",
};

export class RequestEntity {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  get ID() {
    return this.ObservableID();
  }
  set ID(id) {
    this.ObservableID(id);
  }
  get Title() {
    return this.ObservableTitle();
  }
  set Title(title) {
    this.ObservableTitle(title);
  }

  ObservableID = ko.observable();
  ObservableTitle = ko.observable();

  RequestSubject = ko.observable();
  RequestDescription = ko.observable();

  RequestorInfo = {
    Requestor: ko.observable(),
    Name: ko.observable(),
    Phone: ko.observable(),
    Email: ko.observable(),
    Office: ko.observable(),
    Supervisor: ko.observable(),
    ManagingDirector: ko.observable(),
  };

  State = {
    IsActive: ko.observable(),
    Stage: ko.observable(),
    PreviousStage: ko.observable(),
    Status: ko.observable(),
    PreviousStatus: ko.observable(),
    InternalStatus: ko.observable(),
  };

  Dates = {
    Submitted: new DateField(),
    EstClosed: new DateField(),
    Closed: new DateField(),
  };

  RequestOrgs = ko.observable();

  ServiceType = {
    IsLoading: ko.observable(false),
    Entity: ko.observable(),
    Def: ko.observable(),
    definitionWatcher: (newSvcType) => {
      // This should only be needed when creating a new request.
      this.ServiceType.instantiateEntity(newSvcType);
    },
    instantiateEntity: async (newSvcType = this.ServiceType.Def()) => {
      const newEntity = await newSvcType.instantiateEntity(this);
      this.ServiceType.Entity(newEntity);
    },
    refreshEntity: async () => {
      if (DEBUG) console.log("ServiceType: Refresh Triggered");
      if (!this.ServiceType.Def()?.HasTemplate) return;
      if (!this.ID) return;

      this.ServiceType.IsLoading(true);
      if (!this.ServiceType.Entity()) {
        if (DEBUG)
          console.log("ServiceType: Refresh null entity, Instantiating");
        await this.ServiceType.instantiateEntity();
      }
      var template = this.ServiceType.Entity();
      template.Title = this.Title;
      await this.ServiceType.Def()
        ?.getListRef()
        ?.LoadEntityByRequestId(template, this.ID);

      this.ServiceType.IsLoading(false);
    },
    createEntity: async (newEntity = this.ServiceType.Entity()) => {
      if (!newEntity) return;
      newEntity.Title = this.Title;
      const folderPath = this.getRelativeFolderPath();
      const newSvcTypeItemId = await this.ServiceType.Def()
        .getListRef()
        .AddEntity(newEntity, folderPath, this);
      newEntity.ID = newSvcTypeItemId;
      return newSvcTypeItemId;
    },
    updateEntity: async (fields) => {
      if (!this.ServiceType.Entity()) return;
      await this.ServiceType.Def()
        ?.getListRef()
        ?.UpdateEntity(this.ServiceType.Entity(), fields);
    },
  };

  // FieldMaps are used by the ApplicationDbContext and define
  // how to store and retrieve the entity properties
  FieldMap = {
    ID: this.ObservableID,
    Title: this.ObservableTitle,
    RequestSubject: this.RequestSubject,
    RequestDescription: this.RequestDescription,
    Requestor: {
      set: (val) => this.RequestorInfo.Requestor(People.Create(val)),
      get: this.RequestorInfo.Requestor,
    },
    RequestorName: this.RequestorInfo.Name,
    RequestorPhone: this.RequestorInfo.Phone,
    RequestorEmail: this.RequestorInfo.Email,
    RequestorSupervisor: {
      set: (val) => this.RequestorInfo.Supervisor(People.Create(val)),
      get: this.RequestorInfo.Supervisor,
    },
    ManagingDirector: {
      set: (val) => this.RequestorInfo.ManagingDirector(People.Create(val)),
      get: this.RequestorInfo.ManagingDirector,
    },
    RequestorOrg: {
      set: (val) => this.RequestorInfo.Office(RequestOrg.Create(val)),
      get: this.RequestorInfo.Office,
    },
    IsActive: this.State.IsActive,
    PipelineStage: {
      factory: PipelineStage.FindInStore,
      obs: this.State.Stage,
    },
    RequestStagePrev: this.State.PreviousStage,
    RequestStatus: this.State.Status,
    RequestStatusPrev: this.State.PreviousStatus,
    InternalStatus: this.State.InternalStatus,
    RequestSubmitted: this.Dates.Submitted,
    EstClosedDate: this.Dates.EstClosed,
    ClosedDate: this.Dates.Closed,
    RequestOrgs: {
      set: (inputArr) =>
        this.RequestOrgs(inputArr.map((val) => RequestOrg.Create(val))),
      get: this.RequestOrgs,
    },
    ServiceType: {
      set: (val) => this.ServiceType.Def(ServiceType.Create(val)),
      get: this.ServiceType.Def,
    }, // {id, title},
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "RequestSubject",
      "RequestDescription",
      "Requestor",
      "RequestorName",
      "RequestorPhone",
      "RequestorEmail",
      "RequestorSupervisor",
      "ManagingDirector",
      "RequestorOrg",
      "IsActive",
      "PipelineStage",
      "RequestStagePrev",
      "RequestStatus",
      "RequestStatusPrev",
      "InternalStatus",
      "RequestSubmitted",
      "EstClosedDate",
      "ClosedDate",
      "RequestOrgs",
      "ServiceType",
    ],
    ByStatus: [
      "ID",
      "Title",
      "ServiceType",
      "RequestorOrg",
      "Requestor",
      "RequestSubmitted",
      "EstClosedDate",
      "ClosedDate",
      "RequestStatus",
    ],
  };

  static ListDef = {
    name: "WorkOrder",
    title: "Work Order",
    fields: RequestEntity.Views.All,
  };
}
