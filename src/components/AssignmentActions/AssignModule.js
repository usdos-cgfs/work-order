import { assignmentStates } from "../../entities/Assignment.js";
import { roles } from "../../infrastructure/Authorization.js";
import { BaseComponent } from "../index.js";
import { assignTemplate } from "./AssignTemplate.js";

export class AssignModule extends BaseComponent {
  constructor({ request, assignment, addAssignment, completeAssignment }) {
    super();
    this.allAssignments = request.Assignments.list.All;
    this.assignment = assignment;
    this.addAssignment = addAssignment;
    this.completeAssignment = completeAssignment;
    this.NextStage = request.Pipeline.getNextStage();
  }
  assignmentStates = assignmentStates;

  // TODO: How can we show who was assigned by this request,
  NewAssignments = ko.pureComputed(() => {
    return this.allAssignments().filter(
      (assignment) => assignment.PipelineStage.ID == this.NextStage?.ID
    );
  });

  // TODO: how should stage be determined?
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

  static name = "assigner-actions";
  static template = assignTemplate;
}
