tabsEnum = {
  "#my-orders": 0,
  "#assigned-orders": 1,
  "#order-lookup": 2,
  "#order-new": 3,
  "#order-detail": 4,
};

var time = {};
var dialog = {};

function initStaticListRefs() {
  vm.listRefWO(new sal.NewSPList(workOrderListDef));
  //vm.listRefpu10k(new SPList(pu10kListDef));

  vm.listRefApproval(new sal.NewSPList(approvalListDef));
  vm.listRefAction(new sal.NewSPList(actionListDef));
  vm.listRefDateRanges(new sal.NewSPList(dateRangesListDef));
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

  vm.configServiceTypes().forEach(function (serviceType) {
    if (serviceType.TemplateName) {
      var listDef = vm.listDefs().find(function (listDef) {
        return listDef.uid == serviceType.UID;
      });

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

function createNewRequestID() {
  var ts = new Date();
  return ts.format("yyMMdd") + "-" + (ts.getTime() % 100000);
}

function newWorkOrder() {
  dismissDescription();
  // Chained, requires vm.selectedServiceType to already be selected.
  vm.tab("order-detail");

  //set the select for which view we're on.
  vm.currentView("new");

  // Set our VM fields
  vm.requestID(createNewRequestID());
  updateUrlParam("reqid", vm.requestID());

  // Check if we have a current requestor
  Workorder.Common.Utilities.setPeoplePicker(
    "peoplerequestor",
    sal.globalConfig.currentUser.get_loginName()
  );

  //Get the current users phone
  if (sal.globalConfig.currentUserProfile) {
    vm.requestorTelephone(
      sal.globalConfig.currentUserProfile.UserProfileProperties.results.find(
        function (prop) {
          return prop.Key == "WorkPhone";
        }
      ).Value
    );
  } else {
    vm.requestorTelephone("");
  }
  vm.requestorEmail(sal.globalConfig.currentUser.get_email());
  vm.requestStageNum(0);
  vm.requestIsActive(1);
  vm.requestStatus("Draft");

  // vm.requestOrgIds(
  //   vm.selectedServiceType().RequestOrgs.map(function (ro) {
  //     return ro.get_lookupId();
  //   })
  // );
  //Set the workorder request orgs.
  vm.request.pipeline.allRequestOrgs().forEach(function (org) {
    if (
      !vm.requestOrgs().find(function (ro) {
        return ro.ID == org.ID;
      })
    ) {
      vm.requestOrgs.push(org);
    }
  });

  //Clear our requested fields.
  vm.requestHeader(new Object());
  vm.requestClosedDate(null);
  vm.requestSubmittedDate(null);
  vm.requestDescriptionHTML(null);
  vm.requestActions([]);
  vm.requestApprovals([]);
  vm.requestAttachments([]);
  vm.request.dateRanges.all([]);
  //vm.requestAssignees([]);
  vm.requestAssignments([]);
  vm.requestComments([]);
}

function refreshWorkOrderItem(woID, callback) {
  /* 
    Refresh the work order item in the vm.allOrders array.
  */
  callback = callback === undefined ? function () {} : callback;
  // dialog.refresh = SP.UI.ModalDialog.showWaitScreenWithNoClose(
  //   "Refreshing Work Order..."
  // );
  vm.busy.addTask(appBusyStates.refresh);
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq><Eq>" +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    woID +
    "</Value>" +
    "</Eq></And></Where></Query><RowLimit>1</RowLimit></View>";

  vm.listRefWO().getListItems(camlq, function (items) {
    console.log("loading open orders", items);
    if (items[0]) {
      var req = items[0];
      if (
        vm.allOrders().find(function (order) {
          return order.Title == woID;
        })
      ) {
        vm.allOrders(
          vm.allOrders().map(function (order) {
            return order.Title == woID ? req : order;
          })
        );
      } else {
        vm.allOrders.push(req);
      }
      fetchRequestAssignments(woID, function () {
        viewWorkOrderItem(woID, callback);
        vm.busy.finishTask(appBusyStates.refresh);
        // dialog.close(dialog.refresh);
      });
    } else {
      vm.busy.finishTask(appBusyStates.refresh);
      // dialog.close(dialog.refresh);
    }
  });
}

function viewWorkOrderItem(woID, callback) {
  callback = callback === undefined ? function () {} : callback;

  vm.busy.addTask(appBusyStates.view);

  var request = vm.allOrders().find(function (order) {
    return order.Title == woID;
  });

  if (!request) {
    // Clear urlparam
    updateUrlParam("reqid", "");
    vm.tab("my-orders");
    vm.busy.finishTask(appBusyStates.view);
    // dialog.close(dialog.view);
  } else {
    vm.requestID(woID);
    vm.tab("order-detail");
    vm.currentView("view");

    vm.requestHeader(request);
    console.log("workorder fetched - setting value pairs");
    //vm.selectedServiceType("");
    clearValuePairs(workOrderListDef.viewFields);
    setValuePairs(workOrderListDef.viewFields, vm.requestHeader());

    vm.requestAssignments(vm.allRequestAssignmentsMap()[woID]);

    var hasItemDetail = vm.selectedServiceType().listDef ? true : false;
    /* Fetch all associated Items */
    var queryCount = 4; // there are 4 lists we need to query
    queryCount = hasItemDetail ? (queryCount += 1) : queryCount;

    var queryInc = new Incremental(0, queryCount, function () {
      onViewWorkOrderItemComplete(callback);
    });
    //fetchRequestAssignments();
    fetchActions(function () {
      console.log("actions fetched");
      try {
        $(".ui.accordion").accordion();
      } catch (e) {
        console.log("error showing accordion");
      }
      queryInc.inc();
    });
    fetchApprovals(function () {
      console.log("approvals fetched");
      queryInc.inc();
    });
    fetchAttachments();
    fetchComments(function () {
      console.log("comments fetched");
      queryInc.inc();
    });
    fetchDateRanges(function () {
      queryInc.inc();
    });

    /* Fetch the associated service type items */
    if (hasItemDetail) {
      viewServiceTypeItem(function () {
        queryInc.inc();
      });
    }
    //initUIComponents();
  }
}

function viewServiceTypeItem(callback) {
  callback = callback === undefined ? function () {} : callback;

  // Fetches the list item info from the currently selected service type and record.
  var serviceTypeCaml =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
  vm.selectedServiceType().listRef.getListItems(
    serviceTypeCaml,
    function (items) {
      if (items[0]) {
        var res = items[0];
        vm.serviceTypeHeader(res);
        console.log("service type fetched -- setting valuepairs", items);
        setValuePairs(
          vm.selectedServiceType().listDef.viewFields,
          vm.serviceTypeHeader()
        );
      } else {
        timedNotification("Warning: couldn't find Service Type Info");
      }
      callback();
      //onViewWorkOrderItemComplete(callback);

      // This utilizes the date ranges list, we'll need to query that as well.
      // vm.listRefDateRanges().getListItems(
      //   serviceTypeCaml,
      //   function (dateRanges) {
      //     vm.request.dateRanges.all(dateRanges);
      //
      //   }
      // );
    }
  );
}

function onViewWorkOrderItemComplete(callback) {
  callback = callback === undefined ? function () {} : callback;
  vm.requestLoaded(new Date());
  vm.tab("order-detail");
  vm.currentView("view");
  vm.busy.finishTask(appBusyStates.view);
  callback();
  // dialog.close(dialog.view);
}

function showAdvancePrompt() {
  $("#prompt-advance").modal("show");
}

function dismissAdvancePrompt() {
  $("#prompt-advance").modal("hide");
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

  vm.busy.addTask(appBusyStates.save);

  // Need to get the value of the trix editor.
  vm.requestDescriptionHTML($("#trix-request-description").html());

  //Get the requestors name
  //vm.requestorName(vm.requestor.user()["title"]);

  vm.requestIsSaveable(true);
  var requestValuePairs = getValuePairs(workOrderListDef.viewFields);
  if (vm.requestSvcTypeListBool()) {
    var typeValuePairs = getValuePairs(vm.requestSvcTypeListViewFields());
  }
  validateRequest();

  // If all of our required fields are present.
  if (vm.requestIsSaveable()) {
    // First, save or update the parent work order item.
    switch (vm.currentView()) {
      case "edit":
        // We are saving an edit form, get the id and update.
        vm.listRefWO().updateListItem(
          vm.requestHeader().ID,
          requestValuePairs,
          function () {
            console.log("Workorder header saved");
            if (!vm.selectedServiceType().listDef) {
              onSaveEditWorkOrderCallback();
            }
          }
        );
        if (vm.requestSvcTypeListBool()) {
          //var typeValuePairs = getValuePairs(vm.requestSvcTypeListViewFields());

          vm.selectedServiceType().listRef.updateListItem(
            vm.serviceTypeHeader().ID,
            typeValuePairs,
            onSaveEditWorkOrderCallback
          );
        }
        createAction("Edited", "The request has been edited.");
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
    vm.busy.finishTask(appBusyStates.save);
    vm.busy.addTask(appBusyStates.cancelAction);
    vm.busy.finishTask(appBusyStates.cancelAction);
    // dialog.close(dialog.save);
  }
}

function calcNewWorkorderDates() {
  // Check the submitted date, if it's between 3 pm, (19 UTC) and midnight (4 UTC)
  // it needs to be set as submitted the next business day
  var now = new Date();
  if (now.getUTCHours() >= 19 || now.getUTCHours() < 4) {
    console.log("its after 3, this is submitted tomorrow");
    var tomorrow = businessDaysFromDate(now, 1);
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
      vm.selectedServiceType().DaysToCloseBusiness
    )
  );

  //Set the request orgs
  //vm.requestOrgIds(vm.selectedServiceType().RequestOrgs);

  //vm.requestStageNum(0);
  vm.requestStatus("Open");
}

function createNewWorkorderItems() {
  window.clearTimeout(window.breakingPermissionsTimeoutID);
  // triggered by vm.foldersCreated.subscribe in viewmodel.js
  // This should only run once the appropriate permissions are set
  // at the folder level to prevent info spillage.

  calcNewWorkorderDates();
  vm.requestStatus("Open");

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
            function () {
              onSaveNewWorkOrderMaster(id);
            },
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
  Workorder.Notifications.newWorkorderEmailUser();

  // Offload our reminder emails to a separate function
  // Workorder.Notifications.workorderReminderEmails(id);

  // Create our Action
  createAction(
    "Created",
    "The request was submitted with an effective submission date of " +
      vm.requestSubmittedDate().toDateString(),
    true
  );

  // Refresh the request
  refreshWorkOrderItem(vm.requestID(), function () {
    pipelineForward();
  });
  vm.busy.finishTask(appBusyStates.save);
  // dialog.close(dialog.save);
}

function onSaveEditWorkOrderCallback(val) {
  console.log("callback val: ", val);
  refreshWorkOrderItem(vm.requestID());
  vm.busy.finishTask(appBusyStates.save);
  // dialog.close(dialog.save);
}

function breakingPermissionsTimeoutFunc() {
  alert(
    "Looks like something went wrong while setting the permissions." +
      "Please try to save the workorder again. \n" +
      "If you continue to see this message, please " +
      "report it to cgfssharepoint@state.gov."
  );
  Workorder.Notifications.breakingPermissionsTimeout();
  vm.busy.finishTask(appBusyStates.save);
  // dialog.close(dialog.save);
}

function createWorkorderFolders() {
  window.breakingPermissionsTimeoutID = window.setTimeout(
    breakingPermissionsTimeoutFunc,
    5000
  );
  //vm.foldersCreated(0);

  // Set all permissions up front
  var folderPermissions = vm.requestFolderPerms();

  //For each of our multi-item lists, create a new folder
  var listRefs = [
    vm.listRefWO(),
    vm.listRefAction(),
    vm.listRefAssignment(),
    vm.listRefWOEmails(),
  ];

  if (vm.requestSvcTypeListBool()) {
    // Also create a folder for the service type
    listRefs.push(vm.selectedServiceType().listRef);
  }

  var folderIncrementer = new Incremental(
    0,
    listRefs.length,
    createNewWorkorderItems
  );

  listRefs.forEach(function (listRef) {
    listRef.upsertListFolderPath(vm.requestFolderPath(), function (folderId) {
      // Update the permissions for the new folder
      if (folderId) {
        listRef.setItemPermissions(
          folderId,
          folderPermissions,
          function () {
            //vm.foldersCreatedInc();
            folderIncrementer.inc();
          },
          true
        );
      }
    });
  });

  // vm.libRefWODocs().createFolderRec(vm.requestFolderPath(),function (folder) {
  //   vm.libRefWODocs().setLibFolderPermissions(
  //     vm.requestFolderPath(),
  //     folderPermissions,
  //     function()  {
  //       vm.foldersCreatedInc();
  //     },
  //     true
  //   );
  // });
}

function ensureAttachments() {
  if (
    vm.selectedServiceType().AttachmentsRequiredCnt &&
    vm.requestAttachments().length <
      vm.selectedServiceType().AttachmentsRequiredCnt
  ) {
    vm.requestIsSaveable(false);
    alert(
      "This request has not been saved. It is missing the required attachments."
    );
  }
}

function validateRequest() {
  if (vm.selectedServiceType().SupervisorRequired) {
    // Check if we have a supervisor
    var supervisorAttached = vm.requestorSupervisor.user() ? true : false;
    vm.requestIsSaveable(vm.requestIsSaveable() && supervisorAttached);
    if (!supervisorAttached) {
      alert(
        "This request has not been saved. Requestor Supervisor is required."
      );
    }
  }

  if (vm.selectedServiceType().validate) {
    vm.selectedServiceType().validate();
  }
  ensureAttachments();
}

/************************************************************
 * ValuePair Binding Getters and Setters
 ************************************************************/
function getValuePairsHuman(listDef) {
  var valuePairs = [];
  var missingFields = [];

  $.each(listDef, function (field, obj) {
    console.log(field, obj);

    // For each mapped field in our List Def viewfields, push the bound
    // KO object to it.
    if (
      ["ID", "ClosedDate", "Created"].indexOf(field) < 0 &&
      obj.koMap != "empty"
    ) {
      var koMap = obj.koMap;
      console.log(koMap);
      var observable = vm[koMap];
      //let fieldValue = !$.isEmptyObject(vm[koMap]()) ? vm[koMap]() : "";

      // Based on the field type, do any casting or conversions here
      switch (obj.type) {
        case "DateTime":
          if (observable.date) {
            fieldValue = observable.date().format("yyyy-MM-dd");
          } else {
            fieldValue = observable().format("yyyy-MM-dd");
          }
          break;
        case "Person":
          fieldValue = observable.userName();
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
  return valuePairs;
}

function getValuePairs(listDef) {
  //Get value pairs and validate
  console.log(listDef);
  var valuePairs = [];
  var missingFields = [];
  $.each(listDef, function (field, obj) {
    console.log(field, obj);

    // For each mapped field in our List Def viewfields, push the bound
    // KO object to it.
    if (
      ["ID", "ClosedDate", "Created"].indexOf(field) < 0 &&
      obj.koMap != "empty"
    ) {
      var koMap = obj.koMap;
      console.log(koMap);
      var observable = vm[koMap];
      var fieldValue = null;
      //let fieldValue = !$.isEmptyObject(vm[koMap]()) ? vm[koMap]() : "";

      // Based on the field type, do any casting or conversions here
      switch (obj.type) {
        case "DateTime":
          if (observable.date && !isNaN(observable.date())) {
            fieldValue = observable.date().toISOString();
          } else if (typeof observable === "function" && observable()) {
            fieldValue = observable().toISOString();
          }
          break;
        case "Person":
          fieldValue = observable.userId();
          break;
        case "Group":
          if (observable()) {
            fieldValue = observable().ID;
          }
          break;
        default:
          fieldValue = observable();
      }
      // Check if this field is required
      // TODO: highlight the offending field
      if (obj.required && !fieldValue) {
        missingFields.push(field);
        vm.requestIsSaveable(false);
      } else {
        valuePairs.push([field, fieldValue]);
      }
    }
  });

  if (missingFields.length) {
    var warn =
      "The request has not been saved. The following fields are missing: \n";
    missingFields.forEach(function (field) {
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
    console.log(
      "Setting " + obj.koMap + " to " + jObject[field] + " from " + field
    );
    var observable = vm[obj.koMap];
    switch (obj.type) {
      case "Person":
        observable.userId(jObject[field]);
        break;
      case "DateTime":
        if (observable.date) {
          observable.date(jObject[field]);
        } else {
          observable(jObject[field]);
        }
        break;
      default:
        observable(jObject[field]);
    }
  });
}

function clearValuePairs(listDef) {
  $.each(listDef, function (field, obj) {
    if (["requestID", "ServiceType"].indexOf(obj.koMap) < 0) {
      var observable = vm[obj.koMap];
      switch (obj.type) {
        case "Person":
          observable.user(new Object());
          break;
        case "DateTime":
          if (observable.date) {
            observable.date(new Date());
            break;
          }
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
  fetchAllOrders(function (orders) {
    vm.incLoadedListItems();
    fetchAllAssignments(function (assignments) {
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
  vm.listRefConfigActionOffices().getListItems(
    "<Query></Query>",
    function (items) {
      vm.configActionOffices(items);
      vm.incLoadedListItems();
    }
  );

  vm.listRefConfigRequestOrgs().getListItems(
    "<Query></Query>",
    function (items) {
      vm.configRequestOrgs(items);
      vm.incLoadedListItems();
    }
  );

  vm.listRefConfigHolidays().getListItems("<Query></Query>", function (items) {
    vm.configHolidays(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigPipelines().getListItems("<Query></Query>", function (items) {
    vm.configPipelines(items);
    vm.incLoadedListItems();
  });

  vm.listRefConfigRequestingOffices().getListItems(
    "<Query></Query>",
    function (items) {
      vm.configRequestingOffices(items);
      vm.incLoadedListItems();
    }
  );
  /* We won't filter our inactive service types just in case there are some open */
  vm.listRefConfigServiceType().getListItems(
    "<Query></Query>",
    function (items) {
      vm.configServiceTypes(items);
      vm.incLoadedListItems();
    }
  );
}

/************************************************************
 * Work Orders
 ************************************************************/
function fetchAllOrders(callback) {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq></Where></Query></View>";

  vm.listRefWO().getListItems(camlq, function (items) {
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
  vm.libRefWODocs().createFolderRec(vm.requestFolderPath(), function () {
    vm.libRefWODocs().setLibFolderPermissions(
      vm.requestFolderPath(),
      vm.requestFolderPerms(),
      function () {
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
  var camlq =
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
    function () {
      vm.assignRequestOffice(null);
    }
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

function createAssignment(role, notify) {
  role =
    role === undefined ? assignmentListDef.viewFields.Role.opts.Resolver : role;
  notify = notify === undefined ? false : notify;
  // Create a new assignment based off our set observables
  if (vm.assignActionOffice() || vm.assignAssignee()) {
    var vp = [
      ["Title", vm.requestID()],
      ["Role", role],
    ];
    if (vm.assignActionOffice()) {
      vp.push(["ActionOffice", vm.assignActionOffice().ID]);
      if (vm.assignActionOffice().RequestOrg) {
        reqOrgId = vm.assignActionOffice().RequestOrg.get_lookupId();
        reqOrg = vm.configRequestOrgs().find(function (org) {
          return org.ID == reqOrgId;
        });
      }
    }
    if (vm.assignAssignee()) {
      vp.push(["Assignee", vm.assignAssignee().userId()]);
    }

    // Check if this is a type of Assignment that needs to be completed
    var roleOpts = assignmentListDef.viewFields.Role.opts;
    if (role == roleOpts.Approver.Name || role == roleOpts.Resolver.Name) {
      vp.push(["IsActive", true]);
    } else {
      vp.push(["IsActive", true]);
    }

    vm.listRefAssignment().createListItem(
      vp,
      function (id) {
        console.log("Assigned: ", id);
        try {
          $("#wo-routing").accordion("open", 0);
        } catch (e) {
          console.warn("Do we have any accordions?", e);
        }
        fetchRequestAssignments(vm.requestID(), function (assignments) {
          //let rvp = [["RequestAssignments", vm.requestAssignmentIds()]];
          //vm.listRefWO().updateListItem(vm.requestHeader().ID, rvp, function()  {});
        });
        if (notify) {
          // Build our email
          //If we have an assignee, send direct to them
          Workorder.Notifications.newAssignmentNotification(role, id);
        }
        //Update the request with a new assignment:
        // Create Action
        var actionText = "";
        if (vm.assignAssignee()) {
          actionText =
            "The following Individual has been assigned to this request: " +
            vm.assignAssignee().lookupUser().get_lookupValue() +
            " - " +
            role;
        } else if (vm.assignActionOffice()) {
          actionText =
            "The following Action Office has been assigned to this request: " +
            vm.assignActionOffice().Title +
            " - " +
            role;
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
  var start = new Date();
  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    assignments.map(function (assignment) {
      if (assignment.ActionOffice) {
        assignment.actionOffice = vm.configActionOffices().find(function (ao) {
          return ao.ID == assignment.ActionOffice.get_lookupId();
        });
      }
    });
    vm.allAssignments(assignments);

    var end = new Date();
    console.log("assignments mapped in " + (end - start) + " ms");
    if (callback) {
      callback(assignments);
    }
  });
}

function fetchRequestAssignments(title, callback) {
  var title = title === undefined ? null : title;
  var callback = callback === undefined ? null : callback;

  var queryTitle = title ? title : vm.requestID();

  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    queryTitle +
    "</Value></Eq></And></Where></Query></View>";

  vm.listRefAssignment().getListItems(camlq, function (assignments) {
    // Let's connect our Action offices here.
    assignments.map(function (assignment) {
      if (assignment.ActionOffice) {
        assignment.actionOffice = vm.configActionOffices().find(function (ao) {
          return ao.ID == assignment.ActionOffice.get_lookupId();
        });
      }
    });

    assignments.forEach(function (assignment) {
      if (
        vm.allAssignments().find(function (allAssignment) {
          return allAssignment.ID == assignment.ID;
        })
      ) {
        // If this is already in our assignment list, update it
        vm.allAssignments(
          vm.allAssignments().map(function (allAssignment) {
            return allAssignment.ID == assignment.ID
              ? assignment
              : allAssignment;
          })
        );
      } else {
        // Push the new assignment to the list
        vm.allAssignments.push(assignment);
      }
    });

    vm.requestAssignments(assignments);

    vm.allAssignments.valueHasMutated();
    if (callback) {
      callback(assignments);
    }
  });
}

function updateTableRequest(id) {
  var title = this.Title;
  vm.tableRequestTitle(title);
  fetchRequestAssignments(id, function (assigments) {
    vm.tableRequestAssignments(assigments);
  });
}

function fetchMyAOAssignments() {
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq><In>" +
    '<FieldRef Name="ActionOffice" LookupId="TRUE"/><Values>' +
    vm
      .userActionOfficeMembership()
      .map(function (ao) {
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
      return idarr.indexOf(this.Title) >= 0;
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
  vm.requestAssignments().forEach(function (assignment) {
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
    vm.busy.addTask(appBusyStates.approve);
    //     dialog.approve = SP.UI.ModalDialog.showWaitScreenWithNoClose(
    //   "Approving Work Order..."
    // );
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
      vm.busy.finishTask(appBusyStates.approve);
      // dialog.close(dialog.approve);
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

function createAction(type, desc, sendEmail) {
  var sendEmail = sendEmail === undefined ? false : sendEmail;

  var vp = [
    ["Title", vm.requestID()],
    ["ActionType", type],
    ["Description", desc],
    ["SendEmail", sendEmail],
  ];
  vm.listRefAction().createListItem(
    vp,
    function () {
      newActionCallback(SP.UI.DialogResult.OK, null);
    },
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
    vm.busy.addTask(appBusyStates.newAction);
    //     dialog.newAction = SP.UI.ModalDialog.showWaitScreenWithNoClose(
    //   "Refreshing Actions List..."
    // );
    //$(".admin-action-zone").hide();
    console.log(value);
    fetchActions(function () {
      vm.busy.finishTask(appBusyStates.newAction);
      // dialog.close(dialog.newAction);
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
      vm.busy.finishTask(appBusyStates.newComment);
      // dialog.close(dialog.newComment);
      // Let's branch based on whether the last approval was approve or reject.
      console.log("comments fetched");
    });
  }
}

function submitComment() {
  if (vm.commentNew()) {
    vm.busy.addTask(appBusyStates.newComment);
    //     dialog.newComment = SP.UI.ModalDialog.showWaitScreenWithNoClose(
    //   "Submitting Comment..."
    // );
    vm.listRefComment().upsertListFolderPath(
      vm.requestFolderPath(),
      function (folderId) {
        // Update the permissions for the new folder
        if (folderId) {
          vm.listRefComment().setItemPermissions(
            folderId,
            vm.requestFolderPerms(),
            function () {
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
  fetchComments(function () {
    vm.busy.finishTask(appBusyStates.newComment);

    // SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
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
 * DateRange
 ************************************************************/
function createDateRange(dateRange) {
  var vp = [
    ["Title", vm.requestID()],
    ["TableName", dateRange.name()],
    ["StartDateTime", dateRange.start.date()],
    ["EndDateTime", dateRange.end.date()],
    ["Label", dateRange.label()],
  ];
  vm.listRefDateRanges().createListItem(vp, function () {
    console.log("Inserted");
    dateRange.label("");

    fetchDateRanges(function () {});
  });
}

function fetchDateRanges(callback) {
  var callback = callback === undefined ? function () {} : callback;
  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
    vm.requestID() +
    "</Value></Eq></And></Where></Query></View>";
  vm.listRefDateRanges().getListItems(camlq, function (dateRanges) {
    vm.request.dateRanges.all(dateRanges);
    callback();
  });
}

function deleteDateRange(dateRange) {
  vm.listRefDateRanges().deleteListItem(dateRange.ID, function () {
    fetchDateRanges();
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
  dismissAdvancePrompt();

  vm.busy.addTask(appBusyStates.pipeline);

  // dialog.pipeline = SP.UI.ModalDialog.showWaitScreenWithNoClose(
  //   "Progressing to Next Stage",
  //   "Please wait..."
  // );

  var valuePairs = new Array();

  /* Increment the current request stage num */
  var t = parseInt(vm.requestStageNum()) + 1;
  if (t > vm.selectedPipeline().length) {
    // vm.requestStatus("Closed");
    // valuePairs.push(["RequestStatus", "Closed"]);
    vm.busy.finishTask(appBusyStates.pipeline);
    // dialog.close(dialog.pipeline);
    closeWorkOrder();
  } else {
    vm.requestStageNum(t);
    valuePairs.push(["RequestStage", vm.requestStageNum()]);

    vm.listRefWO().updateListItem(
      vm.requestHeader().ID,
      valuePairs,
      function () {
        console.log("pipeline moved to next stage.");
        if (vm.requestIsActive() && vm.requestStage()) {
          pipelineAssignments();
          /* let's create a new Action every time the item progresses */
          createAction(
            vm.requestStage().Title,
            sal.globalConfig.currentUser.get_title() +
              " has moved the request to stage " +
              vm.requestStage().Step +
              ": " +
              vm.requestStage().Title
          );
        }
        vm.busy.finishTask(appBusyStates.pipeline);
        // dialog.close(dialog.pipeline);
      }
    );
  }
}

function pipelineAssignments() {
  if (vm.requestStage().WildCardAssignee) {
    var personName = vm.requestStage().WildCardAssignee;
    // This should be a person field
    try {
      var personObservable = vm[personName];
      vm.assignAssignee(personObservable);
    } catch (err) {
      console.error(
        "Something went wrong fetching " + personName + " from viewmodel: ",
        err
      );
    }
  }

  // Add the current stages Request Org to requests RequestOrg column
  // This is an off by one issue since stage 0 is editing but isn't
  // in our pipeline.

  if (vm.requestStageOrg()) {
    vm.requestOrgs.push(vm.requestStageOrg());
    valuePairs = [["RequestOrgs", vm.requestOrgIds()]];
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
      pipelineNotifications();
      pipelineForward();
      createAction("Notification");
      break;
    case "Pending Resolution":
    case "Pending Assignment":
    default:
      pipelineNotifications();
      break;
  }
}

function pipelineNotifications() {
  Workorder.Notifications.pipelineStageNotification();

  // Create the action
}

function cancelWorkOrder() {
  closeWorkOrder("Cancelled");
}

function closeWorkOrder(reason) {
  var statusClosed = configPipelinesListDef.viewFields.ActionType.opts.Closed;
  var reason = reason === undefined ? statusClosed : reason;

  vm.busy.addTask(appBusyStates.closing);
  // dialog.closing = SP.UI.ModalDialog.showWaitScreenWithNoClose(
  //   "Closing Request...",
  //   reason
  // );

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
      sal.globalConfig.currentUser.get_title() +
        " has " +
        reason +
        " the request"
    );
    vm.busy.finishTask(appBusyStates.closing);
    // dialog.close(dialog.closing);
    lockRequest(vm.requestID());
  });
}

function lockRequest(woID) {
  vm.busy.addTask(appBusyStates.lock);
  //       dialog.lock = SP.UI.ModalDialog.showWaitScreenWithNoClose(
  //   "Locking Request..."
  // );
  // Put the request into read only mode
  var listRefs = [
    vm.listRefWO(),
    vm.listRefAction(),
    vm.listRefAssignment(),
    vm.listRefWOEmails(),
    vm.listRefComment(),
  ];

  if (vm.requestSvcTypeListBool()) {
    // Also create a folder for the service type
    listRefs.push(vm.selectedServiceType().listRef);
  }

  var incrementer = new Incremental(0, listRefs.length, function () {
    vm.busy.finishTask(appBusyStates.lock);
    // dialog.close(dialog.lock);
    refreshWorkOrderItem(vm.requestID());
  });

  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">1</Value>' +
    "</Eq><Eq>" +
    '<FieldRef Name="Title"/><Value Type="Text">' +
    woID +
    "</Value>" +
    "</Eq></And></Where></Query><RowLimit>1</RowLimit></View>";

  listRefs.forEach(function (list) {
    list.getListItems(camlq, function (items) {
      if (items[0]) {
        var item = items[0];
        list.getItemPermissions(item.ID, function (logins) {
          console.log("success", logins);
          var vp = logins.map(function (login) {
            return [login, "Restricted Read"];
          });
          list.setItemPermissions(
            item.ID,
            vp,
            function () {
              console.log(
                "Updated item perms " +
                  list.config.def.name +
                  " " +
                  incrementer.val()
              );
              incrementer.inc();
            },
            true
          );
        });
      } else {
        incrementer.inc();
      }
    });
  });
}

/************************************************************
 * Initialize app
 ************************************************************/
/* initApp -> fetchXListData -> initServiceTypes -> initTemplates -> initComplete */
function initApp() {
  // Initialize ViewModel
  vm = new koviewmodel();
  var initTime = new Date();
  //vm.busy.addTask(appBusyStates.init);
  dialog.init = SP.UI.ModalDialog.showWaitScreenWithNoClose(
    "Initializing",
    "Please Wait..."
  );
  $(".non-editable-field").prop("disabled", true);

  console.log("initialized listeners");

  // Initialize our SharePoint Access Layer
  var ini = initSal();

  //init our common utilities
  InitCommon();

  vm.timers.init(initTime);

  //InitCommon();

  /* Depending on our page, we may need additional info */
  /* Submitter/Action Office/Approval */
  if (typeof InitNotifications != "undefined") {
    // Initialize our Notifications
    InitNotifications();
  }

  // Setup models for each of the config lists we may connect to
  initStaticListRefs();

  // Fetch our static lists and configuration lists
  fetchStaticListData();
  fetchConfigListData();

  // Get our current user groups and store them
  getCurrentUserGroups(function (groups) {
    vm.userGroupMembership(groups);
  });
}

function initServiceTypes() {
  //Initialize the rest of our list references
  initTemplates();
}

function initTemplates() {
  var templates = vm
    .configServiceTypes()
    .map(function (stype) {
      return stype.TemplateName;
    })
    .filter(function (templ) {
      return templ;
    });

  var cnt = templates.length + 1;
  var loaded = 0;

  var templateIncrementer = new Incremental(0, cnt, initComplete);

  templates.forEach(function (template) {
    $.get(
      sal.globalConfig.siteUrl +
        "/SiteAssets/workorder/wo/ServiceTypeTemplates/" +
        template,
      function (html) {
        $("#service-type-templates").append(html);
        templateIncrementer.inc();
      }
    );
  });

  $.get(
    sal.globalConfig.siteUrl +
      "/SiteAssets/workorder/common/common_elements.html",
    function (html) {
      $("#service-type-templates").append(html);
      templateIncrementer.inc();
    }
  );
}

function initComplete() {
  initServiceTypeListRefDefs();

  //Parse Page Params
  var path = window.location.pathname;
  vm.page(path.split("/").pop());

  //URL Params
  var href = window.location.href.toLowerCase();
  var hash = window.location.hash.replace("#", "");

  var queryString = window.location.search;
  //const urlParams = new URLSearchParams(queryString);

  var tab = getUrlParam("tab");
  var id = getUrlParam("reqid");
  var service = getUrlParam("lookup");
  var stype = null;

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

  if (
    ["approval.aspx", "reports.aspx"].indexOf(vm.page().toLocaleLowerCase()) < 0
  ) {
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
  /* Reports 
  if (typeof InitReport != "undefined") {
    InitReport();
  }
  */
  // vm.busy.finishTask(appBusyStates.init);
  dialog.init.close();
  vm.timers.initComplete(new Date());
  //SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function initUIComponents() {
  makeDataTable("#wo-open-orders");
  makeDataTable("#wo-assigned-orders");
  makeDataTable("#wo-closed-orders");
  makeDataTable("#wo-cancelled-orders");

  //$("#example1").calendar();
  if ($(".ui.checkbox").length) {
    $(".ui.checkbox").checkbox();
  }
  if ($(".ui.accordion").length) {
    $(".ui.accordion").accordion();
  }
  // $(".view-action-office").popup({
  //   popup: ".ui.list-action-office.popup",
  //   on: "click",
  // });
  if ($(".menu .item").length) {
    $(".menu .item").tab();
    $(".top.menu .item").tab({
      onVisible: function () {
        vm.tab(this.id);
      },
    });
    $(".ui.secondary.menu").find(".item").tab("change tab", "my-open-orders");
  }
  //$(".ui.top.menu").find(".item").tab("change tab", "my-orders");
}

$(document).ready(function () {
  SP.SOD.executeFunc(
    "sp.js",
    "SP.ClientContext",
    ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js")
  );
});
