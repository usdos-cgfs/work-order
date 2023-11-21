export class Notification {
  constructor() {}

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
