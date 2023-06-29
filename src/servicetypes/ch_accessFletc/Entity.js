import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class AccessFletc extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    Supervisor: new PeopleField({
      displayName: "Supervisor",
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor", "Visitor"],
    }),
    FullName: new TextField({
      displayName: "Full Name",
    }),
  };

  static Views = {
    All: ["ID", "Title", "Supervisor", "EmployeeType", "FullName"],
  };

  static ListDef = {
    name: "st_ch_access_fletc",
    title: "st_ch_access_fletc",
    fields: AccessFletc.Views.All,
  };
}
