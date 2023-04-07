import { Person } from "../models/Person.js";
import { DisplayModes } from "../models/RequestDetail.js";
import { RequestOrg } from "./RequestOrg.js";

const templates = {
  New: "tmpl-request-header-new",
  View: "tmpl-request-header-view",
  Edit: "tmpl-request-header-edit",
};

export class RequestHeader {
  DisplayModes = DisplayModes;

  // const RequestingOrg = new RequestOrg(1, "Person 1");
  // const SubmittingOrg = new RequestOrg(2, "Submitting Org");

  // console.log(RequestingOrg);
  // console.log(SubmittingOrg);
  DisplayMode = ko.observable();
  Template = ko.observable();

  constructor({ displayMode = DisplayModes.View, id = null, title = null }) {
    this.id = id;
    this.title = title;
    this.DisplayMode(displayMode);
    this.Template(templates[displayMode]);
    //this.FieldMap.Title.obs(title);
  }

  FieldMap = {
    // ID: { obs: ko.observable() },
    Title: { obs: ko.observable() },
    // EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    IsActive: { obs: ko.observable() },
    //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    //RequestDescription: { type: "Text", obs: ko.observable() },
    Requestor: { factory: Person.Create, obs: ko.observable() },
    // RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    // RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { factory: RequestOrg.Create, obs: ko.observable() },
    RequestOrgs: { factory: RequestOrg.Create, obs: ko.observableArray() },
    // RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    // RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    // RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { obs: ko.observable() },
    MultiChoice: { obs: ko.observableArray() },
    // RequestSubject: { type: "Text", koMap: "requestSubject" },
    RequestSubmitted: { obs: ko.observable() },
    // ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    ClosedDate: { obs: ko.observable() },
    // Author: { factory: Person.Create, obs: ko.observable() },
    ManagingDirector: { factory: Person.Create, obs: ko.observable() },
    // Created: { obs: ko.observable() },
  };
}
