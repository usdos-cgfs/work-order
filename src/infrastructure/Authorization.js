import { People } from "../components/People.js";
import { OrgTypes, requestOrgStore } from "../entities/RequestOrg.js";
import {
  getCurrentUserPropertiesAsync,
  getUserPropsAsync,
  getDefaultGroups,
} from "./SAL.js";

var roles = {
  FullControl: "Full Control",
  Design: "Design",
  Edit: "Edit",
  Contribute: "Contribute",
  Read: "Read",
  LimitedAccess: "Limited Access",
  RestrictedRead: "Restricted Read",
  RestrictedContribute: "Restricted Contribute",
  InitialCreate: "Initial Create",
};

var staticGroups = {
  RestrictedReaders: { Title: "Restricted Readers" },
};

export class User {
  Groups = null;

  constructor({
    ID,
    Title,
    LoginName = null,
    IsGroup = null,
    IsEnsured = false,
    Groups = null,
  }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this.LoginName = LoginName;
    this.IsGroup = IsGroup;
    // Has the user data been fetched? Used for binding handlers.
    this.IsEnsured = IsEnsured;

    this.Groups = Groups;
  }

  RequestOrgs = ko.pureComputed(() =>
    requestOrgStore().filter(
      (reqOrg) =>
        reqOrg.OrgType == OrgTypes.RequestingOffice &&
        this.Groups.map((uGroup) => uGroup.ID).includes(reqOrg.UserGroup.ID)
    )
  );

  static Create = async function () {
    // TODO: Switch to getUserPropertiesAsync since that includes phone # etc
    const userProps = await getUserPropsAsync();
    //const userProps2 = await UserManager.getUserPropertiesAsync();

    return new User(userProps);
  };
}

export class UserManager {
  static getUserPropertiesAsync = getCurrentUserPropertiesAsync;
}

export function getRequestFolderPermissions(request) {
  const defaultGroups = getDefaultGroups();
  const requestor = request.RequestorInfo.Requestor();
  const requestorOffice = request.RequestorInfo.Office(); // this should be set during validation

  const folderPermissions = [
    [defaultGroups.owners, roles.FullControl],
    [staticGroups.RestrictedReaders, roles.RestrictedRead],
  ];

  folderPermissions.push([requestor, roles.RestrictedContribute]);

  if (requestorOffice && !requestorOffice.BreakAccess) {
    folderPermissions.push([
      requestorOffice.UserGroup,
      roles.RestrictedContribute,
    ]);
  }

  // break pipeline stages at front?
  request.PipelineComponent().stages.forEach((stage) => {
    const stageOrg = requestOrgStore().find(
      (org) => org.ID == stage.RequestOrg.ID
    );
    if (stageOrg) {
      folderPermissions.push([stageOrg.UserGroup, roles.RestrictedContribute]);
    }

    if (
      stage.AssignmentFunction &&
      AssignmentFunctions[stage.AssignmentFunction]
    ) {
      const boundAssignmenttFunc =
        AssignmentFunctions[stage.AssignmentFunction].bind(request);
      const people = boundAssignmenttFunc();
      if (people && people.Title) {
        folderPermissions.push([people, roles.RestrictedContribute]);
      }
    }
  });

  return folderPermissions;
}

/**
 * Assignment functions are function that can be called by pipeline stages
 * Each function is bound to the current request (i.e. "this" refers to the RequestDetailView)
 * Functions should return a valuepair of permissions.
 */

export const AssignmentFunctions = {
  TestFunc: function () {
    console.log("Hello", this);
    return;
    return this.Requestor();
  },
};
