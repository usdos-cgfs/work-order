export default class TaskToastModule {
  constructor(task) {
    Object.assign(this, task);
  }

  FormatMessage = ko.pureComputed(() => `${this.msg}... ${this.Status()}`);
}
