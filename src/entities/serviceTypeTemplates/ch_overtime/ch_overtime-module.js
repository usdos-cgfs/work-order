import { People } from "../../../components/People.js";
import { DateField } from "../../../components/DateField.js";
import ApplicationDbContext from "../../../infrastructure/ApplicationDbContext.js";
import { requestOrgStore } from "../../RequestOrg.js";

import { permissions } from "../../../infrastructure/Authorization.js";

export default class CH_OverTime {
  constructor(request) {
    this.Request = request;
    this.supplementSet = ApplicationDbContext.Set(ContractorSupplement.ListDef);
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
    entity: new ContractorSupplement(),
    refresh: async () =>
      this.supplementSet.LoadEntityByRequestId(
        this.ContractorSupplement.entity,
        this.Request.ID
      ),
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

      // Create the item
      await this.supplementSet.AddEntity(
        this.ContractorSupplement.entity,
        relFolderPath,
        this.Request
      );
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
  };

  validationErrors = ko.pureComputed(() => {
    const result = [];
    // result.push({ description: "no stage set" });
    return result;
  });
}

export class ContractorSupplement {
  constructor() {}
  ID = ko.observable();
  TaskOrderNumber = ko.observable();
  RequisitionNumber = ko.observable();
  LaborCategory = ko.observable();
  ContractorType = ko.observable();

  FieldMap = {
    ID: this.ID,
    TaskOrderNumber: this.TaskOrderNumber,
    RequisitionNumber: this.RequisitionNumber,
    LaborCategory: this.LaborCategory,
    ContractorType: this.ContractorType,
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "TaskOrderNumber",
      "LaborCategory",
      "ContractorType",
      "Request",
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
