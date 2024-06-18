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
        "CGFS Offices",
        "DOS Offices in Charleston",
        "Both (CGFS and DOS Offices)",
      ],
      isRequired: true,
    }),
    NoticeDates: new TextAreaField({
      displayName: "Notification Dates",
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
