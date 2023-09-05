import { RequestDetailView, DisplayModes } from "./views/RequestDetailView.js";
import { NewRequestView } from "./views/NewRequestView.js";
import { OfficeRequestsView } from "./views/OfficeRequestsView.js";
import { MyRequestsView } from "./views/MyRequestsView.js";

import { RequestEntity, requestStates } from "./entities/Request.js";
import { requestOrgStore } from "./entities/RequestOrg.js";
import { pipelineStageStore } from "./entities/PipelineStage.js";
import { serviceTypeStore } from "./entities/ServiceType.js";
import { holidayStore } from "./entities/Holiday.js";

import "./common/KnockoutExtensions.js";
import { sortByTitle } from "./common/EntityUtilities.js";
import { getUrlParam, setUrlParam } from "./common/Router.js";

import { assignmentsStore } from "./stores/Assignments.js";

import {
  User,
  currentUser,
  systemRoles,
  userHasSystemRole,
} from "./infrastructure/Authorization.js";
import {
  getAppContext,
  CreateAppContext,
} from "./infrastructure/ApplicationDbContext.js";
import { InitSal } from "./infrastructure/SAL.js";

import MyAssignmentsView from "./views/MyAssignmentsView.js";
import { RegisterComponents } from "./infrastructure/RegisterComponents.js";
import { blockingTasks, runningTasks } from "./stores/Tasks.js";

import { Tabs } from "./env.js";
import { requestsByStatusMap } from "./stores/Requests.js";

window.WorkOrder = window.WorkOrder || {};

async function CreateApp() {
  ko.options.deferUpdates = true;
  await InitSal();
  RegisterComponents();
  CreateAppContext();
  window.WorkOrder.App = await App.Create();
  ko.applyBindings(window.WorkOrder.App);
  await window.WorkOrder.App.InitData();
}

class App {
  constructor() {
    this.Tab.subscribe(tabWatcher);
    this.HasLoaded(true);
  }

  RunningTasks = runningTasks;
  BlockingTasks = blockingTasks;

  ToggleActionOfficeFeatures = ko.observable(true);
  ShowActionOfficeFeatures = ko.pureComputed(
    () =>
      this.CurrentUser()?.IsActionOffice() && this.ToggleActionOfficeFeatures()
  );
  HasLoaded = ko.observable(false);

  CurrentUser = currentUser;
  context = getAppContext();

  Tab = ko.observable();
  TabClicked = (data, e) => this.Tab(e.target.getAttribute("id"));

  MyOpenAssignments = assignmentsStore.getOpenByRequest;
  //   MyOpenAssignments = ko.pureComputed(() =>
  //   this.CurrentUser()
  //     ? assignmentsStore.getOpenByUser(this.CurrentUser())()
  //     : []
  // );

  Config = {
    pipelineStageStore,
    requestOrgStore,
    serviceTypeStore,
    holidayStore,
  };

  // Views
  OfficeRequestsView = new OfficeRequestsView();
  MyRequestsView = new MyRequestsView();
  MyAssignmentsView = new MyAssignmentsView();
  NewRequestView = new NewRequestView();
  RequestDetailView = ko.observable();

  Authorization = {
    currentUserIsAdmin: ko.pureComputed(() => {
      return userHasSystemRole(currentUser(), systemRoles.Admin);
    }),
  };

  InitData = async () => {
    // This is the non-blocking minimum data that should be loaded

    const openRequestsSet = requestsByStatusMap.get(requestStates.open);

    openRequestsSet.init();
  };

  Init = async function () {
    configLists: {
      var pipelinesPromise = this.context.ConfigPipelines.ToList().then(
        this.Config.pipelineStageStore
      );

      var requestOrgsPromise = this.context.ConfigRequestOrgs.ToList().then(
        (arr) => this.Config.requestOrgStore(arr.sort(sortByTitle))
      );

      var serviceTypePromise = this.context.ConfigServiceTypes.ToList().then(
        (arr) => this.Config.serviceTypeStore(arr.sort(sortByTitle))
      );

      const holidaysPromise = this.context.ConfigHolidays.ToList().then(
        this.Config.holidayStore
      );

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
      if (reqId && startTab == Tabs.RequestDetail) {
        this.viewRequestByTitle(reqId);
      } else if (startTab == Tabs.RequestDetail) {
        startTab = Tabs.NewRequest;
      }
      this.Tab(startTab);
    }

    // Kick off the initial data load
    // this.InitData();
  };

  SelectNewRequest = (data, e) => {
    this.Tab(Tabs.NewRequest);
  };

  NewRequest = ({ request = null }) => {
    const props = {
      request: request ?? new RequestEntity({}),
      displayMode: DisplayModes.New,
    };
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

  static Create = async function () {
    const report = new App();
    await report.Init();
    return report;
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
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      SP.SOD.executeFunc(
        "sp.js",
        "SP.ClientContext",
        ExecuteOrDelayUntilScriptLoaded(CreateApp, "sp.js")
      );
    }
  };
}

// try {
//   SP.SOD.executeFunc("sp.js", "SP.ClientContext", () => {});
// } catch (e) {
//   console.warn("SP.SOD SP.ClientContext Error", e);
// }
