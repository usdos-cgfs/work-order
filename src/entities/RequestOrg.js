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

  static Create = function (props) {
    if (!props?.ID) return null;
    // const newRequestOrg = new RequestOrg({
    //   ID: props.ID,
    //   Title: props.LookupValue,
    // });
    return requestOrgStore().find((entity) => entity.ID == props.ID);
    //return Object.assign(newRequestOrg, requestOrg);
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "UserGroup",
      "ContactInfo",
      "OrgType",
      "GTM",
      "BreakAccess",
    ],
  };

  static ListDef = {
    name: "ConfigRequestOrgs",
    title: "ConfigRequestOrgs",
    fields: RequestOrg.Views.All,
  };
}

export const requestOrgStore = ko.observableArray([]);
