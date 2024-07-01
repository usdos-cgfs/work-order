import { html } from "../index.js";

export const emailRequestTemplate = html`
  <div>
    <button
      title="Create Email from Request"
      type="button"
      class="btn btn-link"
      data-bind="click: showDialog"
    >
      <i class="fa-solid fa-envelope"></i>
    </button>
  </div>
  <dialog id="dialog-email-request" class="card">
    <div class="card-body">
      <div class="card-title d-flex justify-content-between align-items-center">
        <div>
          <h3>Send Request as Email</h3>
        </div>
        <div class="d-flex justify-content-end">
          <i
            class="fa-solid fa-xmark pointer"
            data-bind="click: closeDialog"
          ></i>
        </div>
      </div>
      <div data-bind="with: notification">
        <div
          data-bind="component: {name: Body.components.edit, params: Body}"
        ></div>
      </div>
    </div>
  </dialog>
`;
