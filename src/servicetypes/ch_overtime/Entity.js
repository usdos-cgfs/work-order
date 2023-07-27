import { People } from "../../entities/People.js";
import PeopleField from "../../fields/PeopleField.js";
import TextField from "../../fields/TextField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import { requestOrgStore } from "../../entities/RequestOrg.js";

import ApplicationDbContext from "../../infrastructure/ApplicationDbContext.js";
import { permissions } from "../../infrastructure/Authorization.js";
import ContractorSupplement from "../contractor_supplement/ContractorSupplement.js";

import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

import { registerServiceTypeViewComponents } from "../../common/KnockoutExtensions.js";

export default class CH_Overtime extends ConstrainedEntity {
  constructor(request) {
    super(request);
    this.Request = request;
    this.supplementSet = ApplicationDbContext.Set(ContractorSupplement);

    registerServiceTypeViewComponents({
      uid: "contractor_supplement",
      components: this.ContractorSupplement.components,
    });
  }

  RequestSubmitted = ko.pureComputed(() => this.Request.Pipeline.Stage());

  ID;

  GovManager = new PeopleField({
    displayName: "Gov Manager",
    isRequired: true,
  });
  GTM = new PeopleField({
    displayName: "GTM",
    isRequired: true,
    Visible: this.RequestSubmitted,
  });
  APM = new PeopleField({
    displayName: "APM",
    isRequired: true,
    Visible: this.RequestSubmitted,
  });
  COR = new PeopleField({
    displayName: "COR",
    isRequired: true,
    Visible: this.RequestSubmitted,
  });

  ContractorSupplement = {
    IsLoading: ko.observable(),
    entity: ko.observable(),
    components: {
      View: "svc-view-" + this.UID,
      Edit: "svc-edit-" + this.UID,
      New: "svc-edit-" + this.UID,
    },
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
    FullName: new PeopleField({
      displayName: "Contractor",
      isRequired: true,
    }),
    ManagerDept: this.GovManager,
    GTM: this.GTM,
    APM: this.APM,
    COR: this.COR,
    DateStart: new DateField({
      displayName: "Start Date",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    DateEnd: new DateField({
      displayName: "End Date (Within Month Range)",
      type: dateFieldTypes.date,
      isRequired: true,
    }),
    Hours: new TextField({
      displayName: "Overtime Hours (Not to Exceed)",
      isRequired: true,
      attr: { type: "number" },
    }),
    // ContractorSupplement: {
    //   get: this.ContractorSupplement.entity,
    //   set: this.ContractorSupplement.set,
    //   Visible: false,
    // },
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
      "Request",
    ],
  };
  static ListDef = {
    name: "st_ch_overtime",
    title: "st_ch_overtime",
    isServiceType: true,
    fields: CH_Overtime.Views.All,
  };
}
