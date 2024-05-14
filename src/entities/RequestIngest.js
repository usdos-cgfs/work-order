import { TextAreaField, TextField } from "../fields/index.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";

export class RequestIngest extends ConstrainedEntity {
  constructor({ ID, Title }) {
    super();
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  From = new TextField({
    displayName: "From",
  });

  To = new TextField({
    displayName: "To",
  });

  CC = new TextField({
    displayName: "CC",
  });

  Title = new TextField({
    displayName: "Subject",
  });

  Body = new TextAreaField({
    displayName: "Body",
    isRichText: true,
  });

  FieldMap = {
    From: this.From,
    CC: this.CC,
    Title: this.Title,
    Body: this.Body,
  };

  getStagedAttachmentsFolderPath = () => "Staged/" + this.ID;

  static Views = {
    All: ["ID", "Title", "From", "To", "CC", "Body"],
  };

  static ListDef = {
    name: "RequestIngest",
    title: "RequestIngest",
    fields: RequestIngest.Views.All,
  };
}
