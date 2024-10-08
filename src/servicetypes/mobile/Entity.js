import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import BaseEntity from "../BaseEntity.js";

export default class Entity extends BaseEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    User: new PeopleField({
      displayName: "User Name",
      isRequired: true,
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["FTE", "Contractor"],
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Broken/Lost/Stolen", "Accessories"],
      isRequired: true,
    }),
    PlanType: new SelectField({
      displayName: "Plan Type",
      options: ["Domestic", "Global"],
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "User", "EmployeeType", "RequestType", "PlanType"],
  };

  static ListDef = {
    name: "st_mobile_phone",
    title: "st_mobile_phone",
    fields: Entity.Views.All,
  };
}
