tabsEnum = {
  "#open-orders": 0,
  "#assigned-orders": 1,
  "#order-new": 2,
  "#order-detail": 3,
};

function initListRefs() {
  vm.listRefWO(new SPList(workOrderListDef));
  //vm.listRefpu10k(new SPList(pu10kListDef));

  vm.listRefApproval(new SPList(approvalListDef));
  vm.libRefWODocs(new SPList(workOrderDocDef));
  vm.listRefAssignment(new SPList(assignmentListDef));
  vm.listRefComment(new SPList(commentListDef));

  /* Configuration lists */
  vm.listRefConfigActionOffices(new SPList(configActionOfficesListDef));
  vm.listRefConfigHolidays(new SPList(configHolidaysListDef));
  vm.listRefConfigPipelines(new SPList(configPipelinesListDef));
  vm.listRefConfigRequestingOffices(new SPList(configRequestingOfficesListDef));
  vm.listRefConfigServiceType(new SPList(configServiceTypeListDef));

  // Now, create a listRef for each of our service types:
  $.each(woViews, function (name, view) {
    console.log(name, view);
    vm["listRef" + name](new SPList(view.listDef));
  });
}

// function initPageListeners() {
//     // $('#new-order-button').click(function () {
//     //     var formname = 'NewForm.aspx';
//     //     var title = 'New Work Order';
//     //     var args = {};
//     //     vm.listRefWO().showModal(formname, title, args, onSaveNewWorkOrderCallback)
//     // })
// }

function initVMVars() {
  // set the wo types
  var wotypes = [];
  $.each(woViews, function (key, val) {
    wotypes.push(val.name);
  });

  vm.requestTypes(wotypes);
}

function navSelectWorkOrder() {
  vm.tab("order-new");
  //$('.ui.menu').find('.item').tab('change tab', 'order-new');
  //$.tab('change tab', 'order-new');
  //$('#tabs').tabs({ active: tabsEnum['#order-new'] })
}

function closeWorkOrder() {
  var vp = [
    ["RequestStatus", "Closed"],
    ["RequestStage", "10"],
    ["ClosedDate", new Date()],
  ];
  vm.listRefWO().updateListItem(vm.requestHeader().ID, vp, function () {
    alert("record closed");
  });
  viewWorkOrder(vm.requestID());
}

function showDescription(woType) {
  vm.requestType(woType);
  //$('#wo-description-modal').dialog();
  $("#wo-description-modal").modal("show");
}

function dismissDescription() {
  $("#wo-description-modal").modal("hide");
}

function newWorkOrder() {
  dismissDescription();
  // Chained, requires vm.requestType to already be selected.
  //console.log(woViews[woType].id);
  // Open the detail tab view
  //$('.ui.menu').find('.item').tab('change tab', 'order-detail');
  vm.tab("order-detail");

  //$.tab('change tab', 'order-detail');

  //$("#tabs").tabs({ active: tabsEnum['#order-detail'] });

  //set the select for which view we're on.
  vm.currentView("new");

  clearValuePairs(vm.requestTypeView().listDef.viewFields);

  // Set our VM fields
  vm.requestID(new Date().getTime());
  //vm.requestID('209Z');
  //fetchAttachments();
  vm.requestorName(sal.globalConfig.currentUser.get_title());
  vm.requestorTelephone("703-875-7070");
  vm.requestorEmail(sal.globalConfig.currentUser.get_email());
  vm.requestorOffice();
  vm.requestStageNum(0);
  vm.requestStatus("Pending");

  //Clear our requested fields.
  vm.requestClosedDate(null);
  vm.requestSubmittedDate(null);
  vm.requestApprovals("");
  vm.requestAttachments("");
  vm.requestAssignees("");
  vm.requestComments("");
}

function viewWorkOrder(woID) {
  // Set the tab to detail view
  //$('.ui.menu').find('.item').tab('change tab', 'order-detail');

  //$.tab('change tab', '');
  //$("#tabs").tabs({ active: tabsEnum['#order-detail'] });
  vm.currentView("view");
  vm.requestID(woID);
  fetchAssignments();
  fetchApprovals(function () {
    console.log("approvals fetched");
  });
  fetchAttachments();
  fetchComments(function () {
    console.log("comments fetched");
  });

  var camlq =
    "<View><Query><Where><Eq>" +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value>" +
    "</Eq></Where></Query></View>";

  vm.listRefWO().getListItems(camlq, function (items) {
    vm.requestHeader(items[0]);
    console.log("workorder fetched - setting value pairs");
    setValuePairs(workOrderListDef.viewFields, items[0]);
    viewServiceType();
    //buildPipelineElement();
    $(".editable-field").prop("disabled", true);
  });
  vm.tab("order-detail");
}

