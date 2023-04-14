import { People } from "../components/People.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { RequestAssignmentsComponent } from "../components/RequestAssignmentsComponent.js";
import { pipelineStageStore } from "../entities/Pipelines.js";
import { createNewRequestID, sortByField } from "../common/EntityUtilities.js";
import {
  serviceTypeStore,
  ServiceType,
  getRepositoryListName,
} from "../entities/ServiceType.js";
import { ServiceTypeComponent } from "../components/ServiceTypeComponent.js";
import { addTask, finishTask, taskDefs } from "../stores/Tasks.js";
import { getRequestFolderPermissions } from "../infrastructure/Authorization.js";
import {
  calculateEffectiveSubmissionDate,
  businessDaysFromDate,
} from "../common/DateUtilities.js";
import { requestStates } from "../entities/Request.js";

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
  ID;
  Title;
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

  ServiceType = ko.observable();

  RequestOrgs = ko.observable();

  // Request Properties
  Fields = {
    ID: { obs: this.ObservableID },
    Title: { obs: this.ObservableTitle },
    RequestSubject: { obs: this.RequestSubject },
    RequestDescription: { obs: this.RequestDescription },
    Requestor: { factory: People.Create, obs: this.RequestorInfo.Requestor },
    RequestorName: { obs: this.RequestorInfo.Name },
    RequestorPhone: { obs: this.RequestorInfo.Phone },
    RequestorEmail: { obs: this.RequestorInfo.Email },

    RequestorSupervisor: {
      factory: People.Create,
      obs: this.RequestorInfo.Supervisor,
    },
    ManagingDirector: {
      factory: People.Create,
      obs: this.RequestorInfo.ManagingDirector,
    },
    RequestorOffice: {
      factory: RequestOrg.Create,
      obs: this.RequestorInfo.Office,
    },

    IsActive: { obs: this.State.IsActive },
    RequestStage: { obs: this.State.Stage },
    RequestStagePrev: { obs: this.State.PreviousStage },
    RequestStatus: { obs: this.State.Status },
    RequestStatusPrev: { obs: this.State.PreviousStatus },
    InternalStatus: { obs: this.State.InternalStatus },
    RequestSubmitted: { obs: this.Dates.Submitted },
    EstClosedDate: { obs: this.Dates.EstClosed },
    ClosedDate: { obs: this.Dates.Closed },

    RequestOrgs: { factory: RequestOrg.Create, obs: this.RequestOrgs },

    ServiceType: { factory: ServiceType.Create, obs: this.ServiceType }, // {id, title},
    AssignmentsBlob: {
      obs: ko.observable(),
    },
  };

  FieldMap = this.Fields; // This is a one to one for this entity

  ServiceTypeComponent = new ServiceTypeComponent({
    request: this,
    serviceType: this.ServiceType,
  });

  Pipeline = ko.pureComputed(() => {
    return {
      currentStage: this.Fields.RequestStage.obs,
      stages: pipelineStageStore()
        .filter(
          (stage) => stage.ServiceType.ID == this.Fields.ServiceType.obs().ID
        )
        .sort(sortByField("Step")),
    };
  });

  Assignments = new RequestAssignmentsComponent({
    request: {
      ID: this.Fields.ID.obs,
      Title: this.Fields.Title.obs,
      AssignmentsBlob: this.AssignmentsBlob,
    },
    context: this._context,
  });

  IsLoading = ko.observable();
  DisplayModes = DisplayModes;
  DisplayMode = ko.observable();

  // Request Methods
  validateRequest = () => {
    if (this.ServiceTypeComponent.ViewModel()?.Validate) {
      const validationResult =
        this.ServiceTypeComponent?.ViewModel()?.Validate();
      if (!validationResult.Success) {
        alert(validationResult.Message);
        return false;
      }
    }
    return true;
  };

  getFolderPath = ko.pureComputed(
    () => `${this.RequestorInfo.Office().Title}/${this.Fields.Title.obs()}`
  );

  getFolderPermissions = () => getRequestFolderPermissions(this);

  // Controls
  RefreshAll = async () => {
    this.RefreshRequest();
    this.Assignments.Refresh();
  };

  RefreshRequest = async () => {
    this.IsLoading(true);
    await this._context.Requests.Load(this);
    this.IsLoading(false);
  };

  SubmitNewRequest = async () => {
    // 1. Validate Request
    //if (!this.validateRequest()) return;

    this.DisplayMode(DisplayModes.View);
    //const saveTaskId = addTask(taskDefs.save);

    // 2. Create Folder Structure
    const folderPath = this.getFolderPath();
    createFolders: {
      //const breakingPermissionsTask = addTask(taskDefs.permissions);
      const folderPerms = this.getFolderPermissions();

      const listRefs = [
        this._context.Requests,
        this._context.Assignments,
        this._context.Notifications,
      ];

      if (this.ServiceType()?.HasTemplate) {
        const listName = getRepositoryListName(this.ServiceType());
        listRefs.push(this._context.Set({ title: listName, name: listName }));
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
    this.Fields.RequestSubmitted.obs(effectiveSubmissionDate);
    this.Fields.EstClosedDate.obs(
      businessDaysFromDate(
        effectiveSubmissionDate,
        this.ServiceType().DaysToCloseBusiness
      )
    );

    this.Fields.RequestStatus.obs(requestStates.open);
    this.Fields.IsActive.obs(true);

    createItems: {
      const newRequestItemId = await this._context.Requests.AddEntity(
        this,
        folderPath
      );

      if (this.ServiceTypeComponent?.ViewModel) {
      }
    }
    // await this._context.Requests.AddInFolder(this);
    // this.Fields.RequestStage.obs(1);
    // this.DisplayMode(DisplayModes.View);
  };

  EditRequest = async () => {
    this.DisplayMode(DisplayModes.Edit);
  };

  UpdateRequest = async () => {
    this.DisplayMode(DisplayModes.View);
  };

  CancelChanges = async () => {
    //Refresh
    this.DisplayMode(DisplayModes.Edit);
  };

  constructor({
    displayMode = DisplayModes.View,
    ID = null,
    Title = null,
    serviceType = null,
    context,
    currentUser,
  }) {
    this._context = context;
    this._currentUser = currentUser;
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;

    this.Fields.ID.obs(ID);
    this.Fields.Title.obs(Title);

    if (serviceType) {
      this.Fields.ServiceType.obs(
        serviceTypeStore().find((service) => service.ID == serviceType.ID)
      );
    }

    this.DisplayMode(displayMode);

    switch (displayMode) {
      case DisplayModes.New:
        this.Fields.Requestor.obs(new People(currentUser));
        this.Fields.Title.obs(createNewRequestID());
        this.Fields.RequestStatus.obs(requestStates.draft);
        break;
      case DisplayModes.View:
        this.RefreshAll();
        break;
      default:
    }
  }
}
