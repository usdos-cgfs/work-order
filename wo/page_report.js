var Workorder = window.Workorder || {};
Workorder.Report = Workorder.Report || {};

function initAppPage() {
  Workorder.Report.Report = new Workorder.Report.NewReportPage();
  Workorder.Report.Report.setInitialState();
  //$(".ui.checkbox").checkbox();
}

Workorder.Report.NewReportPage = function () {
  function setInitialState() {
    // Set our initial variables: dates etc
    var startDate = new Date();
    startDate.setDate(1);
    vm._report.startDate(startDate);

    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    vm._report.endDate(endDate);
  }

  function reportViewmodel() {
    var self = this;

    //track our load time
    self.timerStart = ko.observable(new Date());
    self.timerEnd = ko.observable(new Date());
    self.timerDelta = ko.pureComputed(function () {
      return self.timerEnd() - self.timerStart();
    });

    self.thresholdGreen = ko.observable(90);
    self.thresholdYellow = ko.observable(40);

    self.view = ko.observable();
    self.viewOpts = ko.observableArray(["Closed", "Open"]);

    self.filterOffice = ko.observable();
    self.filterOfficeOpts = ko.pureComputed(function () {
      return vm.assignCurUserAssignees().filter(function (assignee) {
        return assignee.RequestOrg.get_lookupId() == self.requestOrg().ID;
      });
    });

    self.allDates = ko.observable(false);
    self.startDate = ko.observable();
    self.endDate = ko.observable();

    self.requestOrg = ko.observable();
    self.requestOrgOpts = vm.user.requestOrgMembership();

    self.requestOrgServiceTypesFiltered = ko.pureComputed(function () {
      return vm.configServiceTypes().filter(function (serviceType) {
        if (serviceType.RequestOrgs) {
          return serviceType.RequestOrgs.map(function (reqOrg) {
            return reqOrg.get_lookupId();
          }).includes(self.requestOrg().ID);
        }
      });
    });

    self.filteredRequests = ko.pureComputed(function () {
      if (self.requestOrg()) {
        self.timerStart(new Date());
        console.log("Applying Filter");
        let filteredRequests = [];
        // Filter by Open or Closed
        if (self.view() == "Open") {
          filteredRequests = vm.allOrders().filter(function (request) {
            return request.ClosedDate == null;
          });
        } else if (self.allDates()) {
          // Filter by Date
          filteredRequests = vm.allOrders().filter(function (request) {
            return request.ClosedDate != null;
          });
        } else {
          filteredRequests = vm.allOrders().filter(function (request) {
            let closeDate = new Date(request.ClosedDate);
            return self.startDate() <= closeDate && closeDate <= self.endDate();
          });
        }

        // Filter by config Service Type assignments
        // Find the service types that include the selected request org.
        let reqOrgServiceTypeTitles = self
          .requestOrgServiceTypesFiltered()
          .map(function (serviceType) {
            return serviceType.Title;
          });

        filteredRequests = filteredRequests.filter(function (request) {
          return reqOrgServiceTypeTitles.includes(
            request.ServiceType.get_lookupValue()
          );
        });

        // Filter by Action Office
        if (self.filterOffice()) {
          let actionOfficeAssignedOrders = vm
            .allAssignments()
            .filter(function (assignment) {
              return (
                assignment.ActionOffice.get_lookupId() == self.filterOffice().ID
              );
            })
            .map(function (assignment) {
              return assignment.Title;
            });

          filteredRequests = filteredRequests.filter(function (request) {
            return actionOfficeAssignedOrders.includes(request.Title);
          });
        }
        return filteredRequests;
      }
    });

    self.completedTotalWO = new Incremental();
    self.completedTotalMtgStandard = new Incremental();
    self.completedTotalNotMtgStandard = new Incremental();
    self.completedTotalMtgStandardPerc = ko.observable();
    self.completedTotalAvgDays = ko.observable();
    self.completedTotalAvgDaysFloat = ko.observable();
    self.completedTotalDays = new Incremental();

    self.tableResults = ko.pureComputed(function () {
      // Run through the filtered results and build our case
      var serviceTypes = self.requestOrgServiceTypesFiltered();
      if (serviceTypes.length > 0) {
        self.completedTotalWO.reset();
        self.completedTotalMtgStandard.reset();
        self.completedTotalNotMtgStandard.reset();
        self.completedTotalDays.reset();
        self.completedTotalMtgStandardPerc(0);
        self.completedTotalAvgDays(0);
        self.completedTotalAvgDaysFloat(0);

        var masterMap = {};

        serviceTypes.forEach(function (serviceType) {
          // Use object literal constructors as best practice.
          let serviceObject = {};

          serviceObject.serviceType = serviceType;
          serviceObject.title = serviceType.Title;
          serviceObject.uid = serviceType.UID;
          serviceObject.standard = serviceType.DaysToCloseBusiness;
          serviceObject.completedWO = 0;
          serviceObject.completedTotalDays = 0;
          serviceObject.completedDays = 0;
          serviceObject.completedMeetingStandard = 0;
          serviceObject.completedNotMeetingStandard = 0;
          serviceObject.completedPercMeetingStandard = 0;
          serviceObject.lateIDs = new Array();
          serviceObject.completedAvgTime = 0;
          serviceObject.completedAvgTimeFloat = 0;

          masterMap[serviceObject.title] = serviceObject;
        });

        self.filteredRequests().forEach(function (request) {
          mapObj = masterMap[request.ServiceType.get_lookupValue()];
          if (mapObj != null) {
            //Increment Count
            mapObj.completedWO += 1;

            //Get time to complete this workorder
            var dateEffectiveRequested = new Date(request.RequestSubmitted);
            // Days open up to today.
            var dateClosed = request.ClosedDate
              ? new Date(request.ClosedDate)
              : new Date();
            var daysToComplete = businessDays(
              dateEffectiveRequested,
              dateClosed
            );
            mapObj.completedDays = daysToComplete;

            mapObj.completedTotalDays += daysToComplete;

            if (daysToComplete <= mapObj.standard) {
              mapObj.completedMeetingStandard++;
            } else {
              mapObj.completedNotMeetingStandard++;
              var lateObj = {};
              lateObj.ID = request.ID;
              lateObj.days = daysToComplete;
              lateObj.title = request.Title;

              mapObj.lateIDs.push(lateObj);
            }

            if (mapObj.completedWO > 0) {
              mapObj.completedPercMeetingStandard = Math.round(
                (mapObj.completedMeetingStandard / mapObj.completedWO) * 100
              );
              mapObj.completedAvgTime = Math.ceil(
                mapObj.completedTotalDays / mapObj.completedWO
              );
              mapObj.completedAvgTimeFloat =
                mapObj.completedTotalDays / mapObj.completedWO;
            }
          }
        });

        arrServices = [];
        serviceTypes.forEach(function (serviceType) {
          arrServices.push(masterMap[serviceType.Title]);

          mapObj = masterMap[serviceType.Title];

          self.completedTotalWO.inc(mapObj.completedWO);
          self.completedTotalMtgStandard.inc(mapObj.completedMeetingStandard);
          self.completedTotalNotMtgStandard.inc(
            mapObj.completedNotMeetingStandard
          );
          self.completedTotalDays.inc(mapObj.completedTotalDays);
        });

        if (self.completedTotalWO.val() > 0) {
          self.completedTotalMtgStandardPerc(
            Math.round(
              (self.completedTotalMtgStandard.val() /
                self.completedTotalWO.val()) *
                100
            )
          );

          self.completedTotalAvgDaysFloat(
            self.completedTotalDays.val() / self.completedTotalWO.val()
          );
          self.completedTotalAvgDays(
            Math.ceil(self.completedTotalAvgDaysFloat())
          );
        }
        self.timerEnd(new Date());
        return arrServices;
      }
    });
  }

  vm._report = new reportViewmodel();

  function runStats() {}

  var publicMembers = {
    setInitialState: setInitialState,
  };

  return publicMembers;
};
