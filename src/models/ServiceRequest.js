import { SPList, MapListItem } from "../common/sal.js";
import { RequestOrg, CreateRequestOrg } from "./RequestOrg.js";
import { FieldArray, PersonField } from "../common/fields.js";

export const WorkOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
};

export const WorkOrderListRef = new SPList(WorkOrderListDef);

export function RequestHeader() {
  const RequestingOrg = new RequestOrg(1, "Person 1");
  const SubmittingOrg = new RequestOrg(2, "Submitting Org");

  console.log(RequestingOrg);
  console.log(SubmittingOrg);

  const FieldMap = {
    //ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", obs: ko.observable() },
    // EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    IsActive: { type: "Bool", obs: ko.observable() },
    // //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    //RequestDescription: { type: "Text", obs: ko.observable() },
    // RequestOrgs: { type: "Lookup", koMap: "requestOrgIds" },
    Requestor: { type: "Person", koMap: "requestor" },
    // RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    // RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { type: "LookUp", obs: RequestingOrg },
    //RequestOrgs: {
    //   type: "LookUp",
    //   array: true,
    //   obs: new FieldArray(CreateRequestOrg),
    // },
    // RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    // RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    // RequestStage: { type: "Text", koMap: "requestStageNum" },
    // RequestStatus: { type: "Text", koMap: "requestStatus" },
    // RequestSubject: { type: "Text", koMap: "requestSubject" },
    // RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    // ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    // ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    // Author: { type: "Person", obs: new PersonField({}) },
    // ManagingDirector: { type: "Person", obs: new PersonField({}) },
    // Created: { type: "Date", koMap: "empty" },
  };
  const publicMembers = {
    FieldMap,
    // Fields,
  };

  return publicMembers;
}

export async function RequestDetail({ title }) {
  const requestHeader = RequestHeader();
  if (title) {
    // If we are passing in a title, try to find it
    var servicerequest = await WorkOrderListRef.findByTitleAsync(
      title,
      Object.keys(requestHeader.FieldMap)
    );
    console.log("ServiceRequest", servicerequest);
    //MapListItem(servicerequest[0].oListItem, requestHeader.FieldMap);
  }

  const publicMembers = {
    requestHeader,
  };

  return publicMembers;
}
