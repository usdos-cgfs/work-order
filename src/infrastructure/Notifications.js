import { currentUser } from "./Authorization.js";
import { getAppContext } from "./ApplicationDbContext.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { assignmentRoles } from "../entities/Assignment.js";

const requestActionTypeFunctionMap = {
  Created: requestCreatedNotification,
  Advanced: requestAdvancedNotification,
  Assigned: requestAssignedNotification,
  Closed: requestClosedNotification,
};

export async function emitCommentNotification(comment, request) {
  const notification = {
    To: [request.RequestorInfo.Requestor(), currentUser()],
    CC: request.Assignments.list.All().map((asg) => asg.RequestOrg),
    Request: request,
    Title: `Work Order -New Comment- ${request.Title} - ${request.ID}`,
    Body:
      `${
        currentUser().Title
      } has left a new comment on ${request.getAppLinkElement()}:<br/><br/>` +
      comment.Comment,
  };

  await createNotification(notification, request.getRelativeFolderPath());
}

export function emitRequestNotification(request, action) {
  // Entry point for request based notifications
  if (window.DEBUG) {
    console.log("Sending Notification: ", action);
    console.log("for request: ", request);
  }
  if (requestActionTypeFunctionMap[action.activity]) {
    requestActionTypeFunctionMap[action.activity](request, action);
  }
}

async function requestCreatedNotification(request) {
  // Notification sent to the user/requestor
  if (window.DEBUG)
    console.log("Sending Request Created Notification for: ", request);

  const actionOffices = [
    ...new Set(
      request.Pipeline.Stages()?.map((stage) => stage.RequestOrg.Title)
    ),
  ];

  let actionOfficeLiString = "";
  actionOffices.forEach((office) => {
    actionOfficeLiString += `<li>${office}</li>`;
  });

  const submitterNotification = {
    To: [request.RequestorInfo.Requestor(), currentUser()],
    Title: `Work Order -New- ${request.ServiceType.Def()?.Title} - ${
      request.Title
    }`,
    Body:
      `<p>Your ${
        request.ServiceType.Def()?.Title
      } request has been successfully submitted.</p>` +
      `<p>${request.getAppLinkElement()}</p>` +
      "<p>Estimated days to close this request type: " +
      request.ServiceType.Def()?.DaysToCloseBusiness +
      "</p>" +
      "<p>This request will be serviced by:</br><ul>" +
      actionOfficeLiString +
      "</ul></p>" +
      "<p>To view the request, please click the link above, or copy and paste the below URL into your browser:</br>" +
      request.getAppLink(),
    Request: request,
  };

  await createNotification(
    submitterNotification,
    request.getRelativeFolderPath()
  );

  // Notification Sent to Action Offices to let them know an item's been submitted
  const requestOrgNotification = {
    To: request.Pipeline.Stages()?.map((stage) =>
      RequestOrg.FindInStore(stage.RequestOrg)
    ),
    Title: `Work Order -New- ${request.ServiceType.Def()?.Title} - ${
      request.Title
    }`,
    Body:
      "<p>Greetings Colleagues,<br><br> A new service request has been opened requiring your attention:<br>" +
      request.getAppLinkElement() +
      "</p>" +
      "<p>Estimated days to close this request type: " +
      request.ServiceType.Def()?.DaysToCloseBusiness +
      "</p>" +
      "<p>This request will be serviced by:</br><ul>" +
      actionOfficeLiString +
      "</ul></p>" +
      "<p>To view the request, please click the link above, or copy and paste the below URL into your browser:</br>" +
      request.getAppLink(),
    Request: request,
  };

  await createNotification(
    requestOrgNotification,
    request.getRelativeFolderPath()
  );
}

function requestAdvancedNotification(request) {
  if (window.DEBUG)
    console.log("Sending Request Advanced Notification for: ", request);
}

async function requestAssignedNotification(request, action) {
  if (window.DEBUG)
    console.log("Sending Request Assigned Notification for: ", request);
  if (window.DEBUG) console.log(action);
  const role = action.data?.Role?.LookupValue;
  let roleBasedMessage = "";
  switch (role) {
    case assignmentRoles.Subscriber:
    case assignmentRoles.Viewer:
      roleBasedMessage =
        "<p>This notification was generated for information purposes only. You have no pending actions on this request.</p>";
      break;
    default:
  }

  const assignedNotification = {
    Title: formatNotificationTitle(request, "Assigned"),
    Body:
      `<p>Greetings Colleagues,<br><br>You have been assigned the role of\
       <strong>${role}</strong> on the following\
       workorder request:<br>` +
      request.getAppLinkElement() +
      "</p>" +
      roleBasedMessage +
      "<p>To view the request, please click the link above,\
       or copy and paste the below URL into your browser: <br> " +
      request.getAppLink() +
      "</p>" +
      "<strong>Note:</strong> if you are a <strong>Subscriber</strong> or\
       <strong>Viewer</strong> you have no action to take.",
    Request: request,
  };

  // Only send to assignee if they are different than the Request Org
  const assignee = action.data?.Assignee;
  const assignedReqOrg = RequestOrg.FindInStore(action.data?.RequestOrg);
  if (assignee?.ID != assignedReqOrg?.UserGroup.ID) {
    assignedNotification.To = [assignee];
    assignedNotification.CC = [assignedReqOrg];
  } else {
    assignedNotification.To = [assignedReqOrg];
  }

  await createNotification(
    assignedNotification,
    request.getRelativeFolderPath()
  );
}

async function requestClosedNotification(request, action) {
  // TODO: Medium - CC the action offices
  if (window.DEBUG)
    console.log("Sending Request Closed Notification for: ", request);
  const closedNotification = {
    To: [request.RequestorInfo.Requestor()],
    Title: formatNotificationTitle(request, "Closed " + request.State.Status()),
    Body:
      `<p>Greetings Colleagues,<br><br>The following request has been ${request.State.Status()}:<br>` +
      request.getAppLinkElement() +
      "</p>" +
      "<p>This request cannot be re-opened.</p>",
    Request: request,
  };
  await createNotification(closedNotification, request.getRelativeFolderPath());
}

async function createNotification(notification, relFolderPath) {
  const context = getAppContext();

  notification.ToString = emailStringMapper(notification.To);
  notification.To = entityPeopleMapper(notification.To);

  notification.CCString = emailStringMapper(notification.CC);
  notification.CC = entityPeopleMapper(notification.CC);

  notification.BCCString = emailStringMapper(notification.BCC);
  notification.BCC = entityPeopleMapper(notification.BCC);

  await context.Notifications.AddEntity(notification, relFolderPath);
}

/**
 * Takes a Person, Group, or Request Org array of entities and returns the Group
 * if they don't have a  PreferredEmail attribute
 * @param {Entity[]} entityArr
 * @returns {People[]}
 */
function entityPeopleMapper(entityArr) {
  return entityArr
    ?.filter((entity) => !entity.PreferredEmail)
    ?.map((entity) => {
      if (entity.UserGroup) return entity.UserGroup;

      if (entity.OrgType) {
        console.warn("Trying to email RequestOrg!");
        return;
      }

      return entity;
    });
}

/**
 * Take a Person or Request Org array and returns an appropriately delimited string
 * @param {Entity[]} entityArr
 * @returns {string}
 */
function emailStringMapper(entityArr) {
  //
  return entityArr
    ?.filter((entity) => entity.PreferredEmail)
    ?.map((entity) => entity.PreferredEmail)
    .join(";");
}

function formatNotificationTitle(request, content) {
  return `Work Order -${content}- ${request.ServiceType.Def()?.Title} - ${
    request.Title
  }`;
}
