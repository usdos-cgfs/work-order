import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "select-view",
  edit: "select-edit",
};

registerFieldComponent("select", components);

export default class SelectField extends BaseField {
  constructor({
    displayName,
    isRequired = false,
    Visible,
    options,
    multiple = false,
  }) {
    super({ Visible, displayName, isRequired });
    this.Options(options);
    this.multiple = multiple;
  }

  // For use with multiple select
  SelectedOptions = ko.observableArray();
  SelectedOption = ko.observable();

  toString = () =>
    this.multiple ? this.SelectedOptions().join(", ") : this.SelectedOption();

  Value = ko.pureComputed({
    read: () =>
      this.multiple ? this.SelectedOptions().join(", ") : this.SelectedOption(),
    write: (val) =>
      this.multiple ? this.SelectedOptions(val) : this.SelectedOption(val),
  });

  get = () => {
    if (this.multiple) {
      return this.SelectedOptions();
    }

    return this.SelectedOption();
  };
  set = (val) => {
    if (val && this.multiple) {
      if (Array.isArray(val)) {
        this.SelectedOptions(val);
      } else {
        this.SelectedOptions(val.results ?? val.split("#;"));
      }
      return;
    }
    this.SelectedOption(val);
  };

  Options = ko.observableArray();

  components = components;
}
