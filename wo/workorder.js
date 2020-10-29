tabsEnum = {
  "#my-orders": 0,
  "#assigned-orders": 1,
  "#order-lookup": 2,
  "#order-new": 3,
  "#order-detail": 4,
};

function initStaticListRefs() {
  vm.listRefWO(new sal.NewSPList(workOrderListDef));
  //vm.listRefpu10k(new SPList(pu10kListDef));

  vm.listRefApproval(new sal.NewSPList(approvalListDef));
  vm.listRefAction(new sal.NewSPList(actionListDef));
  vm.libRefWODocs(new sal.NewSPList(workOrderDocDef));
  vm.listRefAssignment(new sal.NewSPList(assignmentListDef));
  vm.listRefComment(new sal.NewSPList(commentListDef));
  vm.listRefWOEmails(new sal.NewSPList(workOrderEmailsListDef));

  /* Configuration lists */
  vm.listRefConfigActionOffices(new sal.NewSPList(configActionOfficesListDef));
  //vm.listRefconfigRequestOrgs(new SPList(configRequestOrgsListDef));
  vm.listRefConfigHolidays(new sal.NewSPList(configHolidaysListDef));
  vm.listRefConfigPipelines(new sal.NewSPList(configPipelinesListDef));
  vm.listRefConfigRequestingOffices(
    new sal.NewSPList(configRequestingOfficesListDef)
  );
  vm.listRefConfigRequestOrgs(new sal.NewSPList(configRequestOrgsListDef));
  vm.listRefConfigServiceType(new sal.NewSPList(configServiceTypeListDef));
}

function initServiceTypeListRefDefs() {
  // These should be set as soon as templates are loaded.

  vm.configServiceTypes().forEach((serviceType) => {
    if (serviceType.TemplateName) {
      let listDef = vm
        .listDefs()
        .find((listDef) => listDef.uid == serviceType.UID);

      if (listDef) {
        serviceType.listDef = listDef;

        serviceType.listRef = new sal.NewSPList(listDef);
      }
    }
  });
}

function navSelectWorkOrder() {
  vm.tab("order-new");
  //$('.ui.menu').find('.item').tab('change tab', 'order-new');
  //$.tab('change tab', 'order-new');
  //$('#tabs').tabs({ active: tabsEnum['#order-new'] })
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
  vm.tab("order-detail");

  //set the select for which view we're on.
  vm.currentView("new");

  // Set our VM fields
  vm.requestID(new Date().getTime());
  updateUrlParam("reqid", vm.requestID());

  vm.requestorName(sal.globalConfig.currentUser.get_title());
  if (sal.globalConfig.currentUserProfile) {
    vm.requestorTelephone(
      sal.globalConfig.currentUserProfile.UserProfileProperties.results.find(
        (prop) => prop.Key == "WorkPhone"
      ).Value
    );
  } else {
    vm.requestorTelephone("");
  }
  vm.requestorEmail(sal.globalConfig.currentUser.get_email());
  vm.requestStageNum(0);
  vm.requestIsActive(1);
  vm.requestStatus("Draft");

  //Clear our requested fields.
  vm.requestHeader(new Object());
  vm.requestClosedDate(null);
  vm.requestSubmittedDate(null);
  vm.requestDescriptionHTML(null);
  vm.requestActions([]);
  vm.requestApprovals([]);
  vm.requestAttachments([]);
  //vm.requestAssignees([]);
  vm.requestAssignments([]);
  vm.requestComments([]);

  buildPipelineElement();
}

function refreshWorkOrderItem(woID, callback = null) {
  SP.UI.ModalDialog.showWaitScreenWithNoClose("Refreshing Work Order...");
  let camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq><Eq>" +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    woID +
    "</Value>" +
    "</Eq></And></Where></Query><RowLimit>1</RowLimit></View>";

  let reqCamlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq><Eq>" +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    woID +
    "</Value>" +
    "</Eq></And></Where></Query><RowLimit>1</RowLimit></View>";

  vm.listRefWO().getListItems(camlq, (items) => {
    console.log("loading open orders", items);
    if (items[0]) {
      let req = items[0];
      if (vm.allOrders().find((order) => order.Title == woID)) {
        vm.allOrders(
          vm.allOrders().map((order) => (order.Title == woID ? req : order))
        );
      } else {
        vm.allOrders.push(req);
      }
      fetchRequestAssignments(woID, () => {
        viewWorkOrderItem(woID);
        if (callback) {
          callback();
        }
      });
    }
  });
}

