import { html } from "../BaseComponent.js";
export const assignTemplate = html`
  <div class="card m-1">
    <div class="card-body">
      <div>
        <h6>You have been designated as an action office assigner:</h6>
      </div>
      <div>
        Assignee: <span data-bind="text: assignment.Assignee?.Title"></span>
      </div>
      <div>
        Request Org:
        <span data-bind="text: assignment.RequestOrg?.Title"></span>
      </div>
      <!-- ko if: assignment.Status == assignmentStates.Completed -->
      <div class="badge text-bg-success">Complete!</div>
      <!-- <div>Assignments:</div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Assignee</th>
          <th>Role</th>
          <th>Stage</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: NewAssignments">
        <tr>
          <td data-bind="text: Assignee?.Title"></td>
          <td data-bind="text: Role"></td>
          <td data-bind="text: PipelineStage?.Title"></td>
        </tr>
      </tbody>
    </table> -->
      <div>Add another assignment:</div>
      <!-- /ko -->
      <div
        data-bind="component: { name: 'new-assignment', params: newAssignmentParams }"
      ></div>
    </div>
  </div>
`;
