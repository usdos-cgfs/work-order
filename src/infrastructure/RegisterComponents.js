import ConstrainedEntityModule from "../components/ConstrainedEntity/ConstrainedEntityModule.js";

export function RegisterComponents() {
  // Regular Components
  registerComponent({
    name: "approver-actions",
    folder: "AssignmentActions",
    module: "ApprovalModule",
    template: "ApprovalTemplate",
  });

  registerComponent({
    name: "resolver-actions",
    folder: "AssignmentActions",
    module: "ResolverModule",
    template: "ResolverTemplate",
  });

  registerComponent({
    name: "assigner-actions",
    folder: "AssignmentActions",
    module: "AssignModule",
    template: "AssignTemplate",
  });

  registerComponent({
    name: "open-requests-table",
    folder: "RequestsByStatus",
    module: "RequestsByStatusTableModule",
    template: "OpenRequestsTableTemplate",
  });

  registerComponent({
    name: "open-office-requests-table",
    folder: "RequestsByStatus",
    module: "RequestsByStatusTableModule",
    template: "OpenOfficeRequestsTableTemplate",
  });

  registerComponent({
    name: "closed-requests-table",
    folder: "RequestsByStatus",
    module: "RequestsByStatusTableModule",
    template: "ClosedRequestsTableTemplate",
  });

  // Requests By Service Type
  registerComponent({
    name: "requests-by-service-type",
    folder: "RequestsByServiceType",
    module: "RequestsByServiceTypeModule",
    template: "RequestsServiceTypeTemplate",
  });

  registerComponent({
    name: "requests-by-service-type-table",
    folder: "RequestsByServiceType",
    module: "RequestsByServiceTypeTableModule",
    template: "RequestsServiceTypeTableTemplate",
  });

  registerComponent({
    name: "my-assignments-table",
    folder: "MyAssignments",
    module: "MyAssignmentsModule",
    template: "MyAssignmentsTemplate",
  });

  registerComponent({
    name: "request-header-view",
    folder: "RequestHeader",
    module: "RequestHeaderModule",
    template: "RequestHeaderViewTemplate",
  });

  registerComponent({
    name: "request-header-edit",
    folder: "RequestHeader",
    module: "RequestHeaderModule",
    template: "RequestHeaderEditTemplate",
  });

  registerComponent({
    name: "request-body-view",
    folder: "RequestBody",
    module: "RequestBodyModule",
    template: "RequestBodyViewTemplate",
  });
  registerComponent({
    name: "request-body-edit",
    folder: "RequestBody",
    module: "RequestBodyModule",
    template: "RequestBodyEditTemplate",
  });

  registerComponent({
    name: "pipeline-component",
    folder: "Pipeline",
    module: "PipelineModule",
    template: "PipelineTemplate",
  });

  registerComponent({
    name: "quick-info",
    folder: "QuickInfo",
    module: "QuickInfoModule",
    template: "QuickInfoTemplate",
  });

  registerComponent({
    name: "new-assignment",
    folder: "NewAssignment",
    module: "NewAssignmentModule",
    template: "NewAssignmentTemplate",
  });

  registerComponent({
    name: "task-toast",
    folder: "Toasts",
    module: "TaskToastModule",
    template: "TaskToastTemplate",
  });

  // registerFieldComponent("people");
  //registerFieldComponent("select");
}

export function registerComponent({
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

export function registerFieldComponent(name, components) {
  // register both our view and edit components

  Object.keys(components).map((view) => {
    const componentName = components[view];
    if (ko.components.isRegistered(componentName)) {
      return;
    }
    ko.components.register(componentName, {
      template: {
        fromPath: `/components/Fields/${name}/${name}${view}.html`,
      },
      viewModel: {
        viaLoader: `/components/Fields/${name}/${name}Module.js`,
      },
    });
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
