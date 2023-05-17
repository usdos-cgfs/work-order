import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";
import { ContractorSupplement } from "./ch_overtime-module.js";

import { registerServiceTypeComponent } from "../../../common/KnockoutExtensions.js";

export default class ActionAPM {
  constructor(params) {
    console.log("Hello from APM Actions module.");
    this._context = getAppContext();
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    // this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;
    this.Supplement = this.ServiceType.Entity().ContractorSupplement;
    this.Entity = this.ServiceType.Entity;

    this.init();
  }

  init = async () => {
    registerServiceTypeComponent(
      "edit-contractor-supplement",
      this.ServiceType.Def().UID
    );

    const entityExists = await this.Supplement.refresh();

    this.validate();
    console.log("Found supplement", entityExists);
  };

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  getValidationErrors = () => {
    const errors = [];
    if (!this.Entity().GTM()) {
      errors.push({
        source: errorSource,
        description: "Please provide a GTM.",
      });
    }
    if (!this.Entity().COR()) {
      errors.push({
        source: errorSource,
        description: "Please provide a COR.",
      });
    }

    if (!this.Supplement.entity.IsValid()) {
      errors.push({
        source: errorSource,
        description: "Please provide the contractor supplemental information.",
      });
    }

    return errors;
  };

  validate = () => {
    const validationErrors = this.getValidationErrors();
    this.Errors(
      this.Errors()
        .filter((e) => e.source != errorSource)
        .concat(validationErrors)
    );
    return validationErrors;
  };

  // gtmWatcher = (user) => {
  //   if (!this.GTM()) {
  //     this.GTM(user);
  //   }
  // };

  submit = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;
    console.log(this);

    await this.ServiceType.Def()
      ?.getListRef()
      ?.UpdateEntity(this.ServiceType.Entity(), ["COR", "GTM"]);

    await this.Supplement.create();
    this.Request.refreshAll();
    this.hasBeenSaved(true);
  };

  update = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;

    await this.ServiceType.Def()
      ?.getListRef()
      ?.UpdateEntity(this.ServiceType.Entity(), ["COR", "GTM"]);

    await this.Supplement.update();
    this.Request.refreshAll();
    this.hasBeenSaved(true);
  };
}

const errorSource = "apm-actions";
