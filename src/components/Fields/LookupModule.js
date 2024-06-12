import { html, BaseFieldModule } from "./BaseFieldModule.js";

const editTemplate = html``;
const viewTemplate = html``;

export class LookupModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  static view = "lookup-view";
  static edit = "lookup-edit";
  static new = "lookup-new";
}
ko.components.register(LookupModule.edit, {
  template: editTemplate,
  viewModel: LookupModule,
});

ko.components.register(LookupModule.view, {
  template: viewTemplate,
  viewModel: LookupModule,
});
