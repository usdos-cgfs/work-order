import { Action, actionTypes } from "../entities/Action.js";

export class ActivityLogComponent {
  constructor({ request, actions, context }) {
    this.request = request;
    this._context = context;
    this.request.ObservableID.subscribe(this.requestIdWatcher);
    this.request.ActivityQueue.subscribe(
      this.activityQueueWatcher,
      this,
      "arrayChange"
    );
  }
  Actions = ko.observableArray();

  IsLoading = ko.observable();

  requestIdWatcher = (newId) => {
    this.refreshActions();
  };

  activityQueueWatcher = (changes) => {
    const activities = changes
      .filter((change) => change.status == "added")
      .map((change) => change.value);

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
    Closed: this.requestClosed.bind(this),
  };

  refreshActions = async () => {
    if (!this.request.ID) return;
    this.IsLoading(true);
    const actions = await this._context.Actions.FindByRequestId(
      this.request.ID,
      Action.Views.All
    );
    this.Actions(actions);
    this.IsLoading(false);
  };

  addAction = async (action) => {
    if (!this.request.ID || !action) return;

    const folderPath = this.request.getRelativeFolderPath();
    // const actionObj = Object.assign(new Action(), action);
    const newActionId = await this._context.Actions.AddEntity(
      action,
      folderPath,
      this.request
    );

    this.refreshActions();
  };

  async requestCreated() {
    this.addAction({
      ActionType: actionTypes.Created,
      Description: `The request was submitted with an effective submission date of ${this.request.Dates.Submitted()?.toLocaleDateString()}.`,
    });
  }

  async requestAdvanced(stage) {
    this.addAction({
      ActionType: actionTypes.Advanced,
      Description: `The request was advanced to stage ${stage.Step}: ${stage.Title}.`,
    });
  }

  async requestClosed() {
    this.addAction({
      ActionType: actionTypes.Closed,
      Description: `The request was closed with a status of ${this.request.State.Status()}.`,
    });
  }

  async assignmentCompleted(assignment) {
    let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
    this.addAction({
      ActionType: assignment.Status,
      Description: actionDescription,
    });
  }

  async requestApproved(assignment) {
    let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
    this.addAction({
      ActionType: actionTypes.Approved,
      Description: actionDescription,
    });
  }

  async requestRejected(assignment) {
    let actionDescription =
      `${assignment.ActionTaker.Title} has rejected the request and provided the following reason:<br/>` +
      assignment.Comment;
    this.addAction({
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

    this.addAction({
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

    this.addAction({
      ActionType: actionTypes.Unassigned,
      Description: actionDescription,
    });
  }
}
