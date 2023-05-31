export class People {
  constructor({
    ID,
    Title,
    LoginName = null,
    IsGroup = null,
    IsEnsured = false,
  }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
    this.LoginName = LoginName;
    this.IsGroup = IsGroup;
    // Has the user data been fetched? Used for binding handlers.
    this.IsEnsured = IsEnsured;
    this.SetPeoplePickers = [];
  }

  ID = null;
  Title = null;
  LoginName = null;
  LookupValue = null;

  isInPicker = (elementId) => this.SetPeoplePickers.includes(elementId);

  static Create = function (props) {
    if (!props) return null;
    return new People({
      ID: props.ID,
      Title: props.Title ?? props.LookupValue,
    });
  };
}
