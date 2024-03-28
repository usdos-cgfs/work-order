import { Action, actionTypes } from "../entities/Action.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

export class ActivityLogComponent {
  constructor({ addNew, refresh, list, AreLoading }, activityQueue) {
    activityQueue.subscribeAdded(this.activityQueueWatcher);
    this.addNew = addNew;
    this.refresh = refresh;
    this.Actions = list.All;
    this.AreLoading = AreLoading;
  }

  activityQueueWatcher = (activities) => {
    // const activities = changes
    //   .filter((change) => change.status == "added")
    //   .map((change) => change.value);

    activities.map(({ activity, data }) => {
      if (this.actionTypeFunctionMap[activity]) {
        this.actionTypeFunctionMap[activity](data);
      }
    });
  };

  actionTypeFunctionMap = {
    Assigned: this.assignmentAdded.bind(this),
    Unassigned: this.assignmentRemoved.bind(this),
    Created: this.requestCreated.bind(this),
    Advanced: this.requestAdvanced.bind(this),
    Approved: this.requestApproved.bind(this),
    Rejected: this.requestRejected.bind(this),
    Paused: this.requestPaused.bind(this),
    Resumed: this.requestResumed.bind(this),
    Closed: this.requestClosed.bind(this),
  };

  async requestCreated(request) {
    this.addNew({
      ActionType: actionTypes.Created,
      Description: `The request was submitted with an effective submission date of ${request.Dates.Submitted.toLocaleDateString()}.`,
    });
  }

  async requestAdvanced(stage) {
    this.addNew({
      ActionType: actionTypes.Advanced,
      Description: `The request was advanced to stage ${stage.Step}: ${stage.Title}.`,
    });
  }

  requestPaused(reason) {
    this.addNew({
      ActionType: actionTypes.Paused,
      Description: reason,
    });
  }

  requestResumed() {
    this.addNew({
      ActionType: actionTypes.Resumed,
      Description: "Request clock has been resumed",
    });
  }

  async requestClosed(request) {
    this.addNew({
      ActionType: actionTypes.Closed,
      Description: `The request was closed with a status of ${request.State.Status()}.`,
    });
  }

  async assignmentCompleted(assignment) {
    let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
    this.addNew({
      ActionType: assignment.Status,
      Description: actionDescription,
    });
  }

  async requestApproved(assignment) {
    let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
    this.addNew({
      ActionType: actionTypes.Approved,
      Description: actionDescription,
    });
  }

  async requestRejected(assignment) {
    let actionDescription =
      `${assignment.ActionTaker.Title} has rejected the request and provided the following reason:<br/>` +
      assignment.Comment;
    this.addNew({
      ActionType: actionTypes.Rejected,
      Description: actionDescription,
    });
  }

  async assignmentAdded(assignment) {
    let actionDescription = `The following ${assignment.Role.LookupValue}s have been assigned to this request:<br>`;
    if (assignment.Assignee?.Title) {
      actionDescription += `${assignment.Assignee.Title} - `;
    }
    actionDescription += assignment.RequestOrg?.Title;

    this.addNew({
      ActionType: actionTypes.Assigned,
      Description: actionDescription,
    });
  }

  async assignmentRemoved(assignment) {
    let actionDescription = `The following ${
      assignment.Role.LookupValue ?? assignment.Role
    }s have been removed from this request:<br>`;
    if (assignment.Assignee?.Title) {
      actionDescription += `${assignment.Assignee.Title} - `;
    }
    actionDescription += assignment.RequestOrg?.Title;

    this.addNew({
      ActionType: actionTypes.Unassigned,
      Description: actionDescription,
    });
  }
}
