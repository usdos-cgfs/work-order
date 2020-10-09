$(document).ready(function () {
  // Specify the unique ID of the DOM element where the
  // picker will render.
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
  //initApp();
});

function initApp() {
  window.vm = new koviewmodel();

  //initializePeoplePicker("peoplePickerDiv");
  initializePeoplePicker("peoplePicker2Div");

  ko.applyBindings(vm);
}
// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {
  // Create a schema to store picker properties, and set the properties.
  var schema = {};
  schema["PrincipalAccountType"] = "User,DL,SecGroup,SPGroup";
  schema["SearchPrincipalSource"] = 15;
  schema["ResolvePrincipalSource"] = 15;
  schema["AllowMultipleValues"] = false;
  schema["MaximumEntitySuggestions"] = 50;
  schema["Width"] = "280px";

  // Render and initialize the picker.
  // Pass the ID of the DOM element that contains the picker, an array of initial
  // PickerEntity objects to set the picker value, and a schema that defines
  // picker properties.
  this.SPClientPeoplePicker_InitStandaloneControlWrapper(
    peoplePickerElementId,
    null,
    schema
  );
}

// Query the picker for user information.
function getUserInfo() {
  // Get the people picker object from the page.
  var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict
    .peoplePickerDiv_TopSpan;

  // Get information about all users.
  var users = peoplePicker.GetAllUserInfo();
  var userInfo = "";
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    for (var userProperty in user) {
      userInfo += userProperty + ":  " + user[userProperty] + "<br>";
    }
  }
  $("#resolvedUsers").html(userInfo);

  // Get user keys.
  var keys = peoplePicker.GetAllUserKeys();
  $("#userKeys").html(keys);
}

function koviewmodel() {
  let self = this;

  self.userOne = ko.observable();
  self.userTwo = ko.observable();
}

ko.bindingHandlers.people = {
  init: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    let value = valueAccessor();
    //debugger;
    initializePeoplePicker(element.id);
    let pickerId = element
      .querySelector('div[spclientpeoplepicker="true"][id$="_TopSpan"]')
      .getAttribute("id");

    var picker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerId];

    //save old event (needs to stay in its context due to internal calls
    picker.oldChanged = picker.OnControlResolvedUserChanged;
    picker.OnControlResolvedUserChanged = () => {
      //do your code here
      console.log("OnControlResolvedUserChanged");
      //get current selected users
      console.log(picker.GetAllUserInfo());
      ensureUser(picker.GetAllUserKeys(), (user) => {
        value(user);
      });
      //value(picker.GetAllUserKeys());
      //let old event do its magic
      picker.oldChanged();
    };
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    //debugger;
  },
};
// https://knockoutjs.com/documentation/custom-bindings.html

ko.bindingHandlers.kopeoplepicker = {
  init: function (element, valueAccessor, allBindingsAccessor) {
    var schema = {};
    schema["PrincipalAccountType"] = "User";
    schema["SearchPrincipalSource"] = 15;
    schema["ShowUserPresence"] = true;
    schema["ResolvePrincipalSource"] = 15;
    schema["AllowEmailAddresses"] = true;
    schema["AllowMultipleValues"] = false;
    schema["MaximumEntitySuggestions"] = 50;
    schema["Width"] = "280px";
    schema["OnUserResolvedClientScript"] = function (elemId, userKeys) {
      //  get reference of People Picker Control
      var pickerElement = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
      var observable = valueAccessor();
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      ensureUser(userJSObject.Key, (user) => {
        observable(user);
      });
      observable(pickerElement.GetControlValueAsJSObject()[0]);
      console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    var mergedOptions = allBindingsAccessor().options || schema;

    //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
    //  ID to our element, no other options
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(
      element.id,
      null,
      mergedOptions
    );

    //  Force to Ensure User
    var userValue = ko.utils.unwrapObservable(valueAccessor());
    var pickerControl =
      SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
    var editId = "#" + pickerControl.EditorElementId;
    jQuery(editId).val(userValue);

    // Resolve the User
    pickerControl.AddUnresolvedUserFromEditor(true);
  },
};
