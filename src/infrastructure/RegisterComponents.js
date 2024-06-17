import ConstrainedEntityModule from "../components/ConstrainedEntity/ConstrainedEntityModule.js";
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

  // Regular Components
  // registerComponentFromPath({
  //   name: "pending-request-ingests",
  //   folder: "PendingRequestIngests",
  //   module: "PendingRequestIngestsModule",
  //   template: "PendingRequestIngestsTemplate",
  // });

  // registerComponentFromPath({
  //   name: "approver-actions",
  //   folder: "AssignmentActions",
  //   module: "ApprovalModule",
  //   template: "ApprovalTemplate",
  // });

  // registerComponentFromPath({
  //   name: "resolver-actions",
  //   folder: "AssignmentActions",
  //   module: "ResolverModule",
  //   template: "ResolverTemplate",
  // });

  // registerComponentFromPath({
  //   name: "assigner-actions",
  //   folder: "AssignmentActions",
  //   module: "AssignModule",
  //   template: "AssignTemplate",
  // });

  // registerComponentFromPath({
  //   name: "open-requests-table",
  //   folder: "RequestsByStatus",
  //   module: "RequestsByStatusTableModule",
  //   template: "OpenRequestsTableTemplate",
  // });

  // registerComponentFromPath({
  //   name: "open-office-requests-table",
  //   folder: "RequestsByStatus",
  //   module: "RequestsByStatusTableModule",
  //   template: "OpenOfficeRequestsTableTemplate",
  // });

  // registerComponentFromPath({
  //   name: "closed-requests-table",
  //   folder: "RequestsByStatus",
  //   module: "RequestsByStatusTableModule",
  //   template: "ClosedRequestsTableTemplate",
  // });

  // Requests By Service Type
  // registerComponentFromPath({
  //   name: "requests-by-service-type",
  //   folder: "RequestsByServiceType",
  //   module: "RequestsByServiceTypeModule",
  //   template: "RequestsServiceTypeTemplate",
  // });

  // registerComponentFromPath({
  //   name: "requests-by-service-type-table",
  //   folder: "RequestsByServiceType",
  //   module: "RequestsByServiceTypeTableModule",
  //   template: "RequestsServiceTypeTableTemplate",
  // });

  // registerComponentFromPath({
  //   name: "my-assignments-table",
  //   folder: "MyAssignments",
  //   module: "MyAssignmentsModule",
  //   template: "MyAssignmentsTemplate",
  // });

  // registerComponentFromPath({
  //   name: "request-header-view",
  //   folder: "RequestHeader",
  //   module: "RequestHeaderModule",
  //   template: "RequestHeaderViewTemplate",
  // });

  // registerComponentFromPath({
  //   name: "request-header-edit",
  //   folder: "RequestHeader",
  //   module: "RequestHeaderModule",
  //   template: "RequestHeaderEditTemplate",
  // });

  // registerComponentFromPath({
  //   name: "request-body-view",
  //   folder: "RequestBody",
  //   module: "RequestBodyModule",
  //   template: "RequestBodyViewTemplate",
  // });
  // registerComponentFromPath({
  //   name: "request-body-edit",
  //   folder: "RequestBody",
  //   module: "RequestBodyModule",
  //   template: "RequestBodyEditTemplate",
  // });

  registerComponentFromPath({
    name: "pipeline-component",
    folder: "Pipeline",
    module: "PipelineModule",
    template: "PipelineTemplate",
  });

  registerComponentFromPath({
    name: "quick-info",
    folder: "QuickInfo",
    module: "QuickInfoModule",
    template: "QuickInfoTemplate",
  });

  registerComponentFromPath({
    name: "new-assignment",
    folder: "NewAssignment",
    module: "NewAssignmentModule",
    template: "NewAssignmentTemplate",
  });

  registerComponentFromPath({
    name: "task-toast",
    folder: "Toasts",
    module: "TaskToastModule",
    template: "TaskToastTemplate",
  });
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
        viewModel: ConstrainedEntityModule,
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
