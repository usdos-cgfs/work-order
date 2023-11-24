import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
// import ValidationError from "../primitives/ValidationError.js";

const components = {
  view: "text-view",
  edit: "text-edit",
  new: "text-edit",
};

registerFieldComponent("text", components);

export default class TextField extends BaseField {
  constructor(params) {
    super(params);
    this.attr = params.attr ?? {};
  }

  components = components;
}
