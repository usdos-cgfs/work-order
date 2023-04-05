import { SPList, MapListItem } from "../common/sal.js";
import { RequestOrg } from "./RequestOrg.js";
import { PersonField } from "../common/fields.js";

export const WorkOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
};

export const WorkOrderListRef = new SPList(WorkOrderListDef);

export function RequestHeader() {
  const testObs = ko.observable("hello");
  const AuthorField = new PersonField({});

  const RequestingOrg = new RequestOrg(1, "Person 1");
  const SubmittingOrg = new RequestOrg(2, "Submitting Org");

  console.log(RequestingOrg);
  console.log(SubmittingOrg);

  const fieldMap = {
    // ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: ko.observable() },
    // EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    // IsActive: { type: "Bool", koMap: "requestIsActive" },
    // ManagingDirector: { type: "Person", koMap: "requestorManager" },
    // //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    // RequestDescription: { type: "Text", koMap: "requestDescriptionHTML" },
    // RequestOrgs: { type: "Lookup", koMap: "requestOrgIds" },
    // Requestor: { type: "Person", koMap: "requestor" },
    // RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    // RequestorName: { type: "Text", koMap: "requestorName" },
    // RequestorOffice: { type: "Text", koMap: "requestorOfficeLookupId" },
    // RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    // RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    // RequestStage: { type: "Text", koMap: "requestStageNum" },
    // RequestStatus: { type: "Text", koMap: "requestStatus" },
    // RequestSubject: { type: "Text", koMap: "requestSubject" },
    // RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    // ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    // ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Author: { type: "Text", koMap: AuthorField.SPMap },
    // Created: { type: "Date", koMap: "empty" },
  };
  const publicMembers = {
    testObs,
    fieldMap,
    AuthorField,
  };

  return publicMembers;
}

export async function RequestDetail({ title }) {
  const requestHeader = RequestHeader();
  if (title) {
    // If we are passing in a title, try to find it
    var servicerequest = await WorkOrderListRef.findByTitleAsync(title);
    console.log("ServiceRequest", servicerequest);
    MapListItem(servicerequest[0].oListItem, requestHeader.fieldMap);
    console.log(requestHeader.AuthorField);
  }

  const publicMembers = {
    requestHeader,
  };

  return publicMembers;
}
