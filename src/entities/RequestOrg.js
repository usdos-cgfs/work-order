export class RequestOrg {
  constructor({ ID: ID, Title: Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    return new RequestOrg({ ID, Title: LookupValue });
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
