import { People } from "../entities/People.js";
import { Assignment, assignmentStates } from "../entities/Assignment.js";
import {
  RequestOrg,
  OrgTypes,
  requestOrgStore,
} from "../entities/RequestOrg.js";

import { getUserPropsAsync, getDefaultGroups } from "./SAL.js";

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
  RestrictedReaders: new People({ ID: null, Title: "Restricted Readers" }),
};

export const systemRoles = {
  Admin: "Admin",
  ActionOffice: "ActionOffice",
};

export const roles = {
  ActionResolver: {
    LookupValue: "Action Resolver",
    description: "Completes an action before moving request forward",
    isAssignable: true,
    permissions: permissions.RestrictedContribute,
    initialStatus: assignmentStates.InProgress,
  },
  Assigner: {
    LookupValue: "Assigner",
    description: "Assigns the next stage in the pipeline.",
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
  "Pending Assignment": roles.Assigner,
  "Pending Approval": roles.Approver,
  "Pending Action": roles.ActionResolver,
  "Pending Resolution": roles.ActionResolver,
  Notification: roles.Subscriber,
};

// Holds a User object
export const currentUser = ko.observable();

export class User extends People {
  Groups = [];

  constructor({
    ID,
    Title,
    LoginName = null,
    LookupValue = null,
    WorkPhone = null,
    EMail = null,
    IsGroup = null,
    IsEnsured = false,
    Groups = null,
  }) {
    super({ ID, Title, LookupValue, LoginName, IsGroup, IsEnsured });

    this.WorkPhone = WorkPhone;
    this.EMail = EMail;

    this.Groups = Groups;
  }

  Groups = [];

  isInGroup(group) {
    if (!group?.ID) return false;
    return this.getGroupIds().includes(group.ID);
  }

  getGroupIds() {
    return this.Groups.map((group) => group.ID);
  }

  isInRequestOrg = (reqOrg) => {
    return this.RequestOrgs().find((userReqOrg) => userReqOrg.ID == reqOrg.ID);
  };

  RequestOrgs = ko.pureComputed(() => {
    const groupIds = this.getGroupIds();
    return requestOrgStore().filter((reqOrg) =>
      groupIds.includes(reqOrg.UserGroup?.ID)
    );
  });

  RequestingOffices = ko.pureComputed(() => {
    return this.RequestOrgs().filter(
      (reqOrg) => reqOrg.OrgType == OrgTypes.RequestingOffice
    );
  });

  ActionOffices = ko.pureComputed(() => {
    return this.RequestOrgs().filter(
      (reqOrg) => reqOrg.OrgType == OrgTypes.ActionOffice
    );
  });

  IsActionOffice = ko.pureComputed(() => this.ActionOffices().length);
  IsSiteOwner = ko.pureComputed(() =>
    this.isInGroup(getDefaultGroups().owners)
  );

  static Create = async function () {
    // TODO: Major - Switch to getUserPropertiesAsync since that includes phone # etc
    const userProps = await getUserPropsAsync();
    //const userProps2 = await UserManager.getUserPropertiesAsync();

    return new User(userProps);
  };
}

export function userHasSystemRole(user, systemRole) {
  const userIsOwner = user.IsSiteOwner();
  switch (systemRole) {
    case systemRoles.Admin:
      return userIsOwner;
      break;
    case systemRoles.ActionOffice:
      return userIsOwner || user.ActionOffices().length;
    default:
  }
}

export function getRequestFolderPermissions(request) {
  const defaultGroups = getDefaultGroups();
  const requestor = request.RequestorInfo.Requestor();
  const requestorOffice = request.RequestorInfo.Office(); // this should be set during validation

  const folderPermissions = [
    [new People(defaultGroups.owners), permissions.FullControl],
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
    const stageOrg = RequestOrg.FindInStore(stage.RequestOrg);
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
      try {
        const assignments = AssignmentFunctions[stage.AssignmentFunction](
          request,
          stage
        );
        assignments.forEach((assignment) => {
          const people = assignment.Assignee;
          if (people && people.Title) {
            folderPermissions.push([people, permissions.RestrictedContribute]);
          }
        });
      } catch (e) {
        console.warn("Error creating stage assignments", stage);
      }
    }
  });

  return folderPermissions;
}

/**
 * Assignment functions are function that can be called by pipeline stages
 * Each function is bound to the current request (i.e. "this" refers to the Active Request)
 * Functions should return a user/group entity.
 */

export const AssignmentFunctions = {
  TestFunc: function () {
    return request.RequestorInfo.Requestor();
  },
  ch_overtimeGovManager: function (request, stage) {
    const assignee = request.ServiceType.Entity()?.GovManager.get();
    if (!assignee) {
      throw new Error("Could not find stage Assignee");
    }

    const newCustomAssignment = new Assignment({
      Assignee: assignee,
      RequestOrg: stage.RequestOrg,
      PipelineStage: stage,
      IsActive: true,
      Role: roles.ActionResolver,
      CustomComponent: "GovManagerActions",
    });

    // const newApprovalAssignment = new Assignment({
    //   Assignee: assignee,
    //   RequestOrg: stage.RequestOrg,
    //   PipelineStage: stage,
    //   IsActive: true,
    //   Role: roles.Approver,
    // });
    return [newCustomAssignment];
  },
  ch_overtimeAPM: function (request, stage) {
    const assignee = request.ServiceType.Entity()?.APM.get();
    if (!assignee) {
      throw new Error("Could not find stage Assignee");
    }

    const newCustomAssignment = new Assignment({
      Assignee: assignee,
      RequestOrg: stage.RequestOrg,
      PipelineStage: stage,
      IsActive: true,
      Role: roles.ActionResolver,
      CustomComponent: "APMActions",
    });

    // const newApprovalAssignment = new Assignment({
    //   Assignee: assignee,
    //   RequestOrg: stage.RequestOrg,
    //   PipelineStage: stage,
    //   IsActive: true,
    //   Role: roles.Approver,
    // });

    return [newCustomAssignment];
  },
  getGTM: function (request, stage) {
    const assignee = request.ServiceType.Entity()?.GTM.get();
    if (!assignee) {
      throw new Error("Could not find stage Assignee");
    }
    return [
      new Assignment({
        Assignee: assignee,
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: roles.Approver,
      }),
    ];
  },
  getCOR: function (request, stage) {
    const assignee = request.ServiceType.Entity()?.COR.get();
    if (!assignee) {
      throw new Error("Could not find stage Assignee");
    }
    return [
      new Assignment({
        Assignee: assignee,
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: roles.Approver,
      }),
    ];
  },
};