function viewWorkOrderItem(woID) {
  // Set the tab to detail view
  //$('.ui.menu').find('.item').tab('change tab', 'order-detail');

  //$.tab('change tab', '');
  //$("#tabs").tabs({ active: tabsEnum['#order-detail'] });
  let request = vm.allOrders().find((order) => order.Title == woID);

  if (!request) {
    // Clear urlparam
    updateUrlParam("reqid", "");
    vm.tab("my-orders");
  } else {
    vm.requestID(woID);

    vm.requestHeader(request);
    console.log("workorder fetched - setting value pairs");
    vm.selectedServiceType("");
    clearValuePairs(workOrderListDef.viewFields);
    setValuePairs(workOrderListDef.viewFields, vm.requestHeader());

    vm.requestAssignments(vm.allRequestAssignmentsMap()[woID]);
    /* Fetch all associated Items */
    //fetchRequestAssignments();
    fetchActions(function () {
      console.log("actions fetched");
      try {
        $(".ui.accordion").accordion();
      } catch (e) {
        console.log("error showing accordion");
      }
    });
    fetchApprovals(function () {
      console.log("approvals fetched");
    });
    fetchAttachments();
    fetchComments(function () {
      console.log("comments fetched");
    });

    buildPipelineElement();
    /* Fetch the associated service type items */
    if (vm.selectedServiceType().listDef) {
      viewServiceTypeItem();
    } else {
      onViewWorkOrderItemComplete();
    }
    //initUIComponents();
  }
}

function viewServiceTypeItem() {
  // Fetches the list item info from the currently selected service type and record.
  var serviceTypeCaml =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
  vm.selectedServiceType().listRef.getListItems(serviceTypeCaml, (items) => {
    if (items[0]) {
      let res = items[0];
      vm.serviceTypeHeader(res);
      console.log("service type fetched -- setting valuepairs", items);
      setValuePairs(
        vm.selectedServiceType().listDef.viewFields,
        vm.serviceTypeHeader()
      );
    } else {
      timedNotification("Warning: couldn't find Service Type Info");
    }
    onViewWorkOrderItemComplete();
  });
}

function onViewWorkOrderItemComplete() {
  vm.requestLoaded(new Date());
  vm.tab("order-detail");
  vm.currentView("view");
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
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
            if (!vm.selectedServiceType().listDef) {
              onSaveEditWorkOrderCallback();
            }
          }
        );
        if (vm.requestSvcTypeListBool()) {
          var typeValuePairs = getValuePairs(vm.requestSvcTypeListViewFields());

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

        /* The following actions need to be performed atomically
            If any step fails, the entire process fails, should alert user
            to retry.
          1. createWorkorderFolders - Create new folders in each list/lib 
            a. Update folder permissions - handled in 1, on increment
          2. createWorkorderItem - On success of 1a,  
              triggered by vm.foldersCreated subscriber
        */
        createWorkorderFolders();

        break;
    }
  } else {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
  }
}

function calcNewWorkorderDates() {
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

  //Set the request orgs
  vm.requestOrgIds(vm.selectedServiceType().RequestOrgs);

  //vm.requestStageNum(0);
  vm.requestStatus("Open");
}

function createNewWorkorderItems() {
  window.clearTimeout(window.breakingPermissionsTimeoutID);
  // triggered by vm.foldersCreated.subscribe in viewmodel.js
  // This should only run once the appropriate permissions are set
  // at the folder level to prevent info spillage.

  calcNewWorkorderDates();

  var valuePairs = getValuePairs(workOrderListDef.viewFields);

  console.log("vp", valuePairs);
  vm.listRefWO().createListItem(
    valuePairs,
    function (id) {
      console.log("saved", id);
      //Once we've sucessfully saved the master document
      if (id) {
        if (vm.requestSvcTypeListBool()) {
          var typeValuePairs = getValuePairs(vm.requestSvcTypeListViewFields());

          // Save the workorder specific info here:
          vm.selectedServiceType().listRef.createListItem(
            typeValuePairs,
            () => onSaveNewWorkOrderMaster(id),
            vm.requestFolderPath()
          );
        } else {
          onSaveNewWorkOrderMaster(id);
        }
      }
    },
    vm.requestFolderPath()
  );
}

