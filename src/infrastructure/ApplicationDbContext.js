import { SPList } from "./SAL.js";
import { Assignment } from "../entities/Assignment.js";
import { Notification } from "../entities/Notification.js";
import { RequestEntity } from "../entities/Request.js";
import { Holiday } from "../entities/Holiday.js";
import { PipelineStage } from "../entities/PipelineStage.js";
import { RequestOrg } from "../entities/RequestOrg.js";
import { ServiceType } from "../entities/ServiceType.js";
import { Action } from "../entities/Action.js";

const DEBUG = false;

export default class ApplicationDbContext {
  constructor() {}

  Actions = new EntitySet(Action);

  Assignments = new EntitySet(Assignment);

  Notifications = new EntitySet(Notification);

  Requests = new EntitySet(RequestEntity);

  ConfigHolidays = new EntitySet(Holiday);

  ConfigRequestOrgs = new EntitySet(RequestOrg);

  ConfigPipelines = new EntitySet(PipelineStage);

  ConfigServiceTypes = new EntitySet(ServiceType);

  static Set = (listDef) => new EntitySet(listDef);
}

class EntitySet {
  constructor(listDef) {
    if (listDef.ListDef) {
      listDef = listDef.ListDef;
    }
    this.ListDef = listDef;
    this.Title = listDef.title;
    this.Name = listDef.name;

    this.ListRef = new SPList(listDef);
  }

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
    return await this.ListRef.findByReqIdAsync(requestId, fields);
  };

  LoadEntity = async function (entity) {
    if (!entity.ID == null && !entity.Title) {
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
    if (!items) return false;
    if (entity.FieldMap) {
      mapObjectPropsToViewFields(items[0], entity.FieldMap);
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
    return this.ListRef.createListItemAsync(writeableEntity, folderPath);
  };

  UpdateEntity = async function (entity, fields = null) {
    const writeableEntity = createWritableObject.bind(this)(entity, fields);
    writeableEntity.ID = entity.ID;
    if (DEBUG) console.log(writeableEntity);
    return this.ListRef.updateListItemAsync(writeableEntity);
  };

  RemoveEntity = async function (entity) {
    if (!entity.ID) return false;
    await this.ListRef.deleteListItemAsync(entity.ID);
    return true;
  };

  // hoisting
  UpsertFolderPath = async function (folderPath) {
    return this.ListRef.upsertListFolderPathAsync(folderPath);
  };

  SetItemPermissions = async function (entityId, valuePairs, reset = false) {
    const salValuePairs = valuePairs.map((vp) => [
      vp[0].LoginName ?? vp[0].Title,
      vp[1],
    ]);
    return this.ListRef.setItemPermissionsAsync(entityId, salValuePairs, reset);
  };
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

function mapViewFieldsToValuePairs(fieldMappings, fields = null) {
  // Returns array of arrays: [[col1, val1], [col2, val2]]
  // Restricted fields for writing:
  const restrictedFields = ["ID", "Author", "Created", "Editor", "Modified"];
  return Object.keys(fieldMappings)
    .filter(
      (key) =>
        !restrictedFields.includes(key) &&
        (fields ? fields.includes(key) : true)
    )
    .map((key) => {
      return [key, mapViewFieldToValue(fieldMappings[key])];
    });
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
  const fields =
    selectedFields ?? this.ListDef.fields ?? Object.keys(input.FieldMap);

  fields.map((field) => {
    if (input.FieldMap && input.FieldMap[field]) {
      entity[field] = mapViewFieldToValue(input.FieldMap[field]);
      return;
    }
    entity[field] = input[field];
  });

  return entity;
}