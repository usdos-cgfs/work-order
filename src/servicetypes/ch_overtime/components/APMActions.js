import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";
import ContractorSupplement from "../../contractor_supplement/Entity.js";

import { ValidationError } from "../../../primitives/ValidationError.js";
import CH_Overtime from "../Entity.js";
import { assignmentStates } from "../../../entities/Assignment.js";
import ApprovalActions from "../../../components/AssignmentActions/ApprovalModule.js";

export default class ActionAPM extends ApprovalActions {
  constructor(params) {
    super(params);
    if (window.DEBUG) console.log("Hello from APM Actions module.");
    this._context = getAppContext();

    this.ServiceType = params.request.RequestBodyBlob?.Value();
    this.Errors = params.errors;
    // this.ServiceType.Entity().GTM.subscribe(this.gtmWatcher);
    this.Request = params.request;

    this.newEntity = new CH_Overtime();
    this.newEntity.fromJSON(this.ServiceType.toJSON());
    this.init();
  }
  newEntity = null;

  HasLoaded = ko.observable(false);

  Editing = ko.observable(true);

  DisplayMode = ko.pureComputed(() => {
    return this.Editing() ? "edit" : "view";
  });

  init = async () => {
    // await ApplicationDbContext.Set(CH_Overtime).LoadEntity(this.newEntity);
    // this.newEntity.Request = this.Request;
    // Create a clone of the service type entity
    // Object.assign(this.newEntity, this.ServiceType.Entity());
    // this.newEntity = new CH_Overtime(params.request);
    // this.newEntity.ID = this.ServiceType.Entity().ID;
    // this.newEntity.Request = params.request;

    if (window.DEBUG) console.log("setting supplement");
    await this.newEntity.setRequestContext(this.Request);
    // await new Promise();
    // await this.newEntity.ContractorSupplementField.ensure();
    if (!this.newEntity.ContractorSupplementField.Value())
      this.newEntity.ContractorSupplementField.Value(
        new ContractorSupplement({
          Title: this.Request.Title,
          Request: this.Request,
        })
      );

    const isValid = this.validate(false);
    if (this.assignment.Status != assignmentStates.InProgress)
      this.Editing(false);
    this.IsCompleted(!isValid.length);
    this.HasLoaded(true);
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
      this.newEntity.ContractorSupplementField.Value().validate(showErrors)
        .length
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

  ShowSupplementComponent = ko.pureComputed(
    () => this.newEntity.GTM.IsValid() && this.newEntity.COR.IsValid()
  );

  submit = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;

    this.newEntity.ContractorSupplementField.Value().Request = this.Request;

    await this.newEntity.ContractorSupplement.create(
      this.newEntity.ContractorSupplementField.Value()
    );

    // await ApplicationDbContext.Set(CH_Overtime).UpdateEntity(
    //   this.newEntity,
    //   CH_Overtime.Views.APMUpdate
    // );

    // this.ServiceType.refreshEntity();

    this.Request.RequestBodyBlob.Value(this.newEntity);

    await this._context.Requests.UpdateEntity(this.Request, [
      "RequestBodyBlob",
    ]);

    if (this.assignment.Status != assignmentStates.Approved);
    await this.completeAssignment(this.assignment, assignmentStates.Approved);

    this.hasBeenSaved(true);
    this.IsCompleted(true);
  };

  update = async () => {
    this.hasBeenValidated(true);
    if (this.validate().length) return;

    this.Request.RequestBodyBlob.Value(this.newEntity);

    await this._context.Requests.UpdateEntity(this.Request, [
      "RequestBodyBlob",
    ]);

    await this.newEntity.ContractorSupplement.update(
      ContractorSupplement.Views.APMUpdate
    );
    // this.ServiceType.refreshEntity();
    this.hasBeenSaved(true);
    this.Editing(false);
  };
}

const errorSource = "apm-actions";
