import {
  TextAreaField,
  TextField,
  PeopleField,
  DateField,
  LookupField,
  SelectField,
} from "../fields/index.js";
import { currentUser } from "../infrastructure/Authorization.js";
import { RequestEntity } from "./Request.js";

export class Notification {
  constructor() {}

  static Create({ To = "", CC = "", Title = "", Body = "", Request = null }) {
    const notification = new Notification();
    notification.ToString.Value(To);
    notification.CCString.Value(CC);
    notification.Title.Value(Title);
    notification.Body.Value(Body);
    notification.Request.Value(Request);

    return notification;
  }

  Title = new TextField({
    displayName: "Subject",
    isRequired: true,
  });

  ToString = new TextField({
    displayName: "To",
    isRequired: true,
    instructions:
      "Use ; to separate emails (e.g. smithj@state.gov;carls@state.gov;)",
  });

  To = new PeopleField({
    displayName: "To (people)",
    multiple: true,
  });

  CCString = new TextField({
    displayName: "CC",
    isRequired: true,
    instructions:
      "Use ; to separate emails (e.g. smithj@state.gov;carls@state.gov;)",
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

  sendAsOpts = ko.pureComputed(() => {
    const user = ko.unwrap(currentUser);
    if (!user) return [];
    const opts = user
      ?.ActionOffices()
      .map((ao) => ao.PreferredEmail)
      .filter((email) => email);

    // if (user.Email) opts.unshift(user.Email);
    return opts ?? [];
  });

  SendAs = new SelectField({
    displayName: "Send From (optional)",
    options: this.sendAsOpts,
    instructions: "*only pre-approved mailboxes are supported.",
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
    SendAs: this.SendAs,
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
      "FileRef",
    ],
  };

  static ListDef = {
    name: "Notifications",
    title: "Notifications",
    fields: this.Views.All,
  };
}
