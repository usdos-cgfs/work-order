import { html } from "../BaseComponent.js";
export const approvalTemplate = html`
  <!-- ko if: assignment.Status == assignmentStates.InProgress -->
  <div
    class="m-1 card"
    data-bind="css: {'text-bg-success': assignment.Status == assignmentStates.Approved }"
  >
    <div class="card-body">
      <h6>Your approval has been requested:</h6>
      <div class="d-flex justify-content-between">
        <div>
          <div>
            Assignee: <span data-bind="text: assignment.Assignee?.Title"></span>
          </div>
          <div>
            Request Org:
            <span data-bind="text: assignment.RequestOrg?.Title"></span>
          </div>
        </div>
        <div class="d-flex justify-content-start">
          <button class="btn btn-success" data-bind="click: approveHandler">
            Approve
          </button>
          <button class="ms-3 btn btn-danger" data-bind="click: showReject">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Approved -->
  <div class="alert alert-success">
    <strong>Thank you for approving!</strong>
    <button class="btn btn-link" data-bind="click: showReject">
      Reject Instead
    </button>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Rejected -->
  <div class="alert alert-danger">
    <strong>This request has been rejected</strong>
  </div>
  <!-- /ko -->
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
