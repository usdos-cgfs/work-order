import { DateField, SelectField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class DVCSetup extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    DateOfDVC: new DateField({
      displayName: "Date of DVC",
      isRequired: true,
    }),
    Location: new TextField({
      displayName: "Location",
      isRequired: true,
    }),
    Duration: new TextField({
      displayName: "Duration",
      isRequired: true,
    }),
    FarEndPOC: new TextField({
      displayName: "Far End POC",
      isRequired: true,
    }),
    ConnectionType: new SelectField({
      displayName: "Connection Type",
      options: ["OpenNet", "ISDN", "IP"],
      isRequired: true,
    }),
    CallType: new SelectField({
      displayName: "Call Type",
      options: ["Incoming", "Outgoing"],
      isRequired: true,
    }),
    DVCDialInNum: new TextField({
      displayName: "DVC Dial-in Number",
      isRequired: true,
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "DateOfDVC",
      "Location",
      "Duration",
      "FarEndPOC",
      "ConnectionType",
      "CallType",
      "DVCDialInNum",
    ],
  };

  static ListDef = {
    name: "st_dvc_setup",
    title: "st_dvc_setup",
    fields: DVCSetup.Views.All,
  };

  static uid = "dvc_setup";
}
