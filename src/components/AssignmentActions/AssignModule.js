import { assignmentStates } from "../../entities/Assignment.js";
import { roles } from "../../infrastructure/Authorization.js";

export default class AssignModule {
  constructor({ request, assignment, addAssignment, completeAssignment }) {
    this.allAssignments = request.Assignments.list.All;
    this.assignment = assignment;
    this.addAssignment = addAssignment;
    this.completeAssignment = completeAssignment;
    this.NextStage = request.Pipeline.getNextStage();
  }
  assignmentStates = assignmentStates;

  NewAssignments = ko.pureComputed(() => {
    return this.allAssignments().filter(
      (assignment) => assignment.PipelineStage.ID == this.NextStage.ID
    );
  });

  newAssignmentParams = ko.pureComputed(() => {
    return {
      addAssignment: async (newAssignment) => {
        newAssignment.RequestOrg = this.assignment.RequestOrg;
        this.addAssignment(newAssignment);
        this.completeAssignment(this.assignment, assignmentStates.Completed);
      },
      stage: this.NextStage,
    };
  });
  // this is the callback function we pass to the new assignments subcomponent
}
