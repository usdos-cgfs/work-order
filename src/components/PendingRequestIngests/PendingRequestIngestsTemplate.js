import { html } from "../BaseComponent.js";

export const pendingRequestsIngestTemplate = html`
  <!-- ko if: PendingRows().length -->
  <div class="card">
    <div class="card-body">
      <div
        class="card-title d-flex justify-content-between align-items-center accordion-header"
      >
        <h4
          class="mx-0 px-2 flex-grow-1 pointer accordion-title collapsed d-flex align-items-center justify-content-between"
          data-bs-toggle="collapse"
          data-bs-target="#pending-ingest-body"
        >
          (<span data-bind="text: PendingRows().length"></span>) Pending
          Conversion
          <i class="indicator fa fa-caret-down"></i>
        </h4>
      </div>
      <div id="pending-ingest-body" class="accordion-collapse collapse">
        <table class="table table-sm hover">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Convert To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: PendingRows">
            <tr data-bind="">
              <td>
                <button
                  type="button"
                  class="btn btn-link"
                  title="Toggle additional details"
                  data-bind="text: requestIngest.Title.toString(), 
                    toggles: ShowBody"
                ></button>
              </td>
              <td>
                <select
                  data-bind="options: $parent.ConvertToOptions, 
            optionsText: 'Title',
            optionsCaption: 'Select...',
            value: ConvertTo"
                ></select>
              </td>
              <td>
                <button
                  type="button"
                  title="Delete Item"
                  class="btn btn-link"
                  data-bind="click: $parent.deleteItem"
                >
                  <span class="fas fa-trash pointer"></span>
                </button>
              </td>
            </tr>
            <!-- ko if: ShowBody -->
            <!-- ko using: requestIngest -->
            <tr>
              <td colspan="3">
                <div class="d-flex justify-content-start gap-5 w-full">
                  <div
                    data-bind="component: {
                      name: To.components.view, 
                      params: To}"
                  ></div>
                  <div
                    data-bind="component: {
                      name: CC.components.view, 
                      params: CC}"
                  ></div>
                  <div
                    data-bind="component: {
                      name: From.components.view, 
                      params: From}"
                  ></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <div
                  style="max-height: 75vh"
                  class="overflow-auto"
                  data-bind="component: {
                    name: Body.components.view, 
                    params: Body}"
                ></div>
              </td>
            </tr>
            <!-- /ko -->
            <!-- /ko -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- /ko -->
`;
