import { html, BaseFieldModule } from "./BaseFieldModule.js";

const editTemplate = html``;
const viewTemplate = html``;

export class SelectModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  static view = "select-view";
  static edit = "select-edit";
  static new = "select-new";
}

ko.components.register(SelectModule.edit, {
  template: editTemplate,
  viewModel: SelectModule,
});

ko.components.register(SelectModule.view, {
  template: viewTemplate,
  viewModel: SelectModule,
});
