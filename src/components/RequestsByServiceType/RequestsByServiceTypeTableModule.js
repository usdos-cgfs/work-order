import { makeDataTable } from "../../common/DataTableExtensions.js";
import { RequestEntity } from "../../entities/Request.js";

import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";

export default class RequestsByServiceTypeTableModule {
  constructor({ service, key }) {
    if (window.DEBUG) console.log("New Service Type Table", service.Title);
    this.service = service;
    this.key = key;
    this._context = getAppContext();
    this.init();
  }

  HasInitialized = ko.observable();
  AllRequests = ko.observableArray();
  Supplements = ko.observableArray();

  requestMap = {};

  _context;

  requestCols = [
    "Title",
    "RequestingOffice",
    "Requestor",
    "RequestStatus",
    "RequestDescription",
  ];

  SupplementCols = ko.observableArray();

  getSupplementByRequestId = (request) => {
    const supplement = this.Supplements().find(
      (supplement) => supplement.Request?.ID == request.ID
    );
    if (!supplement) return null;

    return supplement;
  };

  getTableElementId = () => `tbl-requests-type-${this.key}-${this.service.UID}`;

  async init() {
    const requestMap = this.requestMap;
    // columns

    // rows
    // 1. Load requests by service type
    const requestsPromise = await this._context.Requests.FindByColumnValue(
      [{ column: "ServiceType", value: this.service.ID }],
      { orderByColumn: "Title", sortAsc: false },
      {},
      RequestEntity.Views.ByServiceType
    ).then((requests) => {
      this.AllRequests(requests.results);
      requests.results.map((req) => {
        requestMap[req.Title]
          ? (requestMap[req.Title].request = req)
          : (requestMap[req.Title] = { request: req });
      });
    });

    // 2. Early exit, service type doesn't have additional fields.
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

    const supplementsPromise = await this.service
      .getListRef()
      .ToList([
        ...this.SupplementCols().map((col) => col.key),
        "Request",
        "Title",
      ])
      .then((results) => {
        this.Supplements(results);
        results.map((supplement) => {
          const reqTitle = supplement.Request?.Title ?? supplement.Title;
          if (!reqTitle) return;
          requestMap[reqTitle]
            ? (requestMap[reqTitle].supplement = supplement)
            : (requestMap[reqTitle] = {
                supplement: supplement,
              });
        });
      });

    await Promise.all([requestsPromise, supplementsPromise]);

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
