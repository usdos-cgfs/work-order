import { People } from "../entities/People.js";
import { getUsersByGroupName } from "../infrastructure/Authorization.js";
import { registerFieldComponent } from "../infrastructure/RegisterComponents.js";
import { ensureUserByKeyAsync } from "../infrastructure/SAL.js";
import BaseField from "./BaseField.js";

const components = {
  view: "people-view",
  edit: "people-edit",
  new: "people-edit",
};

registerFieldComponent("people", components);

export default class PeopleField extends BaseField {
  constructor(params) {
    super(params);
    // this.pickerOptions = params.pickerOptions ?? {};
    this.spGroupName = params.spGroupName ?? null;

    if (this.spGroupName) {
      this.spGroupName.subscribe(this.spGroupNameChangedHandler);
    }
    if (ko.unwrap(this.spGroupName)) {
      this.spGroupNameChangedHandler(ko.unwrap(this.spGroupName));
    }
  }
  spGroupId = ko.observable();
  userOpts = ko.observableArray();
  expandUsers = ko.observable(false);

  spGroupNameChangedHandler = async (groupName) => {
    if (!groupName) {
      this.userOpts.removeAll();
      this.spGroupId(null);
    }

    const group = await ensureUserByKeyAsync(groupName);
    this.spGroupId(group.ID);
    const users = await getUsersByGroupName(groupName);
    this.userOpts(users);
  };

  pickerOptions = ko.pureComputed(() => {
    const opts = {};
    const groupId = ko.unwrap(this.spGroupId);
    if (groupId) opts.SharePointGroupID = groupId;

    return opts;
  });

  toString = ko.pureComputed(() => this.Value()?.Title);

  set = (val) => this.Value(People.Create(val));

  components = components;
}
