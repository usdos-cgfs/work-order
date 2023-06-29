import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  TypesSelected = ko.pureComputed(
    () =>
      this.FieldMap.DocumentType.Value() && this.FieldMap.RequestType.Value()
  );

  ShowPassportInfo = ko.pureComputed(() => {
    if (!this.TypesSelected()) return false;
    if (this.FieldMap.RequestType.Value() == this.requestTypes.New)
      return false;
    return true;
  });

  documentTypes = {
    Passport: "Passport",
    Visa: "Visa",
  };

  requestTypes = {
    New: "New",
    Renewal: "Renewal",
  };

  FieldMap = {
    DocumentType: new SelectField({
      displayName: "Document Type",
      options: Object.values(this.documentTypes),
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: Object.values(this.requestTypes),
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

  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_diplomatic_passport",
    title: "st_diplomatic_passport",
    fields: Entity.Views.All,
  };
}
