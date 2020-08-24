tabsEnum = {
  "#my-orders": 0,
  "#assigned-orders": 1,
  "#order-lookup": 2,
  "#order-new": 3,
  "#order-detail": 4,
};

function initStaticListRefs() {
  vm.listRefWO(new SPList(workOrderListDef));
  //vm.listRefpu10k(new SPList(pu10kListDef));

  vm.listRefApproval(new SPList(approvalListDef));
  vm.listRefAction(new SPList(actionListDef));
  vm.libRefWODocs(new SPList(workOrderDocDef));
  vm.listRefAssignment(new SPList(assignmentListDef));
  vm.listRefComment(new SPList(commentListDef));
  vm.listRefWOEmails(new SPList(workOrderEmailsListDef));

  /* Configuration lists */
  vm.listRefConfigActionOffices(new SPList(configActionOfficesListDef));
  vm.listRefConfigHolidays(new SPList(configHolidaysListDef));
  vm.listRefConfigPipelines(new SPList(configPipelinesListDef));
  vm.listRefConfigRequestingOffices(new SPList(configRequestingOfficesListDef));
  vm.listRefConfigServiceType(new SPList(configServiceTypeListDef));
}

function initServiceTypeListRefs() {
  // These need to be defined separately after initialization
  // since they depend on data loaded from the static list refs
  // mutate the current service types arr

  vm.configServiceTypes().forEach((serviceType) => {
    if (serviceType.ListDef != null && serviceType.ListDef) {
      let servID = serviceType.ID;
      console.log("Creating List Ref for: ", servID);
      serviceType.listRef = new SPList(JSON.parse(serviceType.ListDef));
      serviceType.listDef = JSON.parse(serviceType.ListDef);
    }
  });
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
  viewWorkOrderItem(vm.requestID());
}

function showDescription(woType) {
  vm.selectedServiceType(woType);
  $("#wo-description-modal").modal("show");
}

function dismissDescription() {
  $("#wo-description-modal").modal("hide");
}

function newWorkOrder() {
  dismissDescription();
  // Chained, requires vm.selectedServiceType to already be selected.
  //console.log(woViews[woType].id);
  // Open the detail tab view
  //$('.ui.menu').find('.item').tab('change tab', 'order-detail');
  vm.tab("order-detail");

  //$.tab('change tab', 'order-detail');

  //$("#tabs").tabs({ active: tabsEnum['#order-detail'] });

  //set the select for which view we're on.
  vm.currentView("new");

  // Clear the workorder valuepairs
  //clearValuePairs(workOrderListDef.viewFields);
  //  Clear the selected service type valuepairs
  if (vm.selectedServiceType().ListDef) {
    clearValuePairs(vm.selectedServiceType().listDef.viewFields);
  }

  // Set our VM fields
  vm.requestID(new Date().getTime());
  updateUrlParam("reqid", vm.requestID());
  //vm.requestID('209Z');
  //fetchAttachments();
  vm.requestorName(sal.globalConfig.currentUser.get_title());
  vm.requestorTelephone("703-875-7070");
  vm.requestorEmail(sal.globalConfig.currentUser.get_email());
  vm.requestStageNum(0);
  vm.requestStatus("Draft");

  //Clear our requested fields.
  vm.requestClosedDate(null);
  vm.requestSubmittedDate(null);
  vm.requestActions([]);
  vm.requestApprovals([]);
  vm.requestAttachments([]);
  vm.requestAssignees([]);
  vm.requestComments([]);

  buildPipelineElement();
}

function viewWorkOrderItem(woID) {
  // Set the tab to detail view
  //$('.ui.menu').find('.item').tab('change tab', 'order-detail');

  //$.tab('change tab', '');
  //$("#tabs").tabs({ active: tabsEnum['#order-detail'] });
  vm.currentView("view");
  vm.requestID(woID);

  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq>' +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value>" +
    "</Eq></Where></Query></View>";

  vm.listRefWO().getListItems(camlq, function (items) {
    vm.requestHeader(items[0]);
    console.log("workorder fetched - setting value pairs");
    vm.selectedServiceType("");
    setValuePairs(workOrderListDef.viewFields, vm.requestHeader());

    /* Fetch all associated Items */
    fetchAssignments();
    fetchActions(function () {
      console.log("actions fetched");
    });
    fetchApprovals(function () {
      console.log("approvals fetched");
    });
    fetchAttachments();
    fetchComments(function () {
      console.log("comments fetched");
    });

    /* Fetch the associated service type items */
    if (vm.selectedServiceType().ListDef) {
      viewServiceTypeItem();
    }
    buildPipelineElement();
    $(".editable-field").prop("disabled", true);
    vm.tab("order-detail");
  });
}

