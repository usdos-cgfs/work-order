import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";
import ContractorSupplement from "../../contractor_supplement/ContractorSupplement.js";

import { ValidationError } from "../../../primitives/ValidationError.js";
import CH_Overtime from "../Entity.js";

export default class ActionAPM {
  constructor(params) {
    console.log("Hello from APM Actions module.");
    this._context = getAppContext();
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    // this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;

    if (!this.ServiceType.Entity().ID) {
      console.error("No service entity provided");
    }

    this.newEntity = {};

    this.init();
  }

  Editing = ko.observable(true);

  DisplayMode = ko.pureComputed(() => {
    return this.Editing() ? "edit" : "view";
  });

  init = async () => {
    // Create a clone of the service type entity
    Object.assign(this.newEntity, this.ServiceType.Entity());
    // this.newEntity = new CH_Overtime(params.request);
    // this.newEntity.ID = this.ServiceType.Entity().ID;
    // this.ServiceType.Def()?.getListRef()?.LoadEntity(this.newEntity);
    // this.newEntity.Request = params.request;

    if (window.DEBUG) console.log("setting supplement");
    await new Promise();

    if (!this.newEntity.ContractorSupplement.entity())
      this.newEntity.ContractorSupplement.entity(new ContractorSupplement());
    const isValid = this.validate(false);
    this.Editing(isValid.length);
    this.IsCompleted(!isValid.length);
  };

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);
  IsCompleted = ko.observable(false);

  validate = (showErrors = true) => {
    if (!this.newEntity) return [];
    const errors = [];

    if (this.newEntity.GTM.validate(showErrors).length) {
      errors.push(
        new ValidationError(
          errorSource,
          "required-field",
          "Please provide a GTM."
        )
      );
    }

    if (this.newEntity.COR.validate(showErrors).length) {
      errors.push(
        new ValidationError(
          errorSource,
          "required-field",
          "Please provide a COR."
        )
      );
    }

    if (
      this.newEntity.ContractorSupplement.entity().validate(showErrors).length
    ) {
      errors.push(
        new ValidationError(
          errorSource,
          "required-field",
          "Please provide the contractor supplemental information."
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

  // gtmWatcher = (user) => {
  //   if (!this.GTM()) {
  //     this.GTM(user);
  //   }
  // };

  submit = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;

    await this.newEntity.ContractorSupplement.create(
      this.newEntity.ContractorSupplement.entity()
    );

    await this.ServiceType.Def()
      ?.getListRef()
      ?.UpdateEntity(this.newEntity, CH_Overtime.Views.APMUpdate);

    this.ServiceType.refreshEntity();
    this.hasBeenSaved(true);
    this.IsCompleted(true);
  };

  update = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;

    await this.ServiceType.Def()
      ?.getListRef()
      ?.UpdateEntity(this.ServiceType.Entity(), ["COR", "GTM"]);

    await this.newEntity.ContractorSupplement.update(
      ContractorSupplement.Views.APMUpdate
    );
    this.ServiceType.refreshEntity();
    this.hasBeenSaved(true);
  };
}

const errorSource = "apm-actions";
