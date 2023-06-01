import { SPList } from "./SAL.js";
import { Assignment } from "../entities/Assignment.js";
import { Notification } from "../entities/Notification.js";
import { RequestEntity } from "../entities/Request.js";
import { Holiday } from "../entities/Holiday.js";
import { PipelineStage } from "../entities/PipelineStage.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { ServiceType } from "../entities/ServiceType.js";
import { Action } from "../entities/Action.js";
import { Attachment } from "../entities/Attachment.js";
import { Comment } from "../entities/Comment.js";

const DEBUG = false;

let context = null;

export function setAppContext(appContext) {
  if (context) {
    return;
  }
  context = appContext;
}

export function getAppContext() {
  return context;
}

export const lookupType = {
  value: "LookupValue",
  id: "LookupID",
};

export default class ApplicationDbContext {
  constructor() {}

  Actions = new EntitySet(Action);

  Assignments = new EntitySet(Assignment);

  Attachments = new EntitySet(Attachment);

  Comments = new EntitySet(Comment);

  Notifications = new EntitySet(Notification);

  Requests = new EntitySet(RequestEntity);

  ConfigHolidays = new EntitySet(Holiday);

  ConfigRequestOrgs = new EntitySet(RequestOrg);

  ConfigPipelines = new EntitySet(PipelineStage);

  ConfigServiceTypes = new EntitySet(ServiceType);

  static Set = (listDef) => new EntitySet(listDef);
}

class EntitySet {
  constructor(constructor) {
    // Check if the object we passed in defines a ListDef
    this.constructor = constructor;
    if (constructor.ListDef) {
      constructor = constructor.ListDef;
    }
    this.ListDef = constructor;
    this.Title = constructor.title;
    this.Name = constructor.name;

    this.ListRef = new SPList(constructor);
  }

  // Queries
  FindById = async (id, fields) => {
    const result = await this.ListRef.findByIdAsync(id, fields);
    if (!result) return null;
    const newEntity = new this.constructor(result);
    mapObjectToEntity(result, newEntity);
    return newEntity;
  };

  FindByLookupColumn = async (
    { column, value, type = lookupType.value },
    { orderByColumn, sortAsc },
    { count = null },
    fields,
    includeFolders = false
  ) => {
    // if we pass in a count, we are expecting a cursor result
    const returnCursor = count != null;
    count = count ?? 5000;
    // else, we should apply a count of 5000 and keep fetching

    const results = await this.ListRef.findByLookupColumnAsync(
      [{ column, value, type }],
      { orderByColumn, sortAsc },
      { count },
      fields,
      includeFolders
    );

    let cursor = {
      _next: results._next,
      results: results.results.map((item) => {
        const newEntity = new this.constructor(item);
        mapObjectToEntity(item, newEntity);
        return newEntity;
      }),
    };

    if (returnCursor) {
      return cursor;
    }

    const resultObj = {
      results: cursor.results,
    };

    while (cursor._next) {
      cursor = await this.LoadNextPage(cursor);
      resultObj.results.concat(cursor.results);
    }

    return resultObj;
  };

  LoadNextPage = async (cursor) => {
    const results = await this.ListRef.loadNextPage(cursor);
    return {
      _next: results._next,
      results: results.results.map((item) => {
        const newEntity = new this.constructor(item);
        mapObjectToEntity(item, newEntity);
        return newEntity;
      }),
    };
  };
  /**
   * Return all items in list
   */
  ToList = async () => {};

  // Mutators
  Add = async (entity) => {};
  Update = async (entity) => {};
  Remove = async (entity) => {};

  Load = async (entity) => {};

  // LEGACY: Replace below!
  //
  FindAll = async function (fields, filter = null) {
    return await this.ListRef.getListItemsAsync({ fields, caml: filter });
  };

  Find = async function (entity, fields) {
    if (!entity.ID && !entity.Title) {
      console.error("entity missing Id or title", entity);
      return null;
    }
    var item;
    if (entity.ID) {
      // Prefer find by Id
      item = await this.ListRef.findByIdAsync(entity.ID, fields);
    } else if (entity.Title) {
      item = await this.ListRef.findByTitleAsync(entity.Title, fields, 1);
    }
    return item;
  };

