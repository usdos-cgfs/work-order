export default class BaseEntity {
  constructor() {}

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
