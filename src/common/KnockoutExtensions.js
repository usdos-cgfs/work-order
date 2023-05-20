import { People } from "../components/People.js";
import { ensureUserByKeyAsync } from "../infrastructure/SAL.js";
import { assetsPath } from "../common/Router.js";

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
    schema["Width"] = "280px";
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
      fetch(assetsPath + templateConfig.fromPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Fetching the HTML file went wrong - ${response.statusText}`
            );
          }
          return response.text();
        })
        .then((text) =>
          ko.components.defaultLoader.loadTemplate(name, text, callback)
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

ko.components.register("approver-actions", {
  template: { fromPath: "/components/AssignmentActions/ApprovalTemplate.html" },
  viewModel: { viaLoader: "/components/AssignmentActions/ApprovalModule.js" },
});

ko.components.register("resolver-actions", {
  template: { fromPath: "/components/AssignmentActions/ResolverTemplate.html" },
  viewModel: { viaLoader: "/components/AssignmentActions/ResolverModule.js" },
});

export function registerServiceTypeComponent(
  componentName,
  moduleName,
  serviceTypeUid
) {
  if (ko.components.isRegistered(componentName)) {
    return;
  }
  ko.components.register(componentName, {
    template: {
      fromPath: `/entities/ServiceTypeTemplates/${serviceTypeUid}/${componentName}-template.html`,
    },
    viewModel: {
      viaLoader: `/entities/ServiceTypeTemplates/${serviceTypeUid}/${moduleName}-module.js`,
    },
  });
}

export async function registerServiceTypeTemplate(
  templateName,
  serviceTypeUid
) {
  const templateId = "tmpl-" + templateName;
  if (!document.getElementById(templateId)) {
    const templateRelPath = `/entities/ServiceTypeTemplates/${serviceTypeUid}/${templateName}-template.html`;
    await fetchTemplate(templateId, templateRelPath);
  }
  return templateId;
}

async function fetchTemplate(templateId, templatePath) {
  const response = await fetch(assetsPath + templatePath);

  if (!response.ok) {
    console.error(
      `Fetching the HTML file went wrong - ${response.statusText}`,
      templatePath
    );
    // throw new Error(
    //   `Fetching the HTML file went wrong - ${response.statusText}`
    // );
  }

  const text = await response.text();
  const element = document.createElement("script");

  element.setAttribute("type", "text/html");
  element.setAttribute("id", templateId);
  element.text = text;

  document.getElementById("service-type-templates").append(element);
}
