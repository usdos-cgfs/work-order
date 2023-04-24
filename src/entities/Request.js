export const requestStates = {
  draft: "Draft",
  open: "Open",
  cancelled: "Cancelled",
  closed: "Closed",
};

export class RequestEntity {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    return new ServiceType({ ID, title: LookupValue });
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
    ],
  };

  static ListDef = {
    name: "WorkOrder",
    title: "Work Order",
    fields: RequestEntity.Views.All,
  };
}
