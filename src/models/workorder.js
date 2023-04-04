import { SPList } from "../common/sal.js";
import { RequestOrg } from "./RequestOrg.js";

export const WorkOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    IsActive: { type: "Bool", koMap: "requestIsActive" },
    ManagingDirector: { type: "Person", koMap: "requestorManager" },
    //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    RequestDescription: { type: "Text", koMap: "requestDescriptionHTML" },
    RequestOrgs: { type: "Lookup", koMap: "requestOrgIds" },
    Requestor: { type: "Person", koMap: "requestor" },
    RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { type: "Text", koMap: "requestorOfficeLookupId" },
    RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { type: "Text", koMap: "requestStatus" },
    RequestSubject: { type: "Text", koMap: "requestSubject" },
    RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Date", koMap: "empty" },
  },
};

export const WorkOrderListRef = new SPList(WorkOrderListDef);

export function WorkOrder() {
  const RequestingOrg = new RequestOrg(1, "Person 1");
  const SubmittingOrg = new RequestOrg(2, "Submitting Org");

  console.log(RequestingOrg);
  console.log(SubmittingOrg);
}
