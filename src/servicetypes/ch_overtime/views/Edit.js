import { html } from "../../../components/BaseComponent.js";
export const chOvertimeEditTemplate = html`
  <div data-bind="using: FieldMap">
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: FullName.Visible,
        component: {name: FullName.components.edit, params: FullName}, 
        class: FullName.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: GovManager.Visible,
        component: {name: GovManager.components.edit, params: GovManager}, 
        class: GovManager.width"
      ></div>
    </div>
    <h6>Overtime Dates (within month estimate):</h6>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: DateStart.Visible,
        component: {name: DateStart.components.edit, params: DateStart}, 
        class: DateStart.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: DateEnd.Visible,
        component: {name: DateEnd.components.edit, params: DateEnd}, 
        class: DateEnd.width"
      ></div>
    </div>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: Hours.Visible,
        component: {name: Hours.components.edit, params: Hours}, 
        class: Hours.width"
      ></div>
    </div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: APM.Visible,
    component: {name: APM.components.edit, params: APM}, 
    class: APM.width"
    ></div>
    <div
      class="col pb-2"
      data-bind="
  visible: GTM.Visible,
  component: {name: GTM.components.edit, params: GTM}, 
  class: GTM.width"
    ></div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: COR.Visible,
    component: {name: COR.components.edit, params: COR}, 
    class: COR.width"
    ></div>
  </div>
  <!-- ko if: ContractorSupplementField.Value -->
  <div
    data-bind="component: {name: supplementComponents.view, params: {Entity: ContractorSupplementField.Value()} }"
  ></div>
  <!-- /ko -->
`;
