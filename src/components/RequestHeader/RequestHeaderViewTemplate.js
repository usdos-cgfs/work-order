import { html } from "../BaseComponent.js";
export const requestHeaderViewTemplate = html`
  <div class="container-fluid">
    <div class="row">
      <div class="col-6">
        <h6>Request Status:</h6>
        <p
          data-bind="text: State.Status, class: 'state-' + State.Status()?.toLowerCase()"
        ></p>
      </div>
      <!-- ko if: Dates.Closed.get -->
      <div class="col-6">
        <h6>Closed:</h6>
        <p data-bind="text: Dates.Closed.toLocaleDateString()"></p>
      </div>
      <!-- /ko -->
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Request ID:</h6>
        <p data-bind="text: ObservableTitle"></p>
      </div>
      <div class="col-6">
        <h6>Requesting Org:</h6>
        <p data-bind="text: RequestorInfo.Office()?.Title"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Requestor:</h6>
        <p data-bind="text: RequestorInfo.Requestor()?.Title"></p>
      </div>
      <div class="col-6">
        <h6>Requestor Office:</h6>
        <p data-bind="text: RequestorInfo.OfficeSymbol.Value"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Requestor Phone:</h6>
        <p data-bind="text: RequestorInfo.Phone"></p>
      </div>
      <div class="col-6">
        <h6>Requestor Email:</h6>
        <p data-bind="text: RequestorInfo.Email"></p>
      </div>
      <div class="col-6">
        <h6>Submitted Date:</h6>
        <p data-bind="text: Dates.Submitted.toLocaleString()"></p>
      </div>
      <div class="col-6">
        <h6>Service Type:</h6>
        <p data-bind="text: RequestType.Title"></p>
      </div>
    </div>
  </div>
`;
