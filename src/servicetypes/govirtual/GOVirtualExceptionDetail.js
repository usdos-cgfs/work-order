import { ConstrainedEntityEditModule } from "../../components/index.js";
import { RequestOrg, requestOrgStore } from "../../entities/RequestOrg.js";
import {
  DateField,
  LookupField,
  PeopleField,
  SelectField,
  TextField,
} from "../../fields/index.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import { defaultComponents } from "../../primitives/defaultComponents.js";

import { BaseServiceDetail } from "../BaseServiceDetail.js";
import { govirtualEditTemplate } from "./views/Edit.js";

const components = {
  ...defaultComponents,
  edit: "svc-govirtual-edit",
  new: "svc-govirtual-edit",
};

class GOVirtualExceptionModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }

  static name = components.edit;
  static template = govirtualEditTemplate;
}

registerComponentFromConstructor(GOVirtualExceptionModule);

export class GOVirtualException extends BaseServiceDetail {
  constructor(params) {
    super(params);
    this.RequestingOffice.Value.subscribe(this.requestingOfficeChangeHandler);
  }

  // setRequestContext = async (request) => {
  //   this.Request = request;
  //   const managingDirector = request.Request.Office()?.ManagingDirector;
  //   if (managingDirector) {
  //     this.ManagingDirector.set(managingDirector);
  //   }
  // };

  RequestingOffice = new LookupField({
    isRequired: true,
    type: RequestOrg,
    displayName: "Requesting Office",
    Options: ko.pureComputed(() => {
      return requestOrgStore().filter((org) => org.ManagingDirector);
    }),
  });

  ManagingDirector = new PeopleField({
    isRequired: true,
    displayName: "Managing Director",
    isEditable: false,
  });

  requestingOfficeChangeHandler = (newOffice) => {
    if (!newOffice) return;
    this.ManagingDirector.set(newOffice.ManagingDirector);
  };

  accessTypeOpts = ["Temporary", "Permanent"];

  AccessType = new SelectField({
    isRequired: true,
    displayName: "Request Type",
    options: this.accessTypeOpts,
  });

  DatesRequired = ko.pureComputed(() => this.AccessType.Value() == "Temporary");

  StartDate = new DateField({
    displayName: "Start Date",
    isRequired: this.DatesRequired,
    Visible: this.DatesRequired,
  });

  EndDate = new DateField({
    displayName: "End Date",
    isRequired: this.DatesRequired,
    Visible: this.DatesRequired,
  });

  // ManagingDirector = new PeopleField({
  //   displayName: "Managing Director",
  //   isRequired: true,
  // });

  FieldMap = {
    ...this.FieldMap,
    RequestingOffice: this.RequestingOffice,
    ManagingDirector: this.ManagingDirector,
    AccessType: this.AccessType,
    StartDate: this.StartDate,
    EndDate: this.EndDate,
  };

  components = components;

  static Views = {
    All: [
      "ID",
      "Title",
      "RequestingOffice",
      "ManagingDirector",
      "AccessType",
      "StartDate",
      "EndDate",
    ],
  };

  static ListDef = {
    name: "st_govirtual",
    title: "st_govirtual",
    isServiceType: true,
    fields: GOVirtualException.Views.All,
  };

  static uid = "govirtual";
}
