export class Attachment {
  constructor() {}

  static Views = {
    // All: ["Title", "IsActive"],
    All: ["ID", "Title", "IsActive", "Request", "FileRef", "Author", "Created"],
  };

  static ListDef = {
    name: "WorkOrderDocuments",
    title: "Work Order Documents",
    fields: this.Views.All,
    isLib: true,
  };
}
