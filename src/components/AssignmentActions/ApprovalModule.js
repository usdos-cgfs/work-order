import { assignmentStates } from "../../entities/Assignment.js";
export default function ApprovalActions(params) {
  console.log("hello from approval module", params);

  const assignment = params.assignment;

  const approve = async () => {
    console.log("approved");
    params.completeAssignment(params.assignment, assignmentStates.Approved);
  };

  const reject = async () => {
    console.log("reject");
    params.completeAssignment(params.assignment, assignmentStates.Rejected);
  };

  const rejectModalId = "reject-modal-" + assignment.ID;

  const showReject = () => {
    document.getElementById(rejectModalId).showModal();
  };
  const cancelReject = () => {
    document.getElementById(rejectModalId).close();
  };

  const rejectReason = ko.observable();

  return {
    approve,
    reject,
    showReject,
    cancelReject,
    rejectReason,
    rejectModalId,
    assignment,
    assignmentStates,
  };
}

ApprovalActions.prototype.dispose = function () {
  console.log("disposing approval");
};
