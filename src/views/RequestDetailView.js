import { RequestOrg } from "../entities/RequestOrg.js";
import {
  serviceTypeStore,
  ServiceType,
  getModuleFilePath,
} from "../entities/ServiceType.js";
import { RequestEntity, requestStates } from "../entities/Request.js";
import { actionTypes } from "../entities/Action.js";
import {
  PipelineStage,
  pipelineStageStore,
} from "../entities/PipelineStage.js";
import {
  Assignment,
  assignmentRoles,
  assignmentStates,
  assignmentRoleComponentMap,
  activeAssignmentsError,
} from "../entities/Assignment.js";
import { Attachment } from "../entities/Attachment.js";
import { Comment } from "../entities/Comment.js";
import { Action } from "../entities/Action.js";

import { People } from "../components/People.js";
import { ServiceTypeComponent } from "../components/ServiceTypeComponent.js";
import { ActivityLogComponent } from "../components/ActivityLogComponent.js";
import { NewAssignmentComponent } from "../components/NewAssignmentComponent.js";

import {
  createNewRequestTitle,
  sortByField,
} from "../common/EntityUtilities.js";
import {
  calculateEffectiveSubmissionDate,
  businessDaysFromDate,
} from "../common/DateUtilities.js";
import * as Router from "../common/Router.js";
import { registerServiceTypeComponent } from "../common/KnockoutExtensions.js";

import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";

import {
  currentUser,
  getRequestFolderPermissions,
  stageActionRoleMap,
  AssignmentFunctions,
  permissions,
} from "../infrastructure/Authorization.js";
import {
  emitCommentNotification,
  emitRequestNotification,
} from "../infrastructure/Notifications.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

import { Tabs } from "../app.js";

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

export class RequestDetailView {
  /************************************************************************
      RequestDetail Component Specific Items
  ************************************************************************/

  refreshAll = async () => {
    await this.request.refreshAll();
  };

  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  HeaderComponentName = ko.pureComputed(() => {
    return reqHeaderComponentsMap[this.DisplayMode()];
  });

  ShowActionsArea = ko.pureComputed(
    () =>
      this.request.Assignments.CurrentStage.list.UserActionAssignments().length
  );

  // TODO: this should probably be it's own component w/ template
  NewCommentComponent = {
    CommentText: ko.observable(),
    submit: async () => {
      const comment = {
        Comment: this.NewCommentComponent.CommentText(),
      };
      await this.request.Comments.addNew(comment);
      this.NewCommentComponent.CommentText("");
    },
  };

  submitNewRequest = async () => {
    // 1. Validate Request
    //if (!this.isValid()) return;

    const serviceType = this.request.ServiceType.Def();
    if (!serviceType) {
      // We should have caught this in validation.
      throw "no service type provided";
    }
    this.DisplayMode(DisplayModes.View);
    //const saveTaskId = addTask(taskDefs.save);

    // 2. Create Folder Structure
    const folderPath = this.request.getRelativeFolderPath();

    createFolders: {
      //const breakingPermissionsTask = addTask(taskDefs.permissions);
      const folderPerms = this.request.getFolderPermissions();

      const listRefs = this.request.getInitialListRefs();

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
      //finishTask(breakingPermissionsTask);
    }

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

    this.request.State.Status(requestStates.open);
    this.request.State.IsActive(true);

    createItems: {
      await this._context.Requests.AddEntity(this.request, folderPath);

      await this.request.ServiceType.createEntity();
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

  validationWatcher = (isValid) => {
    if (isValid && this.request.Authorization.currentUserCanAdvance()) {
      this.promptAdvance();
    }
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
    this.request.ServiceType.instantiateEntity(newSvcType);
  };

  constructor({ request, displayMode = DisplayModes.View, serviceType }) {
    this.request = request;
    this._context = getAppContext();

    if (displayMode == DisplayModes.New) {
      this.request.RequestorInfo.Requestor(new People(currentUser()));
      this.request.Title = createNewRequestTitle();
      this.request.State.Status(requestStates.draft);
      this.request.State.IsActive(true);
      this.request.ServiceType.Def.subscribe(this.serviceTypeDefinitionWatcher);
    }

    if (serviceType) {
      this.request.ServiceType.Def(serviceType);
      // this.ServiceType.instantiateEntity();
    }

    this.ServiceTypeComponent = new ServiceTypeComponent({
      request,
      ...this.request.ServiceType,
      displayMode: this.DisplayMode,
    });

    this.request.Assignments.NewAssignmentComponent =
      new NewAssignmentComponent({
        addAssignment: this.request.Assignments.addNew,
      });

    this.request.Validation.IsValid.subscribe(this.validationWatcher);
    // this.DisplayMode.subscribe(this.displayModeWatcher);
    this.DisplayMode(displayMode);

    this.request.LoadedAt(new Date());
    if (displayMode != DisplayModes.New) {
      this.refreshAll();
    }
  }
}
