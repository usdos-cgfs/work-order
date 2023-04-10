export class Person {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
  }

  login = ko.observable();

  static Create = function ({ ID, LookupValue }) {
    return new Person({ ID, Title: LookupValue });
  };
}
