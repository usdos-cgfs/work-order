import { SPList } from "./SAL.js";

export default class ApplicationDbContext {
  constructor() {}

  Assignments = new EntitySet({
    name: "Assignment",
    title: "Assignment",
  });

  Notifications = new EntitySet({
    name: "WorkOrderEmails",
    title: "WorkOrderEmails",
  });

  Requests = new EntitySet({
    name: "WorkOrder",
    title: "Work Order",
  });

  ConfigHolidays = new EntitySet({
    name: "ConfigHolidays",
    title: "ConfigHolidays",
  });

  ConfigRequestOrgs = new EntitySet({
    name: "ConfigRequestOrgs",
    title: "ConfigRequestOrgs",
  });

  ConfigPipelines = new EntitySet({
    name: "ConfigPipelines",
    title: "ConfigPipelines",
  });

  ConfigServiceTypes = new EntitySet({
    name: "ConfigServiceTypes",
    title: "ConfigServiceTypes",
  });

  static Set = (listDef) => new EntitySet(listDef);
}

class EntitySet {
  constructor(listDef) {
    this.Title = listDef.title;
    this.Name = listDef.name;
    this.ListRef = new SPList(listDef);
  }

  FindAll = async function (fields) {
    return await this.ListRef.getListItemsAsync({ fields });
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
    } else if (entity.title) {
      item = await this.ListRef.findByTitleAsync(entity.Title, fields, 1);
    }
    return item;
  };

  AddEntity = async function (entity, folderPath) {
    var vp = mapViewFieldsToValuePairs(entity.FieldMap);
    console.log(vp);
    return this.ListRef.createListItemAsync(vp, folderPath);
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
    mapObjectPropsToViewFields(item, entity.FieldMap);

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
    console.log(`ORM Setting ${key} to`, inputObject[key]);
    mapObjectToViewField(inputObject[key], fieldMappings[key]);
  });
}

function mapObjectToViewField(inVal, fieldMap) {
  // Fieldmap has Three options for setting,
  // 1. observable - the fieldmap represents an observable
  // 2. setter - the fieldmap exposes a setter
  // 3. factory/obs - the fieldmap exposes a factory and an observable to put the result.

  if (typeof fieldMap == "function") {
    fieldMap.obs(inVal);
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
  throw "Error setting fieldmap?";
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
      return [key, mapViewFieldToValuePair(fieldMappings[key])];
    });
}

function mapViewFieldToValuePair(fieldMap) {
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

  console.error("Error setting fieldMap", fieldMap);
  throw "Error getting fieldmap";
}