  FindByRequestId = async function (requestId, fields) {
    if (!requestId) return;
    const results = await this.ListRef.findByLookupColumnAsync(
      [{ column: "Request", value: requestId, type: lookupType.id }],
      { orderByColumn: "ID", sortAsc: false },
      { count: null },
      fields,
      false
    );
    return results.results;
  };

  LoadEntity = async function (entity) {
    if (!entity.ID && !entity.Title) {
      console.error("entity missing Id or title", entity);
      return false;
    }
    var item = await this.Find(entity, Object.keys(entity.FieldMap));
    if (!item) {
      console.warn("ApplicationDbContext Could not find entity", entity);
      return false;
    }
    if (entity.FieldMap) {
      mapObjectPropsToViewFields(item, entity.FieldMap);
    }
    return true;
  };

  LoadEntityByRequestId = async function (entity, requestId) {
    var items = await this.FindByRequestId(
      requestId,
      Object.keys(entity.FieldMap)
    );
    if (!items.length) return false;
    if (entity.FieldMap) {
      mapObjectPropsToViewFields(items[0], entity.FieldMap);
      if (!entity.ID && items[0].ID) {
        entity.ID = items[0].ID;
      }
      return true;
    }
    Object.assign(entity, items[0]);
    return true;
  };

  AddEntity = async function (entity, folderPath, request = null) {
    // if (entity.FieldMap) {
    //   entity = mapViewFieldsToValuePairs(entity.FieldMap);
    // } else if (this.ListDef.fields) {
    const creationfunc = createWritableObject.bind(this);
    const writeableEntity = creationfunc(entity);
    // }

    if (request) {
      writeableEntity.Request = request;
      // vp.push(["ReqId", request]);
    }
    if (DEBUG) console.log(writeableEntity);
    const newId = await this.ListRef.createListItemAsync(
      writeableEntity,
      folderPath
    );
    mapObjectToEntity({ ID: newId }, entity);
    return newId;
  };

  UpdateEntity = async function (entity, fields = null) {
    const writeableEntity = createWritableObject.bind(this)(entity, fields);
    writeableEntity.ID =
      typeof entity.ID == "function" ? entity.ID() : entity.ID;
    if (DEBUG) console.log(writeableEntity);
    return this.ListRef.updateListItemAsync(writeableEntity);
  };

  RemoveEntity = async function (entity) {
    if (!entity.ID) return false;
    await this.ListRef.deleteListItemAsync(entity.ID);
    return true;
  };

  SetItemPermissions = async function (entityId, valuePairs, reset = false) {
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
    return this.ListRef.setItemPermissionsAsync(entityId, salValuePairs, reset);
  };

  GetItemPermissions = function (id) {
    return this.ListRef.getItemPermissionsAsync(id);
  };

  // Folder Methods
  SetFolderReadOnly = async function (relFolderPath) {
    return this.ListRef.setFolderReadonlyAsync(relFolderPath);
  };

  GetItemsByFolderPath = function (folderPath, fields) {
    return this.ListRef.getFolderContentsAsync(folderPath, fields);
  };

  UpsertFolderPath = async function (folderPath) {
    return this.ListRef.upsertFolderPathAsync(folderPath);
  };

  SetFolderPermissions = async function (folderPath, valuePairs, reset = true) {
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
    return this.ListRef.setFolderPermissionsAsync(
      folderPath,
      salValuePairs,
      reset
    );
  };

  EnsureFolderPermissions = async function (relFolderPath, valuePairs) {
    // Slightly more expensive operation to verify a user has the required permissions
    // before adding them. This will cut down on the number of unique permissions in the
    // system since a user may already have the permission via group membership.
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
    return this.ListRef.ensureFolderPermissionsAsync(
      relFolderPath,
      salValuePairs
    );
  };

  UploadNewDocument = async function (folderPath, args) {
    return this.ListRef.uploadNewDocumentAsync(
      folderPath,
      "Attach a New Document",
      args
    );
  };

