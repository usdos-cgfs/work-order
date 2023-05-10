import { assignmentStates } from "../../entities/Assignment.js";
export default function ApprovalActions(params) {
  console.log("hello from approval module", params);

  const approve = async () => {
    console.log("approved");
    params.completeAssignment(params.assignment, assignmentStates.Approved);
  };

  const reject = async () => {
    console.log("reject");
    params.completeAssignment(params.assignment, assignmentStates.Rejected);
  };

  return { approve, reject };
}

ApprovalActions.prototype.dispose = function () {
  console.log("disposing approval");
};
