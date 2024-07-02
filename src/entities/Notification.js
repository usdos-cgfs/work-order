import {
  TextAreaField,
  TextField,
  PeopleField,
  DateField,
  LookupField,
} from "../fields/index.js";
import { RequestEntity } from "./Request.js";

export class Notification {
  constructor({ Title, Body, Request }) {
    this.Title.Value(Title);
    this.Body.Value(Body);
    this.Request.Value(Request);
  }

  Title = new TextField({
    displayName: "Subject",
    isRequired: true,
  });

  ToString = new TextField({
    displayName: "To",
    isRequired: true,
  });

  To = new PeopleField({
    displayName: "To (people)",
    multiple: true,
  });

  CCString = new TextField({
    displayName: "CC",
    isRequired: true,
  });

  CC = new PeopleField({
    displayName: "CC (people)",
    multiple: true,
  });

  BCCString = new TextField({
    displayName: "BCC",
    isRequired: false,
  });

  BCC = new PeopleField({
    displayName: "BCC (people)",
    multiple: true,
  });

  Body = new TextAreaField({
    displayName: "Body",
    isRichText: true,
  });

  Sent = new DateField({
    displayName: "Sent On",
  });

  Request = new LookupField({
    type: RequestEntity,
  });

  FieldMap = {
    Title: this.Title,
    ToString: this.ToString,
    To: this.To,
    CCString: this.CCString,
    CC: this.CC,
    BCCString: this.BCCString,
    BCC: this.BCC,
    Body: this.Body,
    Sent: this.Sent,
  };

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
