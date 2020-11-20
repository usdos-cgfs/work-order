var Workorder = window.Workorder || {};
Workorder.PageApproval = Workorder.PageApproval || {};

function initAppPage() {
  Workorder.PageApproval.Page = Workorder.PageApproval.NewPage();
}

Workorder.PageApproval.NewPage = function () {
  vm.pageApproval = new Object();
  vm.pageApproval.isReject = ko.observable(false);
  vm.pageApproval.requestId = ko.observable();
  vm.pageApproval.message = ko.observable("Hang on, locating record.");

  let assignmentListRef = new sal.NewSPList(assignmentListDef);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let assignmentID = urlParams.get("assignment");
  let reqID = urlParams.get("reqid");
  let reject = urlParams.get("reject");
  vm.pageApproval.isReject(reject);
  vm.pageApproval.requestId(reqID);
  vm.pageApproval.affirm = ko.observable(true);

  if (assignmentID && reqID) {
    // Step 1: View the workorder item
    viewWorkOrderItem(reqID);

    // Step 2: Find the assignment
    assignment = vm.requestAssignments().find(function (assignment) {
      return assignment.ID == assignmentID;
    });
    if (assignment) {
      vm.pageApproval.message("Record located");

      if (!vm.assignmentCurUserCanApprove(assignment)) {
        vm.pageApproval.affirm(
          window.confirm(
            "It looks like you may be attempting to approve or reject this request " +
              "on somebody elses behalf. Your information will be " +
              "associated with this approval. Do you wish to continue?"
          )
        );
      }
      if (!vm.pageApproval.affirm()) {
        vm.pageApproval.message(
          "Assignment found, but you have selected not to " +
            "take ownership. To Approve/Reject, refresh the page."
        );
      } else if (!reject) {
        pageApprovalApprove();
      }
    } else {
      vm.pageApproval.message(
        "Assignment could not be found. " +
          "Please ensure you have appropriate access."
      );
    }
  } else {
    vm.pageApproval.message("No record provided.");
  }

  function pageApprovalApprove() {
    if (assignment && vm.pageApproval.affirm()) {
      // Our user can assign, let's go ahead and approve
      vm.assignmentApprove(assignment, true);
      vm.pageApproval.message("Request approved");
      vm.pageApproval.affirm(false);
    }
  }

  function pageApprovalReject() {
    if (
      assignment &&
      vm.pageApproval.affirm() &&
      vm.assignmentRejectComment()
    ) {
      vm.assignmentRejectAssignment(assignment);
      vm.assignmentRejectSubmit();
      vm.pageApproval.message(
        "Request rejected with the following reason: <br>" +
          vm.assignmentRejectComment()
      );
      vm.pageApproval.affirm(false);
    }
  }

  var publicMembers = {
    approve: pageApprovalApprove,
    reject: pageApprovalReject,
  };
  return publicMembers;
};
