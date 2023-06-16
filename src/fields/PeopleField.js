import { People } from "../entities/People.js";
import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";

const components = {
  view: "people-view",
  edit: "people-edit",
};
export default class PeopleField {
  constructor({ displayName, isRequired = false }) {
    this.displayName = displayName;
    this.isRequired = isRequired;
  }

  Value = ko.observable();

  set = (val) => this.Value(People.Create(val));
  get = () => this.Value();

  components = components;
}

registerFieldComponent("people", components);
