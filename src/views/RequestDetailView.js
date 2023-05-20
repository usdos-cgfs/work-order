import { RequestOrg } from "../entities/RequestOrg.js";
import {
  serviceTypeStore,
  ServiceType,
  modulePath,
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

import { RequestAssignmentsComponent } from "../components/RequestAssignmentsComponent.js";
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

import { Tabs } from "../app.js";

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
    IsLoading: ko.observable(false),
    Entity: ko.observable(),
    Def: ko.observable(),
    definitionWatcher: async (newSvcType) => {
      // This should only be needed when creating a new request.
      await this.ServiceType.instantiateEntity(newSvcType);
    },
    instantiateEntity: async (newSvcType = this.ServiceType.Def()) => {
      if (DEBUG) console.log("ServiceType: Instantiate Triggered");
      if (!newSvcType?.HasTemplate) {
        this.ServiceType.Entity(null);
        return;
      }
      // this.ServiceType.IsLoading(true);
      const service = await import(modulePath(newSvcType.UID));
      if (!service) {
        console.error("Could not find service module");
        return;
      }
      this.ServiceType.Entity(new service.default(this));
      // this.ServiceType.IsLoading(false);
    },
    refreshEntity: async () => {
      if (DEBUG) console.log("ServiceType: Refresh Triggered");
      if (!this.ServiceType.Def()?.HasTemplate) return;
      if (!this.ID) return;

      this.ServiceType.IsLoading(true);
      if (!this.ServiceType.Entity()) {
        if (DEBUG)
          console.log("ServiceType: Refresh null entity, Instantiating");
        await this.ServiceType.instantiateEntity();
      }
      var template = this.ServiceType.Entity();
      template.Title = this.Title;
      await this.ServiceType.Def()
        ?.getListRef()
        ?.LoadEntityByRequestId(template, this.ID);

      this.ServiceType.IsLoading(false);
    },
    createEntity: async (newEntity = this.ServiceType.Entity()) => {
      if (!newEntity) return;
      newEntity.Title = this.Title;
      const folderPath = this.getRelativeFolderPath();
      const newSvcTypeItemId = await this.ServiceType.Def()
        .getListRef()
        .AddEntity(newEntity, folderPath, this);
      newEntity.ID = newSvcTypeItemId;
      return newSvcTypeItemId;
    },
    updateEntity: async (fields) => {
      if (!this.ServiceType.Entity()) return;
      await this.ServiceType.Def()
        ?.getListRef()
        ?.UpdateEntity(this.ServiceType.Entity(), fields);
    },
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
    getNextStage: ko.pureComputed(() => {
      const thisStepNum = this.State.Stage()?.Step ?? 0;
      const nextStepNum = thisStepNum + 1;
      return this.Pipeline.Stages()?.find((stage) => stage.Step == nextStepNum);
    }),
    ShowActionsArea: ko.pureComputed(
      () =>
        !this.IsLoading() &&
        !this.Assignments.AreLoading() &&
        !this.ServiceType.IsLoading() &&
        this.Assignments.CurrentStage.list.UserActionAssignments().length
    ),
    advance: async () => {
      if (this.promptAdvanceModal) this.promptAdvanceModal.hide();

      const nextStage = this.Pipeline.getNextStage();

      if (!nextStage) {
        // End of the Pipeline; time to close
        console.log("Closing Request");
        this.closeAndFinalize();
        return null;
      }
      this.State.Stage(nextStage);

      await this._context.Requests.UpdateEntity(this, ["PipelineStage"]);

      this.ActivityQueue.push({
        activity: actionTypes.Advanced,
        data: nextStage,
      });
      this.Assignments.createStageAssignments(nextStage);
      return;
    },
  };

  Attachments = {
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
      Active: ko.pureComputed(() =>
        this.Attachments.list.All().filter((attachment) => attachment.IsActive)
      ),
    },
    userCanAttach: ko.pureComputed(() =>
      this.Authorization.currentUserCanSupplement()
    ),
    addNew: async () => {
      const folderPath = this.getRelativeFolderPath();
      const folderPerms = this.getFolderPermissions();

      try {
        await this._context.Attachments.UpsertFolderPath(folderPath);
        await this._context.Attachments.SetFolderPermissions(
          folderPath,
          folderPerms
        );
        await this._context.Attachments.UploadNewDocument(folderPath, {
          RequestId: this.ID,
          RequestTitle: this.Title,
        });
        this.Attachments.refresh();
      } catch (e) {
        console.error("Error creating folder: ");
      }
    },
    refresh: async () => {
      if (!this.Title) return;
      this.Attachments.AreLoading(true);
      try {
        const attachments =
          await this._context.Attachments.GetItemsByFolderPath(
            this.getRelativeFolderPath(),
            Attachment.Views.All
          );
        this.Attachments.list.All(attachments);
      } catch (e) {
        console.warn("Looks like there are no attachments", e);
      }
      this.Attachments.AreLoading(false);
    },
    view: (attachment) => {
      //console.log("viewing", attachment);
      this._context.Attachments.ShowForm(
        "DispForm.aspx",
        "View " + attachment.Title,
        { id: attachment.ID }
      );
    },
    userCanRemove: (attachment) => {
      return ko.pureComputed(() => {
        if (!this.Authorization.currentUserCanSupplement()) return false;
        return true;
      });
    },
    remove: async (attachment) => {
      console.log("removing", attachment);
      attachment.IsActive = false;
      await this._context.Attachments.UpdateEntity(attachment, ["IsActive"]);
      this.Attachments.refresh();
    },
  };

  Comments = {
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
      Active: ko.pureComputed(() => {
        return this.Comments.list.All().filter((comment) => comment.IsActive);
      }),
    },
    NewCommentComponent: {
      CommentText: ko.observable(),
      submit: async () => {
        const comment = {
          Comment: this.Comments.NewCommentComponent.CommentText(),
        };
        await this.Comments.addNew(comment);
        this.Comments.NewCommentComponent.CommentText("");
      },
    },
    userCanComment: ko.pureComputed(() => {
      return this.Authorization.currentUserCanSupplement();
    }),
    addNew: async (comment) => {
      const folderPath = this.getRelativeFolderPath();
      const folderPerms = this.getFolderPermissions();

      try {
        const commentFolderId = await this._context.Comments.UpsertFolderPath(
          folderPath
        );

        await this._context.Comments.SetItemPermissions(
          commentFolderId,
          folderPerms
        );

        await this._context.Comments.AddEntity(comment, folderPath);
        this.Comments.refresh();
      } catch (e) {
        console.error("Error creating folder: ");
      }
    },
    update: async (comment) => {},
    refresh: async () => {
      this.Comments.AreLoading(true);
      const folderPath = this.getRelativeFolderPath();
      const comments = await this._context.Comments.GetItemsByFolderPath(
        folderPath,
        Comment.Views.All
      );
      this.Comments.list.All(comments);
      this.Comments.AreLoading(false);
    },
    sendNotification: async (comment) => {
      await emitCommentNotification(comment, this);
      comment.NotificationSent = true;
      await this._context.Comments.UpdateEntity(comment, ["NotificationSent"]);
      this.Comments.refresh();
    },
  };

  Assignments = {
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
      InProgress: ko.pureComputed(() =>
        this.Assignments.list
          .All()
          .filter(
            (assignment) => assignment.Status == assignmentStates.InProgress
          )
      ),
      CurrentUserAssignments: ko.pureComputed(() => {
        // We need find assignments where the current user is directly assigned:
        // or They're in a group that's been assigned:
        const userGroupIds = currentUser().Groups.map((group) => group.ID);
        // or Where they're in a requestOrg that's been assigned:
        const userReqOrgIds = currentUser()
          .ActionOffices()
          .map((org) => org.ID);

        const assignments = this.Assignments.list
          .All()
          .filter(
            (assignment) =>
              assignment.Assignee?.ID == currentUser()?.ID ||
              userGroupIds.includes(assignment.Assignee?.ID) ||
              userReqOrgIds.includes(assignment.RequestOrg?.ID)
          );

        return assignments;
      }),
    },
    CurrentStage: {
      list: {
        UserActionAssignments: ko.pureComputed(() => {
          const userAssignments = this.Assignments.list
            .CurrentUserAssignments()
            .filter(
              (assignment) =>
                assignment.PipelineStage?.ID == this.State.Stage()?.ID &&
                (assignment.Role == assignmentRoles.ActionResolver ||
                  assignment.Role == assignmentRoles.Approver)
            );
          // TODO: Is this really the best way to do this?
          // this.Assignments.CurrentStage.Validation.setActiveAssignmentsError(
          //   userAssignments.find(
          //     (assignment) => assignment.Status == assignmentStates.InProgress
          //   )
          // );

          return userAssignments;
        }),
      },
      Validation: {
        IsValid: ko.pureComputed(
          () =>
            !this.Assignments.CurrentStage.Validation.ActiveAssignmentsError() &&
            !this.Assignments.CurrentStage.Validation.Errors().length
        ),
        Errors: ko.observableArray(),
        ActiveAssignmentsError: ko.pureComputed(() => {
          const activeAssignments = this.Assignments.CurrentStage.list
            .UserActionAssignments()
            .find(
              (assignment) => assignment.Status == assignmentStates.InProgress
            );
          if (activeAssignments) {
            // If we have assignment components and there isn't already a variable set
            // this.Assignments.CurrentStage.Validation.Errors(
            //   this.Assignments.CurrentStage.Validation.Errors()
            //     .filter(
            //       (error) => error.source != activeAssignmentsError.source
            //     )
            //     .push(activeAssignmentsError)
            // );
            if (
              this.Assignments.CurrentStage.Validation.Errors.indexOf(
                activeAssignmentsError
              ) < 0
            ) {
              this.Assignments.CurrentStage.Validation.Errors.push(
                activeAssignmentsError
              );
            }
            return true;
          } else {
            this.Assignments.CurrentStage.Validation.Errors.remove(
              activeAssignmentsError
            );
            return false;
          }
        }),
        setActiveAssignmentsError: (activeAssignments) => {},
      },
      UserCanAdvance: ko.pureComputed(() => {
        return this.Assignments.CurrentStage.list.UserActionAssignments()
          .length;
      }),
      AssignmentComponents: {
        Generic: ko.pureComputed(() => {
          const stage = this.State.Stage();
          if (!stage) {
            return [];
          }
          const assignmentComponents = this.Assignments.CurrentStage.list
            .UserActionAssignments()
            .map((assignment) => {
              return {
                assignment,
                completeAssignment: this.Assignments.complete,
                errors: this.Assignments.CurrentStage.Validation.Errors,
                actionComponentName: ko.observable(
                  assignmentRoleComponentMap[assignment.Role]
                ),
              };
            });

          return assignmentComponents;
        }),
        Custom: ko.pureComputed(() => {
          const stage = this.State.Stage();
          const serviceType = this.ServiceType.Def();
          const serviceTypeEntity = this.ServiceType.Entity();
          if (
            !serviceType?.UID ||
            !stage?.ActionComponentName ||
            !serviceTypeEntity ||
            this.ServiceType.IsLoading()
          ) {
            return;
          }
          // Check if the user is assigned to this stage
          if (
            !this.Assignments.CurrentStage.list.UserActionAssignments().length
          ) {
            return;
          }
          try {
            registerServiceTypeComponent(
              stage.ActionComponentName,
              stage.ActionComponentName,
              serviceType.UID
            );
            return {
              actionComponentName: stage.ActionComponentName,
              serviceType: this.ServiceType,
              request: this,
              errors: this.Assignments.CurrentStage.Validation.Errors,
            };
          } catch (e) {
            console.error(
              `Error registering declared assignment action: ${stage.ActionComponentName}`,
              e
            );
          }
        }),
        Any: ko.pureComputed(
          () =>
            this.Assignments.CurrentStage.AssignmentComponents.Generic()
              .length ||
            this.Assignments.CurrentStage.AssignmentComponents.Custom()
        ),
      },
    },
    refresh: async () => {
      this.Assignments.AreLoading(true);
      // Create a list of Assignment instances from raw entities
      const assignments = (
        await this._context.Assignments.FindByRequestId(
          this.ID,
          Assignment.Views.All
        )
      ).map(Assignment.CreateFromObject);

      this.Assignments.list.All(assignments);
      this.Assignments.AreLoading(false);
    },
    userCanAssign: ko.pureComputed(() => {
      if (!this.State.IsActive()) return false;
      return false;
    }),
    addNew: async (assignment = null) => {
      if (!this.ID || !assignment) return;

      if (!assignment.RequestOrg) {
        assignment.RequestOrg = this.State.Stage()?.RequestOrg;
      }

      if (!assignment.PipelineStage) {
        assignment.PipelineStage = this.State.Stage();
      }

      assignment.Status = assignment.Role.initialStatus;

      const folderPath = this.getRelativeFolderPath();

      const newAssignmentId = await this._context.Assignments.AddEntity(
        assignment,
        folderPath,
        this
      );
      this.Assignments.refresh();

      //this.request.ActivityLog.assignmentAdded(assignment);
      this.ActivityQueue.push({
        activity: actionTypes.Assigned,
        data: assignment,
      });
      if (assignment.Role?.permissions) {
        // assignment.Assignee.Roles = [assignment.Role.permissions];
        this.Authorization.ensureAccess([
          [assignment.Assignee, assignment.Role.permissions],
        ]);
      }
    },
    view: (assignment) => {
      //console.log("viewing", attachment);
      this._context.Assignments.ShowForm(
        "DispForm.aspx",
        "View " + assignment.Assignee.Title,
        { id: assignment.ID }
      );
    },
    remove: async (assignment) => {
      if (!confirm("Are you sure you want to remove this assignment?")) return;
      try {
        await this._context.Assignments.RemoveEntity(assignment);
      } catch (e) {
        console.error("Unable to remove assignment", e);
        return;
      }
      this.Assignments.refresh();

      //this.request.ActivityLog.assignmentRemoved(assignment);
      this.ActivityQueue.push({
        activity: actionTypes.Unassigned,
        data: assignment,
      });
    },
    complete: async (assignment, action) => {
      const updateEntity = {
        ID: assignment.ID,
        Status: assignmentStates[action],
        Comment: assignment.Comment,
        CompletionDate: new Date().toISOString(),
        ActionTaker: currentUser(),
      };
      await this._context.Assignments.UpdateEntity(updateEntity);

      this.Assignments.refresh();
      this.ActivityQueue.push({
        activity: actionTypes[action],
        data: updateEntity,
      });
    },
    createStageAssignments: async (stage = null) => {
      stage = stage ?? this.State.Stage();
      const newAssignment = {
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: stageActionRoleMap[stage.ActionType],
      };

      if (
        stage.AssignmentFunction &&
        AssignmentFunctions[stage.AssignmentFunction]
      ) {
        const people =
          AssignmentFunctions[stage.AssignmentFunction].bind(this)();

        if (people && people.Title) {
          newAssignment.Assignee = people;
          //TODO: Trigger permissions update based on role
        }
      } else {
        newAssignment.Assignee = RequestOrg.FindInStore(
          stage.RequestOrg
        )?.UserGroup;
      }

      await this.Assignments.addNew(newAssignment);
    },
  };

  // AssignmentsArr = ko.observableArray();

  AssignmentsComponent;

  ActivityQueue = ko.observableArray();
  ActivityLog;

  IsLoading = ko.observable();
  LoadedAt = ko.observable();

  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  activityQueueWatcher = (changes) => {
    const activities = changes
      .filter((change) => change.status == "added")
      .map((change) => change.value);

    activities.map(async (action) => {
      emitRequestNotification(action, this);
      if (action.activity == actionTypes.Rejected) {
        // Request was rejected, close it out
        console.warn("Closing request");
        //
        await this.closeAndFinalize(requestStates.rejected);
      }
    });
  };

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
      IsValid: () => this.Assignments.CurrentStage.Validation.IsValid(),
      Errors: ko.pureComputed(() =>
        this.Assignments.CurrentStage.Validation.Errors()
      ),
    },
  };

  getAppLink = () =>
    `${Router.appRoot}/Pages/WO_DB.aspx?reqId=${this.Title}&tab=${Tabs.RequestDetail}`;

  getAppLinkElement = () =>
    `<a href="${this.getAppLink()}" target="blank">${this.Title}</a>`;
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
    this.IsLoading(true);
    await this.refreshRequest();
    // These can be started when we have the ID
    this.Attachments.refresh();
    this.ActivityLog.refreshActions();
    this.Comments.refresh();
    await this.ServiceType.refreshEntity();
    // this.ServiceType.Component.refreshServiceTypeEntity();
    // This is dependent on the serviceType being loaded
    this.Assignments.refresh();
    this.LoadedAt(new Date());
    this.IsLoading(false);
  };

  refreshRequest = async () => {
    await this._context.Requests.LoadEntity(this);
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

      const listRefs = this.getInitialListRefs();

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

      await this.ServiceType.createEntity();
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

  closeAndFinalize = async (status) => {
    //1. set all assignments to inactive

    //2. Set request properties
    this.State.Status(status);
    this.State.IsActive(false);
    this.Dates.Closed(new Date());
    this.State.Stage(null);
    await this._context.Requests.UpdateEntity(this, [
      "RequestStatus",
      "IsActive",
      "ClosedDate",
      "PipelineStage",
    ]);
    //3. Update Permissions;
    await this.Authorization.setReadonly();
    this.refreshAll();
  };

  Authorization = {
    currentUserIsActionOffice: ko.pureComputed(() => {
      return this.Assignments.list
        .CurrentUserAssignments()
        .find((assignment) =>
          [assignmentRoles.ActionResolver, assignmentRoles.Approver].includes(
            assignment.ActionType
          )
        );
    }),
    currentUserCanAdvance: ko.pureComputed(() => {
      return this.Assignments.CurrentStage.list.UserActionAssignments().length;
    }),
    currentUserCanSupplement: ko.pureComputed(() => {
      // determines whether the current user can add attachments or
      const user = currentUser();
      if (!user) {
        console.warn("Current user not set!");
        return false;
      }
      if (!this.State.IsActive()) return false;
      if (this.Assignments.list.CurrentUserAssignments().length) return true;
      if (this.RequestorInfo.Requestor()?.ID == user.ID) return true;
    }),
    ensureAccess: async (accessValuePairs) => {
      const relFolderPath = this.getRelativeFolderPath();
      const listRefs = this.getAllListRefs();
      await Promise.all(
        listRefs.map(async (listRef) => {
          // Apply folder permissions
          await listRef.EnsureFolderPermissions(
            relFolderPath,
            accessValuePairs
          );
        })
      );
    },
    setReadonly: async () => {
      const relFolderPath = this.getRelativeFolderPath();
      const listRefs = this.getAllListRefs();
      await Promise.all(
        listRefs.map(async (listRef) => {
          // Apply folder permissions
          await listRef.SetFolderReadOnly(relFolderPath);
        })
      );
    },
  };

  getAllListRefs() {
    const listRefs = this.getInitialListRefs();
    listRefs.concat([this._context.Comments, this._context.Attachments]);
    return listRefs;
  }

  getInitialListRefs() {
    const listRefs = [
      this._context.Requests,
      this._context.Actions,
      this._context.Assignments,
      this._context.Notifications,
    ];
    if (this.ServiceType.Def()?.getListRef()) {
      listRefs.push(this.ServiceType.Def().getListRef());
    }
    return listRefs;
  }

  promptClose = () => {
    if (confirm("Close and finalize request? This action cannot be undone!")) {
      this.closeAndFinalize(requestStates.closed);
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

  approveRequestHandler = () => {
    this.approveRequest();
  };

  async approveRequest() {
    // await this.AssignmentsComponent.approveUserAssignments(this._currentUser);
    this.promptAdvance();
  }

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
      this.ObservableTitle(createNewRequestTitle());
      this.State.Status(requestStates.draft);
      this.State.IsActive(true);
      this.ServiceType.Def.subscribe(this.ServiceType.definitionWatcher);
    } else {
      this.ObservableID(ID);
      this.ObservableTitle(Title);
    }

    if (serviceTypeDef) {
      this.ServiceType.Def(
        serviceTypeStore().find((service) => service.ID == serviceTypeDef.ID)
      );
      // this.ServiceType.instantiateEntity();
    }

    this.ServiceType.Component = new ServiceTypeComponent({
      request: this,
      ...this.ServiceType,
    });

    // this.AssignmentsComponent = new RequestAssignmentsComponent({
    //   request: this,
    //   stage: this.State.Stage,
    //   // assignments: this.Assignments.list.All,
    //   activityQueue: this.ActivityQueue,
    //   ...this.Assignments,
    // });

    (this.Assignments.NewAssignmentComponent = new NewAssignmentComponent({
      addAssignment: this.Assignments.addNew,
    })),
      (this.ActivityLog = new ActivityLogComponent({
        request: this,
        context,
      }));

    this.ActivityQueue.subscribe(
      this.activityQueueWatcher,
      this,
      "arrayChange"
    );

    // this.DisplayMode.subscribe(this.displayModeWatcher);
    this.DisplayMode(displayMode);

    this.LoadedAt(new Date());
    if (displayMode != DisplayModes.New) {
      this.refreshAll();
    }
  }
}
