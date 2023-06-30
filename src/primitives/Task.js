export const taskStates = {
  pending: "Pending",
  aging: "Aging",
  completed: "Completed",
};

export default class Task {
  constructor({ msg, blocking }) {
    this.msg = msg;
    this.blocking = blocking;
    this.Status(taskStates.pending);
  }

  msg;
  blocking;
  Status = ko.observable();

  timeout = window.setTimeout(() => {
    console.warn("this task is aging:", this);
    // alert(
    //   "Something seems to have gone wrong performing the following action: " +
    //     this.msg
    // );
    this.Status(taskStates.aging);
  }, 5000);

  markComplete = () => {
    window.clearTimeout(this.timeout);
    this.Status(taskStates.completed);
  };
}
