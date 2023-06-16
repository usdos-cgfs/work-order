import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";

const components = {
  view: "text-view",
  edit: "text-edit",
};

registerFieldComponent("text", components);

export default class TextField {
  constructor({ displayName, isRequired = false }) {
    this.displayName = displayName;
    this.isRequired = isRequired;
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  components = components;
}
