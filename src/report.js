import { requestOrgStore } from "./entities/RequestOrg.js";
import { pipelineStageStore } from "./entities/PipelineStage.js";
import { serviceTypeStore } from "./entities/ServiceType.js";
import { holidayStore } from "./entities/Holiday.js";
import { requestStates } from "./entities/Request.js";

import PeopleField from "./fields/PeopleField.js";
import DateField, { dateFieldTypes } from "./fields/DateField.js";

import { currentUser, User } from "./infrastructure/Authorization.js";
import {
  CreateAppContext,
  getAppContext,
} from "./infrastructure/ApplicationDbContext.js";
import { InitSal } from "./infrastructure/SAL.js";

import { sortByTitle } from "./common/EntityUtilities.js";
import { RegisterComponents } from "./infrastructure/RegisterComponents.js";
import CheckboxField from "./fields/CheckboxField.js";

window.WorkOrder = window.WorkOrder || {};

class ServiceTypeSummary {
  constructor({ service, requests, thresholds }) {
    this.service = service;
    this.requests = requests;
    this.thresholds = thresholds;
  }

  MeetingStandardCount = ko.pureComputed(() => {
    return this.requests.length - this.NotMeetingStandard().length;
  });

  NotMeetingStandard = ko.pureComputed(() => {
    return this.requests.filter(
      (request) => !request.Reporting.MeetingStandard()
    );
  });

  PercentMeetingStandard = ko.pureComputed(() =>
    this.MeetingStandardCount()
      ? Math.round((this.MeetingStandardCount() / this.requests.length) * 100)
      : ""
  );

  KPIClass = ko.pureComputed(() => {
    if (!this.requests.length) return;
    const percMeetingStandard = this.PercentMeetingStandard();

    if (percMeetingStandard > this.thresholds.green) return "kpi-green";
    if (percMeetingStandard > this.thresholds.yellow) return "kpi-yellow";
    return "kpi-red";
  });

  ViewButtonText = ko.pureComputed(() =>
    this.ViewLate()
      ? "Hide Late IDs"
      : `View ${this.NotMeetingStandard().length} Late IDs`
  );
  ViewLate = ko.observable(false);

  toggleViewLate = () => this.ViewLate(!this.ViewLate());

  AverageCompletionTime = ko.pureComputed(() => {
    if (!this.requests.length) return;

    const totalDays = this.requests.reduce(
      (accumulator, request) => accumulator + request.Reporting.OpenDays(),
      0
    );
    return Math.ceil(totalDays / this.requests.length);
  });
}

class Report {
  constructor() {
    // Initialize our filters
    const startDate = new Date();
    startDate.setDate(1);
    this.filters.startDate.set(startDate);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    this.filters.endDate.set(endDate);
  }

  static async create() {
    const report = new Report();
    await report.init();
    return report;
  }

  _currentUser = currentUser;
  _context = getAppContext();

  Config = {
    pipelineStageStore,
    requestOrgStore,
    serviceTypeStore,
    holidayStore,
  };

  async init() {
    configLists: {
      var pipelinesPromise = this._context.ConfigPipelines.ToList().then(
        this.Config.pipelineStageStore
      );

      var requestOrgsPromise = this._context.ConfigRequestOrgs.ToList().then(
        (arr) => this.Config.requestOrgStore(arr.sort(sortByTitle))
      );

      var serviceTypePromise = this._context.ConfigServiceTypes.ToList().then(
        (arr) => this.Config.serviceTypeStore(arr.sort(sortByTitle))
      );

      const holidaysPromise = this._context.ConfigHolidays.ToList().then(
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
      this._currentUser(await User.Create());
    }

    const requests = await this._context.Requests.ToList();
    this.AllRequests(requests);
  }

  requestStates = requestStates;
  AllRequests = ko.observableArray();

  filters = {
    org: {
      Value: ko.observable("temp"),
      Options: ko.pureComputed(
        () => this._currentUser()?.ActionOffices() ?? []
      ),
    },
    status: {
      Value: ko.observable(),
      Options: ko.pureComputed(() => [
        requestStates.open,
        requestStates.fulfilled,
      ]),
    },
    user: new PeopleField({ displayName: "Action Office" }),
    allDates: new CheckboxField({
      displayName: "All Dates",
      Visible: ko.pureComputed(
        () => this.filters.status.Value() == requestStates.fulfilled
      ),
    }),
    startDate: new DateField({
      displayName: "Start Date",
      type: dateFieldTypes.date,
      Visible: ko.pureComputed(
        () =>
          this.filters.status.Value() == requestStates.fulfilled &&
          !this.filters.allDates.Value()
      ),
    }),
    endDate: new DateField({
      displayName: "End Date",
      type: dateFieldTypes.date,
      Visible: ko.pureComputed(
        () =>
          this.filters.status.Value() == requestStates.fulfilled &&
          !this.filters.allDates.Value()
      ),
    }),
  };

  OrgServiceTypes = ko.pureComputed(
    () =>
      serviceTypeStore().filter(
        (serviceType) =>
          serviceType.Active &&
          serviceType.ReportingOrgs.find(
            (org) => org.ID == this.filters.org.Value().ID
          )
      ) ?? []
  );

  thresholds = () => {
    switch (this.filters.org.Value()) {
      case "CGFS/EX/IT":
        return {
          green: 85,
          yellow: 83,
        };
      default:
        return {
          green: 90,
          yellow: 40,
        };
    }
  };

  FilteredRequests = ko.pureComputed(() => {
    // filter by status, action office, and dates (if supplied)
    // org will be filterd in our servicetype rollup
    // const orgServiceTypeIds = this.OrgServiceTypes().map(
    //   (service) => service.ID
    // );

    // Filter by status
    const filteredRequests = this.AllRequests().filter(
      (request) => request.State.Status() == this.filters.status.Value()
    );

    // Filter by AO

    if (
      this.filters.status.Value() == requestStates.open ||
      this.filters.allDates.Value()
    ) {
      return filteredRequests;
    }

    // Filter by date
    const filterStart = this.filters.startDate.Value().getTime();
    const filterEnd = this.filters.endDate.Value().getTime();
    return filteredRequests.filter(
      (request) =>
        filterStart <= request.Dates.Closed.Value()?.getTime() &&
        request.Dates.Closed.Value()?.getTime() <= filterEnd
    );
  });

  ServiceTypeReports = ko.pureComputed(() => {
    console.log("Generate Reports Triggered");
    const reports = [];
    const thresholds = this.thresholds();
    this.OrgServiceTypes().map((service) => {
      // Find all Requests of Service Type
      const requests = this.FilteredRequests().filter(
        (request) => service.ID == request.ServiceType.Def()?.ID
      );

      reports.push(new ServiceTypeSummary({ service, requests, thresholds }));
    });
    return reports;
  });
}

async function createReport() {
  await InitSal();
  CreateAppContext();
  RegisterComponents();
  window.WorkOrder.Report = await Report.create();
  ko.applyBindings(window.WorkOrder.Report);
}

if (document.readyState === "ready" || document.readyState === "complete") {
  createReport();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      SP.SOD.executeFunc(
        "sp.js",
        "SP.ClientContext",
        ExecuteOrDelayUntilScriptLoaded(createReport, "sp.js")
      );
    }
  };
}
