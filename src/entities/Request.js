import { RequestOrg } from "./RequestOrg.js";
import { Assignment, assignmentStates } from "./Assignment.js";
import { People } from "../components/People.js";
import { ServiceType } from "./ServiceType.js";
import { PipelineStage } from "./PipelineStage.js";

import { DateField } from "../components/DateField.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

export const requestStates = {
  draft: "Draft",
  open: "Open",
  cancelled: "Cancelled",
  closed: "Closed",
  rejected: "Rejected",
  fulfilled: "Fulfilled",
};

export class RequestEntity {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this._context = getAppContext();
  }

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
    Submitted: new DateField(),
    EstClosed: new DateField(),
    Closed: new DateField(),
  };

  RequestOrgs = ko.observable();

  ServiceType = {
    IsLoading: ko.observable(false),
    Entity: ko.observable(),
    Def: ko.observable(),
    definitionWatcher: (newSvcType) => {
      // This should only be needed when creating a new request.
      this.ServiceType.instantiateEntity(newSvcType);
    },
    instantiateEntity: async (newSvcType = this.ServiceType.Def()) => {
      const newEntity = await newSvcType.instantiateEntity(this);
      this.ServiceType.Entity(newEntity);
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
        this.RequestOrgs(inputArr.results.map((val) => RequestOrg.Create(val))),
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
    advance: async () => {
      if (this.promptAdvanceModal) this.promptAdvanceModal.hide();

      const nextStage = this.Pipeline.getNextStage();

      if (!nextStage) {
        // End of the Pipeline; time to close
        console.log("Closing Request");
        this.closeAndFinalize(requestStates.fulfilled);
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
                assignment.PipelineStage?.ID == this.State.Stage()?.ID &&
                (assignment.Role == assignmentRoles.ActionResolver ||
                  assignment.Role == assignmentRoles.Approver)
            );
        }),
        UserActionAssignments: ko.pureComputed(() => {
          return this.Assignments.list
            .CurrentUserAssignments()
            .filter(
              (assignment) =>
                assignment.PipelineStage?.ID == this.State.Stage()?.ID &&
                (assignment.Role == assignmentRoles.ActionResolver ||
                  assignment.Role == assignmentRoles.Approver)
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
    refresh: async (view = Assignment.Views.All) => {
      this.Assignments.AreLoading(true);
      // Create a list of Assignment instances from raw entities
      const assignmentObjs = await this._context.Assignments.FindByRequestId(
        this.ID,
        view
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

      this.ActivityQueue.push({
        activity: actionTypes[action],
        data: updateEntity,
      });

      this.Assignments.refresh();
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
        }
      } else {
        newAssignment.Assignee = RequestOrg.FindInStore(
          stage.RequestOrg
        )?.UserGroup;
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
      const newActionId = await this._context.Actions.AddEntity(
        action,
        folderPath,
        this.request
      );
      this.Actions.refresh();
    },
  };

  ActivityQueue = ko.observableArray();

  static Views = {
    All: [
      "ID",
      "Title",
      "RequestSubject",
      "RequestDescription",
      "Requestor",
      "RequestorName",
      "RequestorPhone",
      "RequestorEmail",
      "RequestorSupervisor",
      "ManagingDirector",
      "RequestorOrg",
      "IsActive",
      "PipelineStage",
      "RequestStagePrev",
      "RequestStatus",
      "RequestStatusPrev",
      "InternalStatus",
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
      "RequestorOrg",
      "Requestor",
      "RequestSubmitted",
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
