import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";

import { ValidationError } from "../../../primitives/ValidationError.js";
import PeopleField from "../../../fields/PeopleField.js";

import { assignmentStates } from "../../../entities/Assignment.js";
import CH_Overtime from "../Entity.js";
import ApprovalActions from "../../../components/AssignmentActions/ApprovalModule.js";

export default class ActionGovManager extends ApprovalActions {
  constructor(params) {
    super(params);
    this._context = getAppContext();

    this.ServiceType = params.request.ServiceType;
    this.Errors = params.errors;
    this.Request = params.request;

    // this.Errors.push({
    //   source: errorSource,
    //   description: "Has not been validated",
    // });
    this.apmWatcher(this.ServiceType.Entity().APM.get());
    this.gtmWatcher(this.ServiceType.Entity().GTM.get());
    const isValid = this.validate(false);

    // If the assignment has been completed
    // or the state is valid
    if (this.assignment.Status != assignmentStates.InProgress)
      this.Editing(false);
  }

  Editing = ko.observable(true);

  APM = new PeopleField({
    displayName: "APM",
    isRequired: true,
  });

  GTM = new PeopleField({
    displayName: "GTM",
    isRequired: false,
  });

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  validate = (showErrors = true) => {
    if (!this.ServiceType.Entity()) return [];
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
    const updatedEntity = {
      ID: this.ServiceType.Entity().ID,
      APM: this.APM.get(),
    };

    if (this.GTM.get()) {
      updatedEntity.GTM = this.GTM.get();
    }

    await ApplicationDbContext.Set(CH_Overtime).UpdateEntity(updatedEntity);

    this.ServiceType.refreshEntity();

    if (this.assignment.Status != assignmentStates.Approved)
      await this.completeAssignment(this.assignment, assignmentStates.Approved);

    this.Editing(false);
    this.hasBeenSaved(true);
  };
}

const errorSource = "gov-manager-actions";
