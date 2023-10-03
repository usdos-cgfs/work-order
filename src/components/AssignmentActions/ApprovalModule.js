import { assignmentStates } from "../../entities/Assignment.js";
import { currentUser } from "../../infrastructure/Authorization.js";

export default class ApprovalActions {
  constructor(params) {
    // this._context = getAppContext();
    this.assignment = params.assignment;
    // this.ServiceType = params.request.ServiceType;
    // this.Errors = params.errors;
    // this.Request = params.request;
    this.completeAssignment = params.completeAssignment;
  }

  approve = async () => {
    this.completeAssignment(this.assignment, assignmentStates.Approved);
  };

  approveHandler = async () => {
    console.log("approved");
    // Check if we have been directly assigned or as an action office
    if (this.assignment.userIsDirectlyAssigned(currentUser())) {
      approve();
      return;
    }

    if (this.assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This approval is assigned to ${this.assignment.Assignee.Title}. Do you want to approve on their behalf? `
        )
      ) {
        approve();
      }
      return;
    }

    alert("You are not authorized to approve this request!");
  };

  rejectModalId = ko.pureComputed(() => "reject-modal-" + this.assignment.ID);
  RejectReason = ko.observable();

  reject = async () => {
    console.log("reject");
    this.assignment.Comment = this.RejectReason();
    this.completeAssignment(this.assignment, assignmentStates.Rejected);
    document.getElementById(this.rejectModalId()).close();
  };

  showReject = () => {
    const rejectModal = document.getElementById(this.rejectModalId());
    if (this.assignment.userIsDirectlyAssigned(currentUser())) {
      rejectModal.showModal();
      return;
    }

    if (this.assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This approval is assigned to ${this.assignment.Assignee.Title}. Do you want to reject on their behalf? `
        )
      ) {
        rejectModal.showModal();
      }
      return;
    }

    alert("You are not authorized to reject this request!");
  };

  cancelReject = () => {
    document.getElementById(this.rejectModalId()).close();
  };

  undo = async () => {
    // TODO: Minor - We should have an undo option instead of a "Reject Instead"
  };
}
