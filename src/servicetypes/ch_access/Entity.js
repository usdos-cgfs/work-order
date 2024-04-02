import BaseServiceDetail from "../BaseServiceDetail.js";
import {
  BlobField,
  SelectField,
  DateField,
  dateFieldTypes,
  TextField,
  PeopleField,
} from "../../fields/index.js";

import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class CH_Access extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  accessTypeOpts = ["Normal work day", "24/7", "Permanant", "Temporary"];

  employeeTypeOpts = ["CGFS Government", "CGFS Contractor", "Other"];

  AccessDates = new BlobField({
    displayName: "Access Dates",
    entityType: AccessDate,
    multiple: true,
    width: 12,
    isRequired: true,
  });

  AccessType = new SelectField({
    isRequired: true,
    displayName: "Access Type",
    options: this.accessTypeOpts,
  });
  BadgeNum = new TextField({ displayName: "Badge Num", isRequired: true });
  EmployeeType = new SelectField({
    isRequired: true,
    displayName: "Employee Type",
    options: this.employeeTypeOpts,
  });
  FullName = new TextField({ displayName: "Full Name", isRequired: true });
  Locations = new TextField({ displayName: "Locations", isRequired: true });
  Supervisor = new PeopleField({
    displayName: "Supervisor",
    isRequired: true,
  });

  FieldMap = {
    ...this.FieldMap,
    AccessDates: this.AccessDates,
    AccessType: this.AccessType,
    BadgeNum: this.BadgeNum,
    EmployeeType: this.EmployeeType,
    FullName: this.FullName,
    Locations: this.Locations,
    Supervisor: this.Supervisor,
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "AccessType", // CHS
      "AccessDates",
      "BadgeNum",
      "EmployeeType",
      "FullName",
      "Locations",
      "Supervisor",
      "Request",
    ],
  };

  static ListDef = {
    name: "st_ch_access",
    title: "st_ch_access",
    isServiceType: true,
    fields: CH_Access.Views.All,
  };
}

class AccessDate extends ConstrainedEntity {
  FieldMap = {
    StartDate: new DateField({
      displayName: "Start Date",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    EndDate: new DateField({
      displayName: "End Date",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
  };
}
