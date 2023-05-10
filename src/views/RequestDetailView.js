import { RequestOrg } from "../entities/RequestOrg.js";
import { serviceTypeStore, ServiceType } from "../entities/ServiceType.js";
import { RequestEntity, requestStates } from "../entities/Request.js";
import { actionTypes } from "../entities/Action.js";
import { pipelineStageStore } from "../entities/PipelineStage.js";
import { Assignment, assignmentStates } from "../entities/Assignment.js";

import { RequestAssignmentsComponent } from "../components/RequestAssignmentsComponent.js";
import { People } from "../components/People.js";
import { ServiceTypeComponent } from "../components/ServiceTypeComponent.js";

import {
  createNewRequestTitle,
  sortByField,
} from "../common/EntityUtilities.js";
import {
  calculateEffectiveSubmissionDate,
  businessDaysFromDate,
} from "../common/DateUtilities.js";
import * as Router from "../common/Router.js";

import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";
import { getRequestFolderPermissions } from "../infrastructure/Authorization.js";
import { PipelineStage } from "../entities/PipelineStage.js";
import { ActivityLogComponent } from "../components/ActivityLogComponent.js";

const DEBUG = true;

export const DisplayModes = {
  New: "New",
  Edit: "Edit",
  View: "View",
};

const templates = {
  New: "tmpl-request-header-new",
  View: "tmpl-request-header-view",
  Edit: "tmpl-request-header-edit",
};

export class RequestDetailView {
  _context;

  get ID() {
    return this.ObservableID();
  }
  set ID(id) {
    this.ObservableID(id);
  }
  get Title() {
    return this.ObservableTitle();
  }

  set Title(title) {
    this.ObservableTitle(title);
  }
  ObservableID = ko.observable();
  ObservableTitle = ko.observable();

  RequestSubject = ko.observable();
  RequestDescription = ko.observable();

  RequestorInfo = {
    Requestor: ko.observable(),
    Name: ko.observable(),
    Phone: ko.observable(),
    Email: ko.observable(),
    Office: ko.observable(),
    Supervisor: ko.observable(),
    ManagingDirector: ko.observable(),
  };

  State = {
    IsActive: ko.observable(),
    Stage: ko.observable(),
    PreviousStage: ko.observable(),
    Status: ko.observable(),
    PreviousStatus: ko.observable(),
    InternalStatus: ko.observable(),
  };

  Dates = {
    Submitted: ko.observable(),
    EstClosed: ko.observable(),
    Closed: ko.observable(),
  };

  RequestOrgs = ko.observable();

  ServiceType = {
    Def: ko.observable(),
    Entity: ko.observable(),
  };

  // FieldMaps are used by the ApplicationDbContext and define
  // how to store and retrieve the entity properties
  FieldMap = {
    ID: this.ObservableID,
    Title: this.ObservableTitle,
    RequestSubject: this.RequestSubject,
    RequestDescription: this.RequestDescription,
    Requestor: {
      set: (val) => this.RequestorInfo.Requestor(People.Create(val)),
      get: this.RequestorInfo.Requestor,
    },
    RequestorName: this.RequestorInfo.Name,
    RequestorPhone: this.RequestorInfo.Phone,
    RequestorEmail: this.RequestorInfo.Email,
    RequestorSupervisor: {
      set: (val) => this.RequestorInfo.Supervisor(People.Create(val)),
      get: this.RequestorInfo.Supervisor,
    },
    ManagingDirector: {
      set: (val) => this.RequestorInfo.ManagingDirector(People.Create(val)),
      get: this.RequestorInfo.ManagingDirector,
    },
    RequestorOrg: {
      set: (val) => this.RequestorInfo.Office(RequestOrg.Create(val)),
      get: this.RequestorInfo.Office,
    },
    IsActive: this.State.IsActive,
    PipelineStage: {
      factory: PipelineStage.FindInStore,
      obs: this.State.Stage,
    },
    RequestStagePrev: this.State.PreviousStage,
    RequestStatus: this.State.Status,
    RequestStatusPrev: this.State.PreviousStatus,
    InternalStatus: this.State.InternalStatus,
    RequestSubmitted: this.Dates.Submitted,
    EstClosedDate: this.Dates.EstClosed,
    ClosedDate: this.Dates.Closed,
    RequestOrgs: {
      set: (inputArr) =>
        this.RequestOrgs(inputArr.map((val) => RequestOrg.Create(val))),
      get: this.RequestOrgs,
    },
    ServiceType: {
      set: (val) => this.ServiceType.Def(ServiceType.Create(val)),
      get: this.ServiceType.Def,
    }, // {id, title},
  };

