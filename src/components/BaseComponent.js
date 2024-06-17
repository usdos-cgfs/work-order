export const html = String.raw;

export function registerComponent(constructor) {
  ko.components.register(constructor.name, {
    template: constructor.template,
    viewModel: constructor,
  });
}
