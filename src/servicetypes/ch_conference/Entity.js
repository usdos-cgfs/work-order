import BlobField from "../../fields/BlobField.js";
import DateField, { dateFieldTypes } from "../../fields/DateField.js";
import SelectField from "../../fields/SelectField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Conference extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    ConferenceDates: new BlobField({
      displayName: "Conference Dates",
      entityType: ConferenceDate,
      multiple: true,
      width: 12,
      isRequired: true,
    }),
    AVNeeds: new TextAreaField({
      displayName: "A/V Needs",
      isRequired: true,
    }),
    ConferenceRoom: new SelectField({
      displayName: "Conference Room",
      options: [
        "Bldg. F Auditorium (Side A & B)",
        "Bldg. F Auditorium (Side A Only)",
        "Bldg. F Auditorium (Side B Only)",
        "Bldg. F Dining Rooms",
        "Bldg. C VTC Room (C128)",
        "Bldg. C Auditorium (C171)",
      ],
      isRequired: true,
    }),
  };
}

class ConferenceDate extends ConstrainedEntity {
  FieldMap = {
    StartDate: new DateField({
      displayName: "Start Date",
      type: dateFieldTypes.datetime,
      isRequired: true,
    }),
    EndDate: new DateField({
      displayName: "End Date",
      type: dateFieldTypes.datetime,
      isRequired: true,
    }),
  };
}
