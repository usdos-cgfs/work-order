import { html } from "../../../components/BaseComponent.js";
export const chOvertimeViewTemplate = html`
  <div data-bind="using: FieldMap">
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: FullName.Visible,
        component: {name: FullName.components.view, params: FullName}, 
        class: FullName.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: GovManager.Visible,
        component: {name: GovManager.components.view, params: GovManager}, 
        class: GovManager.width"
      ></div>
    </div>
    <div class="py-2">
      <h6 class="">Overtime Dates (within month estimate):</h6>
      <div class="row">
        <div
          class="col pb-2"
          data-bind="
        visible: DateStart.Visible,
        component: {name: DateStart.components.view, params: DateStart}, 
        class: DateStart.width"
        ></div>
        <div
          class="col pb-2"
          data-bind="
        visible: DateEnd.Visible,
        component: {name: DateEnd.components.view, params: DateEnd}, 
        class: DateEnd.width"
        ></div>
      </div>
    </div>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: Hours.Visible,
        component: {name: Hours.components.view, params: Hours}, 
        class: Hours.width"
      ></div>
    </div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: APM.Visible,
    component: {name: APM.components.view, params: APM}, 
    class: APM.width"
    ></div>
    <div
      class="col pb-2"
      data-bind="
  visible: GTM.Visible,
  component: {name: GTM.components.view, params: GTM}, 
  class: GTM.width"
    ></div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: COR.Visible,
    component: {name: COR.components.view, params: COR}, 
    class: COR.width"
    ></div>
  </div>
  <!-- ko if: ContractorSupplementField.Value()?.Title -->
  <div class="py-3">
    <h5 class="text-secondary">Contractor Supplemental Information</h5>
    <div
      data-bind="component: {name: supplementComponents.view, params: {Entity: ContractorSupplementField.Value()} }"
    ></div>
  </div>
  <!-- /ko -->
`;
