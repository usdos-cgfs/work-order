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

export default class TierIRequest extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
  FieldMap = {
    ...this.FieldMap,
    Subject: new TextField({
      displayName: "Title",
      instructions: `Brief one line summary identifying the issue.<br>
      (Team Name - Action Name - Brief description of Issue)`,
      isRequired: true,
    }),
    EmployeeId: new TextField({
      displayName: "Employee ID",
      instructions: `Required if applicable. Please do NOT include employee SSN.`,
      isRequired: true,
    }),
    AnalystPOC: new PeopleField({
      displayName: "Analyst POC",
      instructions: "Name of the incident reporter.",
      isRequired: true,
    }),
    QWINumber: new TextField({
      displayName: "QWI Number",
      instructions: `(example: GFS-WI-APP-###)`,
      isRequired: true,
    }),
    QWIStep: new TextField({
      displayName: "QWI Step",
      instructions: `What step in the QWI were you not able to complete successfully?`,
      isRequired: true,
    }),
    IssueDate: new DateField({
      displayName: "Issue Date/Pay-Period of Action",
      type: dateFieldTypes.date,
      instructions: `(Needed to allow determination of software version being used)`,
      isRequired: true,
    }),
    DISAction: new TextField({
      displayName: "DIS Action",
      instructions: `Required if applicable - if associated with a particular employee, this will be applicable`,
      isRequired: true,
    }),
    DISRequestCode: new TextField({
      displayName: "DIS Request Code",
      instructions: `Required if applicable - if associated with a particular action in DIS, this will be applicable`,
      isRequired: true,
    }),
    PayImpacting: new CheckboxField({
      displayName: "Pay Impacting",
      instructions: `Does the action impact an employee's pay if the issue is not resolved immediately? Please provide any necessary information in the instructions.`,
    }),
    ImpactCount: new TextField({
      displayName: "Number of Employees Impacted",
      isRequired: true,
    }),
    ResolutionDate: new DateField({
      displayName: "Required Date for Resolution",
      instructions: `Enter date required for resolution. What is the last day this action needs to be successfully completed before the employee's pay is negatively impacted?`,
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    PayrollOpIssue: new CheckboxField({
      displayName: "Payroll Operational Issue - Yes/No",
      instructions: `Process did not finish or unexpected processing results - from OPS`,
    }),
    NewRequirement: new TextField({
      displayName:
        "New Requirement or request to modify existing functionality?",
      instructions: `What changed or is expected to change?`,
      isRequired: false,
    }),
    CompliancePolicy: new TextField({
      displayName: "Compliance and Policy",
      instructions: `Did policy change? Is GFACS not compliant?`,
      isRequired: false,
    }),
    SecurityRoleChange: new TextField({
      displayName: "Security Role Change?",
      isRequired: false,
    }),
    DataUpdateRequest: new TextField({
      displayName: "Data Update/Execution Form (EF) request",
      instructions: `What needs to be update? Specific fields, dates? When is it needed by?`,
      isRequired: false,
    }),
    QueryRequest: new TextAreaField({
      displayName: "Query Request",
      instructions: `What needs to be update? Specific fields, dates? When is it needed by?`,
      isRequired: false,
    }),
    DatabaseIssues: new TextAreaField({
      displayName: "Database operation/output issues",
      instructions: `e.g. error message clarification`,
      isRequired: false,
    }),
  };

  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title"],
  };

  static ListDef = {
    name: "st_sdm_tier_I",
    title: "st_sdm_tier_I",
    fields: TierIRequest.Views.All,
  };
}
