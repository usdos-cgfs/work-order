import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "date-view",
  edit: "date-edit",
};

registerFieldComponent("date", components);

/**
 * This field needs to convert between locale and UTC Dates stored on the server;
 */

// TODO: what other options do we need? e.g. date vs datetime
export default class DateField extends BaseField {
  constructor(params) {
    super(params);
  }

  getString = () => {
    // if this is datetime vs date we expect different things
    return this.toLocaleDateString();
  };

  toSortableDateString = () => this.Value()?.format("yyyy-MM-dd");
  toLocaleDateString = () => this.Value()?.toLocaleDateString();
  toLocaleString = () => this.Value()?.toLocaleString();

  get = ko.pureComputed(() => {
    if (!this.Value() || isNaN(this.Value().valueOf())) {
      return null;
    }

    return this.Value().toISOString();
  });

  set = (newDate) => {
    if (!newDate) return null;
    if (newDate.constructor.getName() != "Date") {
      // console.warn("Attempting to set date", newDate);
      newDate = new Date(newDate);
    }
    if (newDate.getTimezoneOffset()) {
    }
    this.Value(newDate);
  };

  inputBinding = ko.pureComputed({
    read: () => {
      if (!this.Value()) return null;
      const d = this.Value();
      return [
        d.getUTCFullYear().toString().padStart(4, "0"),
        (d.getUTCMonth() + 1).toString().padStart(2, "0"),
        d.getUTCDate().toString().padStart(2, "0"),
      ].join("-");
    },
    write: (val) => {
      if (!val) return;
      //writes in format
      this.Value(new Date(val));
    },
  });

  components = components;
}
