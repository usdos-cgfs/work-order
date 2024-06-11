import { ValidationError } from "../primitives/ValidationError.js";

export class BaseField {
  constructor({
    displayName,
    instructions = null,
    isRequired = false,
    width,
    Visible = ko.pureComputed(() => true),
  }) {
    this.displayName = displayName;
    this.instructions = instructions;
    this.isRequired = isRequired;
    this.Visible = Visible;
    this.width = width ? "col-md-" + width : "col-md-6";

    this.addFieldRequirement(isRequiredValidationRequirement(this));
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  toString = ko.pureComputed(() => this.Value());

  toJSON = () => this.Value();
  fromJSON = (val) => this.Value(val);

  validate = (showErrors = true) => {
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  _fieldValidationRequirements = ko.observableArray();

  Errors = ko.pureComputed(() => {
    if (!this.Visible()) return [];
    const errors = this._fieldValidationRequirements()
      .filter((req) => req.requirement())
      .map((req) => req.error);

    return errors;
  });

  addFieldRequirement = (requirement) =>
    this._fieldValidationRequirements.push(requirement);

  IsValid = ko.pureComputed(() => !this.Errors().length);

  ShowErrors = ko.observable(false);

  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}

function isRequiredValidationRequirement(field) {
  return {
    requirement: ko.pureComputed(() => {
      // Return true if field fails validation
      const isRequired = ko.unwrap(field.isRequired);
      if (!isRequired) return false;

      const value = ko.unwrap(field.Value);
      if (value?.constructor == Array) return !value.length;
      return value === null || value === undefined;
    }),
    error: new ValidationError(
      "text-field",
      "required-field",
      `${ko.utils.unwrapObservable(field.displayName)} is required!`
    ),
  };
}
