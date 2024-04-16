import BaseFieldModule from "../BaseFieldModule.js";

export default class PeopleModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  ValueFunc = ko.pureComputed({
    read: () => {
      if (!this.Value()) return;
      const userOpts = ko.unwrap(this.userOpts);
      return userOpts.find((opt) => opt.ID == this.Value().ID);
    },
    write: (opt) => {
      const userOpts = ko.unwrap(this.userOpts);
      if (!userOpts) return;
      this.Value(opt);
    },
  });

  ShowUserSelect = ko.pureComputed(() => {
    // We don't care to unwrap this, since we want to know if it's set or an observable.
    const groupName = this.spGroupName;
    if (!groupName) return false;
    const options = ko.unwrap(this.userOpts);
    return options.length;
  });

  getUniqueId = () => {
    return `people-component-${this.displayName}-${Math.floor(
      Math.random() * 100
    )}`;
  };
}
