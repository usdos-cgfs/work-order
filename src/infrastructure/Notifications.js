const requestActionTypeFunctionMap = {
  Created: requestCreatedNotification,
  Advanced: requestAdvancedNotification,
  Closed: requestClosedNotification,
};

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
