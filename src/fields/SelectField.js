import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "select-view",
  edit: "select-edit",
};

registerFieldComponent("select", components);

export default class SelectField extends BaseField {
  constructor({ displayName, isRequired = false, options }) {
    super({ displayName, isRequired });
    this.Options(options);
  }

  Options = ko.observableArray();

  components = components;
}
