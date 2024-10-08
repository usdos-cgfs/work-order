import { html } from "../BaseComponent.js";
export const taskToastTemplate = html`
  <div
    class="toast show align-items-center"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body" data-bind="text: FormatMessage"></div>
      <button
        type="button"
        class="btn-close me-1 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
`;
