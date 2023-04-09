export class RequestOrg {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static Create = function ({ id, value }) {
    return new RequestOrg({ id, title: value });
  };

  static Fields = [
    "ID",
    "Title",
    "UserGroup",
    "ContactInfo",
    "OrgType",
    "BreakAccess",
  ];
}

export const requestOrgStore = ko.observableArray([]);
