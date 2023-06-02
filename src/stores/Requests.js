import { requestStates } from "../entities/Request.js";

import { RequestsByStatusSet } from "../infrastructure/RequestsByStatusSet.js";

export const requestsByStatusMap = new Map();

requestsByStatusMap.set(
  requestStates.open,
  new RequestsByStatusSet(requestStates.open)
);
requestsByStatusMap.set(
  requestStates.closed,
  new RequestsByStatusSet(requestStates.closed)
);
requestsByStatusMap.set(
  requestStates.cancelled,
  new RequestsByStatusSet(requestStates.cancelled)
);
requestsByStatusMap.set(
  requestStates.rejected,
  new RequestsByStatusSet(requestStates.rejected)
);

//     'Closed': new RequestsByStatusSet(requestStates.closed),

// export const allOpenRequests = new RequestsByStatusSet(requestStates.open)
// allOpenRequests.init()

// export const allClosedRequests = new RequestsByStatusSet(requestStates.closed)
// export const allCancelledRequests = new RequestsByStatusSet(requestStates.cancelled)
// export const allRejectedRequests = new RequestsByStatusSet(requestStates.cancelled)
