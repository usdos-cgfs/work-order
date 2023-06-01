import { getUrlParam, setUrlParam } from "../common/Router.js";
import { requestStates } from "../entities/Request.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

export class MyRequestsView {
  constructor({ openRequests, openAssignments }) {
    this._context = getAppContext();
    this.AllOpenRequests = openRequests;
    this.AllOpenAssignments = openAssignments;

    this.params = {
      open: {
        view: this,
        status: requestStates.open,
        showAssignments: true,
        data: this.AllOpenRequests,
        openAssignments: this.AllOpenAssignments,
      },
      closed: {
        view: this,
        status: requestStates.closed,
        data: ko.observableArray(),
      },
      cancelled: {
        view: this,
        status: requestStates.cancelled,
        data: ko.observableArray(),
      },
    };

    this.View.subscribe(this.viewWatcher);

    this.View(this.views.open);
  }

  // AllOpenAssignments = ko.observableArray();

  views = {
    open: "open",
    closed: "closed",
    cancelled: "cancelled",
  };

  View = ko.observable();

  viewTabClicked = (data, e) => this.View(e.target.dataset.target);

  viewWatcher = (newViewId) => {
    if (!newViewId) {
      return;
    }
    //var tabTriggerElement = document.getElementById(newTab);
    setUrlParam("view", newViewId);
  };

  ActiveTableParams = ko.pureComputed(() => {
    return this.params[this.View()];
  });
}
