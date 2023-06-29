import { People } from "../entities/People.js";
import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "people-view",
  edit: "people-edit",
};

registerFieldComponent("people", components);

export default class PeopleField extends BaseField {
  constructor(params) {
    super(params);
  }

  set = (val) => this.Value(People.Create(val));

  components = components;
}