function viewServiceTypeItem() {
  // Fetches the list item info from the currently selected service type and record.
  var serviceTypeCaml =
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.selectedServiceType().listRef.getListItems(serviceTypeCaml, (items) => {
    let res = items[0];
    vm.serviceTypeHeader(res);
    console.log("service type fetched -- setting valuepairs", items);
    setValuePairs(
      vm.selectedServiceType().listDef.viewFields,
      vm.serviceTypeHeader()
    );
  });
}

function buildPipelineElement() {
  if (!vm.selectedServiceType()) return;
  // TODO: Fix all this for the current pipeline.
  //Based off the currently selected record and record type, show a pipeline of where we're at in the process at the top of the page.
  var pipeline = '<div class="ui mini ordered steps">';

  // First step is editing, this is always checked
  var inDraft = vm.requestStatus() == "Draft" ? "active" : "completed";

  pipeline +=
    '<div class="step completed"><div class="conent"><i class="fa fa-4x ' +
    vm.selectedServiceType().Icon +
    '"/></div></div>';

  pipeline +=
    '<div class="step ' +
    inDraft +
    '">' +
    '<div class="content">' +
    '<div class="title">Editing</div>' +
    '<div class="description">New Request</div>' +
    "</div></div>";

  var status = "disabled";
  var curStage = parseInt(vm.requestStageNum());
  $.each(vm.selectedPipeline(), function (item, stage) {
    status = "disabled";
    if (stage.Step < curStage) {
      status = "completed";
    } else if (stage.Step == curStage) {
      status = "active";
    }

    pipeline +=
      '<div class="step ' +
      status +
      '">' +
      '<div class="content">' +
      '<div class="title">' +
      stage.ActionType +
      "</div>" +
      '<div class="description">' +
      stage.Title +
      "</div>" +
      "</div></div>";
  });

  let completeStatus = status == "completed" ? status : "disabled";
  // Replace status with Request closed status?
  pipeline +=
    '<div class="step ' +
    completeStatus +
    '">' +
    '<div class="content">' +
    '<div class="title">Closed</div>' +
    '<div class="description">Request Closed</div>' +
    "</div></div></div>";

  $("#wo-progress-pipeline").html(pipeline);
  //console.log("building pipeline", vm.selectedServiceType().Title);
}

function actionComplete() {
  // Progress to the next stage
  SP.UI.ModalDialog.showWaitScreenWithNoClose(
    "Progressing to Next Stage",
    "Please wait..."
  );
  // TODO: Anything that needs to be closed out before we enter the next stage

  // Enter the next stage, close if necessary.
  pipelineForward();

  // TODO: Anything that needs to be done in the new stage
}

