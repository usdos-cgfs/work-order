import { ValidationError } from "../primitives/ValidationError.js";

export default class BaseField {
  constructor({
    displayName,
    isRequired = false,
    width,
    Visible = ko.pureComputed(() => true),
  }) {
    this.displayName = displayName;
    this.isRequired = isRequired;
    this.Visible = Visible;
    this.width = width ? "col-md-" + width : "col-md-6";
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  toString = ko.pureComputed(() => this.Value());

  validate = (showErrors = true) => {
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  Errors = ko.pureComputed(() => {
    if (!this.ShowErrors() || !this.Visible()) return [];
    const isRequired =
      typeof this.isRequired == "function"
        ? this.isRequired()
        : this.isRequired;
    if (!isRequired) return [];
    return this.Value()
      ? []
      : [
          new ValidationError(
            "text-field",
            "required-field",
            (typeof this.displayName == "function"
              ? this.displayName()
              : this.displayName) + ` is required!`
          ),
        ];
  });

  ShowErrors = ko.observable(false);

  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}
