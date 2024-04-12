import { People } from "../entities/People.js";
import { ensureUserByKeyAsync } from "../infrastructure/SAL.js";
import { assetsPath } from "../env.js";

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

ko.observableArray.fn.subscribeAdded = function (callback) {
  this.subscribe(
    function (arrayChanges) {
      const addedValues = arrayChanges
        .filter((value) => value.status == "added")
        .map((value) => value.value);
      callback(addedValues);
    },
    this,
    "arrayChange"
  );
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

ko.bindingHandlers.files = {
  init: function (element, valueAccessor) {
    function addFiles(fileList) {
      var value = valueAccessor();
      if (!fileList.length) {
        value.removeAll();
        return;
      }

      const existingFiles = ko.unwrap(value);
      const newFileList = [];
      for (let file of fileList) {
        if (!existingFiles.find((exFile) => exFile.name == file.name))
          newFileList.push(file);
      }
      ko.utils.arrayPushAll(value, newFileList);
      return;
    }

    ko.utils.registerEventHandler(element, "change", function () {
      addFiles(element.files);
    });

    const label = element.closest("label");
    if (!label) return;

    ko.utils.registerEventHandler(label, "dragover", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    ko.utils.registerEventHandler(label, "dragenter", function (event) {
      event.preventDefault();
      event.stopPropagation();
      label.classList.add("dragging");
    });

    ko.utils.registerEventHandler(label, "dragleave", function (event) {
      event.preventDefault();
      event.stopPropagation();
      label.classList.remove("dragging");
    });

    ko.utils.registerEventHandler(label, "drop", function (event) {
      event.preventDefault();
      event.stopPropagation();
      let dt = event.originalEvent.dataTransfer;
      let files = dt.files;
      addFiles(files);
    });
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    const value = valueAccessor();
    if (!value().length && element.files.length) {
      // clear all files
      element.value = null;
      return;
    }

    return;
  },
};

ko.bindingHandlers.toggles = {
  init: function (element, valueAccessor) {
    var value = valueAccessor();

    ko.utils.registerEventHandler(element, "click", function () {
      value(!value());
    });
  },
};

ko.bindingHandlers.people = {
  init: function (element, valueAccessor, allBindings) {
    const pickerOptions = allBindings.get("pickerOptions") ?? {};

    if (ko.isObservable(pickerOptions)) {
      pickerOptions.subscribe(initPickerElement);
    }

    initPickerElement(ko.unwrap(pickerOptions));

    function initPickerElement(pickerOptions) {
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
        var pickerControl =
          SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
        var observable = valueAccessor();
        var userJSObject = pickerControl.GetControlValueAsJSObject()[0];
        if (!userJSObject) {
          observable(null);
          return;
        }

        if (userJSObject.IsResolved) {
          if (userJSObject.Key == observable()?.LoginName) return;
          var user = await ensureUserByKeyAsync(userJSObject.Key);
          var person = new People(user);
          observable(person);
        }
      };

      Object.assign(schema, pickerOptions);

      // TODO: Minor - accept schema settings as options
      //var mergedOptions = Object.assign(schema, obs.schemaOpts);

      //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
      //  ID to our element, no other options
      SPClientPeoplePicker_InitStandaloneControlWrapper(
        element.id,
        null,
        schema
      );

      for (const input of document
        .getElementById(element.id)
        .querySelectorAll("input")) {
        input.setAttribute("autocomplete", "off");
        input.setAttribute("aria-autocomplete", "none");
      }
      // const helpDiv = document.createElement("div");
      // helpDiv.innerHTML = "Search surname first e.g. Smith, John";
      // helpDiv.classList.add("fst-italic", "fw-lighter");
      // element.appendChild(helpDiv);
    }
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
    var userValue = ko.utils.unwrapObservable(valueAccessor());

    if (!userValue) {
      // Clear the form
      pickerControl?.DeleteProcessedUser();
      return;
    }

    if (
      userValue &&
      !pickerControl
        .GetAllUserInfo()
        .find((pickerUser) => pickerUser.DisplayText == userValue.LookupValue)
    ) {
      pickerControl.AddUserKeys(
        userValue.LoginName ?? userValue.LookupValue ?? userValue.Title
      );
    }
  },
};

const fromPathTemplateLoader = {
  loadTemplate: function (name, templateConfig, callback) {
    if (templateConfig.fromPath) {
      // TODO: Minor - fix error catching and fallback flow
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
      // console.log("loading module", name);
      const module = import(assetsPath + viewModelConfig.viaLoader).then(
        (module) => {
          // console.log("imported module", name);
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
