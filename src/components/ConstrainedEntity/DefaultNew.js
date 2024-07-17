import { html } from "../BaseComponent.js";
export const constrainedEntityNewTemplate = html`
  <div>
    <div class="row" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}, class: width"
      ></div>
    </div>
  </div>
`;
