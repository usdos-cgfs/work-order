import { EnsureUserByIdAsync } from "./sal.js";

export function PeopleField(schemaOpts) {
  // We need to refactor this whole thing to support groups/arrays.
  var self = this;
  self.loading = ko.observable(false);
  this.schemaOpts = schemaOpts || {};
  this.user = ko.observable();
  this.userName = ko.pureComputed({
    read: function () {
      return self.user() ? self.user().userName : "";
    },
  });
  this.title = ko.pureComputed(function () {
    return self.user() ? self.user().title : "";
  });
  this.setItemFormat = ko.pureComputed(function () {
    return self.user()
      ? self.user().ID + ";#" + self.user().userName + ";#"
      : "";
  });
  this.ID = function () {
    // We need to refactor
    return self.userId();
  };
  this.userId = ko.pureComputed(
    {
      read: function () {
        if (self.user()) {
          return self.user().ID;
        }
        return "";
      },
      write: async function (value) {
        await this.setUser(value);
      },
    },
    this
  );
  this.lookupUser = ko.observable();
  this.ensuredUser = ko.observable();
  this.setUser = async function (value) {
    return new Promise(async (resolve) => {
      self.loading(true);
      if (value) {
        var user = {};
        switch (value.constructor.getName()) {
          case "SP.FieldUserValue":
            var ensuredUser = await ensureUserByIdAsync(value.get_lookupId());
            user.ID = ensuredUser.get_id();
            user.userName = ensuredUser.get_loginName();
            user.title = ensuredUser.get_title();
            user.isEnsured = false;
            self.user(user);
            self.lookupUser(value);
            self.loading(false);

            break;
          case "SP.User":
            user.ID = value.get_id();
            user.userName = value.get_loginName();
            user.title = value.get_title();
            user.isEnsured = false;
            self.user(user);
            self.lookupUser(value);
            self.loading(false);
            break;
          default:
            break;
        }
      } else {
        self.user(null);
        self.lookupUser(null);
        self.loading(false);
      }
      resolve();
    });
  };
}
