import Entity from "./Entity.js";

/**
 * Constrained Entity's are validated based on their declared fields.
 * We are expecting user input, so need to validate that each input field
 * is valid.
 */
export default class ConstrainedEntity extends Entity {
  constructor(params) {
    super(params);
  }

  FormFields = ko.pureComputed(() => {
    return Object.values(this.FieldMap).filter((field) => field.Visible());
  });

  FormFieldKeys = ko.pureComputed(() =>
    Object.keys(this.FieldMap).filter((key) => this.FieldMap[key].Visible())
  );

  validate = () => {
    Object.values(this.FieldMap).map(
      (field) => field.validate && field.validate()
    );
    this.ShowErrors(true);
    return this.Errors();
  };

  ShowErrors = ko.observable(false);
  Errors = ko.pureComputed(() => {
    if (!this.ShowErrors()) return [];

    return Object.values(this.FieldMap)
      .filter((field) => field.Errors && field.Errors())
      .flatMap((field) => field.Errors());
  });
}
