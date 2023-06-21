import { ValidationError } from "../primitives/ValidationError.js";

export default class BaseField {
  constructor({
    displayName,
    isRequired = false,
    width,
    Visible = () => true,
  }) {
    this.displayName = displayName;
    this.isRequired = isRequired;
    this.Visible = Visible;
    this.width = width ? "col-" + width : "col";
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  toString = () => this.Value();

  validate = () => {
    this.ShowErrors(true);
  };

  Errors = ko.pureComputed(() => {
    if (!this.ShowErrors() || !this.Visible()) return [];
    if (!this.isRequired) return [];
    return this.Value()
      ? []
      : [
          new ValidationError(
            "text-field",
            "required-field",
            this.displayName + ` is required!`
          ),
        ];
  });

  ShowErrors = ko.observable(false);

  ValidationClass = ko.pureComputed(() => {
    if (!this.ShowErrors()) return;
    return this.Errors().length ? "is-invalid" : "is-valid";
  });
}
