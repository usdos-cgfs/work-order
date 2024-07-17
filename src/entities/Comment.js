export class Comment {
  constructor() {}

  static Views = {
    All: [
      "ID",
      "Title",
      "Comment",
      "NotificationSent",
      "Author",
      "IsActive",
      "Created",
    ],
  };

  static ListDef = {
    name: "Comments",
    title: "Comments",
    fields: this.Views.All,
  };
}
