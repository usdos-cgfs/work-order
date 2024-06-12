import { html, BaseFieldModule } from "./BaseFieldModule.js";

const editTemplate = html``;
const viewTemplate = html``;

export class CheckboxModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  static view = "checkbox-view";
  static edit = "checkbox-edit";
  static new = "checkbox-new";
}

ko.components.register(CheckboxModule.edit, {
  template: editTemplate,
  viewModel: CheckboxModule,
});

ko.components.register(CheckboxModule.view, {
  template: viewTemplate,
  viewModel: CheckboxModule,
});
