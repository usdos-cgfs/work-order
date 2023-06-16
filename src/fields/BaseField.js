import { ValidationError } from "../primitives/ValidationError.js";

export default class BaseField {
  constructor({ displayName, isRequired = false }) {
    this.displayName = displayName;
    this.isRequired = isRequired;
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  validate = () => {
    this.ShowErrors(true);
  };

  Errors = ko.pureComputed(() => {
    if (!this.ShowErrors()) return [];
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
