import { Action, actionTypes } from "../entities/Action.js";

export class ActivityLogComponent {
  constructor({ request, actions, context }) {
    this.request = request;
    this._context = context;
    this.request.ObservableID.subscribe(this.requestIdWatcher);
  }
  Actions = ko.observableArray();

  IsLoading = ko.observable();

  requestIdWatcher = (newId) => {
    this.refreshActions();
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

  requestCreated = async () => {
    this.addAction({
      ActionType: actionTypes.Created,
      Description: `The request was submitted with an effective submission date of ${this.request.Dates.Submitted()?.toLocaleDateString()}.`,
    });
  };

  requestAdvanced = async (stage) => {
    this.addAction({
      ActionType: actionTypes.Advanced,
      Description: `The request was advanced to stage ${stage.Step}: ${stage.Title}.`,
    });
  };

  requestClosed = async () => {
    this.addAction({
      ActionType: actionTypes.Closed,
      Description: `The request was closed with a status of ${this.request.State.Status()}.`,
    });
  };

  assignmentAdded = async (assignment) => {
    let actionDescription = `The following ${assignment.Role.LookupValue}s have been assigned to this request:<br>`;
    if (assignment.Assignee?.Title) {
      actionDescription += `${assignment.Assignee.Title} - `;
    }
    actionDescription += assignment.RequestOrg?.Title;

    this.addAction({
      ActionType: actionTypes.Assignment,
      Description: actionDescription,
    });
  };

  assignmentRemoved = async (assignment) => {
    let actionDescription = `The following ${assignment.Role.LookupValue}s have been removed from this request:<br>`;
    if (assignment.Assignee?.Title) {
      actionDescription += `${assignment.Assignee.Title} - `;
    }
    actionDescription += assignment.RequestOrg?.Title;

    this.addAction({
      ActionType: actionTypes.Assignment,
      Description: actionDescription,
    });
  };
}
