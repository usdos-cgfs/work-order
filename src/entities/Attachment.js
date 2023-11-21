export class Attachment {
  constructor() {}

  static Views = {
    // All: ["Title", "IsActive"],
    All: [
      "ID",
      "Title",
      "IsActive",
      "Request",
      "FileLeafRef",
      "FileRef",
      "Author",
      "Created",
    ],
  };

  static ListDef = {
    name: "Attachments",
    title: "Attachments",
    fields: this.Views.All,
    isLib: true,
  };
}
