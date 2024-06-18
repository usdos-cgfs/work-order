import { TextField, SelectField } from "../../fields/index.js";

import { defaultComponents } from "../../primitives/ConstrainedEntity.js";

import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";
import { currentUser } from "../../infrastructure/Authorization.js";

import { requestOrgStore } from "../../entities/RequestOrg.js";
import { serviceTypeStore } from "../../entities/ServiceType.js";
import { RequestEntity } from "../../entities/Request.js";
import BaseServiceDetail from "../BaseServiceDetail.js";
import { ConstrainedEntityViewModule } from "../../components/index.js";
import { itSoftwareViewTemplate } from "./views/View.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";

const components = {
  ...defaultComponents,
  view: "svc-it_software-view",
};

class ITSoftwareViewModule extends ConstrainedEntityViewModule {
  constructor(params) {
    super(params);
  }

  static name = components.view;
  static template = itSoftwareViewTemplate;
}

registerComponentFromConstructor(ITSoftwareViewModule);

export default class ITSoftware extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  ShowCreateProcurementButton = ko.pureComputed(() => {
    const itOrg = requestOrgStore().find((org) => org.Title == "CGFS/EX/IT");
    return itOrg && currentUser()?.isInRequestOrg(itOrg);
  });

  createProcurement = async () => {
    // 1. Generate the description of the new request
    let procurementDescription = "<ul>";
    Object.values(this.FieldMap).forEach((field) => {
      if (field) {
        procurementDescription += `<li>${
          field.displayName
        }: ${field.toString()}</li>`;
      }
    });
    procurementDescription += "</ul>";

    // 2. Create a new request of the procurement
    const procurementServiceTypeDef = serviceTypeStore().find(
      (service) => service.UID == "procurement"
    );

    const newRequest = new RequestEntity({
      ServiceType: procurementServiceTypeDef,
    });

    // 3. Populate fields
    newRequest.FieldMap.RequestDescription.set(procurementDescription);
    newRequest.FieldMap.RequestingOffice.set(
      this.Request.FieldMap.RequestingOffice.get()
    );

    // 4. Copy files
    const sourcePath = this.Request.getRelativeFolderPath();
    const targetPath = await newRequest.Attachments.createFolder();

    const _context = getAppContext();
    try {
      await _context.Attachments.CopyFolderContents(sourcePath, targetPath);
      newRequest.Attachments.refresh();
    } catch (e) {
      console.error("Error copying files: ", e);
    }
    // 5. View Request
    window.WorkOrder.App.NewRequest({ request: newRequest });
  };

  CostThreshold = ko.pureComputed(
    () => parseInt(this.FieldMap.Cost.Value()) > 500
  );

  FieldMap = {
    ...this.FieldMap,
    Name: new TextField({
      displayName: "Software Name",
      isRequired: true,
    }),
    Quantity: new TextField({
      displayName: "Quantity",
      isRequired: true,
    }),
    POCName: new TextField({
      displayName: "POC",
      isRequired: true,
    }),
    Cost: new TextField({
      displayName: "Cost (USD)",
      isRequired: true,
    }),
    RequestType: new SelectField({
      displayName: "Request Type",
      options: ["New", "Maintenance Renewal"],
      isRequired: true,
    }),
    PurchaseFrequency: new SelectField({
      displayName: "Purchase Frequency",
      options: ["One Time", "Recurring"],
      isRequired: this.CostThreshold,
    }),
    ApprovedPurchase: new SelectField({
      displayName: "Approved Purchase",
      options: ["Yes", "No"],
      isRequired: this.CostThreshold,
    }),
    FundingSource: new SelectField({
      displayName: "Funding Source",
      options: ["Project", "Contract", "Other"],
      isRequired: this.CostThreshold,
    }),
  };

  components = components;
  static Views = {
    All: ["ID", "Title", "Request"],
  };

  static ListDef = {
    name: "st_it_software",
    title: "st_it_software",
    fields: ITSoftware.Views.All,
  };
}
