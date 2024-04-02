import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
import {
  mapObjectToEntity,
  mapEntityToObject,
} from "../infrastructure/ApplicationDbContext.js";

const components = {
  view: "blob-view",
  edit: "blob-edit",
  new: "blob-edit",
};

registerFieldComponent("blob", components);

export default class BlobField extends BaseField {
  constructor(params) {
    super(params);
    this.entityType = params.entityType;
    this.multiple = params.multiple;

    if (ko.isObservable(this.entityType)) {
      this.entityType.subscribe(this.updateEntityTypeHandler);
      // this.Value.subscribe(this.updateEntityTypeHandler);
    }
    this.updateEntityTypeHandler(ko.unwrap(this.entityType));
  }

  toString = ko.pureComputed(() => `${this.Value()?.length ?? "0"} items`);

  toJSON = ko.pureComputed(() => {
    if (!this.multiple) return this.TypedValue()?.toJSON();
    return this.TypedValues().map((value) => value.toJSON());
  });

  fromJSON = (input) => {
    if (!input) return;
    if (!this.multiple) {
      this.TypedValue()?.fromJSON(input);
      return;
    }
    this.TypedValues.removeAll();
    input.map((obj) => {
      const newEntity = new this.entityConstructor();
      newEntity.fromJSON(obj);
      this.TypedValues.push(newEntity);
    });
  };

  TypedValues = ko.observableArray();
  TypedValue = ko.observable();

  // Value = ko.pureComputed(() =>
  //   this.multiple ? this.TypedValues() : this.TypedValue()
  // );

  get = () => {
    return JSON.stringify(this.toJSON());
  };

  set = (val) => {
    if (window.DEBUG) console.log(val);
    if (val?.constructor == BlobField) {
      // this.fromJSON(val.toJSON());
      return;
    }
    this.fromJSON(JSON.parse(val));
  };

  get entityConstructor() {
    return ko.utils.unwrapObservable(this.entityType);
  }

  // use purecomputed for memoization, fields shouldn't change
  Cols = ko.pureComputed(() => {
    const entityType = ko.unwrap(this.entityType);
    if (!entityType) return [];

    const newEntity = new this.entityConstructor();

    return newEntity.FormFields();
  });

  // ColKeys = ko.pureComputed(() =>
  //   new this.entityConstructor()?.FormFieldKeys()
  // );

  NewItem = ko.observable();

  submit = () => {
    const errors = this.TypedValue()?.validate();
    if (errors.length) return;

    this.TypedValues.push(this.TypedValue());

    this.TypedValue(new this.entityConstructor());
  };

  add = (item) => this.TypedValues.push(item);
  remove = (item) => this.TypedValues.remove(item);

  updateEntityTypeHandler = (newType) => {
    if (!newType) return;

    this.TypedValue(new this.entityConstructor());
    this.fromJSON(this.Value());

    // this.applyValueToTypedValues();
  };

  applyValueToTypedValues = () => {
    if (!this.Value() || !this.TypedValue()) return;

    if (!this.multiple) {
      mapObjectToEntity(this.Value(), this.TypedValue());
      return;
    }

    const typedItems = this.Value()?.map((item) => {
      const newEntity = new this.entityConstructor();
      mapObjectToEntity(item, newEntity);
      return newEntity;
    });
    this.TypedValues(typedItems);
  };

  Errors = ko.pureComputed(() => {
    if (!this.Visible()) return [];
    // const isRequired = ko.unwrap(this.isRequired);
    const isRequired =
      typeof this.isRequired == "function"
        ? this.isRequired()
        : this.isRequired;
    if (!isRequired) return [];
    const currentValue = this.multiple ? this.TypedValues() : this.TypedValue();
    return currentValue
      ? []
      : [
          new ValidationError(
            "text-field",
            "required-field",
            (typeof this.displayName == "function"
              ? this.displayName()
              : this.displayName) + ` is required!`
          ),
        ];
  });

  components = components;
}
