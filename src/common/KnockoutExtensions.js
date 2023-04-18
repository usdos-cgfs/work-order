import { People } from "../components/People.js";
import { ensureUserByKeyAsync } from "../infrastructure/SAL.js";

ko.bindingHandlers.people = {
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
    schema["OnUserResolvedClientScript"] = async function (elemId, userKeys) {
      //  get reference of People Picker Control
      var pickerElement = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
      var observable = valueAccessor();
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      if (userJSObject) {
        var user = await ensureUserByKeyAsync(userJSObject.Key);
        var person = new People(user);
        person.SetPeoplePickers.push(element.id);
        observable(person);
      } else {
        observable(null);
      }
      //observable(pickerElement.GetControlValueAsJSObject()[0]);
      //console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    //var mergedOptions = Object.assign(schema, obs.schemaOpts);

    //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
    //  ID to our element, no other options
    SPClientPeoplePicker_InitStandaloneControlWrapper(element.id, null, schema);
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
    var userValue = ko.utils.unwrapObservable(valueAccessor());
    if (userValue && !userValue.isInPicker(element.id)) {
      var pickerControl =
        SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
      //var editId = "#" + pickerControl.EditorElementId;
      //jQuery(editId).val(userValue.userName);

      document.getElementById(pickerControl.EditorElementId).value =
        userValue.LookupValue;
      // Resolve the User
      pickerControl.AddUnresolvedUserFromEditor(true);
    }
  },
};

ko.bindingHandlers.dateField = {
  init: function (element, valueAccessor, allBindingsAccessor) {},
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {},
};
