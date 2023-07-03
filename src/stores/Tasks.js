import Task from "../primitives/Task.js";

export const runningTasks = ko.observableArray();

export const blockingTasks = ko.pureComputed(() => {
  return runningTasks().filter((task) => task.IsBlocking()) ?? [];
});

export const taskDefs = {
  init: { msg: "Initializing the Application", blocking: true },
  save: { msg: "Saving Request", blocking: true },
  cancelAction: { msg: "Cancelling Action", blocking: true },
  view: { msg: "Viewing Request", blocking: false },
  refresh: { msg: "Refreshing Request", blocking: false },
  permissions: { msg: "Updating Request Item Permissions", blocking: true },
  lock: { msg: "Locking Request", blocking: true },
  closing: { msg: "Closing Request", blocking: true },
  pipeline: { msg: "Progressing to Next Stage", blocking: true },
  newComment: { msg: "Submitting Comment", blocking: false },
  refreshComments: { msg: "Refreshing Comments", blocking: false },
  notifyComment: { msg: "Sending Comment Email", blocking: false },
  newAction: { msg: "Submitting Action", blocking: false },
  refreshActions: { msg: "Refreshing Actions", blocking: false },
  newAttachment: { msg: "Submitting Attachment", blocking: false },
  refreshAttachments: { msg: "Refreshing Attachments", blocking: false },
  approve: { msg: "Approving Request", blocking: true },
};

export const addTask = (taskDef) => {
  const newTask = new Task(taskDef);

  runningTasks.push(newTask);
  return newTask;
};

export const finishTask = function (activeTask) {
  if (activeTask) {
    activeTask.markComplete();
    window.setTimeout(() => removeTask(activeTask), 3000);
    // runningTasks.remove(activeTask);
  }
};

const removeTask = function (taskToRemove) {
  runningTasks.remove(taskToRemove);
};
