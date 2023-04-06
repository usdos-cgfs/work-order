export function MapObjectsToViewFields(inputObject, fieldMappings) {
  Object.keys(fieldMappings).forEach((key) => {
    MapObjectToViewField(inputObject[key], fieldMappings[key]);
  });
}
export function MapObjectToViewField(inVal, fieldMap) {
  var outVal = Array.isArray(inVal)
    ? inVal.map((item) => GenerateObject(item, fieldMap))
    : GenerateObject(inVal, fieldMap);

  fieldMap.obs(outVal);
}

function GenerateObject(inVal, fieldMap) {
  return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
}
