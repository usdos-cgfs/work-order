import { html } from "../BaseComponent.js";
export const pipelineTemplate = html`
  <div class="card pipeline-module">
    <div class="card-body p-0">
      <div class="card-title d-flex m-0" data-bind="">
        <div class="d-flex flex-column justify-content-center mx-3 p-1">
          <i class="fa fa-3x" data-bind="class: Pipeline.Icon"></i>
        </div>
        <div class="flex-grow-1 bg-light-gray">
          <ol class="p-0 m-0 mt-4 d-flex">
            <!-- ko foreach: Pipeline.Stages -->
            <li
              class="d-flex stage-item flex-column justify-content-center px-3 py-1"
              data-bind="class: $parent.listItemTypeClass($data),
            click: $parent.setSelected"
            >
              <div class="d-flex align-items-center" data-bind="">
                <h4 style="color: inherit" data-bind="text: Step"></h4>
                <div class="mx-2"></div>
                <div>
                  <div class="fw-bold" data-bind="text: Title"></div>
                  <p data-bind="text: $parent.listItemSubText($data)"></p>
                </div>
              </div>
            </li>
            <!-- /ko -->
          </ol>
        </div>
      </div>
      <!-- ko if: ShowActionsArea -->
      <div class="">
        <div class="p-3">
          <div data-bind="using: SelectedStageDetail">
            <!-- ko if: IsCurrentStage() && CurrentUserActionableAssignments().length -->
            <div>
              <p class="text-secondary">
                Please complete the following assignment actions to advance this
                request.
              </p>
              <!-- ko foreach: CurrentUserActionableAssignments -->
              <div data-bind="foreach: Errors">
                <div
                  class="alert alert-warning"
                  role="alert"
                  data-bind="text: description"
                ></div>
              </div>
              <!-- ko using: getComponent({request: $parent.request}) -->
              <div
                data-bind="component: { name: actionComponentName, params: $data }"
              ></div>
              <!-- /ko -->
              <!-- /ko -->
            </div>
            <!-- /ko -->
            <div class="mt-4 accordion-item">
              <div class="accordion-header pointer">
                <h5
                  class="accordion-title collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#stage-assignment-body"
                  aria-expanded="false"
                >
                  Stage Assignments <i class="indicator fa fa-caret-down"></i>
                </h5>
              </div>
              <div
                id="stage-assignment-body"
                class="accordion-collapse collapse"
                style=""
              >
                <p class="text-secondary">
                  View and manage all assignments for this stage.
                </p>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Assigned To</th>
                      <th>Request Org</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Completed By</th>
                      <th>Completed On</th>
                      <!-- ko if: IsCurrentStage -->
                      <th>Action</th>
                      <!-- /ko -->
                    </tr>
                  </thead>
                  <tbody>
                    <!-- ko foreach: AllStageAssignments -->
                    <!-- <tr
                  data-bind="
                  css: {'pointer': isUserActionable()},
                  click: toggleExpanded
                  "
                > -->
                    <tr>
                      <td data-bind="text: Assignee?.Title"></td>
                      <td data-bind="text: RequestOrg?.Title"></td>
                      <td data-bind="text: Role"></td>
                      <td data-bind="text: Status"></td>
                      <td data-bind="text: ActionTaker?.Title ?? 'N/A'"></td>
                      <td
                        data-bind="text: CompletionDate?.toLocaleString() ?? 'N/A'"
                      ></td>
                      <!-- ko if: $parent.IsCurrentStage -->
                      <td>
                        <!-- ko if: $parent.userCanAssign -->
                        <i
                          class="fas fa-search pointer"
                          data-bind="click: $parent.view"
                        ></i>
                        <i
                          class="fa fa-trash pointer"
                          data-bind="click: $parent.remove"
                        ></i>
                        <!-- /ko -->
                      </td>
                      <!-- /ko -->
                    </tr>
                    <!-- ko if: false && $parent.IsCurrentStage() && isUserActionable() && isExpanded() -->
                    <tr>
                      <td colspan="7" data-bind=""></td>
                    </tr>
                    <!-- /ko -->
                    <!-- /ko -->
                  </tbody>
                </table>
                <!-- ko if: userCanAssign() -->
                <div
                  data-bind="component: { name: 'new-assignment', params: {addAssignment: addNew } }"
                ></div>
                <!-- /ko -->
              </div>
            </div>
          </div>
          <!-- ko if: false -->
          <div>
            <!-- ko using: request.Assignments.CurrentStage -->
            <!-- ko if: AssignmentComponents().length -->
            <div data-bind="foreach: Validation.Errors">
              <div
                class="alert alert-warning"
                role="alert"
                data-bind="text: description"
              ></div>
            </div>
            <div class="">
              <!-- ko foreach: AssignmentComponents -->
              <div
                data-bind="component: {name: actionComponentName, params: $data }"
              ></div>
              <!-- /ko -->
            </div>
            <!-- /ko -->
            <!-- /ko -->
          </div>
          <!-- /ko -->
        </div>
      </div>
      <!-- /ko -->
    </div>
  </div>
`;
