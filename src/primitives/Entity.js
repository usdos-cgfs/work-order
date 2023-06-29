export default class Entity {
  constructor(params) {}

  toJSONBlob = () => {
    const out = {};
    Object.keys(this.FieldMap).map(
      (key) => (out[key] = this.FieldMap[key].toString())
    );
    return out;
  };
}
