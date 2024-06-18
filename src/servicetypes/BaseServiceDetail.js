import { ConstrainedEntity } from "../primitives/index.js";

export class BaseServiceDetail extends ConstrainedEntity {
  constructor(params) {
    super(params);
    if (params?.Request) this.Request = params.Request;
  }

  Request;

  FieldMap = {
    ...this.FieldMap,
    Request: this.Request,
  };
}
