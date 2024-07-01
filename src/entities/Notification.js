import { TextAreaField, TextField } from "../fields/index.js";

export class Notification {
  constructor() {}

  Title = new TextField({
    displayName: "Subject",
    isRequired: true,
  });

  ToString = new TextField({
    displayName: "To",
    isRequired: true,
  });

  CCString = new TextField({
    displayName: "CC",
    isRequired: true,
  });

  Body = new TextAreaField({
    displayName: "Body",
    isRichText: true,
  });

  static Views = {
    All: [
      "ID",
      "Title",
      "To",
      "ToString",
      "CC",
      "CCString",
      "BCC",
      "Body",
      "Sent",
      "DateSent",
      "Request",
      "DateToSend",
    ],
  };

  static ListDef = {
    name: "Notifications",
    title: "Notifications",
    fields: this.Views.All,
  };
}
