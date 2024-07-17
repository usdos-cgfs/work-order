import { html } from "../../../components/BaseComponent.js";
export const templateViewTemplate = html`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
  </div>
`;
