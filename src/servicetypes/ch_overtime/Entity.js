import { People } from "../../entities/People.js";
import PeopleField from "../../fields/PeopleField.js";
import TextField from "../../fields/TextField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import { requestOrgStore } from "../../entities/RequestOrg.js";

import ApplicationDbContext from "../../infrastructure/ApplicationDbContext.js";
import {
  currentUser,
  permissions,
} from "../../infrastructure/Authorization.js";
import ContractorSupplement from "../contractor_supplement/Entity.js";

import ConstrainedEntity, {
  defaultComponents,
} from "../../primitives/ConstrainedEntity.js";

import BaseServiceDetail from "../BaseServiceDetail.js";

import {
  registerServiceTypeViewComponents,
  registerServiceTypeActionComponent,
} from "../../infrastructure/RegisterComponents.js";

import LookupField from "../../fields/LookupField.js";

const components = {
  view: "svc-ch_overtime-view",
  edit: "svc-ch_overtime-edit",
  new: "svc-ch_overtime-edit",
};

registerServiceTypeViewComponents({ uid: "ch_overtime", components });
registerServiceTypeActionComponent({
  uid: "ch_overtime",
  componentName: "APMActions",
});
registerServiceTypeActionComponent({
  uid: "ch_overtime",
  componentName: "GovManagerActions",
});

export default class CH_Overtime extends ConstrainedEntity {
  constructor(requestContext) {
    super(requestContext);
    // if (requestContext.Request) this.Request = requestContext.Request;
  }

  setRequestContext = async (request) => {
    this.Request = request;
    await this.ContractorSupplement.findByRequest(this.Request);
  };

  RequestSubmitted = ko.pureComputed(() => this.Request?.Pipeline?.Stage());

  RequestStage2 = ko.pureComputed(
    () => this.Request?.Pipeline?.Stage()?.Step == 2
  );

  Contractor = new PeopleField({
    displayName: "Contractor",
    isRequired: true,
  });
  GovManager = new PeopleField({
    displayName: "Gov Manager",
    isRequired: true,
  });
  GTM = new PeopleField({
    displayName: "GTM",
    isRequired: this.RequestStage2,
    Visible: this.RequestSubmitted,
  });
  APM = new PeopleField({
    displayName: "APM",
    isRequired: this.RequestSubmitted,
    Visible: this.RequestSubmitted,
  });
  COR = new PeopleField({
    displayName: "COR",
    isRequired: this.RequestStage2,
    Visible: this.RequestSubmitted,
  });

  ContractorSupplementField = new LookupField({
    displayName: "Contractor Supplement",
    Visible: ko.observable(false),
    type: ContractorSupplement,
    lookupCol: "LaborCategory",
    isRequired: false,
    multiple: false,
  });

  ContractorSupplement = {
    set: ApplicationDbContext.Set(ContractorSupplement),
    findByRequest: async (request) => {
      const contractorSupplementResult =
        await this.ContractorSupplement.set.FindByColumnValue(
          [{ column: "Title", op: "eq", value: request.Title }],
          {},
          {},
          ContractorSupplement.Views.All,
          false
        );

      const supplement = contractorSupplementResult?.results?.pop();
      if (!supplement) {
        return;
      }

      this.ContractorSupplementField.Value(supplement);
    },
    update: async (fields = null) => {
      // TODO: update permissions
      await this.ContractorSupplement.set.UpdateEntity(
        this.ContractorSupplementField.Value(),
        fields
      );
    },
    VisibleOnForm: ko.pureComputed(() => {}),
    create: async (
      contractorSupplement = this.ContractorSupplementField.Value()
    ) => {
      // this.ContractorSupplement.entity.Request = this.Request;
      const relFolderPath = this.Request.getRelativeFolderPath();
      const folderPerms = this.ContractorSupplement.getPermissions();
      //Create the folder
      const listFolderId = await this.ContractorSupplement.set.UpsertFolderPath(
        relFolderPath
      );

      // Break the Permissions
      await this.ContractorSupplement.set.SetFolderPermissions(
        relFolderPath,
        folderPerms
      );

      contractorSupplement.Contractor.set(this.Contractor.get());
      // Create the item
      await this.ContractorSupplement.set.AddEntity(
        contractorSupplement,
        relFolderPath,
        this.Request
      );
      this.ContractorSupplementField.Value(contractorSupplement);
      // await ApplicationDbContext.Set(CH_Overtime).UpdateEntity(this, [
      //   "ContractorSupplement",
      // ]);
    },
    getPermissions: () => {
      // APM, GTM, Budget, PA, and COR have access
      const budgetGroup = requestOrgStore().find(
        (org) => org.Title.toUpperCase() == "CGFS/EX/BUDGET"
      )?.UserGroup;
      const user = currentUser();

      return [
        [user, permissions.RestrictedContribute],
        [this.APM.get(), permissions.RestrictedContribute],
        [this.GTM.get(), permissions.RestrictedContribute],
        [this.COR.get(), permissions.RestrictedContribute],
        [budgetGroup, permissions.RestrictedContribute],
      ];
    },
  };

  supplementComponents = defaultComponents;

  FieldMap = {
    FullName: this.Contractor,
    GovManager: this.GovManager,
    GTM: this.GTM,
    APM: this.APM,
    COR: this.COR,
    DateStart: new DateField({
      displayName: "Start Date",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    DateEnd: new DateField({
      displayName: "End Date (Within Month Range)",
      type: dateFieldTypes.date,
      isRequired: false,
    }),
    Hours: new TextField({
      displayName: "Overtime Hours (Not to Exceed)",
      isRequired: false,
      attr: { type: "number" },
    }),
    // ContractorSupplement: this.ContractorSupplementField,
  };

  components = components;

  static Views = {
    All: [
      "ID",
      "Title",
      "FullName",
      "GovManager",
      "GTM",
      "APM",
      "COR",
      "DateStart",
      "DateEnd",
      "Hours",
      "ContractorSupplement",
      "Request",
    ],
    APMUpdate: ["COR", "GTM"],
  };

  static ListDef = {
    name: "st_ch_overtime",
    title: "st_ch_overtime",
    isServiceType: true,
    fields: CH_Overtime.Views.All,
  };

  // static Set = ApplicationDbContext.Set(CH_Overtime);
}
