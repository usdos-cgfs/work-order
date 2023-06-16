import SelectField from "../../fields/SelectField.js";
import TextAreaField from "../../fields/TextAreaField.js";

export default class Entity {
  constructor(request) {}

  FieldMap = {
    DistributionGroup: new SelectField({
      displayName: "Employee Type",
      options: [
        "CGFS Offices",
        "DOS Offices in Charleston",
        "Both (CGFS and DOS Offices)",
      ],
    }),
    NoticeDates: new TextAreaField({
      displayName: "Notification Dates",
    }),
  };

  static Views = {
    All: ["ID", "Title", "DistributionGroup", "NoticeDates"],
  };

  static ListDef = {
    name: "st_ch_notice",
    title: "st_ch_notice",
    fields: Entity.Views.All,
  };
}
