import { TextModule } from "../components/Fields/index.js";
import { BaseField } from "./index.js";

// import ValidationError from "../primitives/ValidationError.js";

export default class TextField extends BaseField {
  constructor(params) {
    super(params);
    this.attr = params.attr ?? {};
  }

  components = TextModule;
}
