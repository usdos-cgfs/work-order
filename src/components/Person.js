export class Person {
  constructor({ ID, Title, LoginName = null, IsEnsured = false }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this.LoginName = LoginName;
    // Has the user data been fetched? Used for binding handlers.
    this.IsEnsured = IsEnsured;
  }

  ID = null;
  Title = null;
  LoginName = null;
  LookupValue = null;

  static Create = function ({ ID, LookupValue }) {
    return new Person({ ID, Title: LookupValue });
  };
}
