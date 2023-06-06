import { RequestDetailView, DisplayModes } from "./views/RequestDetailView.js";
import { NewRequestView } from "./views/NewRequestView.js";
import { OfficeRequestsView } from "./views/OfficeRequestsView.js";
import { MyRequestsView } from "./views/MyRequestsView.js";

import { RequestEntity } from "./entities/Request.js";
import { RequestOrg, requestOrgStore } from "./entities/RequestOrg.js";
import { PipelineStage, pipelineStageStore } from "./entities/PipelineStage.js";
import { ServiceType, serviceTypeStore } from "./entities/ServiceType.js";
import { holidayStore, Holiday } from "./entities/Holiday.js";

import "./common/KnockoutExtensions.js";
import { sortByTitle } from "./common/EntityUtilities.js";
import { getUrlParam, setUrlParam } from "./common/Router.js";

import { User, currentUser } from "./infrastructure/Authorization.js";
import ApplicationDbContext, {
  getAppContext,
  setAppContext,
} from "./infrastructure/ApplicationDbContext.js";
import { InitSal } from "./infrastructure/SAL.js";

export const assetsPath = window.appRoot + "/src";

const datatablesSheet = await import(
  window.appRoot + "/lib/datatables/datatables.min.css",
  {
    assert: { type: "css" },
  }
);
const appSheet = await import(window.appRoot + "/src/app.css", {
  assert: { type: "css" },
});
const faSheet = await import(
  window.appRoot + "/lib/fontawesome-6.4.0/css/all.min.css",
  {
    assert: { type: "css" },
  }
);

document.adoptedStyleSheets = [
  datatablesSheet.default,
  appSheet.default,
  faSheet.default,
];

window.WorkOrder = window.WorkOrder || {};

async function CreateApp() {
  // TODO: deferred import dependencies (SAL) here and DI into App

  ko.options.deferUpdates = true;
  //const { WorkOrder } = await import("./models/WorkOrder.js");
  await InitSal();

  const context = new ApplicationDbContext();
  setAppContext(context);
  window.WorkOrder.Report = await App.Create();
  ko.applyBindings(window.WorkOrder.Report);
}

export const Tabs = {
  MyRequests: "my-requests-tab",
  NewRequest: "new-request-tab",
  RequestDetail: "request-detail-tab",
};

class App {
  constructor() {
    this.Tab.subscribe(tabWatcher);
    this.HasLoaded(true);
  }
  HasLoaded = ko.observable(false);

  CurrentUser = currentUser;
  context = getAppContext();

  Tab = ko.observable();
  TabClicked = (data, e) => this.Tab(e.target.getAttribute("id"));

  RequestDetail = ko.observable();
  OpenRequests = ko.observableArray();
  OpenAssignments = ko.observableArray();

  quickInfoParams = {
    allOpenRequests: this.OpenRequests,
    allOpenAssignments: this.OpenAssignments,
  };

  Config = {
    pipelineStageStore,
    requestOrgStore,
    serviceTypeStore,
    holidayStore,
  };

  // Views
  OfficeRequestsView = new OfficeRequestsView();
  MyRequestsView = new MyRequestsView();
  NewRequestView = new NewRequestView();
  RequestDetailView = ko.observable();

  Init = async function () {
    configLists: {
      var pipelinesPromise = this.context.ConfigPipelines.FindAll(
        PipelineStage.Views.All
      ).then(this.Config.pipelineStageStore);

      var requestOrgsPromise = this.context.ConfigRequestOrgs.FindAll(
        RequestOrg.Views.All
      ).then((arr) => this.Config.requestOrgStore(arr.sort(sortByTitle)));

      var serviceTypePromise = this.context.ConfigServiceTypes.FindAll(
        ServiceType.Views.All
      ).then((arr) =>
        this.Config.serviceTypeStore(
          arr.sort(sortByTitle).map((val) => new ServiceType(val))
        )
      );

      const holidaysPromise = this.context.ConfigHolidays.FindAll(
        Holiday.Views.All
      ).then(this.Config.holidayStore);

      const configResults = await Promise.all([
        requestOrgsPromise,
        pipelinesPromise,
        serviceTypePromise,
        holidaysPromise,
      ]);
    }

    user: {
      this.CurrentUser(await User.Create());
    }

    routing: {
      var startTab = getUrlParam("tab") || Tabs.MyRequests;
      var reqId = getUrlParam("reqId");
      if (reqId) {
        this.viewRequestByTitle(reqId);
      } else if (startTab == Tabs.RequestDetail) {
        startTab = Tabs.NewRequest;
      }
      this.Tab(startTab);
    }
  };

  static Create = async function () {
    const report = new App();
    await report.Init();
    return report;
  };

  SelectNewRequestButton = (data, e) => {};

  NewRequest = (data, e) => {
    const props = {
      request: new RequestEntity({}),
      displayMode: DisplayModes.New,
    };
    if (data && data.ID) {
      props.serviceType = data;
    }
    setUrlParam("reqId", "");
    this.RequestDetailView(new RequestDetailView(props));
    this.Tab(Tabs.RequestDetail);
  };

  viewRequestByTitle = async (title) => {
    const results = await this.context.Requests.FindByColumnValue(
      [{ column: "Title", value: title }],
      {},
      {},
      RequestEntity.Views.All,
      false
    );
    if (!results.results.length) {
      console.warn("Request not found: ", title);
      return;
    }
    this.ViewRequest(results.results[0]);
  };

  ViewRequest = async (request) => {
    //var title = "230330-6165";
    // request = {
    //   ID: 539,
    //   Title: "230330-6165",
    // };
    setUrlParam("reqId", request.Title);
    this.RequestDetailView(
      new RequestDetailView({
        request,
        context: this.context,
      })
    );
    this.Tab(Tabs.RequestDetail);
  };
}

const tabWatcher = (newTab) => {
  if (!newTab) {
    return;
  }
  var tabTriggerElement = document.getElementById(newTab);
  var tab = new bootstrap.Tab(tabTriggerElement);
  setUrlParam("tab", newTab);
  tab.show();
};

if (document.readyState === "ready" || document.readyState === "complete") {
  CreateApp();
} else {
  document.addEventListener("DOMContentLoaded", function (event) {
    SP.SOD.executeFunc(
      "sp.js",
      "SP.ClientContext",
      ExecuteOrDelayUntilScriptLoaded(CreateApp, "sp.js")
    );
  });
}