function editWorkOrder() {
  //make the editable fields editable.
  //$('.editable-field').prop('disabled', false)
  vm.currentView("edit");
  // Need to do this to update the trix editor
  vm.requestDescriptionHTML.valueHasMutated();
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

  vm.requestIsSaveable(true);

  // Need to get the value of the trix editor.
  vm.requestDescriptionHTML($("#trix-request-description").html());

  if (vm.selectedServiceType().ListDef) {
    var typeValuePairs = getValuePairs(
      JSON.parse(vm.selectedServiceType().ListDef).viewFields
    );
  }

  // If all of our required fields are present.
  if (vm.requestIsSaveable()) {
    // First, save or update the parent work order item.
    switch (vm.currentView()) {
      case "edit":
        var requestValuePairs = getValuePairs(workOrderListDef.viewFields);

        // We are saving an edit form, get the id and update.
        vm.listRefWO().updateListItem(
          vm.requestHeader().ID,
          requestValuePairs,
          () => {
            console.log("Workorder header saved");
            if (!vm.selectedServiceType().ListDef) {
              onSaveEditWorkOrderCallback();
            }
          }
        );
        if (vm.selectedServiceType().ListDef) {
          // If we are saving to any other list.
          var typeValuePairs = getValuePairs(
            vm.selectedServiceType().listDef.viewFields
          );
          vm.selectedServiceType().listRef.updateListItem(
            vm.serviceTypeHeader().ID,
            typeValuePairs,
            onSaveEditWorkOrderCallback
          );
        }
        createAction("Edited", `The request has been edited.`);
        break;

      case "new":
        // we are saving a new record, create a new copy of each of the record types.
        // Save the current work order

        // Check the submitted date, if it's between 3 pm, (19 UTC) and midnight (4 UTC)
        // it needs to be set as submitted the next business day
        let now = new Date();
        if (now.getUTCHours() >= 19 || now.getUTCHours() < 4) {
          console.log("its after 3, this is submitted tomorrow");
          let tomorrow = businessDaysFromDate(now, 1);
          tomorrow.setUTCHours(13);
          tomorrow.setUTCMinutes(0);
          vm.requestSubmittedDate(tomorrow);
        } else {
          vm.requestSubmittedDate(new Date());
        }

        // Set the est closed date based off our submit date
        vm.requestEstClosed(
          businessDaysFromDate(
            vm.requestSubmittedDate(),
            vm.selectedServiceType().DaysToCloseDisp
          )
        );

        vm.requestStageNum(1);
        vm.requestStatus("Open");
        var valuePairs = getValuePairs(workOrderListDef.viewFields);

        // TODO: Figure out how to submit people to people picker fields.
        console.log("vp", valuePairs);
        vm.listRefWO().createListItem(
          valuePairs,
          function (id) {
            console.log("saved", id);
          },
          vm.requestorOffice().Title
        );

        if (typeValuePairs) {
          // Save the workorder specific info here:
          vm.selectedServiceType().listRef.createListItem(
            typeValuePairs,
            onSaveNewWorkOrderMaster,
            vm.requestorOffice().Title
          );
        } else {
          onSaveNewWorkOrderMaster();
        }

        createAction(
          "Created",
          `The request was submitted with an effective submission date of ${vm
            .requestSubmittedDate()
            .toDateString()}`,
          true
        );
        break;
    }
  } else {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
  }
}

