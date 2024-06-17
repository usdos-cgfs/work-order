import { BaseComponent } from "../BaseComponent.js";
import { taskToastTemplate } from "./TaskToastTemplate.js";

export class TaskToastModule extends BaseComponent {
  constructor(task) {
    Object.assign(this, task);
  }

  FormatMessage = ko.pureComputed(() => `${this.msg}... ${this.Status()}`);

  static name = "task-toast";
  static template = taskToastTemplate;
}
