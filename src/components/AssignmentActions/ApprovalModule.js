import { assignmentStates } from "../../entities/Assignment.js";
import { currentUser } from "../../infrastructure/Authorization.js";

export default function ApprovalActions(params) {
  console.log("hello from approval module", params);

  const assignment = params.assignment;

  const approve = async () => {
    params.completeAssignment(params.assignment, assignmentStates.Approved);
  };

  const approveHandler = async () => {
    console.log("approved");
    // Check if we have been directly assigned or as an action office
    if (assignment.userIsDirectlyAssigned(currentUser())) {
      approve();
      return;
    }

    if (assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This approval is assigned to ${assignment.Assignee.Title}. Do you want to approve on their behalf? `
        )
      ) {
        approve();
      }
      return;
    }

    alert("You are not authorized to approve this request!");
  };

  const rejectModalId = "reject-modal-" + assignment.ID;
  const rejectReason = ko.observable();

  const reject = async () => {
    console.log("reject");
    params.assignment.Comment = rejectReason();
    params.completeAssignment(params.assignment, assignmentStates.Rejected);
    document.getElementById(rejectModalId).close();
  };

  const showReject = () => {
    const rejectModal = document.getElementById(rejectModalId);
    if (assignment.userIsDirectlyAssigned(currentUser())) {
      rejectModal.showModal();
      return;
    }

    if (assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This approval is assigned to ${assignment.Assignee.Title}. Do you want to reject on their behalf? `
        )
      ) {
        rejectModal.showModal();
      }
      return;
    }

    alert("You are not authorized to reject this request!");
  };

  const cancelReject = () => {
    document.getElementById(rejectModalId).close();
  };

  const undo = async () => {
    // TODO: Minor - We should have an undo option instead of a "Reject Instead"
  };

  return {
    approveHandler,
    undo,
    reject,
    showReject,
    cancelReject,
    rejectReason,
    rejectModalId,
    assignment,
    assignmentStates,
  };
}
