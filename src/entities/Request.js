import { RequestOrg } from "../entities/RequestOrg.js";
import { ServiceType } from "../entities/ServiceType.js";
import { actionTypes } from "../entities/Action.js";
import {
  PipelineStage,
  pipelineStageStore,
  stageActionTypes,
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
import { ActivityLogComponent } from "../components/ActivityLogComponent.js";
import { NewAssignmentComponent } from "../components/NewAssignmentComponent.js";
import { DateField } from "../components/DateField.js";

import {
  createNewRequestTitle,
  sortByField,
} from "../common/EntityUtilities.js";
import {
  calculateEffectiveSubmissionDate,
  businessDaysFromDate,
} from "../common/DateUtilities.js";
import * as Router from "../common/Router.js";
import { registerServiceTypeActionComponent } from "../common/KnockoutExtensions.js";

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

import { DisplayModes } from "../views/RequestDetailView.js";

import { Tabs } from "../app.js";

// export const requestStates = {
//   draft: { ID: 1, Title: "Draft" },
//   open: { ID: 2, Title: "Open" },
//   fulfilled: { ID: 3, Title: "Completed" },
//   cancelled: { ID: 4, Title: "Cancelled" },
//   rejected: { ID: 5, Title: "Rejected" },
// };
export const requestStates = {
  draft: "Draft",
  open: "Open",
  fulfilled: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export class RequestEntity {
  constructor({ ID = null, Title = null, ServiceType = null }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this._context = getAppContext();

    if (!ID) {
      this.DisplayMode(DisplayModes.New);
    }

    this.ActivityQueue.subscribe(
      this.activityQueueWatcher,
      this,
      "arrayChange"
    );
  }

  DisplayMode = ko.observable(DisplayModes.View);
  Displaymodes = DisplayModes;

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
    Phone: ko.observable(),
    Email: ko.observable(),
    Office: ko.observable(),
  };

  State = {
    IsActive: ko.observable(),
    Status: ko.observable(),
  };

  Dates = {
    Submitted: new DateField(),
    EstClosed: new DateField(),
    Closed: new DateField(),
  };

  RequestOrgs = ko.observable();

  ServiceType = {
    IsLoading: ko.observable(false),
    Entity: ko.observable(),
    Def: ko.observable(),
    instantiateEntity: async (newSvcType = this.ServiceType.Def()) => {},
    refreshEntity: async () => {
      if (DEBUG) console.log("ServiceType: Refresh Triggered");
      if (!this.ServiceType.Def()?.HasTemplate) return;
      this.ServiceType.IsLoading(true);
      if (!this.ID) {
        const newEntity = await this.ServiceType.Def().instantiateEntity(this);
        this.ServiceType.Entity(newEntity);
        this.ServiceType.IsLoading(false);
        return;
      }
      await this.ServiceType.Def()?.initializeEntity();
      const results = await this.ServiceType.Def()
        ?.getListRef()
        ?.FindByColumnValue([{ column: "Request", value: this.ID }], {}, {});

      if (!results.results.length) {
        console.error("cannot find servicetype entity");
        this.ServiceType.IsLoading(false);
        return;
      }

      const entity = results.results[0];
      entity.Request = this;
      this.ServiceType.Entity(entity);
      this.ServiceType.IsLoading(false);
    },
    createEntity: async (newEntity = this.ServiceType.Entity()) => {
      if (!newEntity) return;
      newEntity.Title = this.Title;
      const folderPath = this.getRelativeFolderPath();
      await this.ServiceType.Def()
        .getListRef()
        .AddEntity(newEntity, folderPath, this);
      // newEntity.ID = newSvcTypeItemId;
    },
    updateEntity: async (fields) => {
      if (!this.ServiceType.Entity()) return;
      await this.ServiceType.Def()
        ?.getListRef()
        ?.UpdateEntity(this.ServiceType.Entity(), fields);
    },
  };

  Pipeline = {
    Stage: ko.observable(),
    Icon: ko.pureComputed(() => this.ServiceType.Def()?.Icon),
    Stages: ko.pureComputed(() => {
      if (!this.ServiceType.Def()) return [];
      return pipelineStageStore()
        .filter((stage) => stage.ServiceType.ID == this.ServiceType.Def()?.ID)
        .sort(sortByField("Step"));
    }),
    getNextStage: ko.pureComputed(() => {
      const thisStepNum = this.Pipeline.Stage()?.Step ?? 0;
      const nextStepNum = thisStepNum + 1;
      return this.Pipeline.Stages()?.find((stage) => stage.Step == nextStepNum);
    }),
    advance: async () => {
      if (this.promptAdvanceModal) this.promptAdvanceModal.hide();

      const thisStage = this.Pipeline.Stage();
      const nextStage = this.Pipeline.getNextStage();

      if (!nextStage) {
        // End of the Pipeline; time to close
        console.log("Closing Request");
        this.closeAndFinalize(requestStates.fulfilled);
        return null;
      }
      this.Pipeline.Stage(nextStage);

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

        await this._context.Comments.SetFolderPermissions(
          folderPath,
          folderPerms
        );

        await this._context.Comments.AddEntity(comment, folderPath);
        this.Comments.refresh();
      } catch (e) {
        console.error("Error creating folder: ");
      }
    },
    update: async (comment) => {
      // TODO ?
    },
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
    HaveLoaded: ko.observable(false),
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
      InProgress: ko.pureComputed(() => {
        // TODO: this should maybe be in the component
        return this.Assignments.list
          .All()
          .filter(
            (assignment) => assignment.Status == assignmentStates.InProgress
          );
      }),
      Dashboard: ko.pureComputed(() => {
        return this.Assignments.list.All();
      }),
      CurrentUserAssignments: ko.pureComputed(() => {
        // We need find assignments where the current user is directly assigned:
        // or They're in a group that's been assigned:
        const userGroupIds = currentUser().getGroupIds();
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
        ActionAssignments: ko.pureComputed(() => {
          return this.Assignments.list
            .All()
            .filter(
              (assignment) =>
                assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID &&
                assignment.isActionable()
            );
        }),
        InProgress: ko.pureComputed(() => {
          // TODO: some of these views should maybe be in whatever components are using them
          return this.Assignments.list
            .InProgress()
            .filter(
              (assignment) =>
                assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID
            );
        }),
        UserActionAssignments: ko.pureComputed(() => {
          return this.Assignments.list
            .CurrentUserAssignments()
            .filter(
              (assignment) =>
                assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID &&
                assignment.isActionable()
            );
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
          // TODO: this should be a subscription event
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
          const stage = this.Pipeline.Stage();
          if (!stage) {
            return [];
          }
          const assignmentComponents = this.Assignments.CurrentStage.list
            .UserActionAssignments()
            .map((assignment) => {
              return {
                request: this,
                assignment,
                addAssignment: this.Assignments.addNew,
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
          const stage = this.Pipeline.Stage();
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
            registerServiceTypeActionComponent({
              componentName: stage.ActionComponentName,
              uid: serviceType.UID,
            });
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
      const assignmentObjs =
        await this._context.Assignments.GetItemsByFolderPath(
          this.getRelativeFolderPath(),
          Assignment.Views.All
        );
      const assignments =
        assignmentObjs?.map(Assignment.CreateFromObject) ?? [];

      this.Assignments.list.All(assignments);
      this.Assignments.HaveLoaded(true);
      this.Assignments.AreLoading(false);
    },
    userCanAssign: ko.pureComputed(() => {
      // TODO
      if (!this.State.IsActive()) return false;
      return false;
    }),
    addNew: async (assignment = null) => {
      if (!this.ID || !assignment) return;

      if (!assignment.RequestOrg) {
        assignment.RequestOrg = this.Pipeline.Stage()?.RequestOrg;
      }

      if (!assignment.PipelineStage) {
        assignment.PipelineStage = this.Pipeline.Stage();
      }

      assignment.Status = assignment.Role.initialStatus;

      const folderPath = this.getRelativeFolderPath();

      await this._context.Assignments.AddEntity(assignment, folderPath, this);
      // Have to await this for the next permissions set.
      await this.Assignments.refresh();
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

      this.ActivityQueue.push({
        activity: actionTypes[action],
        data: updateEntity,
      });

      this.Assignments.refresh();
    },
    createStageAssignments: async (stage = this.Pipeline.Stage()) => {
      if (!stage?.ActionType) return;

      // If this stage is already assigned, skip it
      if (
        this.Pipeline.Stages().find((stage) =>
          this.Assignments.list
            .All()
            .map((assignment) => assignment.PipelineStage?.ID)
            .includes(stage.ID)
        )
      )
        return;

      const newAssignment = {
        Assignee:
          stage.Assignee ?? RequestOrg.FindInStore(stage.RequestOrg)?.UserGroup,
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
        }
      }

      await this.Assignments.addNew(newAssignment);
    },
  };

  Actions = {
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
    },
    refresh: async () => {
      if (!this.ID) return;
      this.Actions.AreLoading(true);
      const actions = await this._context.Actions.GetItemsByFolderPath(
        this.getRelativeFolderPath(),
        Action.Views.All
      );
      this.Actions.list.All(actions);
      this.Actions.AreLoading(false);
    },
    addNew: async (action) => {
      if (!this.ID || !action) return;

      const folderPath = this.getRelativeFolderPath();
      // const actionObj = Object.assign(new Action(), action);
      action.PipelineStage = action.PipelineStage ?? this.Pipeline.Stage();
      await this._context.Actions.AddEntity(action, folderPath, this.request);
      this.Actions.refresh();
    },
  };

  ActivityQueue = ko.observableArray();
  ActivityLogger = new ActivityLogComponent(this.Actions, this.ActivityQueue);
  IsLoading = ko.observable();
  LoadedAt = ko.observable();

  activityQueueWatcher = (changes) => {
    const activities = changes
      .filter((change) => change.status == "added")
      .map((change) => change.value);

    activities.map(async (action) => {
      emitRequestNotification(this, action);
      switch (action.activity) {
        case actionTypes.Assigned:
        case actionTypes.Unassigned:
          // update the Request Orgs
          this.RequestOrgs(
            this.Assignments.list
              .All()
              .map((assignment) => assignment.RequestOrg)
          );
          await this._context.Requests.UpdateEntity(this, ["RequestOrgs"]);
          break;
        case actionTypes.Rejected:
          {
            // Request was rejected, close it out
            console.warn("Closing request");
            //
            await this.closeAndFinalize(requestStates.rejected);
          }
          break;
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
      return (
        this.State.Status() == requestStates.open &&
        this.Assignments.CurrentStage.list.UserActionAssignments().length
      );
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

  getAppLink = () =>
    `${Router.webRoot}/Pages/WO_DB.aspx?reqId=${this.Title}&tab=${Tabs.RequestDetail}`;

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

  calculateEffectiveSubmissionDate = () => {
    const submissionDate = this.Dates.Submitted.get() ?? new Date();
    if (
      submissionDate.getUTCHours() >= 19 ||
      submissionDate.getUTCHours() < 4
    ) {
      console.log("its after 3, this is submitted tomorrow");
      const tomorrow = businessDaysFromDate(submissionDate, 1);
      tomorrow.setUTCHours(13);
      tomorrow.setUTCMinutes(0);
      return tomorrow;
    } else {
      return submissionDate;
    }
  };

  // Controls
  refreshAll = async () => {
    this.IsLoading(true);
    await this.refreshRequest();
    // These can be started when we have the ID
    this.Attachments.refresh();
    this.Actions.refresh();
    this.Comments.refresh();
    await this.ServiceType.refreshEntity();
    // Assignments are dependent on the serviceType being loaded
    this.Assignments.refresh();
    this.LoadedAt(new Date());
    this.IsLoading(false);
  };

  refreshRequest = async () => {
    if (!this.ID) return;
    await this._context.Requests.LoadEntity(this);
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

  closeAndFinalize = async (status) => {
    //1. set all assignments to inactive

    //2. Set request properties
    this.State.Status(status);
    this.State.IsActive(false);
    this.Dates.Closed.set(new Date());
    await this._context.Requests.UpdateEntity(this, [
      "RequestStatus",
      "IsActive",
      "ClosedDate",
    ]);
    // 3. Emit closeout action
    this.ActivityQueue.push({
      activity: actionTypes.Closed,
      data: this,
    });
    // 4. Update Permissions;
    await this.Authorization.setReadonly();
    this.refreshAll();
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
    RequestorPhone: this.RequestorInfo.Phone,
    RequestorEmail: this.RequestorInfo.Email,
    RequestingOffice: {
      set: (val) => this.RequestorInfo.Office(RequestOrg.Create(val)),
      get: this.RequestorInfo.Office,
    },
    IsActive: this.State.IsActive,
    PipelineStage: {
      factory: PipelineStage.FindInStore,
      obs: this.Pipeline.Stage,
    },
    RequestStatus: this.State.Status,
    RequestSubmitted: this.Dates.Submitted,
    EstClosedDate: this.Dates.EstClosed,
    ClosedDate: this.Dates.Closed,
    RequestOrgs: {
      set: (inputArr) =>
        this.RequestOrgs(
          (inputArr.results ?? inputArr).map((val) => RequestOrg.Create(val))
        ),
      get: this.RequestOrgs,
    },
    ServiceType: {
      set: (val) => this.ServiceType.Def(ServiceType.Create(val)),
      get: this.ServiceType.Def,
    }, // {id, title},
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "RequestDescription",
      "Requestor",
      "RequestorPhone",
      "RequestorEmail",
      "RequestingOffice",
      "IsActive",
      "PipelineStage",
      "RequestStatus",
      "RequestSubmitted",
      "EstClosedDate",
      "ClosedDate",
      "RequestOrgs",
      "ServiceType",
    ],
    ByStatus: [
      "ID",
      "Title",
      "ServiceType",
      "RequestingOffice",
      "RequestOrgs",
      "Requestor",
      "RequestSubmitted",
      "PipelineStage",
      "EstClosedDate",
      "ClosedDate",
      "RequestStatus",
      "RequestOrgs",
    ],
  };

  static ListDef = {
    name: "WorkOrder",
    title: "Work Order",
    fields: RequestEntity.Views.All,
  };
}
