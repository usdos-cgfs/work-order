import { EnsureUserByIdAsync } from "./sal.js";

export function PersonField(schemaOpts) {
  const IsLoading = ko.observable();
  const User = ko.observable();

  // SPMap Can be written from a SharePoint item
  // and when read will return a SP compatible result
  const SPMap = ko.pureComputed({
    write: async function (value) {
      if (!value) {
        User(null);
        return;
      }
      IsLoading(true);
      var ensuredUser;
      switch (value.constructor.getName()) {
        case "SP.FieldUserValue":
          ensuredUser = await EnsureUserByIdAsync(value.get_lookupId());
          break;
        case "SP.User":
          ensuredUser = value;
          break;
        default:
          break;
      }
      if (!ensuredUser) {
        console.warn("Can't find user", value);
        return;
      }
      var tempUser = {
        id: ensuredUser.get_id(),
        userName: ensuredUser.get_loginName(),
        title: ensuredUser.get_title(),
        isEnsured: true,
      };
      User(tempUser);
      IsLoading(false);
    },
    read: function () {},
  });

  return {
    SPMap,
    IsLoading,
    User,
  };
}

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
