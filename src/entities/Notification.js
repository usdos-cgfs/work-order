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
    name: "WorkOrderEmails",
    title: "WorkOrderEmails",
    fields: this.Views.All,
  };
}
