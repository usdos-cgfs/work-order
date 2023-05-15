import { People } from "../components/People.js";
import { assignmentStates } from "../entities/Assignment.js";
import { OrgTypes, requestOrgStore } from "../entities/RequestOrg.js";

import {
  getCurrentUserPropertiesAsync,
  getUserPropsAsync,
  getDefaultGroups,
} from "./SAL.js";

export const permissions = {
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

export const roles = {
  ActionResolver: {
    LookupValue: "Action Resolver",
    description: "Completes an action before moving request forward",
    isAssignable: true,
    permissions: permissions.RestrictedContribute,
    initialStatus: assignmentStates.InProgress,
  },
  Approver: {
    LookupValue: "Approver",
    description: "Approves or Rejects the request.",
    isAssignable: true,
    permissions: permissions.RestrictedContribute,
    initialStatus: assignmentStates.InProgress,
  },
  Viewer: {
    LookupValue: "Viewer",
    description: "Has view only access to the request.",
    isAssignable: true,
    permissions: permissions.RestrictedRead,
  },
  Subscriber: {
    LookupValue: "Subscriber",
    description:
      "Has view only access to the request and recieves notifications",
    isAssignable: true,
    permissions: permissions.RestrictedRead,
  },
};

export const stageActionRoleMap = {
  "Pending Assignment": roles.ActionResolver,
  "Pending Approval": roles.Approver,
  "Pending Action": roles.ActionResolver,
  "Pending Resolution": roles.ActionResolver,
  Notification: roles.Subscriber,
};

// Holds a User object
export const currentUser = ko.observable();

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

  RequestingOffices = ko.pureComputed(() => {
    const groupIds = this.Groups.map((uGroup) => uGroup.ID);
    return requestOrgStore().filter(
      (reqOrg) =>
        reqOrg.OrgType == OrgTypes.RequestingOffice &&
        groupIds.includes(reqOrg.UserGroup?.ID)
    );
  });

  ActionOffices = ko.pureComputed(() => {
    const groupIds = this.Groups.map((uGroup) => uGroup.ID);
    return requestOrgStore().filter(
      (reqOrg) =>
        reqOrg.OrgType == OrgTypes.ActionOffice &&
        groupIds.includes(reqOrg.UserGroup?.ID)
    );
  });

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
    [defaultGroups.owners, permissions.FullControl],
    [staticGroups.RestrictedReaders, permissions.RestrictedRead],
  ];

  folderPermissions.push([requestor, permissions.RestrictedContribute]);

  if (requestorOffice && !requestorOffice.BreakAccess) {
    folderPermissions.push([
      requestorOffice.UserGroup,
      permissions.RestrictedContribute,
    ]);
  }

  // break pipeline stages at front?
  request.Pipeline.Stages()?.forEach((stage) => {
    const stageOrg = requestOrgStore().find(
      (org) => org.ID == stage.RequestOrg.ID
    );
    if (stageOrg) {
      folderPermissions.push([
        stageOrg.UserGroup,
        permissions.RestrictedContribute,
      ]);
    }

    if (
      stage.AssignmentFunction &&
      AssignmentFunctions[stage.AssignmentFunction]
    ) {
      const boundAssignmenttFunc =
        AssignmentFunctions[stage.AssignmentFunction].bind(request);
      const people = boundAssignmenttFunc();
      if (people && people.Title) {
        folderPermissions.push([people, permissions.RestrictedContribute]);
      }
    }
  });

  return folderPermissions;
}

/**
 * Assignment functions are function that can be called by pipeline stages
 * Each function is bound to the current request (i.e. "this" refers to the RequestDetailView)
 * Functions should return a user/group entity.
 */

export const AssignmentFunctions = {
  TestFunc: function () {
    console.log("Hello", this);
    return this.RequestorInfo.Requestor();
  },
  getGovManager: function () {
    return this.ServiceType.Entity()?.GovManager();
  },
  getAPM: function () {
    return this.ServiceType.Entity()?.APM();
  },
  getGTM: function () {
    return this.ServiceType.Entity()?.GTM();
  },
};
