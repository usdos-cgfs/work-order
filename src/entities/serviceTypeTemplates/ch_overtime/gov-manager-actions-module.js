import { getAppContext } from "../../../infrastructure/ApplicationDbContext.js";

export default class ActionGovManager {
  constructor(params) {
    this._context = getAppContext();
    this.ServiceTypeEntity = params.serviceTypeEntity;
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    this.ServiceTypeEntity().APM.subscribe(this.apmWatcher);
    this.ServiceTypeEntity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;

    // this.Errors.push({
    //   source: errorSource,
    //   description: "Has not been validated",
    // });
    this.apmWatcher(this.ServiceTypeEntity().APM());
    //this.validate();
  }
  APM = ko.observable();
  GTM = ko.observable();

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  validate = () => {
    if (!this.ServiceTypeEntity()) return [];
    const errors = [];
    if (!this.APM() && !this.ServiceTypeEntity().APM()) {
      errors.push({
        source: errorSource,
        description: "Please provide an APM.",
      });
    }
    // else if (!this.hasBeenSaved()) {
    //   errors.push({
    //     source: errorSource,
    //     description: "Has not been saved",
    //   });
    // }

    this.Errors(
      this.Errors()
        .filter((e) => e.source != errorSource)
        .concat(errors)
    );
    return errors;
  };

  apmWatcher = (user) => {
    if (!this.APM()) {
      this.APM(user);
      this.validate();
    }
  };

  gtmWatcher = (user) => {
    if (!this.GTM()) {
      this.GTM(user);
    }
  };

  submit = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;
    console.log(this);

    this.ServiceTypeEntity().APM(this.APM());
    this.ServiceTypeEntity().GTM(this.GTM());

    await this.ServiceType()
      ?.getListRef()
      ?.UpdateEntity(this.ServiceTypeEntity(), ["APM", "GTM"]);

    this.Request.refreshAll();
    this.hasBeenSaved(true);
  };
}

const errorSource = "gov-manager-actions";
