import "./common/KnockoutExtensions.js";
import { RequestDetailView, DisplayModes } from "./views/RequestDetailView.js";
import { NewRequestView } from "./views/NewRequestView.js";
import { MyRequestsView } from "./views/MyRequestsView.js";

import { InitSal } from "./infrastructure/SAL.js";
import { RequestOrg, requestOrgStore } from "./entities/RequestOrg.js";
import "./infrastructure/ApplicationDbContext.js";
import ApplicationDbContext from "./infrastructure/ApplicationDbContext.js";
import { PipelineStage, pipelineStageStore } from "./entities/Pipelines.js";
import { ServiceType, serviceTypeStore } from "./entities/ServiceType.js";
import { sortByTitle } from "./common/EntityUtilities.js";
import { getUrlParam, setUrlParam } from "./common/Router.js";
import { User } from "./infrastructure/Authorization.js";
import { holidayStore, Holiday } from "./entities/Holidays.js";

var WorkOrder = window.WorkOrder || {};

document.addEventListener("DOMContentLoaded", function (event) {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(InitDB, "sp.js")
  );
});

async function InitDB() {
  //const { WorkOrder } = await import("./models/WorkOrder.js");
  await InitSal();
  WorkOrder.Report = await NewReport.Create();
  ko.applyBindings(WorkOrder.Report);
}

export const Tabs = {
  MyRequests: "my-requests-tab",
  NewRequest: "new-request-tab",
  RequestDetail: "request-detail-tab",
};

class NewReport {
  constructor() {
    this.Tab.subscribe(tabWatcher);
  }

  context = new ApplicationDbContext();

  Tab = ko.observable();
  TabClicked = (data, e) => this.Tab(e.target.getAttribute("id"));

  RequestDetail = ko.observable();
  OpenRequests = ko.observableArray();

  Config = {
    pipelineStageStore,
    requestOrgStore,
    serviceTypeStore,
    holidayStore,
  };

  // Views
  MyRequestsView = new MyRequestsView({ context: this.context });
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
      this.currentUser = await User.Create();
    }

    routing: {
      var startTab = getUrlParam("tab");
      var reqId = getUrlParam("reqId");
      if (reqId) {
        this.ViewRequest({ title: reqId });
      } else if (startTab == Tabs.RequestDetail) {
        startTab = Tabs.NewRequest;
      }
      this.Tab(startTab);
    }
  };

  static Create = async function () {
    const report = new NewReport();
    await report.Init();
    return report;
  };

  SelectNewRequestButton = (data, e) => {};

  NewRequest = (data, e) => {
    const props = {
      currentUser: this.currentUser,
      context: this.context,
      displayMode: DisplayModes.New,
    };
    if (data && data.ID) {
      props.serviceType = data;
    }
    setUrlParam("reqId", "");
    this.RequestDetailView(new RequestDetailView(props));
    this.Tab(Tabs.RequestDetail);
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
        ID: request.ID,
        Title: request.Title,
        currentUser: this.currentUser,
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
