import { html } from "../BaseComponent.js";
export const constrainedEntityEditTemplate = html`
  <div>
    <div class="row mb-2 form-fields" data-bind="foreach: FormFields">
      <div
        class="col pb-3 form-field-component"
        data-bind="component: {
        name: components.edit, params: $data}, 
        class: width"
      ></div>
    </div>
  </div>
`;
