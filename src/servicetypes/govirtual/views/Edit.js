import { html } from "../../../components/BaseComponent.js";
export const govirtualEditTemplate = html`
  <div>
    <div class="row row-cols-2 form-fields">
      <div
        class="col pb-2"
        data-bind="component: {name: RequestingOffice.components.edit, params: RequestingOffice}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: ManagingDirector.components.view, params: ManagingDirector}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: AccessType.components.edit, params: AccessType}"
      ></div>
      <!-- ko if: DatesRequired -->
      <div
        class="col pb-2"
        data-bind="component: {name: StartDate.components.edit, params: StartDate}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: EndDate.components.edit, params: EndDate}"
      ></div>
      <!-- /ko -->
    </div>
  </div>
`;
