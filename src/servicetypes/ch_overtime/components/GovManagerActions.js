import { getAppContext } from "../../../infrastructure/ApplicationDbContext.js";

import { ValidationError } from "../../../primitives/ValidationError.js";
import PeopleField from "../../../fields/PeopleField.js";

export default class ActionGovManager {
  constructor(params) {
    this._context = getAppContext();
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    // this.ServiceType.Entity().APM.subscribe(this.apmWatcher);
    // this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;

    // this.Errors.push({
    //   source: errorSource,
    //   description: "Has not been validated",
    // });
    this.apmWatcher(this.ServiceType.Entity().APM.get());
    this.gtmWatcher(this.ServiceType.Entity().GTM.get());
    const isValid = this.validate(false);
    this.Editing(isValid.length);
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

    await this.ServiceType.Def().getListRef()?.UpdateEntity(updatedEntity);

    this.ServiceType.refreshEntity();
    this.hasBeenSaved(true);
  };
}

const errorSource = "gov-manager-actions";
