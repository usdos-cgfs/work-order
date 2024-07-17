import { html } from "../../../components/BaseComponent.js";
export const itSoftwareViewTemplate = html`
  <div>
    <!-- ko if: ShowCreateProcurementButton -->
    <button
      type="button"
      class="btn btn-primary w-100"
      data-bind="click: createProcurement"
    >
      Create Procurement
    </button>
    <!-- /ko -->
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
  </div>
`;
