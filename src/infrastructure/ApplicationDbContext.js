import { SPList } from "./SAL.js";

export default class ApplicationDbContext {
  constructor() {}

  RequestHeaders = new EntitySet({
    name: "WorkOrder",
    title: "Work Order",
  });

  ConfigRequestOrgs = new EntitySet({
    name: "ConfigRequestOrgs",
    title: "ConfigRequestOrgs",
  });

  ConfigPipelines = new EntitySet({
    name: "ConfigPipelines",
    title: "ConfigPipelines",
  });
}

class EntitySet {
  constructor(listDef) {
    this.ListRef = new SPList(listDef);
  }

  Add = async function (entity, folderPath) {
    var vp = MapViewFieldsToValuePairs(entity.FieldMap);
    console.log(vp);
    return this.ListRef.createListItemAsync(vp, folderPath);
  };

  FindAll = async function (fields) {
    return await this.ListRef.getListItemsAsync({ fields });
  };

  Find = async function (entity, fields) {
    if (!entity.id && !entity.title) {
      console.error("entity missing Id or title", entity);
      return null;
    }
    var item;
    if (entity.id) {
      item = await this.ListRef.findByIdAsync(entity.id, fields);
    } else if (entity.title) {
      item = await this.ListRef.findByTitleAsync(entity.title, fields);
    }
    return item;
  };

  Load = async function (entity) {
    if (!entity.id == null && !entity.title) {
      console.error("entity missing Id or title", entity);
      return false;
    }
    var item = await this.Find(entity, Object.keys(entity.FieldMap));
    if (!item) {
      console.warn("ApplicationDbContext Could not find entity", entity);
      return false;
    }
    MapObjectsToViewFields(item, entity.FieldMap);
    return true;
  };
}

function MapObjectsToViewFields(inputObject, fieldMappings) {
  Object.keys(fieldMappings).forEach((key) => {
    console.log(`ORM Setting ${key} to`, inputObject[key]);
    MapObjectToViewField(inputObject[key], fieldMappings[key]);
  });
}

function MapObjectToViewField(inVal, fieldMap) {
  // If the input value is an array, then we are putting an array into the observable.
  var outVal = Array.isArray(inVal)
    ? inVal.map((item) => GenerateObject(item, fieldMap))
    : GenerateObject(inVal, fieldMap);

  fieldMap.obs(outVal);
}

function GenerateObject(inVal, fieldMap) {
  // If the fieldMap provides a factory, use that, otherwise return the value
  return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
}

function MapViewFieldsToValuePairs(fieldMappings) {
  // Expects array of arrays: [[col1, val1], [col2, val2]]
  return Object.keys(fieldMappings).map((key) => {
    return [key, MapViewFieldToValuePair(fieldMappings[key])];
  });
}

function MapViewFieldToValuePair(fieldMap) {
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
