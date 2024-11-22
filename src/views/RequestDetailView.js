import { requestInternalStates, requestStates } from "../constants/index.js";
import { actionTypes } from "../entities/Action.js";

import { People } from "../entities/People.js";

import { createNewRequestTitle } from "../common/EntityUtilities.js";
import {
  businessDaysFromDate,
  calculateEffectiveTimeToClose,
} from "../common/DateUtilities.js";
import * as Router from "../common/Router.js";

import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";

import { currentUser } from "../infrastructure/Authorization.js";

import { getAppContext } from "../infrastructure/ApplicationDbContext.js";
import TextAreaField from "../fields/TextAreaField.js";

import { requestsByStatusMap } from "../stores/Requests.js";

import { stageActionTypes } from "../entities/PipelineStage.js";

const DEBUG = true;

export const DisplayModes = {
  New: "New",
  Edit: "Edit",
  View: "View",
};

const reqHeaderComponentsMap = {
  New: "request-header-edit",
  View: "request-header-view",
  Edit: "request-header-edit",
};

const reqBodyComponentsMap = {
  New: "request-body-edit",
  View: "request-body-view",
  Edit: "request-body-edit",
};

export class RequestDetailView {
  /************************************************************************
      RequestDetail Component Specific Items
  ************************************************************************/

  refreshAll = async () => {
    await this.request.refreshAll();
  };

  Request = ko.observable();
  get request() {
    return this.Request();
  }

  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  HeaderComponentName = ko.pureComputed(() => {
    return reqHeaderComponentsMap[this.DisplayMode()];
  });

  BodyComponentName = ko.pureComputed(() => {
    return reqBodyComponentsMap[this.DisplayMode()];
  });

  ShowActionsArea = ko.pureComputed(
    () =>
      this.request.State.IsActive() &&
      !this.request.IsLoading() &&
      !this.request.Assignments.AreLoading() &&
      this.request.Assignments.CurrentStage.list.UserActionAssignments().length
  );

  ShowCloseArea = ko.pureComputed(() => {
    return (
      !this.request.IsLoading() &&
      !this.request.Assignments.AreLoading() &&
      this.request.Authorization.currentUserCanClose()
    );
  });

  ShowFulfillArea = ko.pureComputed(() => {
    return (
      !this.request.IsLoading() &&
      !this.request.Assignments.AreLoading() &&
      this.request.Authorization.currentUserCanClose()
    );
  });

  EnableChangeStatusArea = ko.pureComputed(() => {
    return this.request.Authorization.currentUserCanAdvance();
  });

  newComment = {
    input: new TextAreaField({
      displayName: "Please provide additional comments/instructions here",
      instructions: null,
      isRichText: true,
    }),
    submit: async () => {
      const comment = {
        Comment: this.newComment.input.Value(),
      };
      await this.request.Comments.addNew(comment);
      this.newComment.input.Value("");
    },
  };

  calculateEffectiveOpenTime = () => {
    const timeToClose = calculateEffectiveTimeToClose(this.request);
    console.log(timeToClose);
  };

  submitNewRequest = async () => {
    // 1. Validate Request
    if (!this.request.Validation.validate()) return;

    const serviceType = this.request.RequestType;
    if (!serviceType) {
      // We should have caught this in validation.
      throw "no service type provided";
    }
    const saveTask = addTask(taskDefs.save);
    this.DisplayMode(DisplayModes.View);
    this.request.DisplayMode(DisplayModes.View);

    // 2. Create Folder Structure
    this.request.State.Status(requestStates.open);
    const folderPath = this.request.getRelativeFolderPath();

    createFolders: {
      const breakingPermissionsTask = addTask(taskDefs.permissions);
      const folderPerms = this.request.getFolderPermissions();

      const listRefs = this.request.getInitialListRefs();
      // See if we have any staged attachments
      const hasStagedAttachments = this.request.Attachments.list.All().length;
      if (hasStagedAttachments) listRefs.push(this._context.Attachments);

      await Promise.all(
        listRefs.map(async (listRef) => {
          // Create folder
          const folderId = await listRef.UpsertFolderPath(folderPath);
          if (!folderId) {
            alert(`Could not create ${listRef.Title} folder ` + folderPath);
            return;
          }
          // Apply folder permissions
          const result = await listRef.SetFolderPermissions(
            folderPath,
            folderPerms
          );
        })
      );
      finishTask(breakingPermissionsTask);

      if (hasStagedAttachments) {
        const stagingFolderPath = this.request.getRelativeFolderPathStaging();
        await this._context.Attachments.CopyFolderContents(
          stagingFolderPath,
          folderPath
        );
        // Delete
        await this._context.Attachments.DeleteFolderByPath(stagingFolderPath);
      }
    }

    // 3. Initialize request header
    // Initialize dates
    const effectiveSubmissionDate =
      this.request.calculateEffectiveSubmissionDate();
    this.request.Dates.Submitted.set(effectiveSubmissionDate);
    this.request.Dates.EstClosed.set(
      businessDaysFromDate(
        effectiveSubmissionDate,
        serviceType.DaysToCloseBusiness
      )
    );
    this.request.RequestOrgs(
      this.request.Pipeline.Stages()
        .filter((stage) => null != stage.RequestOrg)
        .map((stage) => stage.RequestOrg)
    );

    this.request.State.InternalStatus(requestInternalStates.inProgress);
    this.request.State.IsActive(true);

    createItems: {
      await this._context.Requests.AddEntity(this.request, folderPath);
    }

    Router.setUrlParam("reqId", this.request.Title);

    // Send New WorkOrder Notification to User
    // Create new Action Log Item
    // Initial Assignments
    this.request.ActivityQueue.push({
      activity: actionTypes.Created,
      data: this.request,
    });

    // Progress Request
    this.request.Pipeline.advance();

    this.request.Validation.reset();

    this.request.LoadedAt(new Date());

    // push the newrequest to the open requests store
    const openrequests = requestsByStatusMap.get(requestStates.open);
    openrequests.List.push(this.request);

    finishTask(saveTask);
  };

