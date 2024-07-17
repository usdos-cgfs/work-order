import { makeDataTable } from "../../common/DataTableExtensions.js";

import { assignmentsStore } from "../../stores/Assignments.js";
import { BaseComponent } from "../index.js";
import { closedRequestsTableTemplate } from "./ClosedRequestsTableTemplate.js";
import { openOfficeRequestsTableTemplate } from "./OpenOfficeRequestsTableTemplate.js";
import { openRequestsTableTemplate } from "./OpenRequestsTableTemplate.js";

class RequestsByStatusTableModule extends BaseComponent {
  constructor({ activeRequestSet, filteredRequests = null, key = "office" }) {
    super();
    this.key = key;
    this.ActiveSet = activeRequestSet;
    this.filter = this.ActiveSet.filter;
    this.FilteredRequests = filteredRequests ?? this.ActiveSet.List;
    this.IsLoading = this.ActiveSet.IsLoading;
    this.HasLoaded = this.ActiveSet.HasLoaded;
    this.init();
  }

  hasInitialized = false;

  requestDateBackground = (request) => {
    if (new Date() > request.Dates.EstClosed.Value()) return "table-danger";
  };

  getTableElementId = () =>
    "tbl-requests-status-" + this.key + this.filter?.toLowerCase();

  refresh = async () => {
    await this.ActiveSet.load();
  };

  // getRequestAssignments = assignmentsStore.getByRequest;

  tableBodyComplete = (nodes) => {
    if (this.Table) this.Table.clear().destroy();
    this.Table = makeDataTable(this.getTableElementId());
  };

  init = async () => {
    await this.ActiveSet.init();
    this.hasInitialized = true;
  };

  dispose = () => {};
}

export class OpenRequestsTableModule extends RequestsByStatusTableModule {
  constructor(params) {
    super(params);
  }

  static name = "open-requests-table";
  static template = openRequestsTableTemplate;
}

export class OpenOfficeRequestsTableModule extends RequestsByStatusTableModule {
  constructor(params) {
    super(params);
  }

  static name = "open-office-requests-table";
  static template = openOfficeRequestsTableTemplate;
}

export class ClosedRequestsTableModule extends RequestsByStatusTableModule {
  constructor(params) {
    super(params);
  }

  static name = "closed-requests-table";
  static template = closedRequestsTableTemplate;
}
