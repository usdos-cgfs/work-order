import { ConstrainedEntityEditModule } from "../../components/index.js";
import {
  DateField,
  PeopleField,
  SelectField,
  TextField,
  dateFieldTypes,
} from "../../fields/index.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import { defaultComponents } from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";
import { fiscalIrregEditTemplate } from "./views/Edit.js";

const components = {
  ...defaultComponents,
  edit: "svc-fiscal-irreg-edit",
};

class FiscalIrregularitiesEditModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }
  static name = components.edit;
  static template = fiscalIrregEditTemplate;
}

registerComponentFromConstructor(FiscalIrregularitiesEditModule);

export default class FiscalIrregularities extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  CaseNumber = new TextField({
    displayName: "Case Number",
    isRequired: false,
  });

  PostLocation = new TextField({
    displayName: "Post Location",
    isRequired: true,
  });

  PointOfContact = new PeopleField({
    displayName: "Point(s) of Contact",
    isRequired: true,
    multiple: true,
  });

  CableMRN = new TextField({
    displayName: "Cable MRN",
    isRequired: false,
  });

  CableDate = new DateField({
    displayName: "Cable Date",
    type: dateFieldTypes.date,
    isRequired: false,
  });

  USDValue = new TextField({
    displayName: "US Dollar Value",
    isRequired: true,
    attr: { type: "number", min: "0" },
  });

  FIType = new SelectField({
    displayName: "Type of Irregularity",
    options: ["Shortage", "Overage"],
    isRequired: true,
  });

  ShowShortageDocs = ko.pureComputed(() => {
    return this.USDValue.Value() && this.FIType.Value() == "Shortage";
  });

  FieldMap = {
    ...this.FieldMap,
    CaseNumber: this.CaseNumber,
    PostLocation: this.PostLocation,
    PointOfContact: this.PointOfContact,
    CableMRN: this.CableMRN,
    CableDate: this.CableDate,
    USDValue: this.USDValue,
    FIType: this.FIType,
  };

  components = components;
}
