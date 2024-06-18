import {
  BlobField,
  DateField,
  dateFieldTypes,
  SelectField,
  TextAreaField,
} from "../fields/index.js";

import { ConstrainedEntity } from "../primitives/index.js";
import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Conference extends BaseServiceDetail {
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

  static uid = "ch_conference";
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
