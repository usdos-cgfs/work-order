import { html } from "../BaseComponent.js";
export const requestsByServiceTypeTableTemplate = html`
  <!-- ko if: HasInitialized -->
  <div class="my-3">
    <table
      class="table table-striped table-hover"
      data-bind="childrenComplete: tableHasRendered, attr: {'id': getTableElementId()}"
    >
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Request Status</th>
          <!-- ko foreach: SupplementCols -->
          <th data-bind="text: displayName"></th>
          <!-- /ko -->
        </tr>
      </thead>
      <tbody data-bind="foreach: {data: AllRequests, as: 'rmap'}">
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: State.Status"></td>
          <!-- ko foreach: $parent.SupplementCols -->
          <td
            data-bind="text: rmap.RequestBodyBlob?.Value().FieldMap[key]?.toString()"
          ></td>
          <!-- /ko -->
        </tr>
      </tbody>
    </table>
  </div>
  <!-- /ko -->
`;
