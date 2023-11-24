import ApplicationDbContext from "../infrastructure/ApplicationDbContext.js";
import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import BaseField from "./BaseField.js";

const components = {
  view: "lookup-view",
  edit: "lookup-edit",
  new: "lookup-edit",
};

registerFieldComponent("lookup", components);

export default class LookupField extends BaseField {
  constructor({
    displayName,
    type: entityType,
    isRequired = false,
    Visible,
    Options = null,
    optionsText = null,
    multiple = false,
    lookupCol = null,
  }) {
    super({ Visible, displayName, isRequired });
    // Support passing in options
    // if options are not passed, assume this is a search input
    Options ? (this.Options = Options) : (this.isSearch = true);

    this.multiple = multiple;
    this.Value = multiple ? ko.observableArray() : ko.observable();

    this.entityType = entityType;
    this.entitySet = ApplicationDbContext.Set(entityType);
    this.lookupCol = lookupCol ?? "Title";
    this.optionsText = optionsText ?? ((item) => item[this.lookupCol]);
  }

  isSearch = false;

  Options = ko.observableArray();
  IsLoading = ko.observable(false);
  HasLoaded = ko.observable(false);

  // TODO: Started this, should really go in the entity base class if we're doing active record
  // create = async () => {
  //   const newItems = this.multiple ? this.Value() : [this.Value()]
  //   newItems.map(item => this.entitySet.AddEntity(newItems))
  // }

  refresh = async () => {
    if (!!!this.Value()) {
      return;
    }
    this.IsLoading(true);
    if (!this.multiple) {
      await this.entitySet.LoadEntity(this.Value());
      this.IsLoading(false);
      this.HasLoaded(true);
      return;
    }

    await Promise.all(
      this.Value().map(
        async (entity) => await this.entitySet.LoadEntity(entity)
      )
    );
    this.IsLoading(false);
    this.HasLoaded(true);
  };

  ensure = async () => {
    if (this.HasLoaded()) return;
    if (this.IsLoading()) {
      return new Promise((resolve, reject) => {
        const isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
          if (!isLoading) {
            isLoadingSubscription.dispose();
            resolve();
          }
        });
      });
    }
    await this.refresh();
  };

  toString = ko.pureComputed(() => {
    if (!!!this.Value()) {
      return "";
    }
    if (this.multiple) {
      return this.Value()
        .map((val) => getEntityPropertyAsString(val, this.lookupCol))
        .join(", ");
    }
    return getEntityPropertyAsString(this.Value(), this.lookupCol);
  });

  get = () => {
    if (!this.Value()) return;
    if (this.multiple) {
      return this.Value().map((entity) => {
        return {
          ID: entity.ID,
          LookupValue: entity.LookupValue,
          Title: entity.Title,
        };
      });
    }
    const entity = this.Value();
    return {
      ID: entity.ID,
      LookupValue: entity.LookupValue,
      Title: entity.Title,
    };
  };
  set = (val) => {
    if (!val) {
      this.Value(val);
      return;
    }
    if (this.multiple) {
      const valArr = Array.isArray(val) ? val : val.results ?? val.split("#;");

      this.Value(valArr.map((value) => this.findOrCreateNewEntity(value)));
      return;
    }

    this.Value(this.findOrCreateNewEntity(val));
    if (val && !this.toString()) {
      this.ensure();
    }
  };

  findOrCreateNewEntity = (val) => {
    if (this.entityType.FindInStore) {
      const foundEntity = this.entityType.FindInStore(val);
      if (foundEntity) return foundEntity;
      console.warn(
        `Could not find entity in store: ${this.entityType.name}`,
        val
      );
    }

    if (this.entityType.Create) {
      return this.entityType.Create(val);
    }

    return new this.entityType(val);
  };

  components = components;
}

// Should fully constrain all entities, this is ridiculous
function getEntityPropertyAsString(entity, column) {
  if (entity.FieldMap && entity.FieldMap[column]) {
    const field = entity.FieldMap[column];
    if (typeof field == "function") {
      return field();
    }

    if (field.toString && typeof field.toString == "function") {
      return field.toString();
    }

    if (field.get && typeof field.get == "function") {
      return field.get();
    }

    if (field.obs) {
      return field.obs();
    }

    return field;
  }
  return entity[column] ?? "";
}
