import { html } from "../../../components/BaseComponent.js";
export const govManagerActionsTemplate = html`
  <div class="card m-1">
    <div class="card-body">
      <h6>Please provide the APM and GTM (opt):</h6>
      <!-- ko if: Editing -->
      <div class="row">
        <div
          class="col pb-2"
          data-bind="component: {name: APM.components.edit, params: APM}"
        ></div>
        <div
          class="col pb-2"
          data-bind="component: {name: GTM.components.edit, params: GTM}"
        ></div>
      </div>
      <button
        type="button"
        class="btn fluid btn-primary"
        data-bind="click: submit"
      >
        Save and Approve
      </button>
      <button
        type="button"
        class="btn fluid btn-danger"
        data-bind="click: showReject"
      >
        Reject
      </button>
      <!-- /ko -->
      <!-- ko ifnot: Editing-->
      <div class="row">
        <div
          class="col pb-2"
          data-bind="component: {name: APM.components.view, params: APM}"
        ></div>
        <div
          class="col pb-2"
          data-bind="component: {name: GTM.components.view, params: GTM}"
        ></div>
      </div>
      <button
        type="button"
        class="btn fluid btn-primary"
        data-bind="click: () => Editing(true)"
      >
        Update
      </button>
      <!-- /ko -->
    </div>
  </div>
  <dialog class="" data-bind="attr: {id: rejectModalId}">
    <div class="d-flex flex-column justify-content-between h-100">
      <h4>Please Provide a Rejection Reason:</h4>
      <div class="alert alert-warning mb-3">
        Note: Rejecting this request will close the record! Closed requests
        cannot be re-opened!
      </div>
      <textarea
        class="form-control mb-3 flex-grow-1"
        data-bind="textInput: RejectReason"
      ></textarea>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-danger me-2"
          data-bind="click: reject, enable: RejectReason"
        >
          Reject
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-bind="click: cancelReject"
        >
          Cancel
        </button>
      </div>
    </div>
  </dialog>
`;
