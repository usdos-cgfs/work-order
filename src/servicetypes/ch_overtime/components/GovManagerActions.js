import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";

import { requestOrgStore } from "../../../entities/RequestOrg.js";

import { ValidationError } from "../../../primitives/ValidationError.js";
import PeopleField from "../../../fields/PeopleField.js";

import { assignmentStates } from "../../../entities/Assignment.js";
import CH_Overtime from "../Entity.js";
import ApprovalActions from "../../../components/AssignmentActions/ApprovalModule.js";
import { getUsersByGroupName } from "../../../infrastructure/Authorization.js";

export default class ActionGovManager extends ApprovalActions {
  constructor(params) {
    super(params);
    this._context = getAppContext();

    this.ServiceType = params.request.RequestBodyBlob?.TypedValue();
    this.Errors = params.errors;
    this.Request = params.request;

    // this.Errors.push({
    //   source: errorSource,
    //   description: "Has not been validated",
    // });
    this.apmWatcher(this.ServiceType?.APM.get());
    this.gtmWatcher(this.ServiceType?.GTM.get());
    const isValid = this.validate(false);

    this.apmGroup.subscribe(this.apmChangeHandler);
    this.apmChangeHandler(this.apmGroup());
    // this.newEntity = new CH_Overtime();
    // this.newEntity.fromJSON(this.ServiceType.toJSON());

    // If the assignment has been completed
    // or the state is valid
    if (this.assignment.Status != assignmentStates.InProgress)
      this.Editing(false);
  }

  Editing = ko.observable(true);

  apmGroup = ko.pureComputed(() => {
    return requestOrgStore().find(
      (org) => org.Title.toUpperCase() == "CGFS/APMS"
    );
  });

  apmChangeHandler = async (group) => {
    if (!group?.UserGroup?.Title) return;
    const users = await getUsersByGroupName(group?.UserGroup?.Title);

    const instructionText = users.map((user) => user.Title).join("; ");
    this.APM.instructions("Options: " + instructionText);
  };

  APM = new PeopleField({
    displayName: "APM",
    isRequired: true,
    spGroupName: ko.pureComputed(() => {
      const apmOrg = this.apmGroup();

      return apmOrg?.UserGroup?.Title;
    }),
    // instructions: ko.observable(),
    // pickerOptions: ko.pureComputed(() => {
    //   const apmOrg = this.apmGroup();

    //   if (apmOrg?.UserGroup?.ID) {
    //     return {
    //       SharePointGroupID: apmOrg.UserGroup.ID,
    //     };
    //   }
    //   return {};
    // }),
  });

  GTM = new PeopleField({
    displayName: "GTM",
    isRequired: false,
  });

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  validate = (showErrors = true) => {
    if (!this.ServiceType) return [];
    const errors = [];
    if (this.APM.validate(showErrors).length) {
      errors.push(
        new ValidationError(
          errorSource,
          "gov-manager-actions",
          "Please provide a valid APM."
        )
      );
    }

    this.Errors(
      this.Errors()
        .filter((e) => e.source != errorSource)
        .concat(errors)
    );
    return errors;
  };

  apmWatcher = (user) => {
    if (!this.APM.get()) {
      this.APM.set(user);
      // this.validate();
    }
  };

  gtmWatcher = (user) => {
    if (!this.GTM.get()) {
      this.GTM.set(user);
    }
  };

  submit = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;
    console.log(this);

    // this.ServiceType.Entity().APM(this.APM());
    // this.ServiceType.Entity().GTM(this.GTM());
    this.ServiceType.APM.set(this.APM.get());

    if (this.GTM.get()) {
      updatedEntity.GTM = this.GTM.get();
      this.ServiceType.GTM.set(this.GTM.get());
    }

    // await ApplicationDbContext.Set(CH_Overtime).UpdateEntity(updatedEntity);
    await this._context.Requests.UpdateEntity(this.Request, [
      "RequestBodyBlob",
    ]);
    // this.ServiceType.refreshEntity();

    if (this.assignment.Status != assignmentStates.Approved)
      await this.completeAssignment(this.assignment, assignmentStates.Approved);

    this.Editing(false);
    this.hasBeenSaved(true);
  };
}

const errorSource = "gov-manager-actions";
