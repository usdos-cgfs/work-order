import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
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

  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_",
    title: "st_",
    fields: Entity.Views.All,
  };
}