function viewServiceType() {
  // Fetches the list item info from the currently selected service type and record.
  var serviceTypeCaml =
    '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.currentListRef().getListItems(serviceTypeCaml, function (items) {
    vm.serviceTypeHeader(items[0]);
    console.log("service type fetched -- setting valuepairs");
    setValuePairs(vm.requestTypeView().listDef.viewFields, items[0]);
  });
}

function buildPipelineElement() {
  //Based off the currently selected record and record type, show a pipeline of where we're at in the process at the top of the page.
  var pipeline = '<div class="ui mini ordered steps">';
  var curStage = parseInt(vm.requestStageNum());
  $.each(vm.requestTypeView().pipeline, function (item, stage) {
    var status = "disabled";
    if (item < curStage) {
      var status = "completed";
    } else if (item == curStage) {
      var status = "active";
    }

    pipeline +=
      '<div class="step ' +
      status +
      '">' +
      '<div class="content">' +
      '<div class="title">' +
      stage.type +
      "</div>" +
      '<div class="description">' +
      stage.displayName +
      "</div>" +
      "</div></div>";
  });

  pipeline += "</div>";
  $("#wo-progress-pipeline").html(pipeline);
  console.log("building pipeline", vm.requestType());
}

function actionComplete() {
  // Save the changes to the workorder
  //saveWorkOrder();
  // Update the Assignment to show Completion
  //vm.listRefAssignment().
  pipelineForward();
}

function editWorkOrder() {
  //make the editable fields editable.
  //$('.editable-field').prop('disabled', false)
  vm.currentView("edit");
}

function saveWorkOrder() {
  /* Save button handler switch based off of current view: 
        Saving edits to an already existing document
        Saving a new document
    */
  SP.UI.ModalDialog.showWaitScreenWithNoClose(
    "Saving Work Order...",
    "Please wait..."
  );
  var typeValuePairs = getValuePairs(vm.requestTypeView().listDef.viewFields);

  // First, save or update the parent work order item.
  switch (vm.currentView()) {
    case "edit":
      // We are saving an edit form, get the id and update.
      setTimeout(function () {
        onSaveEditWorkOrderCallback("12");
      }, 1000);
      vm.currentListRef().updateListItem(
        vm.serviceTypeHeader().ID,
        typeValuePairs,
        onSaveNewWorkOrderMaster
      );

      break;
    case "new":
      // we are saving a new record, create a new copy of each of the record types.
      // Save the current work order
      vm.requestStageNum(1);
      vm.requestStatus("Open");
      //var valuePairs = [['Title', 'Test Work Order'], ['RequestType', vm.requestTypeName()]]
      var valuePairs = getValuePairs(workOrderListDef.viewFields);

      // TODO: Figure out how to submit people to people picker fields.
      console.log("vp", valuePairs);
      vm.listRefWO().createListItem(valuePairs, function (id) {
        console.log("saved", id);
      });
      //setTimeout(function () {onSaveNewWorkOrderMaster('12')}, 1200);
      vm.requestSubmittedDate(new Date().toLocaleString());

      // Save the workorder specific info here:
      vm.currentListRef().createListItem(
        typeValuePairs,
        onSaveNewWorkOrderMaster
      );
      break;
  }

  switch (vm.requestType()) {
    case "pu10k":
      save_pu10k();
      break;
    case "tel":
      save_tel();
      break;
    case "presentation":
      break;
    case "rsa":
      break;
    default:
      onSaveNewWorkOrderMaster("01");
  }

  viewWorkOrder(vm.requestID());
  //$('.editable-field').prop('disabled', true)
  //vm.currentView('view');
}

