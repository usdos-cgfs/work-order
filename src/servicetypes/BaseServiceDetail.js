import { RequestEntity } from "../entities/Request.js";
import LookupField from "../fields/LookupField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";

export default class BaseServiceDetail extends ConstrainedEntity {
  constructor({ ID, Title, Request }) {
    super({ ID, Title });
    if (Request) this.Request.Value(Request);
  }

  Request = new LookupField({
    displayName: "Request",
    type: RequestEntity,
    isRequired: true,
    Visible: ko.observable(false),
  });

  FieldMap = {
    ...this.FieldMap,
    Request: this.Request,
  };
}
