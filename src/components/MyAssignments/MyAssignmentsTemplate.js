import { html } from "../BaseComponent.js";
export const myAssignmentsTemplate = html`
  <table
    id="my-assignments-table"
    class="table table-striped table-hover w-100"
  >
    <thead>
      <tr>
        <th>Request</th>
        <th>Service Type</th>
        <th>Requesting Office</th>
        <th>Requestor</th>
        <th>Est Closed</th>
        <!-- <th>Role(s)</th> -->
      </tr>
    </thead>
    <!-- ko if: IsLoading -->
    <tbody data-bind="">
      <tr class="">
        <td colspan="6" class="p-0">
          <progress class="w-100"></progress>
        </td>
      </tr>
    </tbody>
    <!-- /ko -->
    <!-- ko ifnot: IsLoading -->
    <tbody
      data-bind="childrenComplete: myPostProcessingLogic, foreach: MyAssignedRequests"
    >
      <tr class="pointer" data-bind="click: () => $root.ViewRequest($data)">
        <td data-bind="text: Title"></td>
        <td data-bind="text: RequestType.Title"></td>
        <td data-bind="text: RequestorInfo.Office()?.Title"></td>
        <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
        <td data-bind="text: Dates.EstClosed.toSortableDateString()"></td>
        <!-- ko if: false -->
        <td>
          <!-- ko foreach: Assignments.list.CurrentUserAssignments -->
          <div
            class="position-relative my-1 py-1 alert"
            data-bind="class: $parents[1].assignmentStatusClass($data)"
          >
            <span data-bind="text: Role"> </span>
          </div>
          <!-- /ko -->
        </td>
        <!-- /ko -->
      </tr>
    </tbody>
    <!-- /ko -->
  </table>

  <!-- <div>
  <p>Legend:</p>
  <div class="badge rounded-pill text-bg-warning">In Progress</div>
  <div class="badge rounded-pill text-bg-success">Completed</div>
  <div class="badge rounded-pill text-bg-secondary">No Action</div>
</div> -->
`;
