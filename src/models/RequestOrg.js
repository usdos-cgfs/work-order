export class RequestOrg {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static factory = function ({ id, value }) {
    return new RequestOrg({ id, title: value });
  };
}
