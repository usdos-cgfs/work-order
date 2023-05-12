import { currentUser } from "./Authorization.js";
import { getAppContext } from "./ApplicationDbContext.js";

const requestActionTypeFunctionMap = {
  Created: requestCreatedNotification,
  Advanced: requestAdvancedNotification,
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

export function emitRequestNotification(action, request) {
  console.log("Sending Notification: ", action);
  console.log("for request: ", action);
  if (requestActionTypeFunctionMap[action.activity]) {
    requestActionTypeFunctionMap[action.activity](request);
  }
}

function requestCreatedNotification(request) {
  console.log("Sending Request Created Notification for: ", request);
}

function requestAdvancedNotification(request) {
  console.log("Sending Request Advanced Notification for: ", request);
}

function requestClosedNotification(request) {
  console.log("Sending Request Closed Notification for: ", request);
}

async function createNotification(notification, relFolderPath) {
  const context = getAppContext();

  notification.ToString = emailStringMapper(notification.To);
  notification.To = entityPeopleMapper(notification.To);

  notification.CCString = emailStringMapper(notification.CC);
  notification.CC = entityPeopleMapper(notification.CC);

  notification.BCCString = emailStringMapper(notification.BCC);
  notification.BCC = entityPeopleMapper(notification.BCC);

  const notificationId = await context.Notifications.AddEntity(
    notification,
    relFolderPath
  );
}

/**
 * Takes a Person or Request Org array of entities and returns the Group or Person
 * if they don't have a  PreferredEmail attribute
 * @param {Entity[]} entityArr
 * @returns {People[]}
 */
function entityPeopleMapper(entityArr) {
  return entityArr
    ?.filter((entity) => !entity.PreferredEmail)
    ?.map((entity) => entity.UserGroup ?? entity);
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
