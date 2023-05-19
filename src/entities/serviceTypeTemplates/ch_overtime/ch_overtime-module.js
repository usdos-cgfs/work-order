import { People } from "../../../components/People.js";
import { DateField } from "../../../components/DateField.js";
import { requestOrgStore } from "../../RequestOrg.js";

import ApplicationDbContext, {
  getAppContext,
} from "../../../infrastructure/ApplicationDbContext.js";
import { permissions } from "../../../infrastructure/Authorization.js";

import { registerServiceTypeComponent } from "../../../common/KnockoutExtensions.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
    this.supplementSet = ApplicationDbContext.Set(ContractorSupplement.ListDef);
    this._context = getAppContext();
  }
  ID;

  Contractor = ko.observable();
  GovManager = ko.observable();
  GTM = ko.observable();
  APM = ko.observable();
  COR = ko.observable();

  DateStart = new DateField();
  DateEnd = new DateField();

  Hours = ko.observable();

  ContractorSupplement = {
    IsLoading: ko.observable(),
    entity: new ContractorSupplement(),
    refresh: async () => {
      if (!this.ContractorSupplement.entity.ID) return;
      this.ContractorSupplement.IsLoading(true);
      // await this.supplementSet.LoadEntityByRequestId(
      //   this.ContractorSupplement.entity,
      //   this.Request.ID
      // );
      await this.supplementSet.LoadEntity(this.ContractorSupplement.entity);
      this.ContractorSupplement.IsLoading(false);
    },
    set: async (entity) => {
      if (!entity?.ID) return;
      this.ContractorSupplement.entity.ID = entity.ID;
      //await this.supplementSet.LoadEntity(this.ContractorSupplement.entity);
      await this.ContractorSupplement.refresh();
    },
    update: async () => {
      await this.supplementSet.UpdateEntity(
        this.ContractorSupplement.entity,
        ContractorSupplement.Views.APMUpdate
      );
    },
    create: async () => {
      // this.ContractorSupplement.entity.Request = this.Request;
      const relFolderPath = this.Request.getRelativeFolderPath();
      const folderPerms = this.ContractorSupplement.getPermissions();
      //Create the folder
      const listFolderId = await this.supplementSet.UpsertFolderPath(
        relFolderPath
      );

      // Break the Permissions
      await this.supplementSet.SetItemPermissions(listFolderId, folderPerms);

      this.ContractorSupplement.entity.Contractor(this.Contractor());
      // Create the item
      const supplementId = await this.supplementSet.AddEntity(
        this.ContractorSupplement.entity,
        relFolderPath,
        this.Request
      );
      this.ContractorSupplement.entity.ID = supplementId;
      await this.Request.ServiceType.updateEntity(["ContractorSupplement"]);
    },
    getPermissions: () => {
      // APM, GTM, Budget, PA, and COR have access
      const budgetGroup = requestOrgStore().find(
        (org) => org.Title == "CGFS/EX/Budget"
      )?.UserGroup;
      const paGroup = requestOrgStore().find(
        (org) => org.Title == "CGFS/EX/PA"
      )?.UserGroup;

      return [
        [this.APM(), permissions.FullControl],
        [this.GTM(), permissions.FullControl],
        [this.COR(), permissions.FullControl],
        [budgetGroup, permissions.FullControl],
        [paGroup, permissions.FullControl],
      ];
    },
  };

  FieldMap = {
    ID: this.ID,
    FullName: {
      obs: this.Contractor,
      factory: People.Create,
    },
    ManagerDept: {
      obs: this.GovManager,
      factory: People.Create,
    },
    GTM: {
      obs: this.GTM,
      factory: People.Create,
    },
    APM: {
      obs: this.APM,
      factory: People.Create,
    },
    COR: {
      obs: this.COR,
      factory: People.Create,
    },
    DateStart: {
      set: this.DateStart.set,
      get: this.DateStart.get,
    },
    DateEnd: {
      set: this.DateEnd.set,
      get: this.DateEnd.get,
    },
    Hours: this.Hours,
    ContractorSupplement: {
      get: () => this.ContractorSupplement.entity,
      set: this.ContractorSupplement.set,
    },
  };

  validationErrors = ko.pureComputed(() => {
    const result = [];
    // result.push({ description: "no stage set" });
    return result;
  });
}

export class ContractorSupplement {
  constructor(params) {
    registerServiceTypeComponent("view-contractor-supplement", "ch_overtime");
    registerServiceTypeComponent("edit-contractor-supplement", "ch_overtime");
  }
  ObservableID = ko.observable();
  get ID() {
    return this.ObservableID();
  }
  set ID(val) {
    return this.ObservableID(val);
  }

  Title = "";

  TaskOrderNumber = ko.observable();
  RequisitionNumber = ko.observable();
  LaborCategory = ko.observable();
  ContractorType = ko.observable();
  Contractor = ko.observable();

  FieldMap = {
    ID: this.ID,
    TaskOrderNumber: this.TaskOrderNumber,
    RequisitionNumber: this.RequisitionNumber,
    LaborCategory: this.LaborCategory,
    ContractorType: this.ContractorType,
    Contractor: {
      obs: this.Contractor,
      factory: People.Create,
    },
  };

  IsValid = ko.pureComputed(() => {
    return (
      this.ContractorType() &&
      this.LaborCategory() &&
      this.RequisitionNumber() &&
      this.TaskOrderNumber()
    );
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "TaskOrderNumber",
      "LaborCategory",
      "ContractorType",
      "Request",
      "Contractor",
    ],
    APMUpdate: ["TaskOrderNumber", "LaborCategory", "ContractorType"],
  };

  static ListDef = {
    name: "st_ch_overtime_supplement",
    title: "st_ch_overtime_supplement",
    fields: this.Views.All,
  };

  ContractorTypeOptsArr = ["SCA", "Non-SCA"];
}
