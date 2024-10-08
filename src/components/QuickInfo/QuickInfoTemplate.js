import { html } from "../BaseComponent.js";
export const quickInfoTemplate = html`
  <div id="quick-info" class="d-flex justify-content-between mb-3">
    <div class="action-group d-flex flex-column justify-content-end">
      <!-- ko if: ShowActionOfficeToggle -->
      <div class="form-check form-switch">
        <label class="form-check-label"
          >Enable System Action Office Features
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            data-bind="checked: ToggleActionOfficeFeatures"
        /></label>
      </div>
      <!-- /ko -->
      <button
        class="btn btn-primary mb-3"
        data-bind="click: $root.SelectNewRequest"
        type="button"
      >
        New Request <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="ms-auto status-cards" style="min-width: 20rem">
      <div class="status-info open-assignments">
        <div
          class="card info-header"
          title="Toggle Open Assignments"
          data-bind="click: toggleInfoContainer"
        >
          <div class="card-body">
            <img
              src="/sites/CGFS/Style Library/apps/wo/assets/Direct Assignments.svg"
            />
            <h5 data-bind="text: MyOpenAssignments().length"></h5>
            Open Assignments
          </div>
        </div>
        <div
          class="info-table-container alert"
          data-bind="class: MyOpenAssignments().length > 0 ? 'alert-warning' : 'alert-success'"
        >
          <div class="card-body">
            <!-- ko ifnot: MyOpenAssignments().length -->
            <p>Nothing to Show!</p>
            <!-- /ko -->
            <!-- ko if: MyOpenAssignments().length -->
            <table class="table table-warning table-sm table-hover m-0">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Assignee</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody data-bind="foreach: MyOpenAssignments">
                <tr
                  title="Go to Request"
                  class="pointer"
                  data-bind="click: () => $root.viewRequestByTitle($data.Request.Title)"
                >
                  <td data-bind="text: Request.Title"></td>
                  <td data-bind="text: Assignee?.Title"></td>
                  <td data-bind="text: Role"></td>
                </tr>
              </tbody>
            </table>
            <!-- /ko -->
          </div>
        </div>
      </div>
      <!-- ko if: ShowActionOfficeFeatures -->
      <div class="status-info late-requests">
        <div
          class="card info-header"
          title="Toggle Team Late Requests"
          data-bind="click: toggleInfoContainer"
        >
          <div class="card-body">
            <img
              src="/sites/CGFS/Style Library/apps/wo/assets/Late Requests.svg"
            />
            <h5 data-bind="text: LateRequests().length"></h5>
            Late Requests
          </div>
        </div>
        <div
          class="info-table-container alert"
          data-bind="class: LateRequests().length > 0 ? 'alert-danger' : 'alert-success'"
        >
          <div class="card-body">
            <!-- ko ifnot: LateRequests().length -->
            <p>Nothing to Show!</p>
            <!-- /ko -->
            <!-- ko if: LateRequests().length -->
            <table class="table table-danger table-sm table-hover m-0">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Service Type</th>
                  <th>Est. Closed Date</th>
                </tr>
              </thead>
              <tbody data-bind="foreach: LateRequests">
                <tr
                  class="pointer"
                  title="Go to Request"
                  data-bind="click: $root.ViewRequest"
                >
                  <td data-bind="text: Title"></td>
                  <td data-bind="text: RequestType.Title"></td>
                  <td
                    data-bind="text: Dates.EstClosed.toLocaleDateString()"
                  ></td>
                </tr>
              </tbody>
            </table>
            <!-- /ko -->
          </div>
        </div>
      </div>
      <div
        class="w-full"
        data-bind='component: "pending-request-ingests"'
      ></div>
      <!-- /ko -->
    </div>
  </div>

  <style>
    #quick-info {
      gap: 1rem;
    }

    #quick-info .action-group {
      min-width: 224px;
      width: 224px;
      padding: 1rem;
    }

    #quick-info .status-cards {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: end;
    }

    #quick-info img {
      width: 2.5rem;
      height: 2.5rem;
      background-color: white;
      border-radius: 6px;
      margin-bottom: 8px;
      padding: 0.25rem;
    }

    .status-info {
      display: flex;
      flex-direction: row;
      justify-content: end;
    }

    .status-info .info-header {
      height: 138px;
      width: 230px;
      color: white;
      cursor: pointer;
      z-index: 5;
    }

    .status-info .info-header:hover {
      filter: brightness(0.9);
    }

    .status-info.open-assignments .info-header {
      background: linear-gradient(145deg, #4d547e, #303346);
    }

    .status-info.late-requests .info-header {
      background: linear-gradient(145deg, #fc6f7f, #ec1719);
    }

    .status-info .info-table-container {
      /* display: none; */
      border-radius: 6px;
      position: relative;
      left: -34px;
      z-index: 4;
      overflow: hidden;
      max-height: 0px;
      transition: max-height 0.35s ease-out;
      max-width: 0px;
      transition: max-width 0.35s ease-out;
    }

    .status-info.active .info-table-container {
      padding: 1rem 1rem 1rem 50px;
      max-height: 450px;
      transition: max-height 0.35s ease-in;
      max-width: 500px;
      transition: max-width 0.35s ease-in;
    }

    .status-info .info-table-container .card-body {
      max-height: 198px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .status-info .info-table-container table thead {
      position: sticky;
      top: 0;
      text-wrap: nowrap;
    }
    /* #quick-info .status-info {
    display: block;
  } */
  </style>
`;
