import { SelectField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CashMgmtRequest extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
  FieldMap = {
    ...this.FieldMap,
    Subcategory: new SelectField({
      displayName: "Subcategory",
      options: [
        "Accommodation Exchange",
        "Annual Cash Waivers",
        "Debt Collection",
        "Fiscal Irregularities",
        "One-Time Cash Waivers",
        "Proceeds of Sale",
        "Suspense Deposits Abroad",
      ],
      isRequired: true,
    }),
  };

  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title", "Subcategory"],
  };

  static ListDef = {
    name: "st_fp_cash_mgmt",
    title: "st_fp_cash_mgmt",
    fields: CashMgmtRequest.Views.All,
  };

  static uid = "fp_cash_mgmt";
}
