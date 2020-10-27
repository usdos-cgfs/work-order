var Workorder = window.Workorder || {};
Workorder.PageApproval = Workorder.PageApproval || {};

function initAppPage() {
  Workorder.PageApproval.Page = Workorder.PageApproval.NewPage();
}

Workorder.PageApproval.NewPage = function () {
  vm.pageApprovalRequestId = ko.observable();
  vm.pageApprovalMessage = ko.observable("Hang on, locating record.");

  let assignmentListRef = new sal.NewSPList(assignmentListDef);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let assignmentID = urlParams.get("assignment");
  let reqID = urlParams.get("request");
  vm.pageApprovalRequestId(reqID);

  if (assignmentID && reqID) {
    // Step 1: View the workorder item
    viewWorkOrderItem(reqID);

    // Step 2: Find the assignment
    let assignment = vm.requestAssignments().find(function (assignment) {
      return assignment.ID == assignmentID;
    });

    if (assignment) {
      if (vm.assignmentCurUserCanApprove(assignment)) {
        // Our user can assign, let's go ahead and approve
        vm.assignmentApprove(assignment, true);
        vm.pageApprovalMessage("Request approved");
      } else if (
        window.confirm(
          "It looks like you may be attempting to approve this request " +
            "on somebody elses behalf. Your information will be " +
            "associated with this approval. Do you wish to continue?"
        )
      ) {
        vm.assignmentApprove(assignment, true);
      } else {
        vm.pageApprovalMessage(
          "Assignment found but not approved. " +
            "To approve, please refresh your browser window."
        );
      }
    } else {
      vm.pageApprovalMessage(
        "Assignment could not be found. " +
          "Please ensure you have appropriate access."
      );
    }
  } else {
    vm.pageApprovalMessage("No record provided.");
  }
};
