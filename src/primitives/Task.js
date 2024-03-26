const taskStates = {
  pending: "Pending",
  aging: "Aging",
  completed: "Completed",
};

export class Task {
  constructor({ msg, blocking }) {
    this.msg = msg;
    this.blocking = blocking;
    this.Status(taskStates.pending);

    this.timeout = this.setTimeout();
  }

  msg;
  blocking;
  Status = ko.observable();
  timeout;

  timeoutPeriod = 5000;

  setTimeout = () =>
    window.setTimeout(() => {
      console.warn("this task is aging:", this);
      this.Status(taskStates.aging);
    }, this.timeoutPeriod);

  resetTimeout = () => {
    window.clearTimeout(this.timeout);
    this.timeout = this.setTimeout();
  };

  markComplete = () => {
    window.clearTimeout(this.timeout);
    this.Status(taskStates.completed);
  };

  // Should this task block user input?
  IsBlocking = ko.pureComputed(
    () => this.blocking && this.Status() != taskStates.completed
  );
}

export class ProgressTask extends Task {
  constructor({ msg, blocking }) {
    super({ msg, blocking });
  }

  timeoutPeriod = 8000;

  updateProgress = ({ percentDone }) => {
    this.Status(`${parseInt(percentDone * 100)}%`);
  };
}
