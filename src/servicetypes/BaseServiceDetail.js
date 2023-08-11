import { RequestEntity } from "../entities/Request.js";
import LookupField from "../fields/LookupField.js";
import ConstrainedEntity from "../primitives/ConstrainedEntity.js";

export default class BaseServiceDetail extends ConstrainedEntity {
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
