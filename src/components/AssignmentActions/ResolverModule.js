import { assignmentStates } from "../../entities/Assignment.js";

export default function (params) {
  console.log("hello from resolver module", params);

  const complete = async () => {
    console.log("complete");
    params.completeAssignment(params.assignment, assignmentStates.Completed);
  };

  return {
    complete,
  };
}
