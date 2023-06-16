export default class PeopleModule {
  constructor(fieldmap) {
    Object.assign(this, fieldmap);
  }

  getUniqueId = () => {
    return "people-component-" + this.displayName;
  };
}
