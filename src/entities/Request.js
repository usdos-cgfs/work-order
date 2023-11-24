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

import { People } from "./People.js";
import { ActivityLogComponent } from "../components/ActivityLogComponent.js";
import DateField from "../fields/DateField.js";

import {
  createNewRequestTitle,
  sortByField,
} from "../common/EntityUtilities.js";
import {
  businessDaysFromDate,
  calculateBusinessDays,
} from "../common/DateUtilities.js";
import * as Router from "../common/Router.js";
import { registerServiceTypeActionComponent } from "../infrastructure/RegisterComponents.js";

import {
  currentUser,
  getRequestFolderPermissions,
  stageActionRoleMap,
  AssignmentFunctions,
} from "../infrastructure/Authorization.js";
import {
  emitCommentNotification,
  emitRequestNotification,
} from "../infrastructure/Notifications.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

import TextField from "../fields/TextField.js";
import TextAreaField from "../fields/TextAreaField.js";
import BlobField from "../fields/BlobField.js";

import { DisplayModes } from "../views/RequestDetailView.js";

import { Tabs } from "../env.js";
import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";
import { ValidationError } from "../primitives/ValidationError.js";

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

const requestStateClasses = {
  Draft: "text-bg-info",
  Open: "text-bg-primary",
  Completed: "text-bg-success",
  Cancelled: "text-bg-warning",
  Rejected: "text-bg-danger",
};

// TODO: implement as Entity
export class RequestEntity {
  constructor({ ID = null, Title = null, ServiceType: RequestType = null }) {
    this.ID = ID;
    this.Title = Title ?? createNewRequestTitle();
    this.LookupValue = Title;
    this._context = getAppContext();

    if (!ID) {
      this.DisplayMode(DisplayModes.New);
    }

    if (RequestType) {
      this.RequestType = ServiceType.FindInStore(RequestType);
      this.RequestBodyBlob = new BlobField({
        displayName: "Service Type Details",
        isRequired: false,
        width: 12,
        entityType: ko.observable(this.RequestType._constructor),
      });
    }

    this.ActivityQueue.subscribe(
      this.activityQueueWatcher,
      this,
      "arrayChange"
    );
  }

  // static async Create({
  //   ID = null,
  //   Title = null,
  //   ServiceType: RequestType = null,
  // }) {
  //   const serviceType = ServiceType.FindInStore(RequestType);
  //   await serviceType.initializeEntity();
  //   return new RequestEntity({ ID, Title, ServiceType: serviceType });
  // }

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
  RequestDescription = new TextAreaField({
    displayName: ko.pureComputed(
      () => this.RequestType?.DescriptionTitle ?? "Description"
    ),
    instructions: ko.pureComputed(
      () => this.RequestType?.DescriptionFieldInstructions
    ),
    isRichText: true,
    isRequired: ko.pureComputed(
      () => this.RequestType?.DescriptionRequired ?? false
    ),
    width: "12",
  });

  RequestorInfo = {
    Requestor: ko.observable(),
    Phone: ko.observable(),
    Email: ko.observable(),
    Office: ko.observable(),
  };

  State = {
    IsActive: ko.observable(),
    Status: ko.observable(),
    StatusClass: ko.pureComputed(() => {
      return requestStateClasses[this.State.Status()];
    }),
  };

  Reporting = {
    MeetingStandard: ko.pureComputed(() => this.Reporting.AgingDays() <= 0),
    AgingDays: ko.pureComputed(
      () => this.Reporting.OpenDays() - this.RequestType.DaysToCloseBusiness
    ),
    OpenDays: ko.pureComputed(() => {
      const endDate = this.Dates.Closed.Value() ?? new Date();
      return calculateBusinessDays(this.Dates.Submitted.Value(), endDate);
    }),
  };

  Dates = {
    Submitted: new DateField({ displayName: "Submitted Date" }),
    EstClosed: new DateField({ displayName: "Est. Closed Date" }),
    Closed: new DateField({ displayName: "Closed Date" }),
  };

  RequestOrgs = ko.observable();

