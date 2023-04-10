export class Person {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  login = ko.observable();

  static Create = function ({ ID, LookupValue }) {
    return new Person({ ID, Title: LookupValue });
  };
}
