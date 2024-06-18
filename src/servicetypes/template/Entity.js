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
import {
  registerComponentFromConstructor,
  registerServiceTypeViewComponents,
} from "../../infrastructure/RegisterComponents.js";
import BaseServiceDetail from "../BaseServiceDetail.js";
import { templateViewTemplate } from "./views/View.js";
import { templateEditTemplate } from "./views/Edit.js";
import {
  ConstrainedEntityEditModule,
  ConstrainedEntityViewModule,
} from "../../components/index.js";

/* 
Components and registration are only necessary if we have custom views in our ./views folder
Remove if using the default views (don't forget to remove the reference in our entity request!)
*/
const components = {
  view: "svc-template-view",
  edit: "svc-template-edit",
  new: "svc-template-edit",
};

// registerServiceTypeViewComponents({ uid: "template", components });

const getApmOrg = ko.pureComputed(() => {
  return requestOrgStore().find(
    (org) => org.Title.toUpperCase() == "CGFS/APMS"
  );
});

class TemplateRequestViewModule extends ConstrainedEntityViewModule {
  constructor(params) {
    super(params);
  }

  static name = components.view;
  static template = templateViewTemplate;
}

class TemplateRequestEditModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }

  static name = components.edit;
  static template = templateEditTemplate;
}

registerComponentFromConstructor(TemplateRequestEditModule);
registerComponentFromConstructor(TemplateRequestViewModule);

export default class TemplateRequest extends BaseServiceDetail {
  constructor(entityParams) {
    super(entityParams);
  }

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
  FieldMap = {
    ...this.FieldMap,
    SamplePeople: new PeopleField({
      displayName: "Supervisor",
      isRequired: false,
    }),
    SampleMultiPeople: new PeopleField({
      displayName: "Multiple People",
      isRequired: false,
      multiple: true,
    }),
    SampleGroupPeople: new PeopleField({
      displayName: "Group People",
      isRequired: false,
    }),
    SampleSelect: new SelectField({
      displayName: " Type",
      options: ["FTE", "Contractor"],
      isRequired: false,
    }),
    SampleText: new TextField({
      displayName: "FullName",
      isRequired: false,
    }),
    SampleTextArea: new TextAreaField({
      displayName: "NotificationDates",
      isRequired: false,
    }),
    SampleDate: new DateField({
      displayName: "ExpirationDate",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    SampleCheckbox: new CheckboxField({
      displayName: "SpecialOrder",
    }),
    SampleLookup: new LookupField({
      displayName: "Request Org",
      type: RequestOrg,
      lookupCol: "Title",
      Options: requestOrgStore,
      isRequired: false,
      multiple: false,
    }),
    SampleMultiLookup: new LookupField({
      displayName: "Service Types",
      type: ServiceType,
      lookupCol: "Title",
      Options: serviceTypeStore,
      isRequired: false,
      multiple: true,
    }),
  };

  components = components;

  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_template",
    title: "st_template",
    fields: TemplateRequest.Views.All,
  };
}
