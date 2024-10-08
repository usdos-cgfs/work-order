import { html } from "../BaseComponent.js";
export const requestHeaderEditTemplate = html`
  <div class="container-fluid">
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Request Status:</h6>
        <p class="state-draft">Draft</p>
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <label
          ><h6>Request ID:</h6>
          <p data-bind="text: ObservableTitle"></p
        ></label>
      </div>
      <div class="col-6 pb-2">
        <div class="form-group">
          <label><h6>Requesting Org:</h6></label>
          <select
            class="form-control"
            data-bind="value: RequestorInfo.Office,
        options: AvailableRequestorOffices,
        optionsText: (ro) => ro.Title"
          ></select>
          <!-- <p>
            GTM:
            <span
              data-bind="text: RequestorInfo.Office()?.GTM?.LookupValue"
            ></span>
          </p> -->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Requestor:</h6>
        <div
          id="people-requestor"
          data-bind="people: RequestorInfo.Requestor"
        ></div>
      </div>
      <div class="col-6 pb-2">
        <h6>Requestor Office:</h6>
        <input
          class="form-control"
          data-bind="value: RequestorInfo.OfficeSymbol.Value"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Requestor Phone:</h6>
        <input
          type="tel"
          class="form-control"
          data-bind="value: RequestorInfo.Phone"
        />
      </div>
      <div class="col-6 pb-2">
        <h6>Requestor Email:</h6>
        <input
          type="email"
          class="form-control"
          class="fluid"
          data-bind="value: RequestorInfo.Email"
        />
      </div>
      <div class="col-12 pb-2">
        <h6>Service Type:</h6>
        <p data-bind="text: RequestType.Title"></p>
      </div>
    </div>
  </div>
`;
