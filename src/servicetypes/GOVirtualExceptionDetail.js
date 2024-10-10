import {
  DateField,
  PeopleField,
  SelectField,
  TextField,
} from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class GOVirtualException extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  // setRequestContext = async (request) => {
  //   this.Request = request;
  //   const managingDirector = request.Request.Office()?.ManagingDirector;
  //   if (managingDirector) {
  //     this.ManagingDirector.set(managingDirector);
  //   }
  // };

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
    AccessType: this.AccessType,
    StartDate: this.StartDate,
    EndDate: this.EndDate,
    // ManagingDirector: this.ManagingDirector,
  };

  static Views = {
    All: ["ID", "Title", "AccessType", "StartDate", "EndDate"],
  };

  static ListDef = {
    name: "st_govirtual",
    title: "st_govirtual",
    isServiceType: true,
    fields: GOVirtualException.Views.All,
  };

  static uid = "govirtual";
}
