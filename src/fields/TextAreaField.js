import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
};

registerFieldComponent("textarea", components);

//TODO: What other options? e.g. cols, rows

export default class TextAreaField {
  constructor({ displayName, isRequired = false, isRichText = false }) {
    this.isRichText = isRichText;
    this.displayName = displayName;
    this.isRequired = isRequired;
  }

  Value = ko.observable();

  get = () => this.Value();
  set = (val) => this.Value(val);

  components = components;
}
