import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";
import { ContractorSupplement } from "./ch_overtime-module.js";

import { registerServiceTypeComponent } from "../../../common/KnockoutExtensions.js";

export default class ActionAPM {
  constructor(params) {
    this._context = getAppContext();
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    // this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;
    this.Supplement = this.ServiceType.Entity().ContractorSupplement;
    this.Entity = this.ServiceType.Entity;

    //this.validate();
    this.init();
  }

  init = async () => {
    registerServiceTypeComponent(
      "edit-contractor-supplement",
      this.ServiceType.Def().UID
    );

    const entityExists =
      await this.ServiceType.Entity().ContractorSupplement.refresh();

    console.log("Found supplement", entityExists);
  };

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  validate = () => {
    if (!this.ServiceType.Entity()) return [];
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
