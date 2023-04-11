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
        const userObj = {
          ID: user.get_id(),
          Title: user.get_title(),
          LoginName: user.get_loginName(),
          IsEnsured: true,
        };
        observable(new People(userObj));
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
    if (userValue && !userValue.IsEnsured) {
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
