var Workorder = window.Workorder || {};
Workorder.Report = Workorder.Report || {};

function initReportPage() {
  Workorder.Report.Report = new Workorder.Report.NewReportPage();
}

Workorder.Report.NewReportPage = function () {
  function reportViewmodel() {
    let self = this;
    self.view = ko.observable();
    self.viewOpts = ko.observableArray(["Closed", "Open"]);
  }
  vm._report = new reportViewmodel();
};
