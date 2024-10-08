import { html } from "../BaseComponent.js";
export const constrainedEntityViewTemplate = html`
  <div>
    <div class="row row-cols-1 row-cols-md-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}, class: width"
      ></div>
    </div>
  </div>
`;
