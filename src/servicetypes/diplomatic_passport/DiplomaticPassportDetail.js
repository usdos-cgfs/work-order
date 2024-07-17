import {
  DateField,
  dateFieldTypes,
  PeopleField,
  SelectField,
  TextAreaField,
  TextField,
} from "../../fields/index.js";

import { BaseServiceDetail } from "../BaseServiceDetail.js";

import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import {
  ConstrainedEntityEditModule,
  ConstrainedEntityViewModule,
} from "../../components/index.js";
import { diplomaticPassportEditTemplate } from "./views/Edit.js";
import { diplomaticPassportViewTemplate } from "./views/View.js";

const documentTypes = {
  Passport: "Passport",
  Visa: "Visa",
};

const requestTypes = {
  New: "New",
  Renewal: "Renewal",
};

const components = {
  view: "svc-diplomatic_passport-view",
  edit: "svc-diplomatic_passport-edit",
  new: "svc-diplomatic_passport-edit",
};

class DiplomaticPassportEditModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }

  static name = components.edit;
  static template = diplomaticPassportEditTemplate;
}

class DiplomaticPassportViewModule extends ConstrainedEntityViewModule {
  constructor(params) {
    super(params);
  }

  static name = components.view;
  static template = diplomaticPassportViewTemplate;
}

registerComponentFromConstructor(DiplomaticPassportEditModule);
registerComponentFromConstructor(DiplomaticPassportViewModule);

export class DiplomaticPassportVisa extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  TypesSelected = ko.pureComputed(
    () =>
      this.FieldMap.RequestType.Value() && this.FieldMap.DocumentType.Value()
  );

  ShowPassportInfo = ko.pureComputed(() => {
    const requestType = this.FieldMap.RequestType.Value();
    const documentType = this.FieldMap.DocumentType.Value();

    if (!requestType || !documentType) return false;
    if (
      documentType == documentTypes.Passport &&
      requestType == requestTypes.New
    )
      return false;
    return true;
  });

  FieldMap = {
    ...this.FieldMap,
    DocumentType: new SelectField({
      displayName: "Document Type",
      options: Object.values(documentTypes),
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: Object.values(requestTypes),
      isRequired: true,
    }),
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
    Grade: new TextField({
      displayName: "Grade/Rank",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    JobTitle: new TextField({
      displayName: "Job Title",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    DestinationCity: new TextField({
      displayName: "Destination City",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    DestinationCountry: new TextField({
      displayName: "Destination Country",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    Departure: new DateField({
      displayName: "Departure",
      type: dateFieldTypes.date,
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    Return: new DateField({
      displayName: "Return",
      type: dateFieldTypes.date,
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    BirthLocation: new TextField({
      displayName: "State/Country of Birth",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    DateOfBirth: new DateField({
      displayName: "Date of Birth",
      type: dateFieldTypes.date,
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    Gender: new TextField({
      displayName: "Gender",
      isRequired: true,
      Visible: this.TypesSelected,
    }),
    PassportDateIssued: new DateField({
      displayName: "Issue Date (of most recent Passport)",
      type: dateFieldTypes.date,
      isRequired: true,
      Visible: this.ShowPassportInfo,
    }),
    PassportDateExpiration: new DateField({
      displayName: "Expiration Date (of most recent Passport)",
      type: dateFieldTypes.date,
      isRequired: true,
      Visible: this.ShowPassportInfo,
    }),
    FullName: new TextField({
      displayName: "Full Name (as it appears on passport)",
      isRequired: true,
      Visible: this.ShowPassportInfo,
    }),
    PassportNum: new TextField({
      displayName: "Passport #",
      isRequired: true,
      Visible: this.ShowPassportInfo,
    }),
    Justification: new TextAreaField({
      displayName: "Justification (if passport is expedited)",
      isRequired: false,
      width: 12,
      Visible: this.TypesSelected,
    }),
  };

  TravelFields = ko.pureComputed(() => [
    this.FieldMap.DestinationCountry,
    this.FieldMap.DestinationCity,
    this.FieldMap.Departure,
    this.FieldMap.Return,
  ]);

  PersonalFields = ko.pureComputed(() => [
    this.FieldMap.DateOfBirth,
    this.FieldMap.BirthLocation,
    this.FieldMap.Gender,
  ]);

  PassportFields = ko.pureComputed(() => [
    this.FieldMap.PassportDateIssued,
    this.FieldMap.PassportDateExpiration,
    this.FieldMap.FullName,
    this.FieldMap.PassportNum,
  ]);

  components = components;

  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_diplomatic_passport",
    title: "st_diplomatic_passport",
    fields: DiplomaticPassportVisa.Views.All,
  };

  static uid = "diplomatic_passport";
}
