import { getUrlParam, setUrlParam } from "../common/Router.js";
import { requestStates } from "../entities/Request.js";
import { getAppContext } from "../infrastructure/ApplicationDbContext.js";

export class MyRequestsView {
  constructor({}) {
    this._context = getAppContext();
    this.View.subscribe(this.viewWatcher);

    this.View(this.views.open);
  }

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

  params = {
    open: {
      view: this,
      status: requestStates.open,
      showAssignments: true,
    },
    closed: {
      view: this,
      status: requestStates.closed,
    },
    cancelled: {
      view: this,
      status: requestStates.cancelled,
    },
  };

  ActiveComponent = ko.pureComputed(() => {
    if (!this.View()) {
      return;
    }

    const component = this.components[this.View()];
    if (!component) {
      console.error("Missing component", this.View());
      return null;
    }

    component.Init();

    return component;
  });

  ActiveTableParams = ko.pureComputed(() => {
    return this.params[this.View()];
  });
}