  // ServiceType = {
  //   IsLoading: ko.observable(false),
  //   Entity: ko.observable(),
  //   // Def: ko.observable(),
  //   refreshEntity: async () => {
  //     return;
  //   },
  // };

  RequestType;

  RequestBodyBlob;
  // = new BlobField({
  //   displayName: "Service Type Details",
  //   isRequired: false,
  //   width: 12,
  //   entityType: ko.observable(),
  // });

  Pipeline = {
    Stage: ko.observable(),
    PreviousStage: ko.observable(),
    Icon: ko.pureComputed(() => this.RequestType?.Icon),
    Stages: ko.pureComputed(() => {
      if (!this.RequestType) return [];
      const typeStages = pipelineStageStore()
        .filter((stage) => stage.ServiceType?.ID == this.RequestType?.ID)
        .sort(sortByField("Step"));
      const completedStage = PipelineStage.GetCompletedStage();
      completedStage.Step = typeStages.length + 1;
      typeStages.push(completedStage);
      return typeStages;
    }),
    RequestOrgs: ko.pureComputed(() => {
      return this.Pipeline.Stages()
        .filter((stage) => stage.RequestOrg)
        .map((stage) => stage.RequestOrg);
    }),
    getNextStage: ko.pureComputed(() => {
      const thisStepNum = this.Pipeline.Stage()?.Step ?? 0;
      const nextStepNum = thisStepNum + 1;
      return this.Pipeline.Stages()?.find((stage) => stage.Step == nextStepNum);
    }),
    advance: async () => {
      const pipelineAdvanceTask = addTask(taskDefs.pipeline);
      if (this.promptAdvanceModal) this.promptAdvanceModal.hide();

      const nextStage = this.Pipeline.getNextStage();

      if (nextStage.ActionType == stageActionTypes.Closed) {
        // End of the Pipeline; time to close
        console.log("Closing Request");
        this.closeAndFinalize(requestStates.fulfilled);
        finishTask(pipelineAdvanceTask);
        return null;
      }

      const thisStage = this.Pipeline.Stage();
      this.Pipeline.PreviousStage(thisStage);

      this.Pipeline.Stage(nextStage);

      await this._context.Requests.UpdateEntity(this, [
        "PipelineStage",
        "PipelineStagePrev",
      ]);

      this.ActivityQueue.push({
        activity: actionTypes.Advanced,
        data: nextStage,
      });

      await this.Assignments.createStageAssignments(nextStage);

      // If this is a notification stage, advance. The activity logger will emit our notification.
      if (nextStage.ActionType == stageActionTypes.Notification) {
        this.Pipeline.advance();
      }

      if (nextStage.ActionType == stageActionTypes.Closed) {
        this.closeAndFinalize(requestStates.fulfilled);
      }
      finishTask(pipelineAdvanceTask);
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
    Validation: {
      Errors: ko.pureComputed(() => {
        let errors = [];
        let minAttachments = this.RequestType?.AttachmentsRequiredCnt ?? 0;
        if (minAttachments < 0) minAttachments = 1;
        const attachmentsCount = this.Attachments.list.Active().length;
        if (attachmentsCount < minAttachments) {
          errors.push(
            new ValidationError(
              "attachment-count-mismatch",
              "request-header",
              `This request has ${this.RequestType.attachmentsRequiredCntString()} required attachment(s)!`
            )
          );
        }
        return errors;
      }),
    },
    userCanAttach: ko.pureComputed(() =>
      this.Authorization.currentUserCanSupplement()
    ),
    createFolder: async () => {
      const newAttachmentTask = addTask(taskDefs.newAttachment);
      let folderPath = this.getRelativeFolderPath();
      const folderPerms = this.getFolderPermissions();

      try {
        await this._context.Attachments.UpsertFolderPath(folderPath);
        await this._context.Attachments.SetFolderPermissions(
          folderPath,
          folderPerms
        );
        this.Attachments.refresh();
      } catch (e) {
        console.error("Error creating folder: ", e);
        folderPath = null;
      } finally {
        finishTask(newAttachmentTask);
      }
      return folderPath;
    },
    addNew: async () => {
      const folderPath = await this.Attachments.createFolder();
      if (!folderPath) alert("Unable to create folder");
      await this._context.Attachments.UploadNewDocument(folderPath, {
        RequestId: this.ID,
        RequestTitle: this.Title,
      });
      this.Attachments.refresh();
    },
    refresh: async () => {
      if (!this.Title) return;
      const refreshAttachmentsTask = addTask(taskDefs.refreshAttachments);
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
      finishTask(refreshAttachmentsTask);
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
      const newCommentTask = addTask(taskDefs.newComment);
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
      } finally {
        finishTask(newCommentTask);
      }
    },
    update: async (comment) => {
      // TODO ?
    },
    refresh: async () => {
      const refreshCommentsTask = addTask(taskDefs.refreshComments);
      this.Comments.AreLoading(true);
      const folderPath = this.getRelativeFolderPath();
      const comments = await this._context.Comments.GetItemsByFolderPath(
        folderPath,
        Comment.Views.All
      );
      this.Comments.list.All(comments);
      this.Comments.AreLoading(false);
      finishTask(refreshCommentsTask);
    },
    sendNotification: async (comment) => {
      const notifyCommentTask = addTask(taskDefs.newComment);
      await emitCommentNotification(comment, this);
      comment.NotificationSent = true;
      await this._context.Comments.UpdateEntity(comment, ["NotificationSent"]);
      this.Comments.refresh();
      finishTask(notifyCommentTask);
    },
    remove: async (comment) => {
      const removeCommentTask = addTask(taskDefs.removeComment);
      comment.IsActive = false;
      await this._context.Comments.UpdateEntity(comment, ["IsActive"]);
      this.Comments.refresh();
      finishTask(removeCommentTask);
    },
  };

