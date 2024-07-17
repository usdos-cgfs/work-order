import { BaseField } from "./index.js";
import { CheckboxModule } from "../components/Fields/index.js";

export default class CheckboxField extends BaseField {
  constructor(params) {
    super(params);
  }

  components = CheckboxModule;
}
