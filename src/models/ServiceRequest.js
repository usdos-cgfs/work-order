import { SPList, MapListItem } from "../common/sal.js";
import { RequestOrg } from "./RequestOrg.js";
import { FieldArray, PersonField } from "../common/fields.js";
import { MapObjectsToViewFields } from "../common/Common.js";
import { Person } from "./Person.js";

export const WorkOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
};

//export const WorkOrderListRef = new SPList(WorkOrderListDef);

export class RequestHeader {
  static ListRef = new SPList(WorkOrderListDef);
  // const RequestingOrg = new RequestOrg(1, "Person 1");
  // const SubmittingOrg = new RequestOrg(2, "Submitting Org");

  // console.log(RequestingOrg);
  // console.log(SubmittingOrg);

  constructor() {
    //this.FieldMap.Title.obs(title);
  }

  FieldMap = {
    //ID: { type: "Text", koMap: "empty" },
    Title: { obs: ko.observable() },
    // EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    IsActive: { obs: ko.observable() },
    // //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    //RequestDescription: { type: "Text", obs: ko.observable() },
    // RequestOrgs: { type: "Lookup", koMap: "requestOrgIds" },
    //Requestor: { type: "Person", koMap: "requestor" },
    // RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    // RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { factory: RequestOrg.factory, obs: ko.observable() },
    RequestOrgs: { factory: RequestOrg.factory, obs: ko.observableArray() },
    // RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    // RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    // RequestStage: { type: "Text", koMap: "requestStageNum" },
    // RequestStatus: { type: "Text", koMap: "requestStatus" },
    // RequestSubject: { type: "Text", koMap: "requestSubject" },
    // RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    // ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    // ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Author: { factory: Person.factory, obs: ko.observable() },
    // ManagingDirector: { type: "Person", obs: new PersonField({}) },
    // Created: { type: "Date", koMap: "empty" },
  };

  loadByTitle = async function (title) {
    var servicerequest = await RequestHeader.ListRef.findByTitleAsync(
      title,
      Object.keys(this.FieldMap)
    );
    MapObjectsToViewFields(servicerequest[0], this.FieldMap);
  };
}

export class RequestDetail {
  requestHeader = new RequestHeader();

  constructor({ title }) {}

  static newRequest = async function () {};

  static viewRequest = async function ({ title }) {
    var newRequest = new RequestDetail({ title });
    await newRequest.requestHeader.loadByTitle(title);

    return newRequest;
  };
}
