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

  Set = (listDef) => new EntitySet(listDef);
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
  if (!inVal) {
    fieldMap.obs(null);
    return;
  }
  // If the input value is an array, then we are putting an array into the observable.
  var outVal = Array.isArray(inVal)
    ? inVal.map((item) => generateObject(item, fieldMap))
    : generateObject(inVal, fieldMap);

  fieldMap.obs(outVal);
}

function generateObject(inVal, fieldMap) {
  // If the fieldMap provides a factory, use that, otherwise return the value
  return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
}

function mapViewFieldsToValuePairs(fieldMappings) {
  // Expects array of arrays: [[col1, val1], [col2, val2]]
  return Object.keys(fieldMappings)
    .filter((key) => key != "ID")
    .map((key) => {
      return [key, mapViewFieldToValuePair(fieldMappings[key])];
    });
}

function mapViewFieldToValuePair(fieldMap) {
  var val = fieldMap.obs();
  if (!val) {
    return null;
  }
  return Array.isArray(val)
    ? val.map((item) => (item.id ? { id: item.id, title: item.title } : item))
    : val.id
    ? { id: val.id, title: val.title }
    : val;
}
