import { makeDataTable } from "../../common/DataTableExtensions.js";
import { RequestEntity } from "../../entities/Request.js";

import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";

export default class RequestsByServiceTypeTableModule {
  constructor({ service }) {
    if (window.DEBUG) console.log("New Service Type Table", service.Title);
    this.service = service;
    this._context = getAppContext();
    this.init();
  }

  HasInitialized = ko.observable();
  AllRequests = ko.observableArray();

  _context;

  requestCols = [
    "Title",
    "RequestingOffice",
    "Requestor",
    "RequestStatus",
    "RequestDescription",
  ];

  SupplementCols = ko.observableArray();

  getTableElementId = () => "tbl-requests-type-" + this.service.UID;

  async init() {
    // columns

    // rows
    // 1. Load requests by service type
    const requestsPromise = await this._context.Requests.FindByColumnValue(
      [{ column: "ServiceType", value: this.service.ID }],
      { orderByColumn: "Title", sortAsc: false },
      {},
      RequestEntity.Views.ByServiceType
    ).then((requests) => this.AllRequests(requests.results));

    // 2. If service type has additional fields
    if (!this.service.HasTemplate) {
      await requestsPromise;
      this.HasInitialized(true);
      return;
    }

    const sampleEntity = await this.service.instantiateEntity();
    Object.keys(sampleEntity.FieldMap).map((key) =>
      this.SupplementCols.push({
        key,
        displayName: sampleEntity.FieldMap[key].displayName,
      })
    );

    this.HasInitialized(true);
  }

  tableHasRendered = () => {
    this.Table = makeDataTable(this.getTableElementId());
    // setTimeout(
    //   () => (this.Table = makeDataTable(this.getTableElementId())),
    //   20
    // );
  };
}