function onSaveNewWorkOrderMaster(id) {
  console.log("callback this: ", this);
  console.log("callback val: ", id);

  // Create our New Work Order Email
  Workorder.Notifications.newWorkorderEmails();

  // Offload our reminder emails to a separate function
  Workorder.Notifications.workorderReminderEmails(id);

  // Create our Action
  createAction(
    "Created",
    `The request was submitted with an effective submission date of ${vm
      .requestSubmittedDate()
      .toDateString()}`,
    true
  );
  //pipelineForward();
  refreshWorkOrderItem(vm.requestID(), () => pipelineForward());
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function onSaveEditWorkOrderCallback(val) {
  console.log("callback val: ", val);
  refreshWorkOrderItem(vm.requestID());
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function breakingPermissionsTimeoutFunc() {
  alert(
    "Looks like something went wrong while setting the permissions." +
      "Please try to save the workorder again. \n" +
      "If you continue to see this message, please " +
      "report it to cgfssharepoint@state.gov."
  );
  Workorder.Notifications.breakingPermissionsTimeout();
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function createWorkorderFolders() {
  window.breakingPermissionsTimeoutID = window.setTimeout(
    breakingPermissionsTimeoutFunc,
    5000
  );
  vm.foldersCreated(0);

  // Set all permissions up front
  let folderPermissions = vm.requestFolderPerms();

  //For each of our multi-item lists, create a new folder
  let listRefs = [
    vm.listRefWO(),
    vm.listRefAction(),
    vm.listRefAssignment(),
    vm.listRefWOEmails(),
  ];

  if (vm.requestSvcTypeListBool()) {
    // Also create a folder for the service type
    listRefs.push(vm.selectedServiceType().listRef);
  }

  listRefs.forEach((listRef) =>
    listRef.upsertListFolderPath(vm.requestFolderPath(), (folderId) => {
      // Update the permissions for the new folder
      if (folderId) {
        listRef.setItemPermissions(
          folderId,
          folderPermissions,
          () => {
            vm.foldersCreatedInc();
          },
          true
        );
      }
    })
  );

  // vm.libRefWODocs().createFolderRec(vm.requestFolderPath(), (folder) => {
  //   vm.libRefWODocs().setLibFolderPermissions(
  //     vm.requestFolderPath(),
  //     folderPermissions,
  //     () => {
  //       vm.foldersCreatedInc();
  //     },
  //     true
  //   );
  // });
}

/************************************************************
 * ValuePair Binding Getters and Setters
 ************************************************************/

function getValuePairs(listDef) {
  console.log(listDef);
  var valuePairs = [];
  let missingFields = new Array();
  $.each(listDef, function (field, obj) {
    console.log(field, obj);

    // For each mapped field in our List Def viewfields, push the bound
    // KO object to it.
    if (!["ID", "ClosedDate", "Created"].includes(field)) {
      let koMap = obj.koMap;
      console.log(koMap);
      let observable = vm[koMap];
      //let fieldValue = !$.isEmptyObject(vm[koMap]()) ? vm[koMap]() : "";

      // Based on the field type, do any casting or conversions here
      switch (obj.type) {
        case "DateTime":
          fieldValue = observable().toISOString();
          break;
        case "Person":
          fieldValue = observable.userId();
          break;
        default:
          fieldValue = observable();
      }
      // Check if this field is required
      // TODO: highlight the offending field
      if (obj.required && !fieldValue) {
        missingFields.push(field);
        //vm.requestIsSaveable(false);
      } else {
        valuePairs.push([field, fieldValue]);
      }
    }
  });

  if (missingFields.length) {
    let warn =
      "The request has not been saved. The following fields are missing: \n";
    missingFields.forEach((field) => {
      warn += field + "\n";
    });
    alert(warn);
  }

  return valuePairs;
}

function setValuePairs(listDef, jObject) {
  // The inverse of our getValuePairs function, set the KO observables
  // from our returned object.
  $.each(listDef, function (field, obj) {
    //console.log(field + " " + obj.koMap + " " );
    console.log(`Setting ${obj.koMap} to ${jObject[field]} from ${field}`);
    let observable = vm[obj.koMap];
    switch (obj.type) {
      case "Person":
        observable.userId(jObject[field]);
        break;
      default:
        observable(jObject[field]);
    }
  });
}

function clearValuePairs(listDef) {
  $.each(listDef, function (field, obj) {
    if (obj.koMap != "requestID") {
      let observable = vm[obj.koMap];
      switch (obj.type) {
        case "Person":
          observable.user(new Object());
          break;
        default:
          observable("");
      }
    }
  });
}
/************************************************************
 * Fetch Static List Data
 ************************************************************/
function fetchStaticListData(callback) {
  // Fetch anything we need to present our app
  fetchAllOrders((orders) => {
    vm.incLoadedListItems();
    fetchAllAssignments((assignments) => {
      vm.incLoadedListItems();
    });
  });
}

/************************************************************
 * Fetch Config Lists
 ************************************************************/

function fetchConfigListData(callback) {
  /* Retrieve all data from our config lists */
  /* Once cnt loaded list items hit's 5, initComplete() */
  vm.listRefConfigActionOffices().getListItems("<Query></Query>", (items) => {
    vm.configActionOffices(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigRequestOrgs().getListItems("<Query></Query>", (items) => {
    vm.configRequestOrgs(items);
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
  /* We won't filter our inactive service types just in case there are some open */
  vm.listRefConfigServiceType().getListItems("<Query></Query>", (items) => {
    vm.configServiceTypes(items);
    vm.incLoadedListItems();
  });
}

/************************************************************
 * Work Orders
 ************************************************************/
function fetchAllOrders(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq></Where></Query></View>";

  vm.listRefWO().getListItems(camlq, (items) => {
    console.log("loading open orders", items);
    vm.allOrders(items);
    if (callback) {
      callback(items);
    }
  });
}

/************************************************************
 * Attachments
 ************************************************************/
function newAttachment() {
  vm.libRefWODocs().createFolderRec(vm.requestFolderPath(), () => {
    vm.libRefWODocs().setLibFolderPermissions(
      vm.requestFolderPath(),
      vm.requestFolderPerms(),
      () => {
        vm.libRefWODocs().uploadNewDocument(
          vm.requestFolderPath(),
          "Attach a New Document",
          { id: vm.requestID() },
          function () {
            console.log("success");
            fetchAttachments();
          }
        );
      },
      true
    );
  });
}

function fetchAttachments() {
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
function newOfficeAssignment() {
  // Takes a new action office and adds it to the request assigned offices
  vm.requestOrgs.push(vm.assignRequestOffice());

  vm.listRefWO().updateListItem(
    vm.requestHeader().ID,
    [["RequestOrgs", vm.requestOrgIds()]],
    () => vm.assignRequestOffice(null)
  );
}

function newAssignmentForm(role) {
  // Open the new assignments forms
  vm.listRefAssignment().showModal(
    "CustomNewForm.aspx",
    "New Assignment",
    { woId: vm.requestID(), role: role },
    function (args) {
      //console.log('approval args', args)
      // TODO: If this pushes the process forward, handle that here.
      //approvalUpdateProgress()
      fetchRequestAssignments();
    }
  );
}

function createAssignment(role = "Action Resolver", notify = false) {
  // Create a new assignment based off our set observables
  if (vm.assignActionOffice() || vm.assignAssignee()) {
    let vp = [
      ["Title", vm.requestID()],
      ["Role", role],
    ];
    if (vm.assignActionOffice()) {
      vp.push(["ActionOffice", vm.assignActionOffice().ID]);
    }
    if (vm.assignAssignee()) {
      vp.push(["Assignee", vm.assignAssignee().userId()]);
    }
    vm.listRefAssignment().createListItem(
      vp,
      (id) => {
        console.log("Assigned: ", id);
        try {
          $("#wo-routing").accordion("open", 0);
        } catch (e) {
          console.warn("Do we have any accordions?", e);
        }
        fetchRequestAssignments(vm.requestID(), (assignments) => {
          //let rvp = [["RequestAssignments", vm.requestAssignmentIds()]];
          //vm.listRefWO().updateListItem(vm.requestHeader().ID, rvp, () => {});
        });
        if (notify) {
          // Build our email
          //If we have an assignee, send direct to them
          Workorder.Notifications.newAssignmentNotification(role, id);
        }
        //Update the request with a new assignment:
        // Create Action
        let actionText = new String();
        if (vm.assignAssignee()) {
          actionText = `The following Individual has been assigned to this request: ${vm
            .assignAssignee()
            .lookupUser()
            .get_lookupValue()} - ${role}`;
        } else if (vm.assignActionOffice()) {
          actionText = `The following Action Office has been assigned to this request: ${
            vm.assignActionOffice().Title
          } - ${role}`;
        }
        createAction("Assignment", actionText);
        timedNotification(actionText);
        vm.assignActionOffice(null);
        vm.assignAssignee(null);
      },
      vm.requestFolderPath()
    );
  }
}

function fetchAllAssignments(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq></Where></Query></View>";
  let start = new Date();
  vm.listRefAssignment().getListItems(camlq, (assignments) => {
    assignments.map((assignment) => {
      if (assignment.ActionOffice) {
        assignment.actionOffice = vm
          .configActionOffices()
          .find((ao) => ao.ID == assignment.ActionOffice.get_lookupId());
      }
    });
    vm.allAssignments(assignments);

    let end = new Date();
    console.log(`assignments mapped in ${end - start} ms`);
    if (callback) {
      callback(assignments);
    }
  });
}

function fetchRequestAssignments(title = null, callback = null) {
  let queryTitle = title ? title : vm.requestID();

  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    queryTitle +
    "</Value></Eq></And></Where></Query></View>";

  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    // Let's connect our Action offices here.
    assignments.map((assignment) => {
      if (assignment.ActionOffice) {
        assignment.actionOffice = vm
          .configActionOffices()
          .find((ao) => ao.ID == assignment.ActionOffice.get_lookupId());
      }
    });

    assignments.forEach((assignment) => {
      if (
        vm
          .allAssignments()
          .find((allAssignment) => allAssignment.ID == assignment.ID)
      ) {
        // If this is already in our assignment list, update it
        vm.allAssignments(
          vm
            .allAssignments()
            .map((allAssignment) =>
              allAssignment.ID == assignment.ID ? assignment : allAssignment
            )
        );
      } else {
        // Push the new assignment to the list
        vm.allAssignments.push(assignment);
      }
    });

    vm.requestAssignments(assignments);

    // vm
    //   .allOrders()
    //   .find(
    //     (order) => order.Title == queryTitle
    //   ).requestAssignmentMap = assignments;

    vm.allAssignments.valueHasMutated();
    if (callback) {
      callback(assignments);
    }
  });
}

function updateTableRequest(id) {
  let title = this.Title;
  vm.tableRequestTitle(title);
  fetchRequestAssignments(id, (assigments) =>
    vm.tableRequestAssignments(assigments)
  );
}

function fetchMyAOAssignments() {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq><In>" +
    '<FieldRef Name="ActionOffice" LookupId="TRUE"/><Values>' +
    vm
      .userActionOfficeMembership()
      .map((ao) => {
        return '<Value Type="Lookup">' + ao.ID + "</Value>";
      })
      .join("") +
    "</Values></In></And></Where></Query></View>";

  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    console.log(assignments);
    vm.allAOAssignments(assignments);
    var idarr = [];
    $(vm.allAssignments()).each(function () {
      idarr.push(this.Title);
    });
    var filtered = $(vm.allOrders()).filter(function () {
      return idarr.includes(this.Title);
    });
    var vanilla = $.makeArray(filtered);
    vm.assignedOpenOrders(vanilla);
    //makeDataTable("#wo-assigned-orders");
  });
}

/************************************************************
 * Approvals
 ************************************************************/
function approveRequest() {
  // Find the assignment that needs approving and approve!
  vm.requestAssignments().forEach((assignment) => {
    if (vm.assignmentCurUserCanApprove(assignment)) {
      vm.assignmentApprove(assignment);
    }
  });
}

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
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
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
    vm.requestFolderPath()
  );
}

function fetchActions(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
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
    { woId: vm.requestID(), rootFolder: vm.requestFolderPath() + "/" },
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
  if (vm.commentNew()) {
    SP.UI.ModalDialog.showWaitScreenWithNoClose("Submitting Comment...");
    vm.listRefComment().upsertListFolderPath(
      vm.requestFolderPath(),
      (folderId) => {
        // Update the permissions for the new folder
        if (folderId) {
          vm.listRefComment().setItemPermissions(
            folderId,
            vm.requestFolderPerms(),
            () => {
              vm.listRefComment().createListItem(
                [
                  ["Title", vm.requestID()],
                  ["Comment", vm.commentNew()],
                ],
                submitCommentCallback,
                vm.requestFolderPath()
              );
            },
            true
          );
        }
      }
    );
  }
}

function submitCommentCallback(id) {
  vm.commentNew("");
  fetchComments(() => {
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
  });
}

function fetchComments(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
  vm.listRefComment().getListItems(camlq, function (comments) {
    vm.requestComments(comments);
    callback();
  });
}

/************************************************************
 * Pipeline
 ************************************************************/
/**
 * Documentation - pipelineForward
 * Progress the current request pipeline forward, increment
 * stage number, handle closing, and handle assignments from
 * new ConfigPipeline stage.
 */
function pipelineForward() {
  let valuePairs = new Array();

  /* Increment the current request stage num */
  var t = parseInt(vm.requestStageNum()) + 1;
  if (t > vm.selectedPipeline().length) {
    // vm.requestStatus("Closed");
    // valuePairs.push(["RequestStatus", "Closed"]);
    closeWorkOrder();
  } else {
    vm.requestStageNum(t);
    valuePairs.push(["RequestStage", vm.requestStageNum()]);

    vm.listRefWO().updateListItem(
      vm.requestHeader().ID,
      valuePairs,
      function () {
        console.log("pipeline moved to next stage.");
        buildPipelineElement();
        pipelineAssignments();
        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
      }
    );
  }
}

function pipelineAssignments() {
  if (vm.requestIsActive() && vm.requestStage()) {
    if (vm.requestStage().WildCardAssignee) {
      let personName = vm.requestStage().WildCardAssignee;
      // This should be a person field
      try {
        let personObservable = vm[personName];
        vm.assignAssignee(personObservable);
      } catch (err) {
        console.error(
          `Something went wrong fetching ${personName} from viewmodel:`,
          err
        );
      }
    }
    switch (vm.requestStage().ActionType) {
      case "Pending Approval":
        // The assigned approver needs to check off
        vm.assignActionOffice(vm.requestStageOffice());
        createAssignment("Approver", true);
        break;
      case "Pending Action":
        vm.assignActionOffice(vm.requestStageOffice());
        createAssignment("Action Resolver");
        break;
      case "Notification":
      case "Pending Resolution":
      case "Pending Assignment":
      default:
        pipelineNotifications();
        break;
    }
  } else {
    pipelineNotifications();
  }
}

function pipelineNotifications(addendum = null) {
  Workorder.Notfications.pipelineStageNotification();

  // Create the action
  createAction(
    vm.requestStage().Title == "Closed" ? "Closed" : "Progressed",
    `${sal.globalConfig.currentUser.get_title()} has moved the request to stage ${
      vm.requestStage().Step
    }: ${vm.requestStage().Title}`
  );
}

function cancelWorkOrder() {
  SP.UI.ModalDialog.showWaitScreenWithNoClose("Cancelling Request...");
  closeWorkOrder("Cancelled");
}

function closeWorkOrder(reason = "Closed") {
  var vp = [
    ["RequestStatus", reason],
    ["RequestStage", "10"],
    ["ClosedDate", new Date()],
    ["IsActive", false],
  ];
  vm.listRefWO().updateListItem(vm.requestHeader().ID, vp, function () {
    alert("Record succesfully closed");

    Workorder.Notifications.workorderClosedEmail(reason);

    // Create the action
    createAction(
      reason,
      `${sal.globalConfig.currentUser.get_title()} has ${reason} the request`
    );
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
    refreshWorkOrderItem(vm.requestID());
  });
}

/************************************************************
 * Initialize app
 ************************************************************/
/* initApp -> fetchXListData -> initServiceTypes -> initTemplates -> initComplete */
function initApp() {
  SP.UI.ModalDialog.showWaitScreenWithNoClose("Initializing", "Please Wait...");
  $(".non-editable-field").prop("disabled", true);

  console.log("initialized listeners");

  // Initialize our SharePoint Access Layer
  var ini = initSal();

  // Initialize our Notifications
  InitNotifications();

  // Initialize ViewModel
  vm = new koviewmodel();

  // Setup models for each of the config lists we may connect to
  initStaticListRefs();

  // Fetch our static lists and configuration lists
  fetchStaticListData();
  fetchConfigListData();

  // Get our current user groups and store them
  getCurrentUserGroups((groups) => vm.userGroupMembership(groups));
}

function initServiceTypes() {
  //Initialize the rest of our list references
  initTemplates();
}

function initTemplates() {
  let templates = vm
    .configServiceTypes()
    .map((stype) => stype.TemplateName)
    .filter((templ) => templ);

  let cnt = templates.length;
  let loaded = 0;

  templates.forEach((template) => {
    $.get(
      `${sal.globalConfig.siteUrl}/SiteAssets/workorder/wo/ServiceTypeTemplates/${template}`,
      function (html) {
        $("#service-type-templates").append(html);
        loaded++;
        if (loaded == cnt) {
          // We've loaded all templates
          initComplete();
        }
      }
    );
  });
}

function initComplete() {
  initServiceTypeListRefDefs();

  //Parse Page Params
  var path = window.location.pathname;
  vm.page(path.split("/").pop());

  //URL Params
  var href = window.location.href.toLowerCase();
  var hash = window.location.hash.replace("#", "");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let tab = urlParams.get("tab");
  let id = urlParams.get("reqid");
  let stypeId = urlParams.get("stype");
  let stype = null;

  // if (id && tab == 'order-detail') {
  //   viewWorkOrderItem(id);
  // }
  //If we're on a separate tab, switch back to the tab from the url.

  // if no tab is present, switch based on page

  switch (vm.page()) {
    case "app.aspx":
      vm.userRole("user");
      break;

    case "admin.aspx":
      //fetchMyAOAssignments();
      vm.userRole("admin");
      break;

    default:
  }

  vm.applicationIsLoaded(true);
  ko.applyBindings(vm);

  if (vm.page().toLocaleLowerCase() != "approval.aspx") {
    $("#tabs").show();
    initUIComponents();

    switch (tab) {
      case null:
        vm.tab("my-orders");
        break;
      case "order-detail":
        if (id) {
          viewWorkOrderItem(id);
        }
        break;
      default:
        vm.tab(tab);
    }
  }
  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function initUIComponents() {
  makeDataTable("#wo-open-orders");
  makeDataTable("#wo-assigned-orders");
  makeDataTable("#wo-closed-orders");
  makeDataTable("#wo-cancelled-orders");

  $(".ui.checkbox").checkbox();
  $(".ui.accordion").accordion();
  // $(".view-action-office").popup({
  //   popup: ".ui.list-action-office.popup",
  //   on: "click",
  // });
  $(".menu .item").tab();
  $(".top.menu .item").tab({
    onVisible: function () {
      vm.tab(this.id);
    },
  });
  $(".ui.secondary.menu").find(".item").tab("change tab", "my-open-orders");
  //$(".ui.top.menu").find(".item").tab("change tab", "my-orders");
}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
