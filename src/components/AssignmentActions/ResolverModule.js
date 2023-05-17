import { assignmentStates } from "../../entities/Assignment.js";
import { currentUser } from "../../infrastructure/Authorization.js";

export default function (params) {
  console.log("hello from resolver module", params);

  const assignment = params.assignment;
  const complete = async () => {
    console.log("complete");
    params.completeAssignment(params.assignment, assignmentStates.Completed);
  };

  const completeHandler = () => {
    console.log("approved");
    // Check if we have been directly assigned or as an action office
    if (assignment.userIsDirectlyAssigned(currentUser())) {
      complete();
      return;
    }

    if (assignment.userIsInRequestOrg(currentUser())) {
      if (
        confirm(
          `This assignment is assigned to ${assignment.Assignee.Title}. Do you want to complete on their behalf? `
        )
      ) {
        complete();
      }
      return;
    }

    alert("You are not authorized to approve this request!");
  };
  return {
    assignment,
    assignmentStates,
    completeHandler,
  };
}
