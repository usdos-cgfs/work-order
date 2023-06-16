import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    SamplePeople: new PeopleField({
      displayName: "Supervisor",
    }),
    SampleSelect: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor", "Visitor"],
    }),
    SampleText: new TextField({
      displayName: "Full Name",
    }),
    SampleTextArea: new TextAreaField({
      displayName: "Notification Dates",
    }),
    SampleDate: new DateField({ displayName: "Expiration Date" }),
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
