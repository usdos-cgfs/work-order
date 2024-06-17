import { html } from "../BaseComponent.js";
export const requestsByServiceTypeTemplate = html`
  <select
    class="form-select"
    data-bind="value: SelectedService, 
options: ServiceTypes, 
optionsCaption: 'Select...', 
optionsText: 'Title'"
  ></select>
  <!-- ko if: SelectedService -->
  <div
    data-bind="component: {name: 'requests-by-service-type-table', params: {key, service: SelectedService()}}"
  ></div>
  <!-- /ko -->
`;
