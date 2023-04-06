export class Person {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  login = ko.observable();

  static factory = function ({ id, value }) {
    return new Person({ id, title: value });
  };
}
