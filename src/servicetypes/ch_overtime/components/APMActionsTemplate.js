import { html } from "../../../components/BaseComponent.js";
export const apmActionsTemplate = html`
  <div class="card m-1">
    <div class="card-body">
      <h6>Please provide the GTM and COR:</h6>
      <!-- ko if: HasLoaded -->
      <div data-bind="using: newEntity">
        <div class="row">
          <div
            class="col pb-2"
            data-bind="component: {name: GTM.components[$parent.DisplayMode()], params: GTM}"
          ></div>
          <div
            class="col pb-2"
            data-bind="component: {name: COR.components[$parent.DisplayMode()], params: COR}"
          ></div>
        </div>
        <!-- Only show the addtional fields after GTM and COR have been provided -->
        <!-- ko if:  $parent.ShowSupplementComponent-->
        <div
          data-bind="component: {name: supplementComponents[$parent.DisplayMode()], params: {Entity: ContractorSupplementField.Value() }}"
        ></div>
        <!-- /ko -->
        <div>
          <!-- ko if: $parent.Editing -->
          <!-- ko if: $parent.IsCompleted -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: $parent.update, enable: ContractorSupplementField.Value().IsValid"
          >
            Update
          </button>
          <button
            class="btn btn-outline-danger"
            type="button"
            data-bind="click: () => $parent.Editing(false)"
          >
            Cancel
          </button>
          <!-- /ko -->
          <!-- ko ifnot: $parent.IsCompleted -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: $parent.submit, enable: ContractorSupplementField.Value().IsValid"
          >
            Save and Approve
          </button>
          <!-- /ko -->
          <button
            type="button"
            class="btn fluid btn-danger"
            data-bind="click: $parent.showReject"
          >
            Reject
          </button>
          <!-- /ko -->
          <!-- ko ifnot: $parent.Editing -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: () => $parent.Editing(true)"
          >
            Edit
          </button>
          <!-- /ko -->
        </div>
      </div>
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
