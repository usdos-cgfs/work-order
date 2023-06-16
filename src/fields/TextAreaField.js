import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "text-area-view",
  edit: "text-area-edit",
};

registerFieldComponent("textarea", components);

//TODO: What other options? e.g. cols, rows

export default class TextAreaField extends BaseField {
  constructor({ displayName, isRequired = false, isRichText = false }) {
    super({ displayName, isRequired });
    this.isRichText = isRichText;
  }

  components = components;
}
