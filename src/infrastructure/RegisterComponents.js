import { ConstrainedEntityComponents } from "../components/index.js";
import * as Components from "../components/index.js";
export const html = String.raw;

export function RegisterComponents() {
  // register our components
  for (const key in Components) {
    const component = Components[key];
    if (component.prototype instanceof Components.BaseComponent) {
      registerComponentFromConstructor(component);
    }
  }
}

export function registerComponentFromConstructor(constructor) {
  ko.components.register(constructor.name, {
    template: constructor.template,
    viewModel: constructor,
  });
}

export function registerComponentFromPath({
  name,
  folder,
  module: moduleFilename,
  template: templateFilename,
}) {
  if (ko.components.isRegistered(name)) {
    return;
  }
  ko.components.register(name, {
    template: {
      fromPath: `/components/${folder}/${templateFilename}.html`,
    },
    viewModel: {
      viaLoader: `/components/${folder}/${moduleFilename}.js`,
    },
  });
}

export function registerServiceTypeViewComponents({ uid, components }) {
  // If we don't specify a view, default to the template views
  Object.keys(components).forEach((view) => {
    const componentName = components[view];
    if (!ko.components.isRegistered(componentName)) {
      ko.components.register(componentName, {
        template: {
          fromPath: `/servicetypes/${uid}/views/${view}.html`,
          fallback: `/components/ConstrainedEntity/Default${view}.html`,
        },
        // viewModel: ConstrainedEntityComponents,
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
