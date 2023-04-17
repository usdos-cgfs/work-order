import { getUrlParam, setUrlParam } from "../common/Router.js";
import { RequestsByStatusComponent } from "../components/RequestsByStatusComponent.js";
import { requestStates } from "../entities/Request.js";

export class MyRequestsView {
  constructor({ context }) {
    this._context = context;
    this.View.subscribe(this.viewWatcher);
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

  components = {
    open: new RequestsByStatusComponent({
      view: this,
      status: requestStates.open,
    }),
    closed: new RequestsByStatusComponent({
      view: this,
      status: requestStates.closed,
    }),
    cancelled: new RequestsByStatusComponent({
      view: this,
      status: requestStates.cancelled,
    }),
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
}
