import { currentUser } from "./Authorization.js";
import { getAppContext } from "./ApplicationDbContext.js";
import { RequestOrg, Notification } from "../entities/index.js";
import { assignmentRoles } from "../entities/Assignment.js";

import { siteTitle } from "../env.js";

const html = String.raw;

const requestActionTypeFunctionMap = {
  Created: requestCreatedNotification,
  Advanced: requestAdvancedNotification,
  Assigned: requestAssignedNotification,
  Closed: requestClosedNotification,
};

export function createRequestDetailNotification({ request }) {
  const notification = new Notification();

  const reqPairs = [
    `Request ID: ${request.Title}`,
    `Submitted On: ${request.Dates.Submitted.toString()}`,
    `Requestor Info:`,
    `Name: ${request.RequestorInfo.Requestor()?.Title}`,
    `Phone: ${request.RequestorInfo.Phone()}`,
    `Email: ${request.RequestorInfo.Email()}`,
    `Office Symbol: ${request.RequestorInfo.OfficeSymbol.toString()}`,
  ];

  const requestHeaderHtml = `<p>${reqPairs.join(`<br>`)}</p>`;

  const requestBodyHtml = request.RequestBodyBlob?.Value()?.toHTML();

  const requestDescHtml = html`
    <p>
      ${ko.unwrap(request.RequestDescription.displayName)}:<br />
      ${request.RequestDescription.Value()}
    </p>
  `;

  notification.Body.Value(
    [requestHeaderHtml, requestBodyHtml, requestDescHtml].join(`<br>`)
  );

  return notification;
}

export async function emitCommentNotification(comment, request) {
  const toArray = [request.RequestorInfo.Requestor(), currentUser()];
  const ccArray = [];
  request.Assignments.list
    .All()
    .filter((asg) => asg.PipelineStage?.ID == request.Pipeline.Stage()?.ID)
    .map((asg) => {
      if (asg.Assignee?.LoginName) toArray.push(asg.Assignee);
      ccArray.push(asg.RequestOrg);
    });

  const notification = {
    To: toArray,
    CC: ccArray,
    Request: request,
    Title: formatNotificationTitle(request, "New Comment"),
    Body: `${
      currentUser().Title
    } has left a new comment on ${request.getAppLinkElement()}:<br/><br/>`,
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
      request.Pipeline.RequestOrgs()?.map((requestOrg) => requestOrg.Title)
    ),
  ];

  let actionOfficeLiString = "";
  actionOffices.forEach((office) => {
    actionOfficeLiString += `<li>${office}</li>`;
  });

  const submitterNotification = {
    To: [request.RequestorInfo.Requestor(), currentUser()],
    Title: formatNotificationTitle(request, `New`),
    Body:
      `<p>Your ${request.RequestType.Title} request has been successfully submitted.</p>` +
      `<p>${request.getAppLinkElement()}</p>` +
      "<p>Estimated days to close this request type: " +
      request.RequestType.DaysToCloseBusiness +
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
    To: request.Pipeline.RequestOrgs()?.map((requestOrg) =>
      RequestOrg.FindInStore(requestOrg)
    ),
    Title: formatNotificationTitle(request, `New`),
    Body:
      "<p>Greetings Colleagues,<br><br> A new service request has been opened requiring your attention:<br>" +
      request.getAppLinkElement() +
      "</p>" +
      "<p>Estimated days to close this request type: " +
      request.RequestType.DaysToCloseBusiness +
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
       request:<br>` +
      request.getAppLinkElement() +
      "</p>" +
      roleBasedMessage +
      "<p>To view the request, please click the link above,\
       or copy and paste the below URL into your browser: <br> " +
      request.getAppLink() +
      "</p>",
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
  return `${siteTitle} -${content}- ${request.RequestType.Title} - ${request.Title}`;
}
