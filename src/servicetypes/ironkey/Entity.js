import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    UserName: new PeopleField({
      displayName: "User Name",
      isRequired: true,
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor"],
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Replacement"],
      isRequired: true,
    }),
    Supervisor: new PeopleField({
      displayName: "COR/Supervisor",
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "UserName",
      "EmployeeType",
      "RequestType",
      "Supervisor",
    ],
  };

  static ListDef = {
    name: "st_ironkey",
    title: "st_ironkey",
    fields: Entity.Views.All,
  };
}
