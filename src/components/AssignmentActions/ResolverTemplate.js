import { html } from "../BaseComponent.js";
export const resolverTemplate = html`
  <!-- ko if: assignment.Status != assignmentStates.Completed -->
  <div class="card m-1">
    <div class="card-body">
      <div>
        <h6>You have been designated as an action office resolver:</h6>
      </div>
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
        <div>
          <p>Please confirm you have completed any necessary actions!</p>
          <div class="d-flex justify-content-start">
            <button
              class="ms-3 btn btn-success"
              data-bind="click: completeHandler"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Completed -->
  <div class="alert alert-success">
    <strong>Thank you for confirming!</strong>
  </div>
  <!-- /ko -->
`;
