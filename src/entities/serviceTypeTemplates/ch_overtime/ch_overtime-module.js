import { People } from "../../../components/People.js";
import { DateField } from "../../../components/DateField.js";
import { requestOrgStore } from "../../RequestOrg.js";

import ApplicationDbContext from "../../../infrastructure/ApplicationDbContext.js";
import { permissions } from "../../../infrastructure/Authorization.js";

import { registerServiceTypeComponent } from "../../../common/KnockoutExtensions.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
    this.supplementSet = ApplicationDbContext.Set(ContractorSupplement);
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
    entity: ko.observable(),
    refresh: async () => {
      if (!this.ContractorSupplement.entity()?.ID) return;
      this.ContractorSupplement.IsLoading(true);
      await this.supplementSet.LoadEntity(this.ContractorSupplement.entity());
      this.ContractorSupplement.IsLoading(false);
    },
    set: async (entity) => {
      if (!entity?.ID) return;
      this.ContractorSupplement.entity(new ContractorSupplement());
      this.ContractorSupplement.entity().ID = entity.ID;
      //await this.supplementSet.LoadEntity(this.ContractorSupplement.entity);
      await this.ContractorSupplement.refresh();
    },
    update: async (fields = null) => {
      await this.supplementSet.UpdateEntity(
        this.ContractorSupplement.entity(),
        fields
      );
    },
    create: async (contractorSupplement) => {
      // this.ContractorSupplement.entity.Request = this.Request;
      const relFolderPath = this.Request.getRelativeFolderPath();
      const folderPerms = this.ContractorSupplement.getPermissions();
      //Create the folder
      const listFolderId = await this.supplementSet.UpsertFolderPath(
        relFolderPath
      );

      // Break the Permissions
      await this.supplementSet.SetFolderPermissions(relFolderPath, folderPerms);

      contractorSupplement.Contractor(this.Contractor());
      // Create the item
      await this.supplementSet.AddEntity(
        contractorSupplement,
        relFolderPath,
        this.Request
      );
      this.ContractorSupplement.entity(contractorSupplement);
      await this.Request.ServiceType.updateEntity(["ContractorSupplement"]);
    },
    getPermissions: () => {
      // APM, GTM, Budget, PA, and COR have access
      const budgetGroup = requestOrgStore().find(
        (org) => org.Title.toUpperCase() == "CGFS/EX/BUDGET"
      )?.UserGroup;

      return [
        [this.APM(), permissions.RestrictedContribute],
        [this.GTM(), permissions.RestrictedContribute],
        [this.COR(), permissions.RestrictedContribute],
        [budgetGroup, permissions.RestrictedContribute],
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
      get: this.ContractorSupplement.entity,
      set: this.ContractorSupplement.set,
    },
  };

  validationErrors = ko.pureComputed(() => {
    const result = [];
    // result.push({ description: "no stage set" });
    return result;
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "FullName",
      "ManagerDept",
      "GTM",
      "APM",
      "COR",
      "DateStart",
      "DateEnd",
      "Hours",
      "ContractorSupplement",
    ],
  };
  static ListDef = {
    name: "st_ch_overtime",
    title: "st_ch_overtime",
    fields: CH_OverTime.Views.All,
  };
}

export class ContractorSupplement {
  constructor(params) {
    registerServiceTypeComponent(
      "view-contractor-supplement",
      "contractor-supplement",
      "ch_overtime"
    );
    registerServiceTypeComponent(
      "edit-contractor-supplement",
      "contractor-supplement",
      "ch_overtime"
    );
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
