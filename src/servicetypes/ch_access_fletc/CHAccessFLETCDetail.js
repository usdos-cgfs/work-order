import { PeopleField, SelectField, TextField } from "../../fields/index.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";

import { BaseServiceDetail } from "../BaseServiceDetail.js";
import { CH_GenerateAccessControlEmailActions } from "./components/GenerateAccessControlEmailAction.js";

// We just do this here so it get's pull in on the import chain
registerComponentFromConstructor(CH_GenerateAccessControlEmailActions);

export class AccessFletc extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    Supervisor: new PeopleField({
      displayName: "Supervisor",
      isRequired: true,
    }),
    EmployeeType: new SelectField({
      displayName: "Employee Type",
      options: ["Direct Hire", "Contractor", "Visitor"],
      isRequired: true,
    }),
    FullName: new TextField({
      displayName: "Full Name",
      isRequired: true,
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

  static uid = "ch_accessFletc";
}
