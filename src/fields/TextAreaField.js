import { TextAreaModule } from "../components/Fields/index.js";
import { BaseField } from "./index.js";

export default class TextAreaField extends BaseField {
  constructor(params) {
    super(params);
    this.isRichText = params.isRichText;
    this.attr = params.attr ?? {};
  }

  components = TextAreaModule;
}
