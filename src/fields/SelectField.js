import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";

const components = {
  view: "select-view",
  edit: "select-edit",
};

export default class SelectField {
  constructor({ displayName, isRequired = false, options }) {
    this.displayName = displayName;
    this.Options(options);
    this.isRequired = isRequired;
  }

  Value = ko.observable();
  Options = ko.observableArray();

  set = (val) => this.Value(val);
  get = () => this.Value();

  components = components;
}

registerFieldComponent("select", components);