  Assignments = {
    HaveLoaded: ko.observable(false),
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
      InProgress: ko.pureComputed(() => {
        // TODO: this should maybe be in the component, also CurrentStage.list.InProgress
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
        if (window.DEBUG)
          console.log(`Request ${this.ID}: User Assignments Updated`);
        if (!this.Assignments.list.All().length) {
          return [];
        }
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
    getFolderUrl: () =>
      this._context.Assignments.GetFolderUrl(this.getRelativeFolderPath()),
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
          // TODO: Minor - this should be a subscription event
          const activeAssignments = this.Assignments.CurrentStage.list
            .UserActionAssignments()
            .find(
              (assignment) => assignment.Status == assignmentStates.InProgress
            );
          if (activeAssignments) {
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
      },
      UserCanAdvance: ko.pureComputed(() => {
        return this.Assignments.CurrentStage.list.UserActionAssignments()
          .length;
      }),
      AssignmentComponents: ko.pureComputed(() => {
        return this.Assignments.CurrentStage.list
          .UserActionAssignments()
          .map((assignment) => {
            return {
              request: this,
              assignment,
              addAssignment: this.Assignments.addNew,
              completeAssignment: this.Assignments.complete,
              errors: this.Assignments.CurrentStage.Validation.Errors,
              actionComponentName: assignment.getComponentName(),
            };
          });
      }),
    },
    refresh: async () => {
      this.Assignments.AreLoading(true);
      // Create a list of Assignment instances from raw entities
      const assignments = await this._context.Assignments.GetItemsByFolderPath(
        this.getRelativeFolderPath(),
        Assignment.Views.All
      );
      // const assignments =
      //   assignmentObjs?.map(Assignment.CreateFromObject) ?? [];
      // Load request orgs
      assignments.map(
        (asg) =>
          (asg.RequestOrg =
            RequestOrg.FindInStore(asg.RequestOrg) ?? asg.RequestOrg)
      );

      this.Assignments.list.All(assignments);
      if (window.DEBUG) console.log(`Request ${this.ID} Assignments Updated`);
      this.Assignments.HaveLoaded(true);
      this.Assignments.AreLoading(false);
    },
    userCanAssign: ko.pureComputed(() => {
      // TODO: Major
      // If user is a member of the request org assigned to this stage.
      if (!this.State.IsActive()) return false;
      const assignedOrg = this.Pipeline.Stage()?.RequestOrg;
      if (!assignedOrg) return false;
      const user = currentUser();
      if (user.isInRequestOrg(assignedOrg)) return true;
      return false;
    }),
    addNew: async (assignment = null) => {
      if (!this.ID || !assignment) return;

      // Overwrite our title
      assignment.Title = this.Title;

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
      // update the Request Orgs
      if (
        !this.RequestOrgs().find((org) => org.ID == assignment.RequestOrg.ID)
      ) {
        this.RequestOrgs.push(assignment.RequestOrg);
        await this._context.Requests.UpdateEntity(this, ["RequestOrgs"]);
      }
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
    complete: async (assignment, action, refresh = true) => {
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

      if (refresh) this.Assignments.refresh();
    },
    createStageAssignments: async (stage = this.Pipeline.Stage()) => {
      if (!stage?.ActionType) return;

      if (stage.ActionType == actionTypes.Closed) return;

      // If this stage is already assigned (e.g. from a previous assignment stage), skip it
      if (
        this.Assignments.list
          .All()
          .find((assignment) => assignment.PipelineStage?.ID == stage.ID)
      )
        return;

      if (
        stage.AssignmentFunction &&
        AssignmentFunctions[stage.AssignmentFunction]
      ) {
        try {
          const newAssignments = AssignmentFunctions[stage.AssignmentFunction](
            this,
            stage
          );
          await Promise.all(
            newAssignments.map((newAssignment) =>
              this.Assignments.addNew(newAssignment)
            )
          );
        } catch (e) {
          console.warn("Error creating stage assignments", stage);
          return;
        }
        return;
      }

      const newAssignment = new Assignment({
        Assignee:
          stage.Assignee ?? RequestOrg.FindInStore(stage.RequestOrg)?.UserGroup,
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: stageActionRoleMap[stage.ActionType],
      });

      await this.Assignments.addNew(newAssignment);
    },
  };

  Actions = {
    AreLoading: ko.observable(),
    list: {
      All: ko.observableArray(),
    },
    refresh: async () => {
      const refreshActionsTask = addTask(taskDefs.refreshActions);
      if (!this.ID) return;
      this.Actions.AreLoading(true);
      const actions = await this._context.Actions.GetItemsByFolderPath(
        this.getRelativeFolderPath(),
        Action.Views.All
      );
      this.Actions.list.All(actions);
      this.Actions.AreLoading(false);
      finishTask(refreshActionsTask);
    },
    addNew: async (action) => {
      if (!this.ID || !action) return;
      const newActionTask = addTask(taskDefs.newAction);
      const folderPath = this.getRelativeFolderPath();
      // const actionObj = Object.assign(new Action(), action);
      action.PipelineStage = action.PipelineStage ?? this.Pipeline.Stage();
      await this._context.Actions.AddEntity(action, folderPath, this.request);
      this.Actions.refresh();
      finishTask(newActionTask);
    },
  };

  ActivityQueue = ko.observableArray();
  ActivityLogger = new ActivityLogComponent(this.Actions, this.ActivityQueue);
  IsLoading = ko.observable();
  LoadedAt = ko.observable();

  activityQueueWatcher = (changes) => {
    // Filter out the items in our activity queue that are new additions
    const activities = changes
      .filter((change) => change.status == "added")
      .map((change) => change.value);

    // iterate through our actions: {activity, data}
    activities.map(async (action) => {
      emitRequestNotification(this, action);
      switch (action.activity) {
        case actionTypes.Assigned:
        case actionTypes.Unassigned:
          break;
        case actionTypes.Rejected:
          {
            // Request was rejected, close it out
            console.warn("Closing request");
            //
            await this.closeAndFinalize(requestStates.rejected);
          }
          break;
        case actionTypes.Advanced:
          break;
      }
    });
  };

  Validation = {
    validate: () => {
      this.Validation.WasValidated(true);
      // 1. Validate Header
      this.Validation.validateHeader();
      // 2. Validate Body
      this.Validation.validateBody();
      return this.Validation.IsValid();
    },
    validateHeader: () => {
      this.FieldMap.RequestDescription.validate();
    },
    validateBody: () => {
      const serviceTypeEntity = this.RequestBodyBlob;
      if (!serviceTypeEntity) return;
      return serviceTypeEntity.validate();
    },
    reset: () => this.Validation.WasValidated(false),
    Errors: {
      Request: ko.pureComputed(() => {
        let errors = [];
        // Check if there are required attachments

        errors = errors.concat(this.Attachments.Validation.Errors());

        // Required description
        errors = errors.concat(this.FieldMap.RequestDescription.Errors());

        return errors;
      }),
      ServiceType: ko.pureComputed(() => {
        return this.RequestBodyBlob?.TypedValue()?.Errors() ?? [];
      }),
      All: ko.pureComputed(() => [
        ...this.Validation.Errors.Request(),
        ...this.Validation.Errors.ServiceType(),
        ...this.Validation.CurrentStage.Errors(),
      ]),
    },
    IsValid: ko.pureComputed(() => !this.Validation.Errors.All().length),
    WasValidated: ko.observable(false),
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
      // determines whether the current user can add attachments or modify
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
    `${Router.appRoot}?reqId=${this.Title}&tab=${Tabs.RequestDetail}`;

  getAppLinkElement = () =>
    `<a href="${this.getAppLink()}" target="blank">${this.Title}</a>`;
  /**
   * Returns the generic relative path without the list/library name
   * e.g. EX/2929-20199
   */
  getRelativeFolderPath = ko.pureComputed(
    () =>
      `${this.RequestorInfo.Office()?.Title.replace(
        "/",
        "_"
      )}/${this.ObservableTitle()}`
  );

  getFolderUrl = ko.pureComputed(() =>
    this._context.Requests.GetFolderUrl(this.getRelativeFolderPath())
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
    const refreshId = addTask(taskDefs.refresh);
    this.IsLoading(true);
    await this.refreshRequest();
    // These can be started when we have the ID
    const relatedRecordPromises = [
      this.Attachments.refresh(),
      this.Actions.refresh(),
      this.Comments.refresh(),
      this.Assignments.refresh(),
    ];

    // Assignments are dependent on the serviceType being loaded

    await Promise.all(relatedRecordPromises);
    this.LoadedAt(new Date());
    this.IsLoading(false);
    finishTask(refreshId);
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
    if (this.RequestType?.getListRef()) {
      listRefs.push(this.RequestType.getListRef());
    }
    return listRefs;
  }

  closeAndFinalize = async (status) => {
    const closeId = addTask(taskDefs.closing);
    //1. set all assignments to inactive
    this.Assignments.list.InProgress().map((assignment) => {
      this.Assignments.complete(assignment, assignmentStates.Cancelled, false);
      // assignment.Status = assignmentStates.Cancelled;
      // this._context.Assignments.UpdateEntity(assignment);
    });

    //2. Set request properties
    const closedStage = PipelineStage.GetCompletedStage();

    const thisStage = this.Pipeline.Stage();
    this.Pipeline.PreviousStage(thisStage);
    this.Pipeline.Stage(closedStage);

    this.State.Status(status);
    this.State.IsActive(false);
    this.Dates.Closed.set(new Date());
    await this._context.Requests.UpdateEntity(this, [
      "PipelineStage",
      "PipelineStagePrev",
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
    finishTask(closeId);
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
    PipelineStagePrev: {
      factory: PipelineStage.FindInStore,
      obs: this.Pipeline.PreviousStage,
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
      set: (val) => {
        const type = ServiceType.FindInStore(val);
        this.RequestType = type;
      },
      get: () => this.RequestType,
    }, // {id, title},
    RequestBodyBlob: {
      get: () => this.RequestBodyBlob.get(),
      set: (val) => this.RequestBodyBlob.set(val),
    },
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
      "PipelineStagePrev",
      "RequestStatus",
      "RequestSubmitted",
      "EstClosedDate",
      "ClosedDate",
      "RequestOrgs",
      "ServiceType",
      "RequestBodyBlob",
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
    ByServiceType: [
      "ID",
      "Title",
      "ServiceType",
      "RequestingOffice",
      "Requestor",
      "RequestStatus",
      "RequestBodyBlob",
    ],
  };

  static ListDef = {
    name: "Requests",
    title: "Requests",
    fields: RequestEntity.Views.All,
  };
}
