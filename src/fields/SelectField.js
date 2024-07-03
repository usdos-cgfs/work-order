import { SelectModule } from "../components/Fields/index.js";
import { BaseField } from "./index.js";

export default class SelectField extends BaseField {
  constructor({
    displayName,
    isRequired = false,
    Visible,
    options,
    multiple = false,
    optionsText,
    instructions,
  }) {
    super({ Visible, displayName, isRequired, instructions });
    ko.isObservable(options) ? (this.Options = options) : this.Options(options);
    this.multiple = multiple;
    this.Value = multiple ? ko.observableArray() : ko.observable();
    this.optionsText = optionsText;
  }

  toString = ko.pureComputed(() =>
    this.multiple ? this.Value().join(", ") : this.Value()
  );

  get = () => this.Value();

  set = (val) => {
    if (val && this.multiple) {
      if (Array.isArray(val)) {
        this.Value(val);
      } else {
        this.Value(val.results ?? val.split(";#"));
      }
      return;
    }
    this.Value(val);
  };

  Options = ko.observableArray();

  components = SelectModule;
}
