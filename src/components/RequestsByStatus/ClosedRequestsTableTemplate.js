import { html } from "../BaseComponent.js";
export const closedRequestsTableTemplate = html`
  <div data-bind="">
    <div class="d-flex justify-content-between">
      <h2 class="mx-0" data-bind="text: filter.Title"></h2>
      <i class="fa fa-sync pointer" data-bind="click: refresh"></i>
    </div>

    <!-- <input type="checkbox" data-bind="checked: ShowAssignees" /> -->
    <!-- <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bind="click: loadAssignments"
    >
      Show Assignees
    </button>
  </div> -->
    <table
      class="table table-striped table-hover w-100"
      data-bind="attr: {id: getTableElementId() } "
    >
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Service Type</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Submitted Date</th>
          <th>Est. Completion Date</th>
          <th>Closed Date</th>
        </tr>
      </thead>
      <!-- ko if: IsLoading -->
      <tbody data-bind="">
        <tr class="">
          <td colspan="7" class="p-0">
            <progress class="w-100"></progress>
          </td>
        </tr>
      </tbody>
      <!-- /ko -->
      <!-- ko ifnot: IsLoading -->
      <tbody data-bind="childrenComplete: tableBodyComplete">
        <!-- ko foreach: FilteredRequests -->
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestType.Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: Dates.Submitted.toSortableDateString()"></td>
          <td data-bind="text: Dates.EstClosed.toSortableDateString()"></td>
          <td data-bind="text: Dates.Closed.toSortableDateString()"></td>
        </tr>
        <!-- /ko -->
      </tbody>
      <!-- /ko -->
      <tfoot>
        <tr>
          <th clear-width data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- <button class="btn btn-primary" data-bind="click: loadMore">
    Load More...
  </button> -->
`;