  Pipeline = {
    Stages: ko.pureComputed(() => {
      if (!this.ServiceType.Def()) return [];
      return pipelineStageStore()
        .filter((stage) => stage.ServiceType.ID == this.ServiceType.Def()?.ID)
        .sort(sortByField("Step"));
    }),
    getNextStage: () => {
      const thisStepNum = this.State.Stage()?.Step ?? 0;
      const nextStepNum = thisStepNum + 1;
      return this.Pipeline.Stages()?.find((stage) => stage.Step == nextStepNum);
    },
    advance: async () => {
      if (this.promptAdvanceModal) this.promptAdvanceModal.hide();

      const nextStage = this.Pipeline.getNextStage();

      if (!nextStage) {
        // End of the Pipeline; time to close
        // return null;
      }
      this.State.Stage(nextStage);

      await this._context.Requests.UpdateEntity(this, ["PipelineStage"]);

      this.ActivityQueue.push({
        activity: actionTypes.Advanced,
        data: nextStage,
      });
      this.AssignmentsComponent.createStageAssignments(nextStage);
      return;
    },
  };

  // Assignments = {
  //   List: ko.observable(),
  //   AreLoading: ko.observable(),
  //   refresh: async () => {
  //     if (!this.ObservableID()) return;
  //     this.Assignments.AreLoading(true);
  //     const assignments = await this._context.Assignments.FindByRequestId(
  //       this.ObservableID(),
  //       Assignment.Views.All
  //     );
  //     this.Assignments.List(assignments);
  //     this.Assignments.AreLoading(false);
  //   },
  //   addNew: async (assignment = null) => {
  //     if (!this.ObservableID() || !assignment) return;

  //     if (!assignment.RequestOrg) {
  //       const reqOrg = this.State.Stage()?.RequestOrg;
  //       assignment.RequestOrg = reqOrg;
  //     }

  //     if (!assignment.PipelineStage) {
  //       assignment.PipelineStage = this.Stage();
  //     }

  //     assignment.Status = assignment.Role.initialStatus;

  //     const folderPath = this.request.getRelativeFolderPath();

  //     const newAssignmentId = await this._context.Assignments.AddEntity(
  //       assignment,
  //       folderPath,
  //       this.request
  //     );
  //     this.refreshAssignments();

  //     //this.request.ActivityLog.assignmentAdded(assignment);
  //     this.ActivityQueue.push({
  //       activity: actionTypes.Assigned,
  //       data: assignment,
  //     });
  //   },
  // };

  AssignmentsArr = ko.observableArray();

  AssignmentsComponent;

  ActivityQueue = ko.observableArray();
  ActivityLog;

  IsLoading = ko.observable();
  LoadedAt = ko.observable();

  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  activityQueueWatcher() {}

  Validation = {
    Errors: {
      Request: ko.observableArray(),
      ServiceType: ko.pureComputed(() => []),
      All: ko.pureComputed(() => [
        ...this.Validation.Errors.Request(),
        ...this.Validation.Errors.ServiceType(),
        ...this.Validation.CurrentStage.Errors(),
      ]),
    },
    IsValid: ko.pureComputed(() => !this.Validation.Errors.All().length),
    CurrentStage: {
      IsValid: () =>
        this.AssignmentsComponent.CurrentStage.Validation.IsValid(),
      Errors: ko.pureComputed(() =>
        this.AssignmentsComponent.CurrentStage.Validation.Errors()
      ),
    },
  };

  validationErrors = ko.pureComputed(() => {
    // Return a list of validation errors for the request
    return [];
  });

  isValid = ko.pureComputed(() => {
    const serviceTypValidationErrors =
      this.ServiceType.Entity()?.validationErrors &&
      this.ServiceType.Entity()?.validationErrors();

    return !(
      this.validationErrors().length || serviceTypValidationErrors?.length
    );
  });

  /**
   * Returns the generic relative path without the list/library name
   * e.g. EX/2929-20199
   */
  getRelativeFolderPath = ko.pureComputed(
    () => `${this.RequestorInfo.Office().Title}/${this.ObservableTitle()}`
  );

  getFolderPermissions = () => getRequestFolderPermissions(this);

  // Controls
  refreshAll = async () => {
    this.refreshRequest();
    this.ServiceType.Component.refreshServiceTypeEntity();
  };

