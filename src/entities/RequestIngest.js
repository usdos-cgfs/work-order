import { TextAreaField, TextField } from "../fields/index.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";

export class RequestIngest extends ConstrainedEntity {
  From = new TextField({
    displayName: "From",
  });

  CC = new TextField({
    displayName: "CC",
  });

  Title = new TextField({
    displayName: "Subject",
  });

  Body = new TextAreaField({
    displayName: "Body",
  });

  FieldMap = {
    From: this.From,
    CC: this.CC,
    Title: this.Title,
    Body: this.Body,
  };

  static Views = {
    All: ["ID", "Title", "From", "CC", "Subject", "Body"],
  };

  static ListDef = {
    name: "RequestIngest",
    title: "RequestIngest",
    fields: RequestIngest.Views.All,
  };
}
