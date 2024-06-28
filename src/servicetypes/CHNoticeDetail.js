import { SelectField, TextAreaField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Notice extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    DistributionGroup: new SelectField({
      displayName: "Distribution Group",
      options: [
        "All CGFS CHS [Direct hires/contractors]",
        "All CHS Bureaus + Passport Center [Direct hires/contractors]",
        "GS 15 managing director distro list",
        "Supervisors CHS",
      ],
      isRequired: true,
    }),
    NoticeDates: new TextAreaField({
      displayName: "Notification Dates",
      instructions: "*Please include reminder dates.",
      isRequired: true,
    }),
  };

  static Views = {
    All: ["ID", "Title", "DistributionGroup", "NoticeDates"],
  };

  static ListDef = {
    name: "st_ch_notice",
    title: "st_ch_notice",
    fields: CH_Notice.Views.All,
  };

  static uid = "ch_notice";
}
