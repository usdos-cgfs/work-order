import { getAppContext } from "../../../infrastructure/ApplicationDbContext.js";

export default class ActionGovManager {
  constructor(params) {
    this._context = getAppContext();
    this.ServiceType = params.serviceType;
    this.Errors = params.errors;
    this.ServiceType.Entity().APM.subscribe(this.apmWatcher);
    this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;

    // this.Errors.push({
    //   source: errorSource,
    //   description: "Has not been validated",
    // });
    this.apmWatcher(this.ServiceType.Entity().APM());
    this.gtmWatcher(this.ServiceType.Entity().GTM());
    //this.validate();
  }
  APM = ko.observable();
  GTM = ko.observable();

  hasBeenValidated = ko.observable(false);
  hasBeenSaved = ko.observable(false);

  validate = () => {
    if (!this.ServiceType.Entity()) return [];
    const errors = [];
    if (!this.APM() && !this.ServiceType.Entity().APM()) {
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

    this.ServiceType.Entity().APM(this.APM());
    this.ServiceType.Entity().GTM(this.GTM());

    await this.ServiceType.updateEntity(["APM", "GTM"]);

    this.ServiceType.refreshEntity();
    this.hasBeenSaved(true);
  };
}

const errorSource = "gov-manager-actions";
