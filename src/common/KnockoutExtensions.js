ko.bindingHandlers.people = {
  init: function (element, valueAccessor, allBindingsAccessor) {
    var obs = valueAccessor();
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
      var observable = valueAccessor().user;
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      if (userJSObject) {
        ensureUser(userJSObject.Key, function (user) {
          var userObj = new Object();
          userObj["ID"] = user.get_id();
          userObj["userName"] = user.get_loginName();
          userObj["isEnsured"] = true;
          userObj["ensuredUser"] = user;
          userObj["title"] = user.get_title();
          observable(userObj);
        });
      } else {
        observable(null);
      }
      //observable(pickerElement.GetControlValueAsJSObject()[0]);
      //console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    var mergedOptions = Object.assign(schema, obs.schemaOpts);

    //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
    //  ID to our element, no other options
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(
      element.id,
      null,
      mergedOptions
    );
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    //debugger;
    //  Force to Ensure User
    var userValue = ko.utils.unwrapObservable(valueAccessor().user);
    if (userValue && !userValue.isEnsured) {
      var pickerControl =
        SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
      var editId = "#" + pickerControl.EditorElementId;
      jQuery(editId).val(userValue.userName);

      // Resolve the User
      pickerControl.AddUnresolvedUserFromEditor(true);
    }
  },
};
