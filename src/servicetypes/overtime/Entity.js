import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import BaseEntity from "../BaseEntity.js";
import BlobField from "../../fields/BlobField.js";
import DateField from "../../fields/DateField.js";

import { currentUser } from "../../infrastructure/Authorization.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    FullName: new PeopleField({
      displayName: "Contractor",
      isRequired: true,
    }),
    ManagerGov: new PeopleField({
      displayName: "Gov Manager",
      isRequired: true,
    }),
    ManagerGTM: new PeopleField({
      displayName: "COR/GTM",
      isRequired: true,
    }),
    Office: new SelectField({
      displayName: "Department",
      options: currentUser()
        .RequestingOffices()
        .map((office) => office.Title),
      isRequired: true,
    }),
    RequisitionNumber: new TextField({
      displayName: "Requisition Number/Task Order",
      isRequired: true,
    }),
    Task: new TextField({
      displayName: "Project Task",
      isRequired: true,
    }),
    Hours: new TextField({
      displayName: "Overtime Hours Total",
      isRequired: true,
    }),
    ContractorType: new SelectField({
      displayName: "Contractor Type",
      options: ["SCA", "Non-SCA"],
      isRequired: true,
    }),
    DatesRaw: new BlobField({
      displayName: "Overtime Dates",
      isRequired: true,
      width: 12,
      entity: DatesBlob,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "FullName",
      "ManagerGov",
      "ManagerGTM",
      "Office",
      "RequisitionNumber",
      "Task",
      "Hours",
      "ContractorType",
      "DatesRaw",
    ],
  };

  static ListDef = {
    name: "st_overtime",
    title: "st_overtime",
    fields: Entity.Views.All,
  };
}

class DatesBlob extends BaseEntity {
  constructor() {
    super();
  }
  FieldMap = {
    date: new DateField({
      displayName: "Date",
      isRequired: true,
    }),
    hours: new TextField({
      displayName: "# of Hours",
      isRequired: true,
    }),
    label: new TextField({
      displayName: "Note/Label",
      isRequired: false,
    }),
  };
}