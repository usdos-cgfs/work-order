import { DateField, TextField } from "../fields/index.js";

import { BaseServiceDetail } from "./BaseServiceDetail.js";

export class CH_Transport extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  FieldMap = {
    ...this.FieldMap,
    InvoiceNum: new TextField({
      displayName: "Invoice Num",
      isRequired: true,
    }),
    InvoiceAmount: new TextField({
      displayName: "Invoice Amount",
      isRequired: true,
    }),
    InvoiceDate: new DateField({
      displayName: "Invoice Date",
      isRequired: true,
    }),
    InvoiceReceivedDate: new DateField({
      displayName: "Invoice Received Date",
      isRequired: true,
    }),
    Vendor: new TextField({
      displayName: "Vendor",
      isRequired: true,
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

  static uid = "ch_transport";
}
