import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "blob-view",
  edit: "blob-edit",
};

registerFieldComponent("blob", components);

export default class BlobField extends BaseField {
  constructor(params) {
    super(params);
    this.entity = params.entity;
    this.NewItem(new this.entity());
  }

  Value = ko.observableArray();
  get = () => JSON.stringify(this.Value());
  set = (val) => this.Value(JSON.parse(val));

  // use purecomputed for memoization, fields shouldn't change
  Cols = ko.pureComputed(() => {
    const newEntity = new this.entity();

    return newEntity.FormFields();
  });

  ColKeys = ko.pureComputed(() => new this.entity()?.FormFieldKeys());

  NewItem = ko.observable();

  submit = () => {
    const errors = this.NewItem()?.validate();
    if (errors.length) return;

    const newItemBlob = this.NewItem().toJSONBlob();
    newItemBlob.identifier = new Date().getTime();

    this.Value.push(newItemBlob);
    this.NewItem(new this.entity());
  };

  remove = (item) => this.Value.remove(item);

  components = components;
}
