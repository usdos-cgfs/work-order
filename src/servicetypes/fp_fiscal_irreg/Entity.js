import {
  DateField,
  PeopleField,
  SelectField,
  TextField,
  dateFieldTypes,
} from "../../fields/index.js";
import { registerServiceTypeViewComponents } from "../../infrastructure/RegisterComponents.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

const components = {
  view: "svc-fiscal-irreg-view",
  edit: "svc-fiscal-irreg-edit",
  new: "svc-fiscal-irreg-edit",
};

registerServiceTypeViewComponents({ uid: "fp_fiscal_irreg", components });

export default class FiscalIrregularities extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  PostLocation = new TextField({
    displayName: "Post Location",
    isRequired: true,
  });

  PointOfContact = new PeopleField({
    displayName: "Point of Contacts",
    isRequired: true,
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
    PostLocation: this.PostLocation,
    PointOfContact: this.PointOfContact,
    CableMRN: this.CableMRN,
    CableDate: this.CableDate,
    USDValue: this.USDValue,
    FIType: this.FIType,
  };

  components = components;
}