  // Form Methods
  ShowForm = async function (name, title, args) {
    return new Promise((resolve, reject) =>
      this.ListRef.showModal(name, title, args, resolve)
    );
  };
}

function mapObjectToEntity(inputObject, targetEntity) {
  // Takes an object and attempts to map it to the target entity
  Object.keys(inputObject).forEach((key) => {
    mapValueToEntityProperty(key, inputObject[key], targetEntity);
  });
}

function mapValueToEntityProperty(propertyName, inputValue, targetEntity) {
  //1. Check if the targetEntity has a fieldmapping for this property
  if (targetEntity.FieldMap && targetEntity.FieldMap[propertyName]) {
    mapObjectToViewField(inputValue, targetEntity.FieldMap[propertyName]);
    return;
  }
  // 2. This is just a regular property, set it
  targetEntity[propertyName] = inputValue;
  return;
}

function mapObjectPropsToViewFields(inputObject, fieldMappings) {
  Object.keys(fieldMappings).forEach((key) => {
    if (DEBUG) console.log(`ORM Setting ${key} to`, inputObject[key]);
    mapObjectToViewField(inputObject[key], fieldMappings[key]);
  });
}

function mapObjectToViewField(inVal, fieldMap) {
  // Fieldmap has Three options for setting,
  // 1. observable - the fieldmap represents an observable
  // 2. setter - the fieldmap exposes a setter
  // 3. factory/obs - the fieldmap exposes a factory and an observable to put the result.

  if (typeof fieldMap == "function") {
    fieldMap(inVal);
    return;
  }

  if (typeof fieldMap != "object") {
    fieldMap = inVal;
    return;
  }

  if (fieldMap.set && typeof fieldMap.set == "function") {
    fieldMap.set(inVal);
    return;
  }

  if (fieldMap.obs) {
    if (!inVal) {
      fieldMap.obs(null);
      return;
    }
    // If the input value is an array, then we are putting an array into the observable.
    var outVal = Array.isArray(inVal)
      ? inVal.map((item) => generateObject(item, fieldMap))
      : generateObject(inVal, fieldMap);

    fieldMap.obs(outVal);
    return;
  }

  fieldMap = inVal;
  //throw "Error setting fieldmap?";
}

function generateObject(inVal, fieldMap) {
  // If the fieldMap provides a factory, use that, otherwise return the value
  return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
}

function mapViewFieldToValue(fieldMap) {
  // Fieldmap has Three options for getting,
  // 1. observable - the fieldmap represents an observable or other function that returns a value
  // 2. get - the fieldmap is an object that exposes a getter function
  // 3. factory/obs - the fieldmap is an object exposes a factory and an observable.
  if (typeof fieldMap == "function") {
    return fieldMap();
  }
  if (fieldMap.get && typeof fieldMap.get == "function") {
    return fieldMap.get();
  }

  if (fieldMap.obs) {
    return fieldMap.obs();
  }

  return fieldMap;

  // console.error("Error setting fieldMap", fieldMap);
  // throw "Error getting fieldmap";
}

function createWritableObject(input, selectedFields = null) {
  const entity = {};
  // We either predefine the fields in the ListDef, or provide a complete fieldmap
  const allWriteableFieldsSet = new Set([]);
  if (this.ListDef.fields) {
    this.ListDef.fields.forEach((field) => allWriteableFieldsSet.add(field));
  }
  if (input.FieldMap) {
    Object.keys(input.FieldMap).forEach((field) =>
      allWriteableFieldsSet.add(field)
    );
  }
  const allWriteableFields = [...allWriteableFieldsSet];

  const fields =
    selectedFields ??
    (input.FieldMap ? Object.keys(input.FieldMap) : null) ??
    Object.keys(input);

  fields
    .filter((field) => allWriteableFields.includes(field))
    .map((field) => {
      if (input.FieldMap && input.FieldMap[field]) {
        entity[field] = mapViewFieldToValue(input.FieldMap[field]);
        return;
      }
      entity[field] = input[field];
    });

  return entity;
}
