import { assignmentStates } from "../../entities/Assignment.js";
export default function ApprovalActions(params) {
  console.log("hello from approval module", params);

  const assignment = params.assignment;

  const approve = async () => {
    console.log("approved");
    params.completeAssignment(params.assignment, assignmentStates.Approved);
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
    document.getElementById(rejectModalId).showModal();
  };

  const cancelReject = () => {
    document.getElementById(rejectModalId).close();
  };

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
