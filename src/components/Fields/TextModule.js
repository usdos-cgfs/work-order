import { html, BaseFieldModule } from "./BaseFieldModule.js";

const editTemplate = html``;
const viewTemplate = html``;

export class TextModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  static view = "text-view";
  static edit = "text-edit";
  static new = "text-new";
}

ko.components.register(TextModule.edit, {
  template: editTemplate,
  viewModel: TextModule,
});

ko.components.register(TextModule.view, {
  template: viewTemplate,
  viewModel: TextModule,
});
