import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import LookupField from "../../fields/LookupField.js";

import { RequestOrg, requestOrgStore } from "../../entities/RequestOrg.js";
import { ServiceType, serviceTypeStore } from "../../entities/ServiceType.js";
import { registerServiceTypeViewComponents } from "../../infrastructure/RegisterComponents.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

/* 
Components and registration are only necessary if we have custom views in our ./views folder
Remove if using the default views (don't forget to remove the reference in our entity request!)
*/
// const components = {
//   view: "svc-template-view",
//   edit: "svc-template-edit",
//   new: "svc-template-edit",
// };

// registerServiceTypeViewComponents({ uid: "template", components });

export default class SDMAdminRequest extends BaseServiceDetail {
  constructor({ ID, Title, Request }) {
    super({ ID, Title, Request });
  }

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
  FieldMap = {
    ...this.FieldMap,
    Category: new SelectField({
      displayName: "Category",
      options: ["Category 1", "Category 2", "Category 3"],
      isRequired: false,
    }),
    DatePromised: new DateField({
      displayName: "Date Promised",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    DateCompleted: new DateField({
      displayName: "Date Completed",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
  };

  // components = components;

  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_sdm_admin_request",
    title: "st_sdm_admin_request",
    fields: SDMAdminRequest.Views.All,
  };
}
