function initApp() {
  let assignmentListDef = {
    name: "Assignment",
    title: "Assignment",
    viewFields: {
      ID: { type: "Text" },
      Title: { type: "Text" },
      Assignee: { type: "Person" },
      ActionOffice: { type: "Lookup" },
      CanDelegate: { type: "Bool" },
      Comment: { type: "Text" },
      IsActive: { type: "Bool" },
      Role: { type: "Text" },
      Status: { type: "Text" },
      Author: { type: "Text" },
      Created: { type: "Text" },
    },
  };

  let assignmentListRef = new SPList(assignmentListDef);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let assignmentID = urlParams.get("assignment");

  if (assignmentID) {
    //$("#approval-message").text(`Approving record ${assignmentID}.`);
    let vp = [
      ["Status", "Approved"],
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["ActionTaker", _spPageContextInfo.userId],
    ];
    let timeout = window.setTimeout(
      () => $("#approval-message").text("Something went wrong"),
      3000
    );
    assignmentListRef.updateListItem(assignmentID, vp, () => {
      clearTimeout(timeout);
      $("#approval-message").text(
        `Record ${assignmentID} has been approved. You may now close this page.`
      );
    });
  } else {
    $("#approval-message").text("No record provided.");
  }
}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
