import { SelectField, TextField } from "../../fields/index.js";

import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CashierOperationsRequest extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  Subcategory = new SelectField({
    displayName: "Subcategory",
    options: [
      "Annual Cash Waivers",
      "Class B Cashiering",
      "Occasional Money Holders",
      "One-Time Cash Waivers",
      "United States Treasury Checks",
    ],
    isRequired: true,
  });

  MRN = new TextField({
    displayName: "MRN",
  });

  /* A Service Type must define a fieldmap: 
    Each key corresponds to the SP Column system name
    Each Value should be a predefined field, or should 
    expose a get() and set() function that will be used to
    write and read the value from SharePoint. */
  FieldMap = {
    ...this.FieldMap,
    Subcategory: this.Subcategory,
    MRN: this.MRN,
  };

  fromEmail = (emailContent) => fromEmail(this, emailContent);
  /* Optional views when querying the EntitySet. 
    By default, all declared columns are used.
    When a view is passed, only the specified columns are loaded. */
  static Views = {
    All: ["ID", "Title", "Subcategory"],
  };

  static ListDef = {
    name: "st_fp_cash_mgmt",
    title: "st_fp_cash_mgmt",
    fields: CashierOperationsRequest.Views.All,
  };
}

function fromEmail(serviceType, emailContent) {
  serviceType.FieldMap.Subcategory.set("Annual Cash Waivers");

  const d = document.createElement("div");
  d.innerHTML = emailContent;

  const trs = d.querySelectorAll("tr");

  for (const tr of trs) {
    if (!tr.innerText?.includes("MRN:")) continue;
    console.log(tr);
    const td = tr.querySelector("td:nth-child(2) a");
    const mrnValue = td.innerText;
    serviceType.FieldMap.MRN.set(mrnValue);
  }

  // emailContent;
}
