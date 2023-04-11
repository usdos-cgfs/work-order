export const OrgTypes = {
  ActionOffice: "Action Offices",
  RequestingOffice: "Requesting Office",
  Department: "Department",
  Budget: "Budget PMO",
};

export class RequestOrg {
  constructor({ ID: ID, Title: Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    const newRequestOrg = new RequestOrg({ ID, Title: LookupValue });
    const requestOrg = requestOrgStore().find((entity) => entity.ID == ID);
    return Object.assign(newRequestOrg, requestOrg);
  };

  static Fields = [
    "ID",
    "Title",
    "UserGroup",
    "ContactInfo",
    "OrgType",
    "GTM",
    "BreakAccess",
  ];
}

export const requestOrgStore = ko.observableArray([]);