function onSaveNewWorkOrderMaster(id) {
  console.log("callback this: ", this);
  console.log("callback val: ", id);
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function onSaveEditWorkOrderCallback(val) {
  console.log("callback val: ", val);
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

/************************************************************
 * Work Order Specific handlers.
 ************************************************************/
function save_pu10k() {
  // console.log('master wo saved')
  vm.pu10kDescription($("#textpu10kDescription").val());
  var valuePairs = getValuePairs(woViews.pu10k.listDef.viewFields);
  console.log("pu10k valuepairs", valuePairs);
  // Use our workaround to get the pu10k description text.
  switch (vm.currentView()) {
    case "new":
      vm.pu10kStage(0);
      vm.listRefpu10k().createListItem(valuePairs, onSaveNewWorkOrderMaster);
      //vm.requestProgress(20);
      break;
    case "edit":
      // TODO: Pass the correct item
      vm.listRefpu10k().updateListItem(
        vm.serviceTypeHeader().ID,
        valuePairs,
        onSaveEditWorkOrderCallback
      );
      break;
    default:
  }
}

function save_tel() {
  var valuePairs = getValuePairs(vm.requestTypeView().listDef.viewFields);
  switch (vm.currentView()) {
    case "new":
      //vm.pu10kStage(0);
      vm.currentListRef().createListItem(valuePairs, onSaveNewWorkOrderMaster);
      //vm.requestProgress(20);
      break;
    case "edit":
      // TODO: Pass the correct item
      vm.currentListRef().updateListItem(
        vm.serviceTypeHeader().ID,
        valuePairs,
        onSaveEditWorkOrderCallback
      );
      break;
    default:
  }
}

function getValuePairs(listDef) {
  var valuePairs = [];
  $.each(listDef, function (field, obj) {
    // For each mapped field in our List Def viewfields, push the bound
    // KO object to it.
    if (!["ID", "ClosedDate", "Created"].includes(field)) {
      switch (obj.type) {
        case "DateTime":
          valuePairs.push([
            field,
            !$.isEmptyObject(vm[obj.koMap]())
              ? vm[obj.koMap]().toISOString()
              : "",
          ]);
        default:
          valuePairs.push([
            field,
            !$.isEmptyObject(vm[obj.koMap]()) ? vm[obj.koMap]() : "",
          ]);
      }
    }
  });
  return valuePairs;
}

function setValuePairs(listDef, jObject) {
  // The inverse of our getValuePairs function, set the KO observables
  // from our returned object.
  $.each(listDef, function (field, obj) {
    console.log(field + " " + obj.koMap);
    vm[obj.koMap](jObject[field]);
  });
}

function clearValuePairs(listDef) {
  $.each(listDef, function (field, obj) {
    vm[obj.koMap]("");
  });
}

/************************************************************
 * Fetch Config Lists
 ************************************************************/

function fetchConfigListData(callback) {
  /* Retrieve all data from our config lists */
  vm.listRefConfigActionOffices().getListItems("<Query></Query>", (items) => {
    vm.listItemsConfigActionOffices(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigHolidays().getListItems("<Query></Query>", (items) => {
    vm.listItemsConfigHolidays(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigPipelines().getListItems("<Query></Query>", (items) => {
    vm.listItemsConfigPipelines(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigRequestingOffices().getListItems(
    "<Query></Query>",
    (items) => {
      vm.listItemsConfigRequestingOffices(items);
      vm.incLoadedListItems();
    }
  );
  /* We'll include out inactive service types just in case there are some open */
  vm.listRefConfigServiceType().getListItems("<Query></Query>", (items) => {
    vm.listItemsConfigServiceType(items);
    vm.incLoadedListItems();
  });
}

/************************************************************
 * Work Orders
 ************************************************************/
function fetchOpenOrders(callback) {
  vm.listRefWO().getListItems("<Query></Query>", (items) => {
    console.log("loading open orders", items);
    vm.allOpenOrders(items);
    if (items.length > 0) {
      makeDataTable("#wo-open-orders");
    }
    if (callback) {
      callback();
    }
  });
}

/************************************************************
 * Attachments
 ************************************************************/
function newAttachment() {
  vm.libRefWODocs().createFolder(vm.requestID(), function () {
    vm.libRefWODocs().uploadNewDocument(
      vm.requestID(),
      "Attach a New Document",
      { id: vm.requestID() },
      function () {
        console.log("success");
        fetchAttachments();
      }
    );
  });
}

function fetchAttachments() {
  //Update the attachments from SAL and load them to the page.
  vm.libRefWODocs().getFolderContents(vm.requestID(), function (files) {
    console.log("attachments fetched");
    vm.requestAttachments(files);
  });
}

/************************************************************
 * Assignments
 ************************************************************/
function newAssignment(role) {
  vm.listRefAssignment().showModal(
    "NewForm.aspx",
    "New Assignment",
    { woId: vm.requestID(), role: role },
    function (args) {
      //console.log('approval args', args)
      // TODO: If this pushes the process forward, handle that here.
      //approvalUpdateProgress()
      fetchAssignments();
    }
  );
}

function fetchAssignments() {
  var camlq =
    '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    vm.requestAssignees(assignments);
  });
}

function fetchAllAssignments() {
  var camlq =
    '<View><Query><Where><Eq><FieldRef Name="Assignee"/><Value Type="Integer"><UserID /></Value></Eq></Where></Query></View>';
  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    console.log(assignments);
    vm.allAssignments(assignments);
    var idarr = [];
    $(vm.allAssignments()).each(function () {
      idarr.push(this.Title);
    });
    var filtered = $(vm.allOpenOrders()).filter(function () {
      return idarr.includes(this.Title);
    });
    var vanilla = $.makeArray(filtered);
    vm.assignedOpenOrders(vanilla);
  });
}

/************************************************************
 * Approvals
 ************************************************************/
function newApproval() {
  vm.listRefApproval().showModal(
    "NewForm.aspx",
    "New adjudication",
    { woId: vm.requestID() },
    newApprovalCallback
  );
}

function fetchApprovals(callback) {
  var camlq =
    '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefApproval().getListItems(camlq, function (approvals) {
    vm.requestApprovals(approvals);
    callback();
  });
}

function newApprovalCallback(result, value) {
  console.log("approval callback: " + result, value);
  if (result === SP.UI.DialogResult.OK) {
    SP.UI.ModalDialog.showWaitScreenWithNoClose("Saving Work Order...");
    $(".admin-action-zone").hide();
    console.log(value);
    fetchApprovals(function () {
      // Let's branch based on whether the last approval was approve or reject.
      switch (vm.requestApprovals().slice(-1)[0].Adjudication) {
        case "Approved":
          //let'do whatever we need for an approved record.
          alert("Record has been approved. You may now close this window.");
          //TODO: Push to the next stage!!!!
          pipelineForward();
          break;
        case "Rejected":
          //Rejected records get closed!
          alert("Record has been rejected. You may now close this window.");
          break;
        default:
          //Something went wrong
          alert(":(");
      }
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    });
  }
}

/************************************************************
 * Comments
 ************************************************************/
function newComment() {
  vm.listRefComment().showModal(
    "NewForm.aspx",
    "New Comment",
    { woId: vm.requestID() },
    newCommentCallback
  );
}

function fetchComments(callback) {
  var camlq =
    '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefComment().getListItems(camlq, function (comments) {
    vm.requestComments(comments);
    callback();
  });
}

function newCommentCallback(result, value) {
  console.log("approval callback: " + result, value);
  if (result === SP.UI.DialogResult.OK) {
    SP.UI.ModalDialog.showWaitScreenWithNoClose("Saving Work Order...");
    $(".admin-action-zone").hide();
    console.log(value);
    fetchComments(function () {
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
      // Let's branch based on whether the last approval was approve or reject.
      console.log("comments fetched");
    });
  }
}

/************************************************************
 * Pipeline
 ************************************************************/

function pipelineForward() {
  /* Increment the current request stage num */
  var t = parseInt(vm.requestStageNum()) + 1;
  vm.requestStageNum(t);
  var valuepairs = [["RequestStage", vm.requestStageNum()]];
  vm.listRefWO().updateListItem(vm.requestHeader().ID, valuepairs, function () {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    console.log("pipeline moved to next stage.");
  });
}

/************************************************************
 * Initialize app
 ************************************************************/

function initApp() {
  SP.UI.ModalDialog.showWaitScreenWithNoClose("Initializing", "Please Wait...");
  //textpu10kDescription = new nicEditor({fullPanel : true}).panelInstance('textpu10kDescription')
  $(".non-editable-field").prop("disabled", true);
  //$("#tabs").tabs();
  $("#wo-progress-bar").progressbar({
    value: 0,
  });
  //$('.ui.sticky').sticky();
  $(".ui.accordion").accordion();
  $(".ui.popup").popup();
  $(".menu .item").tab();
  $(".top.menu .item").tab({
    onVisible: function () {
      vm.tab(this.id);
    },
  });

  console.log("initialized listeners");

  // Initialize our SharePoint Access Layer
  var ini = initSal();

  // Initialize ViewModel
  vm = new koviewmodel();
  ko.applyBindings(vm);

  // Setup models for each of the lists we may connect to
  initListRefs();
  // initPageListeners();
  initVMVars();
  var href = window.location.href.toLowerCase();
  var hash = window.location.hash.replace("#", "");
  // check that we are on the app page
  if (
    href.indexOf("app.aspx") !== -1 ||
    href.indexOf("workorder.aspx") !== -1
  ) {
    vm.page("app");
    fetchOpenOrders(function () {
      if (hash != "") {
        viewWorkOrder(hash);
      } else {
        vm.tab("open-orders");

        //$('.ui.menu').find('.item').tab('change tab', 'open-orders');
      }
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    });
  } else if (href.indexOf("approval.aspx") !== -1) {
    vm.page("approval");
    $("#li-open-orders").hide();
    $("#li-new-orders").hide();
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
  } else if (href.indexOf("admin.aspx") !== -1) {
    vm.page("admin");
    $("#li-new-orders").hide();
    fetchOpenOrders(function () {
      vm.tab("open-orders");
      //$('.ui.menu').find('.item').tab('change tab', 'open-orders');
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    });
    fetchAllAssignments();
  }

  //if (hash != '') {
  //    viewWorkOrder(hash);
  //}
}

function initComplete() {}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
