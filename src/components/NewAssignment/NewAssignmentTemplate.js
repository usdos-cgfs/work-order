import { html } from "../BaseComponent.js";
export const newAssignmentTemplate = html`
  <div class="input-group">
    <span class="input-group-text">Add New Assignment</span>
    <div
      class="people-new-assignee"
      data-bind="attr: {id: getAsigneeElementID()}, people: Assignee"
    ></div>
    <select
      name=""
      id=""
      class="form-select"
      data-bind="value: Role,
      options: Roles,
      optionsText: (role) => role.LookupValue,
      optionsCaption: 'Select...'"
    ></select>
    <button
      type="button"
      class="btn btn-primary"
      data-bind="click: submit,
    enable: Role() && Assignee()"
    >
      Submit
    </button>
  </div>
  <!-- ko if: Role -->
  <div class="mt-2 p-1 ps-2 alert alert-info">
    <strong><span data-bind="text: Role().LookupValue"></span>:</strong>
    <span data-bind="text: Role().description"></span>
  </div>
  <!-- /ko -->
`;
