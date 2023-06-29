import SelectField from "../../fields/SelectField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    DistributionGroup: new SelectField({
      displayName: "Employee Type",
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
    fields: Entity.Views.All,
  };
}
