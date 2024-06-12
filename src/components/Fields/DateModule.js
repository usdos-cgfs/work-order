import { html, BaseFieldModule } from "./BaseFieldModule.js";

const editTemplate = html``;
const viewTemplate = html``;

export class DateModule extends BaseFieldModule {
  constructor(params) {
    super(params);
  }

  static view = "date-view";
  static edit = "date-edit";
  static new = "date-new";
}

ko.components.register(DateModule.edit, {
  template: editTemplate,
  viewModel: DateModule,
});

ko.components.register(DateModule.view, {
  template: viewTemplate,
  viewModel: DateModule,
});
