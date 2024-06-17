import { requestOrgStore } from "./entities/RequestOrg.js";
import { pipelineStageStore } from "./entities/PipelineStage.js";
import { serviceTypeStore } from "./entities/ServiceType.js";
import { holidayStore } from "./entities/Holiday.js";
import { requestStates } from "./constants/index.js";

import "./common/KnockoutExtensions.js";

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

  totalCompletionTime = () =>
    this.requests.reduce(
      (accumulator, request) => accumulator + request.Reporting.OpenDays(),
      0
    );
  AverageCompletionTime = ko.pureComputed(() => {
    if (!this.requests.length) return;

    const totalDays = this.totalCompletionTime();
    return Math.ceil(totalDays / this.requests.length);
  });
}

class Report {
  constructor() {
    // Initialize our filters
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);
    startDate.setUTCSeconds(0);
    this.filters.startDate.set(startDate);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setUTCHours(0);
    endDate.setUTCMinutes(0);
    endDate.setUTCSeconds(0);
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

  allRequests = [];
  allAssignments = [];

  filters = {
    org: {
      Value: ko.observable(),
      Options: ko.pureComputed(
        () => this._currentUser()?.ActionOffices() ?? []
      ),
    },
    status: {
      Value: ko.observable(),
      Options: ko.pureComputed(() => [
        requestStates.fulfilled,
        requestStates.open,
      ]),
    },
    user: {
      Value: ko.observable(),
      Options: ko.pureComputed(() => {
        const assignees = this.allAssignments.map(
          (assignment) => assignment.Assignee
        );

        return assignees
          .filter(
            (assignee, index, self) =>
              assignee && index === self.findIndex((t) => t?.ID === assignee.ID)
          )
          .sort(sortByTitle);
      }),
    },
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
    switch (this.filters.org.Value()?.Title) {
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
    let filteredRequests = this.allRequests.filter(
      (request) => request.State.Status() == this.filters.status.Value()
    );

    // Filter by AO/User
    if (this.filters.user.Value()) {
      const userId = this.filters.user.Value().ID;
      //filteredRequests.filter();
      const requestIds = new Set();
      // 1 filter all assignments assigned to user
      // 2 add to unique set of requests ids
      this.allAssignments
        .filter((assignment) => assignment.Assignee?.ID === userId)
        .map((assignment) => requestIds.add(assignment.Request.ID));
      // 3 filter requests by assignment request ids
      filteredRequests = filteredRequests.filter((request) =>
        requestIds.has(request.ID)
      );
    }
    // Guard condition
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

  FilteredAssignments = ko.pureComputed(() => {
    return this.FilteredRequests().flatMap((request) => {
      return this.allAssignments.filter(
        (assignment) => assignment.Request.ID == request.ID
      );
    });
  });

  ServiceTypeReports = ko.pureComputed(() => {
    console.log("Generate Reports Triggered");
    const reports = [];
    const thresholds = this.thresholds();
    this.OrgServiceTypes().map((service) => {
      // Find all Requests of Service Type
      const requests = this.FilteredRequests().filter(
        (request) => service.ID == request.RequestType.ID
      );

      const requestIds = requests.map((request) => request.ID);

      reports.push(new ServiceTypeSummary({ service, requests, thresholds }));
    });
    return reports;
  });

  SummaryRow = ko.pureComputed(() => {
    const summary = {
      totalOpen: 0,
      totalMeetingStandard: 0,
      totalNotMeetingStandard: 0,
      percentMeetingStandard: 0,
      totalCompletionTime: 0,
      averageCompletionTime: 0,
    };

    this.ServiceTypeReports().map((service) => {
      summary.totalOpen += service.requests.length;
      summary.totalMeetingStandard += service.MeetingStandardCount();
      summary.totalNotMeetingStandard += service.NotMeetingStandard().length;
      summary.totalCompletionTime += service.totalCompletionTime();
    });

    summary.percentMeetingStandard = Math.round(
      (summary.totalMeetingStandard / summary.totalOpen) * 100
    );

    summary.averageCompletionTime = Math.ceil(
      summary.totalCompletionTime / summary.totalOpen
    );

    return summary;
  });

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

    records: {
      await Promise.all([
        this._context.Requests.ToList().then(
          (requests) => (this.allRequests = requests)
        ),
        this._context.Assignments.ToList().then(
          (assignments) => (this.allAssignments = assignments)
        ),
      ]);
    }
  }
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
