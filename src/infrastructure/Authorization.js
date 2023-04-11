import { People } from "../components/People.js";
import { OrgTypes, requestOrgStore } from "../entities/RequestOrg.js";
import { getCurrentUserPropertiesAsync, getUserPropsAsync } from "./SAL.js";

export class User {
  Groups = null;

  constructor({
    ID,
    Title,
    LoginName = null,
    IsGroup = null,
    IsEnsured = false,
    Groups = null,
  }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this.LoginName = LoginName;
    this.IsGroup = IsGroup;
    // Has the user data been fetched? Used for binding handlers.
    this.IsEnsured = IsEnsured;

    this.Groups = Groups;
  }

  RequestOrgs = ko.pureComputed(() =>
    requestOrgStore().filter(
      (reqOrg) =>
        reqOrg.OrgType == OrgTypes.RequestingOffice &&
        this.Groups.map((uGroup) => uGroup.ID).includes(reqOrg.UserGroup.ID)
    )
  );

  static Create = async function () {
    const userProps = await getUserPropsAsync();
    //const userProps2 = await UserManager.getUserPropertiesAsync();

    return new User(userProps);
  };
}

export class UserManager {
  static getUserPropertiesAsync = getCurrentUserPropertiesAsync;
}
