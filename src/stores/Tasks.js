export const runningTasks = ko.observable();

export const blockingTasks = ko.pureComputed(() => {
  return runningTasks.filter((task) => task.def.blocking);
});

export const taskDefs = {
  init: { msg: "Initializing the Application", blocking: true },
  save: { msg: "Saving Request...", blocking: true },
  cancelAction: { msg: "Cancelling Action...", blocking: true },
  view: { msg: "Viewing Request...", blocking: true },
  refresh: { msg: "Refreshing Request...", blocking: true },
  lock: { msg: "Locking Request...", blocking: true },
  closing: { msg: "Closing Request...", blocking: true },
  pipeline: { msg: "Progressing to Next Stage...", blocking: true },
  newComment: { msg: "Refreshing Comments...", blocking: true },
  notifyComment: { msg: "Sending Comment Email...", blocking: true },
  newAction: { msg: "Refreshing Actions...", blocking: true },
  approve: { msg: "Approving Request...", blocking: true },
};

export const addTask = (taskDef) => {
  var newTask = {
    id: Math.floor(Math.random() * 100000 + 1),
    def,
  };

  newTask.timeout = window.setTimeout(function () {
    console.error("this task is aging:", newTask);
    alert(
      "Something seems to have gone wrong performing the following action: " +
        newTask.def.msg
    );
  }, 5000);
  runningTasks.push(newTask);
  return newTask.id;
};

export const finishTask = function (taskId) {
  let activeTask = runningTasks().find(function (taskItem) {
    return taskItem.id == taskId;
  });

  if (activeTask) {
    window.clearTimeout(activeTask.timeout);
    removeTask(activeTask);
  }
};

removeTask = function (taskToRemove) {
  runningTasks(
    runningTasks().filter(function (task) {
      return task.id != taskToRemove.id;
    })
  );
};
