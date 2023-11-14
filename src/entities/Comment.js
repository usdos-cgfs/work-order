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
    name: "Comment",
    title: "Comment",
    fields: this.Views.All,
  };
}
