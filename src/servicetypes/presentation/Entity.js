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
    PresentationDate: new DateField({
      displayName: "Presentation Date and Time",
      type: dateFieldTypes.datetime,
      isRequired: true,
    }),
    Location: new TextField({
      displayName: "Location",
      isRequired: true,
    }),
    Duration: new TextField({
      displayName: "Duration",
      isRequired: true,
    }),
    POC: new TextField({
      displayName: "POC",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "PresentationDate", "Location", "Duration", "POC"],
  };

  static ListDef = {
    name: "st_presentation",
    title: "st_presentation",
    fields: Entity.Views.All,
  };
}
