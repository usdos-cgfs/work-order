import {
  DateField,
  dateFieldTypes,
  LookupField,
  PeopleField,
  TextField,
} from "../../fields/index.js";

import { requestOrgStore } from "../../entities/RequestOrg.js";

import ApplicationDbContext, {
  getAppContext,
} from "../../infrastructure/ApplicationDbContext.js";
import {
  currentUser,
  permissions,
} from "../../infrastructure/Authorization.js";
import { ContractorSupplement } from "../ContractorSupplementDetail.js";

import { defaultComponents } from "../../primitives/defaultComponents.js";

import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";

import { chOvertimeViewTemplate } from "./views/View.js";
import { chOvertimeEditTemplate } from "./views/Edit.js";

import {
  ConstrainedEntityEditModule,
  ConstrainedEntityViewModule,
} from "../../components/index.js";
import { BaseServiceDetail } from "../BaseServiceDetail.js";
import { CH_OvertimeAPMActions } from "./components/APMActions.js";
import { CH_OvertimeGovManagerActions } from "./components/GovManagerActions.js";

const components = {
  view: "svc-ch_overtime-view",
  edit: "svc-ch_overtime-edit",
  new: "svc-ch_overtime-edit",
};

// Register action components
registerComponentFromConstructor(CH_OvertimeAPMActions);
registerComponentFromConstructor(CH_OvertimeGovManagerActions);

// It makes sense to keep these here, rather than moving them to the store
// since they are pretty service type/instance specific.
export const getApmOrg = ko.pureComputed(() => {
  return requestOrgStore().find(
    (org) => org.Title.toUpperCase() == "CGFS/APMS"
  );
});

export const getGtmOrg = ko.pureComputed(() =>
  requestOrgStore().find((org) => org.Title.toUpperCase() == "CGFS/GTMS")
);

export const getCorOrg = ko.pureComputed(() =>
  requestOrgStore().find((org) => org.Title.toUpperCase() == "CGFS/CORS")
);

class CH_OvertimeViewModule extends ConstrainedEntityViewModule {
  constructor(params) {
    super(params);
  }

  static name = components.view;
  static template = chOvertimeViewTemplate;
}

class CH_OvertimeEditModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }

  static name = components.edit;
  static template = chOvertimeEditTemplate;
}

registerComponentFromConstructor(CH_OvertimeEditModule);
registerComponentFromConstructor(CH_OvertimeViewModule);

export class CH_Overtime extends BaseServiceDetail {
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
    spGroupName: ko.pureComputed(() => {
      const gtmOrg = ko.unwrap(getGtmOrg);
      return gtmOrg?.UserGroup?.Title;
    }),
  });
  APM = new PeopleField({
    displayName: "APM",
    isRequired: this.RequestSubmitted,
    Visible: this.RequestSubmitted,
    spGroupName: ko.pureComputed(() => {
      const apmOrg = ko.unwrap(getApmOrg);

      return apmOrg?.UserGroup?.Title;
    }),
  });
  COR = new PeopleField({
    displayName: "COR",
    isRequired: this.RequestStage2,
    Visible: this.RequestSubmitted,
    spGroupName: ko.pureComputed(() => {
      const org = ko.unwrap(getCorOrg);

      return org?.UserGroup?.Title;
    }),
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
    set: getAppContext().Set(ContractorSupplement),
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

      const exGroup = requestOrgStore().find(
        (org) => org.Title.toUpperCase() == "CGFS/EX"
      )?.UserGroup;

      const corGroup = getCorOrg()?.UserGroup;

      const user = currentUser();

      return [
        [user, permissions.RestrictedContribute],
        [this.APM.get(), permissions.RestrictedContribute],
        [this.GTM.get(), permissions.RestrictedContribute],
        [this.COR.get(), permissions.RestrictedContribute],
        [budgetGroup, permissions.RestrictedContribute],
        [exGroup, permissions.RestrictedContribute],
        [corGroup, permissions.RestrictedContribute],
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

  static uid = "ch_overtime";
}
