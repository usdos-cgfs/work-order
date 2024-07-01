import { html } from "../../../components/BaseComponent.js";
export const diplomaticPassportEditTemplate = html`
  <div>
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: DocumentType.components.edit, params: DocumentType}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: RequestType.components.edit, params: RequestType}"
      ></div>
    </div>
    <!-- ko if: TypesSelected -->
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: JobTitle.components.edit, params: JobTitle}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: Grade.components.edit, params: Grade}"
      ></div>
    </div>
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: Supervisor.components.edit, params: Supervisor}"
      ></div>
    </div>
    <h4>Travel Information</h4>
    <div class="row row-cols-2" data-bind="foreach: TravelFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <h4>Personal Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PersonalFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <!-- ko if: ShowPassportInfo -->
    <h4>Passport Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PassportFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <!-- /ko -->
    <div
      class="col col-12 pb-2"
      data-bind="component: {name: FieldMap.Justification.components.edit, params: FieldMap.Justification}"
    ></div>
    <!-- /ko -->
  </div>
`;
