export default class BaseEntity {
  constructor() {}

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

  toJSONBlob = () => {
    const out = {};
    Object.keys(this.FieldMap).map(
      (key) => (out[key] = this.FieldMap[key].toString())
    );
    return out;
  };
}
