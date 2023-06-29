import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";

export default class Entity extends ConstrainedEntity {
  constructor(params) {
    super(params);
  }

  FieldMap = {
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
    fields: Entity.Views.All,
  };
}