  refreshRequest = async () => {
    this.IsLoading(true);
    await this._context.Requests.LoadEntity(this);
    this.LoadedAt(new Date());
    this.IsLoading(false);
  };

  submitNewRequest = async () => {
    // 1. Validate Request
    //if (!this.isValid()) return;

    const serviceType = this.ServiceType.Def();
    if (!serviceType) {
      // We should have caught this in validation.
      throw "no service type provided";
    }
    this.DisplayMode(DisplayModes.View);
    //const saveTaskId = addTask(taskDefs.save);

    // 2. Create Folder Structure
    const folderPath = this.getRelativeFolderPath();

    createFolders: {
      //const breakingPermissionsTask = addTask(taskDefs.permissions);
      const folderPerms = this.getFolderPermissions();

      const listRefs = [
        this._context.Requests,
        this._context.Actions,
        this._context.Assignments,
        this._context.Notifications,
      ];

      if (serviceType.getListRef()) {
        listRefs.push(serviceType.getListRef());
      }

      await Promise.all(
        listRefs.map(async (listRef) => {
          // Create folder
          const folderId = await listRef.UpsertFolderPath(folderPath);
          if (!folderId) {
            alert(`Could not create ${listRef.Title} folder ` + folderPath);
            return;
          }
          // Apply folder permissions
          const result = await listRef.SetItemPermissions(
            folderId,
            folderPerms
          );
        })
      );
      //finishTask(breakingPermissionsTask);
    }

    // Initialize dates
    const effectiveSubmissionDate = calculateEffectiveSubmissionDate();
    this.Dates.Submitted(effectiveSubmissionDate);
    this.Dates.EstClosed(
      businessDaysFromDate(
        effectiveSubmissionDate,
        serviceType.DaysToCloseBusiness
      )
    );

    this.State.Status(requestStates.open);
    this.State.IsActive(true);

    createItems: {
      const newRequestItemId = await this._context.Requests.AddEntity(
        this,
        folderPath
      );

      this.ID = newRequestItemId;
      this.ObservableID(newRequestItemId);

      await this.ServiceType.Component.submitServiceTypeEntity();
    }

    Router.setUrlParam("reqId", this.ObservableTitle());

    // Send New WorkOrder Notification to User
    // Create new Action Log Item
    // Initial Assignments
    this.ActivityLog.requestCreated();

    // Progress Request
    this.Pipeline.advance();
  };

  saveChanges(fields = null) {
    this._context.Requests.UpdateEntity(this, fields);
  }

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

  closeAndFinalize = async () => {
    // set all assignments to inactive
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

  approveRequestHandler = () => {
    this.approveRequest();
  };

  async approveRequest() {
    await this.AssignmentsComponent.approveUserAssignments(this._currentUser);
    this.promptAdvance();
  }

  approveAll = async () => {};

  displayModeWatcher = (newDisplayMode) => {
    if (DEBUG)
      console.log("RequestDetailView: displayMode changed", newDisplayMode);
    switch (newDisplayMode) {
      case DisplayModes.New:
        break;
      case DisplayModes.View:
        //this.refreshAll();
        break;
      default:
    }
  };

  constructor({
    displayMode = DisplayModes.View,
    ID = null,
    Title = null,
    serviceType: serviceTypeDef = null,
    context,
    currentUser,
  }) {
    this._context = context;
    this._currentUser = currentUser;
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;

    if (displayMode == DisplayModes.New) {
      this.RequestorInfo.Requestor(new People(currentUser));
      this.ObservableID(ID);
      this.ObservableTitle(createNewRequestTitle());
      this.State.Status(requestStates.draft);
    } else {
      this.ObservableID(ID);
      this.ObservableTitle(Title);
    }

    if (serviceTypeDef) {
      this.ServiceType.Def(
        serviceTypeStore().find((service) => service.ID == serviceTypeDef.ID)
      );
    }

    this.ServiceType.Component = new ServiceTypeComponent({
      request: this,
      ...this.ServiceType,
    });

    this.AssignmentsComponent = new RequestAssignmentsComponent({
      request: this,
      stage: this.State.Stage,
      assignments: this.AssignmentsArr,
      activityQueue: this.ActivityQueue,
    });

    this.ActivityLog = new ActivityLogComponent({
      request: this,
      context,
    });

    this.DisplayMode.subscribe(this.displayModeWatcher);
    this.DisplayMode(displayMode);

    this.LoadedAt(new Date());
    if (displayMode != DisplayModes.New) {
      this.refreshAll();
    }
  }
}
