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

  FieldMap = {
    SamplePeople: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
    SampleSelect: new SelectField({
      displayName: " Type",
      options: ["FTE", "Contractor"],
      isRequired: true,
    }),
    SampleText: new TextField({
      displayName: "FullName",
      isRequired: true,
    }),
    SampleTextArea: new TextAreaField({
      displayName: "NotificationDates",
      isRequired: true,
    }),
    SampleDate: new DateField({
      displayName: "ExpirationDate",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    SampleCheckbox: new CheckboxField({
      displayName: "SpecialOrder",
    }),
  };

  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_",
    title: "st_",
    fields: Entity.Views.All,
  };
}
