import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";
import {
  mapObjectToEntity,
  mapEntityToObject,
} from "../infrastructure/ApplicationDbContext.js";

const components = {
  view: "blob-view",
  edit: "blob-edit",
};

registerFieldComponent("blob", components);

export default class BlobField extends BaseField {
  constructor(params) {
    super(params);
    this.entityType = params.entityType;
    this.multiple = params.multiple;
    this.entityType.subscribe(this.updateEntityTypeHandler);
    this.updateEntityTypeHandler(this.entityType());
  }

  toString = ko.pureComputed(() => `${this.Value()?.length ?? "0"} items`);

  ViewItems = ko.pureComputed(() => {
    if (!this.entityType()) return [];

    return this.Value().map((item) => {
      const newEntity = new this.entityConstructor();
      mapObjectToEntity(item, newEntity);
      return newEntity;
    });
  });

  ViewItem = ko.pureComputed(() => {
    if (!this.entityType()) return;
    // const newEntity = new this.entityConstructor();
    mapObjectToEntity(this.Value(), this.TypedValue());
    return this.TypedValue();
  });
  //Value = ko.observableArray([]);

  TypedValues = ko.observableArray();
  TypedValue = ko.observable();

  RawValue = ko.observable();

  get = () => {
    if (this.TypedValue())
      return JSON.stringify(mapEntityToObject(this.TypedValue()));

    return JSON.stringify(this.Value());
  };

  set = (val) => {
    this.Value(JSON.parse(val));
    this.RawValue(JSON.parse(val));
    // if (this.multiple) {
    //   const newEntities = JSON.parse(val).map((item) =>
    //     mapObjectToEntity(item, new this.entityConstructor())
    //   );
    //   this.Value(newEntities);
    //   return;
    // }

    //mapObjectToEntity(JSON.parse(val), this.TypedValue());
  };

  get entityConstructor() {
    return ko.utils.unwrapObservable(this.entityType);
  }
  // use purecomputed for memoization, fields shouldn't change
  Cols = ko.pureComputed(() => {
    if (!this.entityType()) return [];

    const newEntity = new this.entityConstructor();

    return newEntity.FormFields();
  });

  ColKeys = ko.pureComputed(() =>
    new this.entityConstructor()?.FormFieldKeys()
  );

  NewItem = ko.observable();

  submit = () => {
    const errors = this.NewItem()?.validate();
    if (errors.length) return;

    const newItemBlob = this.NewItem().toJSONBlob();
    newItemBlob.identifier = new Date().getTime();

    this.Value().push(newItemBlob);
    this.NewItem(new this.entityConstructor());
  };

  remove = (item) => this.Value.remove(item);

  updateEntityTypeHandler = (newType) => {
    if (!newType) return;
    if (this.multiple) {
      const typedItems = this.RawValue()?.map((item) => {
        const newEntity = new this.entityConstructor();
        mapObjectToEntity(item, newEntity);
        return newEntity;
      });
      this.TypedValues(typedItems);
      this.NewItem(new this.entityConstructor());
      return;
    }
    this.TypedValue(new this.entityConstructor());
    mapObjectToEntity(this.Value(), this.TypedValue());
  };

  components = components;
}
