import TextField from "../../fields/TextField.js";
import PeopleField from "../../fields/PeopleField.js";
import SelectField from "../../fields/SelectField.js";
import DateField from "../../fields/DateField.js";
import TextAreaField from "../../fields/TextAreaField.js";
import CheckboxField from "../../fields/CheckboxField.js";
import ConstrainedEntity from "../../primitives/ConstrainedEntity.js";
import BaseServiceDetail from "../BaseServiceDetail.js";

export default class CH_Transport extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    InvoiceNum: new TextField({
      displayName: "Invoice Num",
    }),
    InvoiceAmount: new TextField({
      displayName: "Invoice Amount",
    }),
    InvoiceDate: new DateField({ displayName: "Invoice Date" }),
    InvoiceReceivedDate: new DateField({
      displayName: "Invoice Received Date",
    }),
    Vendor: new TextField({
      displayName: "Vendor",
    }),
  };

  static Views = {
    All: [
      "ID",
      "Title",
      "InvoiceNum",
      "InvoiceAmount",
      "InvoiceDate",
      "InvoiceReceivedDate",
      "Vendor",
    ],
  };

  static ListDef = {
    name: "st_ch_transport",
    title: "st_ch_transport",
    fields: CH_Transport.Views.All,
  };
}