function onSaveNewWorkOrderMaster(id) {
  console.log("callback this: ", this);
  console.log("callback val: ", id);
  viewWorkOrderItem(vm.requestID());
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function onSaveEditWorkOrderCallback(val) {
  console.log("callback val: ", val);
  viewWorkOrderItem(vm.requestID());
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

/************************************************************
 * ValuePair Binding Getters and Setters
 ************************************************************/

function getValuePairs(listDef) {
  console.log(listDef);
  var valuePairs = [];
  $.each(listDef, function (field, obj) {
    console.log(field, obj);

    // For each mapped field in our List Def viewfields, push the bound
    // KO object to it.
    if (!["ID", "ClosedDate", "Created"].includes(field)) {
      let koMap = obj.koMap;
      console.log(koMap);
      let fieldValue = !$.isEmptyObject(vm[koMap]()) ? vm[koMap]() : "";

      // Based on the field type, do any casting or conversions here
      switch (obj.type) {
        case "DateTime":
          fieldValue = fieldValue.toISOString();
          break;
        default:
      }
      // Check if this field is required
      // TODO: highlight the offending field
      if (obj.required && !fieldValue) {
        alert(field + " field is required");
        vm.requestIsSaveable(false);
      } else {
        valuePairs.push([field, fieldValue]);
      }
    }
  });
  return valuePairs;
}

function setValuePairs(listDef, jObject) {
  // The inverse of our getValuePairs function, set the KO observables
  // from our returned object.
  $.each(listDef, function (field, obj) {
    //console.log(field + " " + obj.koMap + " " );
    console.log(`Setting ${obj.koMap} to ${jObject[field]} from ${field}`);
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
    vm.configActionOffices(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigHolidays().getListItems("<Query></Query>", (items) => {
    vm.configHolidays(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigPipelines().getListItems("<Query></Query>", (items) => {
    vm.configPipelines(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigRequestingOffices().getListItems(
    "<Query></Query>",
    (items) => {
      vm.configRequestingOffices(items);
      vm.incLoadedListItems();
    }
  );
  /* We'll won't filter our inactive service types just in case there are some open */
  vm.listRefConfigServiceType().getListItems("<Query></Query>", (items) => {
    vm.configServiceTypes(items);
    vm.incLoadedListItems();
  });
}

/************************************************************
 * Work Orders
 ************************************************************/
function fetchAllOrders(callback) {
  vm.listRefWO().getListItems(
    '<View Scope="RecursiveAll"><Query><Where>' +
      "<Eq>" +
      '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
      "</Eq></Where></Query></View>",
    (items) => {
      console.log("loading open orders", items);
      vm.allOrders(items);
      if (items.length > 0) {
        makeDataTable("#wo-open-orders");
        makeDataTable("#wo-closed-orders");
        makeDataTable("#wo-cancelled-orders");
      }
      if (callback) {
        callback();
      }
    }
  );
}

/************************************************************
 * Attachments
 ************************************************************/
function newAttachment() {
  let folderPath = vm.requestorOffice().Title + "/" + vm.requestID();
  vm.libRefWODocs().createFolderRec(folderPath, () => {
    vm.libRefWODocs().uploadNewDocument(
      folderPath,
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
  let folderPath = vm.requestorOffice().Title + "/" + vm.requestID();

  //Update the attachments from SAL and load them to the page.
  let camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="WorkOrderID"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.libRefWODocs().getListItems(camlq, function (items) {
    vm.requestAttachments(items);
  });

  // vm.libRefWODocs().getFolderContents(folderPath, function (files) {
  //   console.log("attachments fetched");
  //   vm.requestAttachments(files);
  // });
}

/************************************************************
 * Assignments
 ************************************************************/
function newAssignment(role) {
  // Open the new assignments forms
  vm.listRefAssignment().showModal(
    "CustomNewForm.aspx",
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

function createAssignment() {
  // Create a new assignment based off our set observables
  if (vm.assignAssignee()) {
    let vp = [
      ["Title", vm.requestID()],
      ["Role", "Action Resolver"],
      ["ActionOffice", vm.assignAssignee().ID],
    ];
    vm.listRefAssignment().createListItem(
      vp,
      (id) => {
        console.log("Assigned: ", id);
        SP.UI.Notify.addNotification(
          vm.assignAssignee().Title + " assigned",
          true
        );
        $("#wo-routing").accordion("open", 0);
        fetchAssignments();
        createAction(
          "Assignment",
          `The following Action Office has been assigned to this request: ${
            vm.assignAssignee().Title
          }`
        );
        vm.assignAssignee(null);
      },
      vm.requestorOffice().Title
    );
  }
}

function fetchAssignments() {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    vm.requestAssignees(assignments);
  });
}

function fetchAllAssignments() {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><In>' +
    '<FieldRef Name="ActionOffice" LookupId="TRUE"/><Values>' +
    vm
      .userActionOfficeMembership()
      .map((ao) => {
        return '<Value Type="Lookup">' + ao.ID + "</Value>";
      })
      .join("") +
    "</Values></In></Where></Query></View>";

  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    console.log(assignments);
    vm.allAssignments(assignments);
    var idarr = [];
    $(vm.allAssignments()).each(function () {
      idarr.push(this.Title);
    });
    var filtered = $(vm.allOrders()).filter(function () {
      return idarr.includes(this.Title);
    });
    var vanilla = $.makeArray(filtered);
    vm.assignedOpenOrders(vanilla);
    makeDataTable("#wo-assigned-orders");
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
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
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
 * Action
 ************************************************************/
function newAction() {
  vm.listRefAction().showModal(
    "CustomNewForm.aspx",
    "New Action",
    { woId: vm.requestID() },
    newActionCallback
  );
}

function createAction(type, desc, sendEmail = false) {
  let vp = [
    ["Title", vm.requestID()],
    ["ActionType", type],
    ["Description", desc],
    ["SendEmail", sendEmail],
  ];
  vm.listRefAction().createListItem(
    vp,
    () => newActionCallback(SP.UI.DialogResult.OK, null),
    vm.requestorOffice().Title
  );
}

function fetchActions(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefAction().getListItems(camlq, function (actions) {
    vm.requestActions(actions);
    callback();
  });
}

function newActionCallback(result, value) {
  console.log("Action callback: " + result, value);
  if (result === SP.UI.DialogResult.OK) {
    SP.UI.ModalDialog.showWaitScreenWithNoClose("Refreshing Actions List...");
    //$(".admin-action-zone").hide();
    console.log(value);
    fetchActions(function () {
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
      // Let's branch based on whether the last approval was approve or reject.
      console.log("actions fetched");
    });
  }
}

/************************************************************
 * Comments
 ************************************************************/
function newComment() {
  vm.listRefComment().showModal(
    "CustomNewForm.aspx",
    "New Comment",
    { woId: vm.requestID(), rootFolder: vm.requestorOffice().Title + "/" },
    newCommentCallback
  );
}

function newCommentCallback(result, value) {
  console.log("approval callback: " + result, value);
  if (result === SP.UI.DialogResult.OK) {
    vm.commentNew("");
    $(".admin-action-zone").hide();
    console.log(value);
    fetchComments(function () {
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
      // Let's branch based on whether the last approval was approve or reject.
      console.log("comments fetched");
    });
  }
}

function submitComment() {
  SP.UI.ModalDialog.showWaitScreenWithNoClose("Submitting Comment...");
  vm.listRefComment().createListItem(
    [
      ["Title", vm.requestID()],
      ["Comment", vm.commentNew()],
    ],
    submitCommentCallback,
    vm.requestorOffice().Title
  );
}

function submitCommentCallback(id) {
  vm.commentNew("");
  fetchComments(() => {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
  });
}

function fetchComments(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></Where></Query></View>";
  vm.listRefComment().getListItems(camlq, function (comments) {
    vm.requestComments(comments);
    callback();
  });
}

/************************************************************
 * Pipeline
 ************************************************************/

function pipelineForward() {
  /* Increment the current request stage num */
  var t = parseInt(vm.requestStageNum()) + 1;
  vm.requestStageNum(t);
  var valuepairs = [["RequestStage", vm.requestStageNum()]];

  if (vm.requestStage().Title == "Closed") {
    valuepairs.push(["RequestStatus", "Closed"]);
  }

  vm.listRefWO().updateListItem(vm.requestHeader().ID, valuepairs, function () {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    console.log("pipeline moved to next stage.");
    buildPipelineElement();
    createAction(
      vm.requestStage().Title == "Closed" ? "Closed" : "Progressed",
      `${sal.globalConfig.currentUser.get_title()} has moved the request to stage ${
        vm.requestStage().Step
      }: ${vm.requestStage().Title}`
    );
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
  // $("#wo-progress-bar").progressbar({
  //   value: 0,
  // });
  // //$('.ui.sticky').sticky();
  // $(".ui.checkbox").checkbox();
  // $(".ui.accordion").accordion();
  // $(".ui.popup").popup();
  // $(".menu .item").tab();
  // $(".top.menu .item").tab({
  //   onVisible: function () {
  //     vm.tab(this.id);
  //   },
  // });

  console.log("initialized listeners");

  // Initialize our SharePoint Access Layer
  var ini = initSal();

  // Initialize ViewModel
  vm = new koviewmodel();
  ko.applyBindings(vm);

  // Setup models for each of the config lists we may connect to
  initStaticListRefs();
  // initPageListeners();
  fetchConfigListData();

  // Get our current user groups and store them
  getCurrentUserGroups((groups) => vm.userGroupMembership(groups));
  //if (hash != '') {
  //    viewWorkOrder(hash);
  //}
}

function initComplete() {
  //Initialize the rest of our list references
  initServiceTypeListRefs();
  initUIComponents();
  initTemplates();
  //Initialization complete: load the current tab.
  var href = window.location.href.toLowerCase();
  var hash = window.location.hash.replace("#", "");

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  //vm.tab(urlParams.get('page_type'))

  // check that we are on the app page
  if (
    href.indexOf("app.aspx") !== -1 ||
    href.indexOf("workorder.aspx") !== -1
  ) {
    vm.page("app");
    fetchAllOrders(function () {
      let tab = urlParams.get("tab");
      let id = urlParams.get("reqid");
      let stypeId = urlParams.get("stype");
      let stype = null;
      if (stypeId) {
        stype = vm
          .configServiceTypes()
          .find((serviceType) => serviceType.UID == stypeId);
      }

      if (id) {
        // Viewing workorder now
        console.log("Viewing the workorder: ", id);
        viewWorkOrderItem(id);
      } else if (tab) {
        vm.tab(tab);
        //vm.lookupOrderUpdate(stype);
        //$('.ui.menu').find('.item').tab('change tab', 'open-orders');
      } else {
        vm.tab("my-orders");
      }
      fetchAllAssignments();
      SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    });
  }
  $("#tabs").show();
}

function initUIComponents() {
  $(".ui.checkbox").checkbox();
  $(".ui.accordion").accordion();
  $(".ui.popup").popup();
  $(".menu .item").tab();
  $(".top.menu .item").tab({
    onVisible: function () {
      vm.tab(this.id);
    },
  });

  $(".ui.secondary.menu").find(".item").tab("change tab", "my-open-orders");
  //$(".ui.top.menu").find(".item").tab("change tab", "my-orders");
}

function initTemplates() {
  vm.configServiceTypes().forEach((stype) => {
    if (stype.TemplateName)
      $.get(
        `${sal.globalConfig.siteUrl}/SiteAssets/workorder/wo/ServiceTypeTemplates/${stype.TemplateName}`,
        function (template) {
          $("#service-type-templates").append(template);
        }
      );
  });
}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
