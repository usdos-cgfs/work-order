import {
  currentUser,
  ensurePerson,
  getUsersByGroupName,
} from "./Authorization.js";
import { getAppContext } from "./ApplicationDbContext.js";
import {
  RequestOrg,
  Notification,
  People,
  assignmentRoles,
} from "../entities/index.js";
import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";

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
    `${request.RequestorInfo.Requestor()?.Title}`,
    `${request.RequestorInfo.Phone()}`,
    `${request.RequestorInfo.Email()}`,
    `${request.RequestorInfo.OfficeSymbol.toString()}`,
  ];

  const requestHeaderHtml = `<p>${reqPairs.join(`<br>`)}</p>`;

  const requestBodyHtml = request.RequestBodyBlob?.Value()?.toHTML();

  const requestDescHtml = html`
    <p>
      ${ko.unwrap(request.RequestDescription.displayName)}:<br />
      ${request.RequestDescription.Value()}
    </p>
  `;

  // Temp for testing

  // notification.ToString.Value("backlkupf@test");
  const user = currentUser();
  if (user?.Email) notification.CCString.Value(user.Email + ";");

  // notification.Title.Value("A test notifciation");

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

  const notification = Notification.Create({
    To: await arrEntityToEmailString(toArray),
    CC: await arrEntityToEmailString(ccArray),
    Request: request,
    Title: formatNotificationTitle(request, "New Comment"),
    Body: `${
      currentUser().Title
    } has left a new comment on ${request.getAppLinkElement()}:<br/><br/>`,
  });

  await submitNotification(notification, request.getRelativeFolderPath());
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

  const context = getAppContext();

  const actionOffices = [
    ...new Set(
      request.Pipeline.RequestOrgs()?.map((requestOrg) => requestOrg.Title)
    ),
  ];

  let actionOfficeLiString = "";
  actionOffices.forEach((office) => {
    actionOfficeLiString += `<li>${office}</li>`;
  });

  const submitterEmails = [request.RequestorInfo.Requestor(), currentUser()];
  const submitterTo = await arrEntityToEmailString(submitterEmails);

  const submitterNotification = Notification.Create({
    To: submitterTo,
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
  });

  await submitNotification(
    submitterNotification,
    request.getRelativeFolderPath()
  );

  // Notification Sent to Action Offices to let them know an item's been submitted
  const pipelineOrgs = request.Pipeline.RequestOrgs()?.map((requestOrg) =>
    RequestOrg.FindInStore(requestOrg)
  );

  const to = await arrEntityToEmailString(pipelineOrgs);

  const requestOrgNotification = Notification.Create({
    To: to,
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
  });

  await submitNotification(
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
    console.log("Sending Request Assigned Notification for: ", request, action);

  if (!action.data) {
    console.warn("Assignment created with no Payload", request, action);
    return;
  }

  const stage = action.data.PipelineStage;
  const role = action.data.Role?.LookupValue;
  const assignee = new People(action.data.Assignee);
  const assignedReqOrg = RequestOrg.FindInStore(action.data.RequestOrg);

  let roleBasedMessage = "";
  switch (role) {
    case assignmentRoles.Subscriber:
    case assignmentRoles.Viewer:
      roleBasedMessage =
        "<p>This notification was generated for information purposes only. You have no pending actions on this request.</p>";
      break;
    default:
  }

  const assignedNotification = Notification.Create({
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
      "</p>" +
      "<strong>Note:</strong> if you are a <strong>Subscriber</strong> or\
       <strong>Viewer</strong> you have no action to take.",
    Request: request,
  });

  // Only send to assignee if they are different than the Request Org
  if (assignee?.ID != assignedReqOrg?.UserGroup.ID) {
    const to = await peopleToEmailString(assignee);
    assignedNotification.ToString.Value(to);
    if (stage.NotifyOrg) {
      const cc = await reqOrgToEmailString(assignedReqOrg);
      assignedNotification.CCString.Value(cc);
    }
  } else {
    const to = await reqOrgToEmailString(assignedReqOrg);
    assignedNotification.ToString.Value(to);
  }

  const context = getAppContext();

  await context.Notifications.AddEntity(
    assignedNotification,
    request.getRelativeFolderPath()
  );
}

async function requestClosedNotification(request, action) {
  // TODO: Medium - CC the action offices
  if (window.DEBUG)
    console.log("Sending Request Closed Notification for: ", request);

  const to = await arrEntityToEmailString([request.RequestorInfo.Requestor()]);

  const closedNotification = Notification.Create({
    To: to,
    Title: formatNotificationTitle(request, "Closed " + request.State.Status()),
    Body:
      `<p>Greetings Colleagues,<br><br>The following request has been ${request.State.Status()}:<br>` +
      request.getAppLinkElement() +
      "</p>" +
      "<p>This request cannot be re-opened.</p>",
    Request: request,
  });
  await submitNotification(closedNotification, request.getRelativeFolderPath());
}

export async function submitNotification(
  notification,
  relFolderPath,
  attachments = null
) {
  const context = getAppContext();

  const newNotificationTask = addTask(taskDefs.newNotification);
  await context.Notifications.AddEntity(notification, relFolderPath);

  // await context.Notifications.LoadEntity(notification);

  if (attachments) {
    await Promise.all(
      attachments.map(async (attachment) => {
        const copyAttachmentTask = addTask(
          taskDefs.copyAttachment(attachment.FileLeafRef)
        );
        await context.Notifications.CopyAttachmentFromPath(
          attachment.FileRef,
          notification
        );
        finishTask(copyAttachmentTask);
      })
    );
  }
  finishTask(newNotificationTask);

  return true;
}

async function arrEntityToEmailString(arr) {
  // Take an array or request orgs and people, and return to an email string;
  const emailStrings = await Promise.all(
    arr.map(async (entity) => {
      if (entity.OrgType) return reqOrgToEmailString(entity);
      return peopleToEmailString(entity);
    })
  );

  return emailStrings.filter((val) => val).join("; ");
}

async function reqOrgToEmailString(entity) {
  // entity is request org and has preferred email
  if (entity.PreferredEmail) return entity.PreferredEmail;

  // entity is request org and has Usergroup
  if (entity.UserGroup) {
    const group = entity.FieldMap.UserGroup.get();
    return getUserEmailsByGroupTitle(group.Title);
  }
}

async function peopleToEmailString(person) {
  if (!person.IsEnsured) {
    person = await ensurePerson(person);
    if (!person) return;
  }

  if (person.IsGroup) return getUserEmailsByGroupTitle(person.Title);

  return person.Email;
}

async function getUserEmailsByGroupTitle(title) {
  const users = await getUsersByGroupName(title);
  return users
    .filter((u) => u.Email)
    .map((u) => u.Email)
    .join(";");
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
