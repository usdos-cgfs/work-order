import { People } from "../entities/People.js";
import { ensureUserByKeyAsync } from "../infrastructure/SAL.js";
import { assetsPath } from "../app.js";
import ServiceTypeModule from "../components/ServiceType/ServiceTypeModule.js";

ko.subscribable.fn.subscribeChanged = function (callback) {
  var oldValue;
  this.subscribe(
    function (_oldValue) {
      oldValue = _oldValue;
    },
    this,
    "beforeChange"
  );

  this.subscribe(function (newValue) {
    callback(newValue, oldValue);
  });
};

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
    //schema["Width"] = "280px";
    schema["OnUserResolvedClientScript"] = async function (elemId, userKeys) {
      //  get reference of People Picker Control
      var pickerElement = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
      var observable = valueAccessor();
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      if (!userJSObject) {
        observable(null);
        return;
      }

      if (userJSObject.IsResolved) {
        if (userJSObject.Key == observable()?.LoginName) return;
        var user = await ensureUserByKeyAsync(userJSObject.Key);
        var person = new People(user);
        // person.SetPeoplePickers.push(element.id);
        observable(person);
      }
      //observable(pickerElement.GetControlValueAsJSObject()[0]);
      //console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    //var mergedOptions = Object.assign(schema, obs.schemaOpts);

    //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
    //  ID to our element, no other options
    SPClientPeoplePicker_InitStandaloneControlWrapper(element.id, null, schema);
    // const helpDiv = document.createElement("div");
    // helpDiv.innerHTML = "Search surname first e.g. Smith, John";
    // helpDiv.classList.add("fst-italic", "fw-lighter");
    // element.appendChild(helpDiv);
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    var pickerControl =
      SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
    const editorElement = document.getElementById(
      pickerControl.EditorElementId
    );

    var userValue = ko.utils.unwrapObservable(valueAccessor());

    if (!userValue) {
      // Clear the form
      pickerControl.DeleteProcessedUser();
      return;
    }

    if (
      userValue &&
      !pickerControl
        .GetAllUserInfo()
        .find((pickerUser) => pickerUser.DisplayText == userValue.LookupValue)
    ) {
      editorElement.value = userValue.LookupValue;
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

const fromPathTemplateLoader = {
  loadTemplate: function (name, templateConfig, callback) {
    if (templateConfig.fromPath) {
      // TODO: fix error cathing and fallback flow
      fetch(assetsPath + templateConfig.fromPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error Fetching HTML Template - ${response.statusText}`
            );
          }
          return response.text();
        })
        .catch((error) => {
          if (!templateConfig.fallback) return;
          console.warn(
            "Primary template not found, attempting fallback",
            templateConfig
          );
          fetch(assetsPath + templateConfig.fallback)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error Fetching fallback HTML Template - ${response.statusText}`
                );
              }
              return response.text();
            })
            .then((text) =>
              ko.components.defaultLoader.loadTemplate(name, text, callback)
            );
        })
        .then((text) =>
          text
            ? ko.components.defaultLoader.loadTemplate(name, text, callback)
            : null
        );
    } else {
      callback(null);
    }
  },
};

ko.components.loaders.unshift(fromPathTemplateLoader);

const fromPathViewModelLoader = {
  loadViewModel: function (name, viewModelConfig, callback) {
    if (viewModelConfig.viaLoader) {
      console.log("loading module", name);
      const module = import(assetsPath + viewModelConfig.viaLoader).then(
        (module) => {
          console.log("imported module", name);
          const viewModelConstructor = module.default;
          // We need a createViewModel function, not a plain constructor.
          // We can use the default loader to convert to the
          // required format.
          ko.components.defaultLoader.loadViewModel(
            name,
            viewModelConstructor,
            callback
          );
        }
      );
    } else {
      // Unrecognized config format. Let another loader handle it.
      callback(null);
    }
  },
};

ko.components.loaders.unshift(fromPathViewModelLoader);

export function registerServiceTypeViewComponents({ uid, components }) {
  Object.keys(components).forEach((view) => {
    const componentName = components[view];
    if (!ko.components.isRegistered(componentName)) {
      ko.components.register(componentName, {
        template: {
          fromPath: `/servicetypes/${uid}/views/${view}.html`,
        },
        viewModel: ServiceTypeModule,
      });
    }
  });
}

export function registerServiceTypeActionComponent({
  uid,
  componentName,
  templateName = null,
  moduleName = null,
}) {
  if (ko.components.isRegistered(componentName)) {
    return;
  }
  ko.components.register(componentName, {
    template: {
      fromPath: `/servicetypes/${uid}/components/${
        templateName ?? componentName
      }.html`,
    },
    viewModel: {
      viaLoader: `/servicetypes/${uid}/components/${
        moduleName ?? componentName
      }.js`,
    },
  });
}