  editRequestHandler = async () => {
    this.DisplayMode(DisplayModes.Edit);
  };

  updateRequestHandler = async () => {
    this.DisplayMode(DisplayModes.View);
  };

  cancelChangesHandler = async () => {
    //Refresh
    this.refreshAll();
    this.DisplayMode(DisplayModes.View);
  };

  promptClose = () => {
    if (confirm("Close and finalize request? This action cannot be undone!")) {
      this.request.closeAndFinalize(requestStates.fulfilled);
    }
  };

  promptFulfill = () => {
    if (
      this.request.Pipeline.Stage().ActionType == stageActionTypes.Closed &&
      confirm("Close and finalize request? This action cannot be undone!")
    ) {
      this.request.closeAndFinalize(requestStates.fulfilled);
      return;
    }

    const openSteps =
      this.request.Pipeline.Stages().length -
      this.request.Pipeline.Stage()?.Step;

    if (
      openSteps &&
      confirm(
        `This request still has ${openSteps} open steps! ` +
          `Are you sure you want to close and finalize it? This action cannot be undone!`
      )
    ) {
      this.request.closeAndFinalize(requestStates.fulfilled);
      return;
    }
  };

  promptCancel = () => {
    if (confirm("Cancel request? This action cannot be undone!")) {
      this.request.closeAndFinalize(requestStates.cancelled);
    }
  };

  pauseOptions = Object.entries(requestInternalStates)
    .filter(([key, value]) => value != requestInternalStates.inProgress)
    .map(([key, value]) => {
      return { key, value };
    });

  pauseReason = ko.observable();

  showPause = ko.pureComputed(() => {
    return (
      this.request.State.Status() == requestStates.open &&
      this.request.State.InternalStatus() == requestInternalStates.inProgress
    );
  });
  clickPause = () => {
    const reason = this.pauseReason();
    this.pauseReason(null);
    this.request.pauseRequest(reason);
  };

  showResume = ko.pureComputed(() => {
    return this.request.State.IsPaused();
  });

  clickResume = () => {
    this.request.resumeRequest();
  };

  validationWatcher = (isValid) => {
    if (
      isValid &&
      this.request.Authorization.currentUserCanAdvance() &&
      !this.request.Assignments.CurrentStage.list.InProgress().length
    ) {
      this.promptAdvance();
    }
  };

  nextStageHandler = () => {
    if (!this.request.Assignments.CurrentStage.list.InProgress().length) {
      this.request.Pipeline.advance();
      return;
    }
    this.promptAdvance();
  };

  promptAdvanceModal;
  promptAdvance = () => {
    if (!this.promptAdvanceModal) {
      this.promptAdvanceModal = new bootstrap.Modal(
        document.getElementById("modal-advance-request"),
        {}
      );
    }
    this.promptAdvanceModal.show();
  };

  confirmAdvanceHandler = () => {
    if (!this.request.Pipeline.getNextStage()) {
      this.promptClose();
      this.promptAdvanceModal.hide();
      return;
    }
    this.request.Pipeline.advance();
    this.promptAdvanceModal.hide();
  };

  approveRequestHandler = () => {
    this.approveRequest();
  };

  async approveRequest() {
    this.promptAdvance();
  }

  serviceTypeDefinitionWatcher = (newSvcType) => {
    // This should only be needed when creating a new request.
  };

  createNewRequest = async ({ request }) => {
    const { Requestor, Phone, Email, OfficeSymbol } = request.RequestorInfo;
    const Author = request.Author.Value;

    if (!Requestor()) Requestor(new People(currentUser()));
    if (!Author()) Author(new People(currentUser()));
    if (!Phone()) Phone(currentUser().WorkPhone);
    if (!Email()) Email(currentUser().EMail);
    if (!OfficeSymbol.get()) OfficeSymbol.set(currentUser().OfficeSymbol);
    //this.request.Title = createNewRequestTitle();
    const { Status, InternalStatus, IsActive } = request.State;
    if (!Status()) Status(requestStates.draft);
    if (!InternalStatus()) InternalStatus(requestStates.draft);
    if (!IsActive()) IsActive(true);

    // Watch for a change in service type
    request.LoadedAt(new Date());

    request.Validation.IsValid.subscribe(this.validationWatcher);

    this.Request(request);
    this.DisplayMode(DisplayModes.New);
  };

  viewRequest = ({ request }) => {
    request.Validation.IsValid.subscribe(this.validationWatcher);

    this.Request(request);

    this.DisplayMode(DisplayModes.View);

    this.refreshAll();
  };

  constructor() {
    this._context = getAppContext();
  }
}
