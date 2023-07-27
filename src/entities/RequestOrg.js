import { People } from "./People.js";

export const OrgTypes = {
  ActionOffice: "Action Office",
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

  UserGroup;

  FieldMap = {
    UserGroup: {
      get: () => this.UserGroup,
      set: (val) => (this.UserGroup = People.Create(val)),
    },
  };

  static Create = function (props) {
    if (!props?.ID) return null;
    // const newRequestOrg = new RequestOrg({
    //   ID: props.ID,
    //   Title: props.LookupValue,
    // });
    return requestOrgStore().find((entity) => entity.ID == props.ID);
    //return Object.assign(newRequestOrg, requestOrg);
  };

  static FindInStore = function (entity) {
    if (!entity?.ID) return null;
    return requestOrgStore().find((reqOrg) => reqOrg.ID == entity.ID);
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "UserGroup",
      "ContactInfo",
      "OrgType",
      "BreakAccess",
      "PreferredEmail",
    ],
  };

  static ListDef = {
    name: "ConfigRequestOrgs",
    title: "ConfigRequestOrgs",
    fields: RequestOrg.Views.All,
  };
}

export const requestOrgStore = ko.observableArray([]);
