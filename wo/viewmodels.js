// console.log('viewmodel loaded');
/************************************************************
 * Generic Viewmodels
 ************************************************************/

/*
sampleServiceType = {
  Active: true,
  AttachmentDescription:
    '<div class="ExternalClass3AC99BB72627496B872A696D6ED66F96"><p>A​ttachments&#58;<br></p></div>',
  AttachmentRequired: true,
  DaysToCloseBusiness: 30,
  DaysToCloseDisp: 14,
  Description:
    '<div class="ExternalClassDB16BCB87118415CBB8161EE9FB6EBE9"><p>C​omplete this request for a new network drop.<br></p></div>',
  ElementID: "wo-network-drop",
  ID: 12,
  Icon: "fa-ethernet",
  KPIThresholdGreen: null,
  KPIThresholdYellow: null,
  ListDef: {},
  Title: "Network Drops",
  UID: "network_drop",
  st_list: "st_network_drop",
};
*/

var managingDirectors = {
  Select: "",
  "CGFS/EX": "Backlund, Peter",
  "CGFS/F": "Lugo, Joan",
  "CGFS/GC": "Self, Amy",
  "CGFS/S/CST": "Sizemore, Richard",
  "CGFS/GSO": "Bowers, Susan",
};

//var offices = ["CGFS/EX", "CGFS/F", "CGFS/GC", "CGFS/S/CST", "CGFS/GSO"];

/************************************************************
 * Set Static SharePoint definitions here for use with SAL
 ************************************************************/
var workOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    IsActive: { type: "Bool", koMap: "requestIsActive" },
    ManagingDirector: { type: "Person", koMap: "requestorManager" },
    //RequestAssignments: { type: "Text", koMap: "requestAssignmentIds" },
    RequestDescription: { type: "Text", koMap: "requestDescriptionHTML" },
    RequestOrgs: { type: "Lookup", koMap: "requestOrgIds" },
    RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { type: "Person", koMap: "requestorOfficeLookupId" },
    RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { type: "Text", koMap: "requestStatus" },
    RequestSubject: { type: "Text", koMap: "requestSubject" },
    RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Created: { type: "Date", koMap: "empty" },
  },
};

var actionListDef = {
  name: "Action",
  title: "Action",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    ActionType: { type: "Choice", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    SendEmail: { type: "Bool", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var approvalListDef = {
  name: "Adjudication",
  title: "Adjudication",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    Adjudication: { type: "Choice", koMap: "empty" },
    Comment: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var assignmentListDef = {
  name: "Assignment",
  title: "Assignment",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Assignee: { type: "Person", koMap: "empty" },
    ActionOffice: { type: "Lookup", koMap: "empty" },
    CanDelegate: { type: "Bool" },
    Comment: { type: "Text", koMap: "empty" },
    IsActive: { type: "Bool", koMap: "empty" },
    Role: { type: "Text", koMap: "empty" },
    Status: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var commentListDef = {
  name: "Comment",
  title: "Comment",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Comment: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var workOrderEmailsListDef = {
  name: "WorkOrderEmails",
  title: "WorkOrderEmails",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    To: { type: "Person", koMap: "empty" },
    CC: { type: "Person", koMap: "empty" },
    BCC: { type: "Person", koMap: "empty" },
    Body: { type: "Text", koMap: "empty" },
    Sent: { type: "Bool", koMap: "empty" },
    DateSent: { type: "Date", koMap: "empty" },
    DateToSend: { type: "Date", koMap: "empty" },
    Request: { type: "Lookup", koMap: "empty" },
  },
};

var workOrderDocDef = {
  name: "WorkOrderDocuments",
  title: "Work Order Documents",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    FileRef: { type: "Text", koMap: "empty" },
    IsActive: { type: "Text", koMap: "empty" },
    WorkOrderID: { type: "Text", koMap: "empty" },
  },
};

/************************************************************
 * SharePoint Configuration Lists
 ************************************************************/
var configActionOfficesListDef = {
  name: "ConfigActionOffices",
  title: "ConfigActionOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    AOGroup: { type: "Person", koMap: "empty" },
    CanAssign: { type: "Bool", koMap: "empty" },
    RequestOrg: { type: "Lookup", koMap: "empty" },
    SysAdmin: { type: "Bool", koMap: "empty" },
    UserAddress: { type: "Person", koMap: "empty" },
  },
};

var configRequestOrgsListDef = {
  name: "ConfigRequestOrgs",
  title: "ConfigRequestOrgs",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    UserGroup: { type: "Person", koMap: "empty" },
  },
};

var configHolidaysListDef = {
  name: "ConfigHolidays",
  title: "ConfigHolidays",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Date: { type: "Text", koMap: "empty" },
    Repeating: { type: "Text", koMap: "empty" },
  },
};

var configPipelinesListDef = {
  name: "ConfigPipelines",
  title: "ConfigPipelines",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    ServiceType: { type: "Text", koMap: "empty" },
    Step: { type: "Text", koMap: "empty" },
    ActionType: { type: "Text", koMap: "empty" },
    Assignee: { type: "Text", koMap: "empty" },
  },
};

var configRequestingOfficesListDef = {
  name: "ConfigRequestingOffices",
  title: "ConfigRequestingOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
    ROGroup: { type: "Person", koMap: "empty" },
  },
};

// Service type configuration list
var configServiceTypeListDef = {
  name: "ConfigServiceTypes",
  title: "ConfigServiceTypes",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
    ActionOffices: { type: "Lookup", koMap: "empty" },
    AttachmentRequired: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    DescriptionRequired: { type: "Bool", koMap: "empty" },
    DescriptionTitle: { type: "Bool", koMap: "empty" },
    ListDef: { type: "Text", koMap: "empty" },
    ElementID: { type: "Text", koMap: "empty" },
    DaysToCloseBusiness: { type: "Text", koMap: "empty" },
    ReminderDays: { type: "Text", koMap: "empty" },
    KPIThresholdYellow: { type: "Text", koMap: "empty" },
    KPIThresholdGreen: { type: "Text", koMap: "empty" },
    Icon: { type: "Text", koMap: "empty" },
    RequestOrgs: { type: "Lookup", koMap: "empty" },
    st_list: { type: "Text", koMap: "empty" },
    TemplateName: { type: "Lookup", koMap: "empty" },
    UID: { type: "Text", koMap: "empty" },
  },
};

/************************************************************
 * Set Knockout View Model
 ************************************************************/
function koviewmodel() {
  var self = this;

  self.empty = ko.observable();

  //self.serviceTypeAbbreviations = ko.observableArray(Object.keys(woViews));
  //self.serviceTypeViews = ko.observable(woViews);

  self.userGroupMembership = ko.observable();

  /************************************************************
   * ADMIN: Authorize Current user to take actions
   ************************************************************/
  self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
  self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

  self.userActionOfficeMembership = ko.pureComputed(() => {
    // Return the configActionOffice offices this user is a part of
    return self
      .configActionOffices()
      .filter(
        (ao) =>
          ao.UserAddress.get_lookupId() == sal.globalConfig.currentUser.get_id()
      );
  });

  self.userActionOfficeOwnership = ko.pureComputed(() => {
    return self.userActionOfficeMembership().filter((uao) => {
      return uao.CanAssign;
    });
  });

  self.userIsSysAdmin = ko.pureComputed(() => {
    return self.userActionOfficeMembership().find((uao) => uao.SysAdmin)
      ? true
      : false;
  });

  self.assignmentCurUserActions = ko.pureComputed(() => {
    return self.request;
  });

  // Can the current user take action on the record?
  self.requestCurUserAction = ko.pureComputed(function () {
    return true;
  });

  // Can the current user approve the record?
  self.requestCurUserApprove = ko.pureComputed(function () {
    return true;
  });

  /************************************************************
   * ADMIN: Assignment
   ************************************************************/
  self.requestCurUserAssign = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      // does the current user have CanAssign to any offices?
      let uao = self
        .userActionOfficeOwnership()
        .map((uao) => uao.RequestOrg.get_lookupValue());

      // Get the office assigned to this stage,
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == self.requestStage().Assignee.get_lookupId());

      return uao.includes(assignedOffice.RequestOrg.get_lookupValue());
    }
  });

  self.assignCurUserAssignees = ko.pureComputed(function () {
    //Who can the current user assign to?
    let uao = self.userActionOfficeOwnership().filter((uao) => {
      return uao.CanAssign;
    });

    if (!uao) {
      // This person isn't an action office, how did we get here?
      return [];
    } else if (uao.map((uao) => uao.SysAdmin).includes(true)) {
      // User is sysadmin, return all action offices
      return self.configActionOffices();
    } else {
      return self.configActionOffices().filter((aos) => {
        return uao
          .map((userAO) => userAO.RequestOrg.get_lookupValue())
          .includes(aos.RequestOrg.get_lookupValue());
      });
    }
  });

  self.assignmentCurUserCanApprove = function (assignment) {
    let isStatus = assignment.Status == "In Progress";
    let isType = assignment.Role == "Approver";

    if (isType && isStatus) {
      // This is the most intensive check, so let's only perform if the easy
      // ones are true
      return vm
        .userActionOfficeMembership()
        .map((ao) => ao.ID)
        .includes(assignment.actionOffice.ID);
    } else {
      return false;
    }
  };

  self.assignmentApprove = function (assignment) {
    // Update this assignment with our approval
    let vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Approved"],
    ];

    self.listRefAssignment().updateListItem(assignment.ID, vp, () => {
      timedNotification(assignment.actionOffice.Title + " Approved", 2000);
      // Create a new action
      createAction("Approved", `The request has been approved.`);
      fetchRequestAssignments();
    });
  };

  self.assignmentRejectComment = ko.observable();
  self.assignmentRejectAssignment = ko.observable();
  self.assignmentReject = function (assignment) {
    self.assignmentRejectAssignment(assignment);
    $("#assignment-reject-modal").modal("show");
  };

  self.assignmentRejectSubmit = function () {
    // Update this assignment with our approval
    let vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Rejected"],
      ["Comment", self.assignmentRejectComment()],
    ];

    self
      .listRefAssignment()
      .updateListItem(self.assignmentRejectAssignment().ID, vp, () => {
        timedNotification(
          self.assignmentRejectAssignment().actionOffice.Title + " Approved",
          2000
        );
        // Create a new action
        createAction(
          "Rejected",
          `The request has been rejected with the following comment:\n` +
            `${self.assignmentRejectComment()}`
        );
        fetchRequestAssignments();
      });
  };

  self.assignmentCurUserCanRemove = function (assignment) {
    return self
      .assignCurUserAssignees()
      .map((assignee) => assignee.ID)
      .includes(assignment.actionOffice.ID);
  };

  self.assignmentRemove = function (assignment) {
    console.log("deleting assignee", assignment);
    self.listRefAssignment().deleteListItem(assignment.ID, () => {
      timedNotification(assignment.actionOffice.Title + " Removed", 2000);
      fetchRequestAssignments();
    });
  };

  self.assignOfficeRemove = function (assignment) {
    self.requestOrgs(self.requestOrgs().filter((ao) => ao.ID != assignment.ID));
  };

  self.assignAssignee = ko.observable();

  self.assignOfficeAssignee = ko.observable();

  /************************************************************
   * ADMIN: Advance
   ************************************************************/
  self.requestCurUserAdvance = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      // which offices is the current user a member of?
      let uao = self
        .userActionOfficeMembership()
        .map((uao) => uao.RequestOrg.get_lookupValue());

      // Get the office assigned to this stage,
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == self.requestStage().Assignee.get_lookupId());

      return uao.includes(assignedOffice.RequestOrg.get_lookupValue());
    }
  });

  /************************************************************
   * ADMIN: Approvals/Actions Table
   ************************************************************/
  self.showActionsTable = ko.pureComputed(() => {
    return true;
  });

  /************************************************************
   * Page/Tab Specific handlers
   ************************************************************/
  // What page is the user on? App, Approval, Admin
  self.page = ko.observable();

  // What tab is the user on?
  self.tab = ko.observable();
  self.tab.subscribe(function (newPage) {
    console.log("New Page: ", newPage);
    $(".ui.menu").find(".item").tab("change tab", newPage);
    if (newPage == "order-detail") {
      console.log("Activate Accordion");
      $(".ui.accordion").accordion();
    }

    if (self.requestID()) {
      updateUrlParam("reqid", self.requestID());
    }
    updateUrlParam("tab", newPage);
  });

  /************************************************************
   * Hold a reference to each of our SAL items
   ************************************************************/
  self.listRefWO = ko.observable();
  self.libRefWODocs = ko.observable();
  self.listRefAction = ko.observable();
  self.listRefApproval = ko.observable();
  self.listRefAssignment = ko.observable();
  self.listRefComment = ko.observable();
  self.listRefWOEmails = ko.observable();

  // Configuration Lists
  self.listRefConfigActionOffices = ko.observable();
  self.listRefConfigHolidays = ko.observable();
  self.listRefConfigPipelines = ko.observable();
  self.listRefConfigRequestingOffices = ko.observable();
  self.listRefConfigRequestOrgs = ko.observable();
  self.listRefConfigServiceType = ko.observable();

  //hold a copy of our list defs, we'll use this for synchronization.
  self.listDefs = ko.observableArray();

  /************************************************************
   * Hold current info about our lists
   ************************************************************/
  self.adminAllOrdersBool = ko.observable(false);

  self.allOrders = ko.observableArray();
  //self.allOfficeOrders = ko.observableArray();
  self.assignedOpenOrders = ko.observableArray();

  self.allAssignments = ko.observableArray();
  self.allAOAssignments = ko.observableArray();

  self.lookupOrders = ko.observableArray();

  /************************************************************
   * My Orders Tab
   ************************************************************/

  self.allOfficeOrders = ko.pureComputed(() => {
    let offices = self
      .userActionOfficeMembership()
      .map((ao) => ao.RequestOrg.get_lookupValue());
    // Get the types of orders we're responsible for based on the ConfigServiceType

    if (!self.adminAllOrdersBool()) {
      let officeOrders = self.allOrders().filter((order) => {
        return order.RequestOrgs.find((ao) =>
          offices.includes(ao.get_lookupValue())
        );
      });

      return officeOrders;
    } else {
      return self.allOrders();
    }
  });

  self.allOpenOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Open")
  );

  self.allClosedOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Closed")
  );

  self.allCancelledOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Cancelled")
  );

  // For the admin dash, we'll need to limit these to the current
  // users office + in addition too, as well as which they're assigned.
  self.officeAllOpenOrders = ko.pureComputed(() =>
    self.allOfficeOrders().filter((req) => req.RequestStatus == "Open")
  );

  self.officeAllClosedOrders = ko.pureComputed(() =>
    self.allOfficeOrders().filter((req) => req.RequestStatus == "Closed")
  );

  self.officeAllCancelledOrders = ko.pureComputed(() =>
    self.allOfficeOrders().filter((req) => req.RequestStatus == "Cancelled")
  );

  /************************************************************
   * allOpenOrders Table Handlers
   ************************************************************/
  self.showWorkOrder = function (request) {
    console.log("clicked", request);
    viewWorkOrderItem(request.Title);
  };

  self.getRequestStage = function (request) {
    const curStage = selectPipelineById(
      request.ServiceType.get_lookupId()
    ).find((step) => step.Step == request.RequestStage);
    return curStage ? curStage.Title : "Closed";
  };

  self.estimateClosingDate = function (request) {
    // TODO: Add the holidays list in here somewhere
    console.log("est closing date", request);

    let daysOffset = self
      .configServiceTypes()
      .find((stype) => stype.ID == request.ServiceType.get_lookupId())
      .DaysToCloseDisp;

    var closeDate = businessDaysFromDate(request.Created, daysOffset);
    return closeDate.format("yyyy-MM-dd");
  };

  self.tableRequestTitle = ko.observable();
  self.tableRequestAssignments = ko.observableArray();

  /************************************************************
   * Lookup Tab
   ************************************************************/
  self.lookupServiceType = ko.observable();
  self.lookupInactiveBool = ko.observable(false);

  self.lookupServiceTypeOptions = ko.pureComputed(() => {
    // return only the options that are available
    let unique = [
      ...new Set(
        self.allOrders().map((order) => order.ServiceType.get_lookupValue())
      ),
    ];
    return self
      .configServiceTypes()
      .filter((stype) => unique.includes(stype.Title));
  });

  self.lookupTables = ko.observableArray();

  self.lookupTableCol = ko.observableArray([]);

  self.lookupServiceType.subscribe((stype) => {
    // First verify we have a valid servicetype that hasn't already been
    // looked up.
    if (
      stype != undefined &&
      !self.lookupTables().find((tstype) => {
        return tstype.stype.UID == stype.UID;
      })
    ) {
      self.lookupTableCol([]);

      let newServiceTable = new Object();
      newServiceTable.id = stype.UID + "-lookup-table";
      newServiceTable.stype = stype;

      newServiceTable.cols = new Array();
      newServiceTable.requests = new Array();

      if (stype.listDef) {
        let lookupKeys = Object.keys(stype.listDef.viewFields).filter(
          (col) => col != "ID" && col != "Title"
        );

        //self.lookupTableCol(lookupKeys);
        newServiceTable.cols = lookupKeys;
        newServiceTable.viewFields = stype.listDef.viewFields;
      }

      let camlq =
        '<View Scope="RecursiveAll"><Query><Where><Eq>' +
        '<FieldRef Name="ServiceType" LookupId="TRUE"/>' +
        '<Value Type="Lookup">' +
        stype.ID +
        "</Value>" +
        "</Eq></Where></Query></View>";

      self.listRefWO().getListItems(camlq, (lookupOrdersTemp) => {
        if (stype.listDef) {
          // If this request type has related orders, let's query those
          let count = lookupOrdersTemp.length - 1;
          let i = 0;
          lookupOrdersTemp.forEach((order) => {
            let camlq =
              '<View Scope="RecursiveAll"><Query><Where><Eq>' +
              '<FieldRef Name="Title"/>' +
              '<Value Type="Text">' +
              order.Title +
              "</Value>" +
              "</Eq></Where></Query></View>";

            stype.listRef.getListItems(camlq, function (val) {
              order.ServiceItem = val[0];
              //self.lookupOrders.push(order);
              newServiceTable.requests.push(order);

              if (i == count) {
                self.lookupTables.push(newServiceTable);
                makeDataTable("#" + newServiceTable.id);
              } else {
                console.log(i + "/" + count);
                i++;
              }
            });
          });
        } else {
          newServiceTable.requests = lookupOrdersTemp;

          self.lookupTables.push(newServiceTable);
          makeDataTable("#" + newServiceTable.id);
        }
      });
    }
  });

  self.lookupServiceTypeListDef = ko.pureComputed(() => {
    return JSON.parse(self.lookupServiceType().ListDef);
  });

  self.lookupParseText = function (col, viewFields, val) {
    // Parse the type of val and return text
    switch (viewFields[col].type) {
      case "RichText":
        return $(val).text();
        break;
      case "DateTime":
        return new Date(val).toLocaleDateString();
        break;
      default:
        return val;
    }
  };

  /************************************************************
   * Hold generic Work Order vars
   ************************************************************/
  // The available service types (we'll set this from a json array)

  self.currentView = ko.observable();

  self.requestIsSaveable = ko.observable();
  self.requestAttachments = ko.observableArray();

  self.requestActions = ko.observableArray();
  self.requestApprovals = ko.observableArray();

  self.requestAssignees = ko.observableArray();
  self.requestComments = ko.observableArray();

  //self.getApprovalAuthor = function (approval) {
  //    console.log('getting author', approval)
  //    return approval.Author.get_lookupValue();
  //}

  /************************************************************
   * Many to One - Attachments
   ************************************************************/
  self.attachmentView = function (attachment) {
    self
      .libRefWODocs()
      .showModal(
        "DispForm.aspx",
        `View ${attachment.Title}`,
        { id: attachment.ID },
        () => {
          fetchAttachments;
        }
      );
  };

  self.attachmentRemove = function (attachment) {
    console.log("removing attachment");
    self
      .libRefWODocs()
      .updateListItem(attachment.ID, [["IsActive", 0]], () =>
        fetchAttachments()
      );
  };

  /************************************************************
   * Many to One - Comments
   ************************************************************/

  self.commentNew = ko.observable();
  /************************************************************
   * Declare our form input computed functions
   ************************************************************/
  self.canSaveForm = ko.pureComputed(function () {
    return self.currentView() == "new" || self.currentView() == "edit";
  });

  self.canEditForm = ko.pureComputed(function () {
    return self.currentView() == "view" && self.page() != "approval";
  });

  self.showRouting = ko.pureComputed(function () {
    return true; //self.page() == 'admin';
  });

  /************************************************************
   * Configuration List Data Here
   ************************************************************/

  self.configActionOffices = ko.observable();
  //self.configRequestOrgs = ko.observable();
  self.configHolidays = ko.observable();
  self.configPipelines = ko.observable();
  self.configRequestingOffices = ko.observable();
  self.configRequestOrgs = ko.observable();
  // We'll update this to hold listRef objects
  self.configServiceTypes = ko.observable();

  // Hold the selected configServiceTypes
  self.selectedServiceType = ko.observable();

  self.selectedServiceTypeTemplate = function () {
    if (vm.selectedServiceType()) {
      return "tmpl_" + vm.selectedServiceType().UID;
    } else {
      return "";
    }
  };

  self.setServiceTypeByUID = function (uid) {
    let newServiceType = self
      .configServiceTypes()
      .find((stype) => stype.UID == uid);
    if (newServiceType) {
      self.selectedServiceType(newServiceType);
    } else {
      timedNotification("Error selecting service type: " + uid);
    }
  };

  self.getServiceTypeByUID = function (uid) {
    return self.configServiceTypes().find((stype) => stype.UID == uid);
  };

  self.selectedServiceType.subscribe((stype) => {
    self.requestShowDescription(false);
    if (stype.ListDef) {
      clearValuePairs(stype.listDef.viewFields);
    }
  });

  // return the selected service type pipeline
  self.selectedPipeline = ko.pureComputed(function () {
    if (self.selectedServiceType()) {
      return selectPipelineById(self.selectedServiceType().ID).sort((a, b) => {
        return a.Step - b.Step;
      });
    }
  });

  function selectPipelineById(stypeId) {
    // Should we sort here?
    return self
      .configPipelines()
      .filter((pipeline) => pipeline.ServiceType.get_lookupId() == stypeId);
  }

  // Track the number of loaded list items for initialization process
  self.loadedListItemLists = ko.observable(0);

  self.incLoadedListItems = function () {
    self.loadedListItemLists(self.loadedListItemLists() + 1);
  };

  self.loadedListItemLists.subscribe(function (val) {
    if (val == 8) {
      initServiceTypes();
    }
  });

  /************************************************************
   * Selected Work Order
   ************************************************************/
  self.requestLink = ko.pureComputed(() => {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      `/Pages/app.aspx?tab=order-detail&reqid=${self.requestID()}`
    );
  });

  self.requestLinkAdmin = ko.pureComputed(() => {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      `/Pages/admin.aspx?tab=order-detail&reqid=${self.requestID()}`
    );
  });
  /************************************************************
   * Observables for work order header
   ************************************************************/
  self.requestLoaded = ko.observable(new Date());
  self.requestID = ko.observable(); // This is the key that will map everything together.
  self.requestHeader = ko.observable(); // This is the raw JSON object returned by the work order query.
  self.serviceTypeHeader = ko.observable(); // This is the raw JSON object object returned by the service type query.
  self.requestSubject = ko.observable();
  // The general description for this request. Some service types only have this
  self.requestDescriptionHTML = ko.observable();
  self.requestEstClosed = ko.observable();

  self.requestShowDescription = ko.observable(false);

  // self.requestDescription = ko.pureComputed({
  //   read: function () {
  //     if (self.currentView() != "view") {
  //       console.log("we are editing");
  //       return $("#request-description").val();
  //     } else {
  //       console.log("we are viewing");
  //       return self.requestDescriptionHTML();
  //     }
  //   },
  //   write: (val) => {
  //     self.requestDescriptionHTML(val);
  //   },
  // });

  self.requestIsActive = ko.observable(); // Bool
  self.requestStatus = ko.observable(); // Open, Closed, etc
  self.requestStageNum = ko.observable(0); // 0, 1, 2 etc, used for our view pipelines.

  self.requestStage = ko.pureComputed(function () {
    if (self.selectedServiceType() && self.requestStageNum()) {
      let stage = self
        .selectedPipeline()
        .find((stage) => stage.Step == self.requestStageNum());

      return stage ? stage : { Step: self.requestStageNum(), Title: "Closed" };
    } else {
      return "";
    }
  });

  // Requestor/Header Info
  self.requestorName = ko.observable();
  self.requestorTelephone = ko.observable();
  self.requestorEmail = ko.observable();
  self.requestorManager = ko.observable();

  self.requestOrgs = ko.observableArray(new Array());

  self.requestOrgIds = ko.pureComputed({
    read: function () {
      let offices = self.configActionOffices();
      let vps = new Array();
      self.requestOrgs().forEach((ao) => {
        vps.push(ao.ID);
        vps.push(ao.Title);
      });

      return vps.join(";#");
    },
    write: function (val) {
      if (val.length > 0) {
        console.log("Action Office IDs: ", val[0].get_lookupValue());
        self.requestOrgs(
          val.map((ao) => {
            return { ID: ao.get_lookupId(), Title: ao.get_lookupValue() };
          })
        );
      } else {
        self.requestOrgs(new Array());
      }
    },
  });

  self.requestAssignments = ko.observableArray(new Array());

  self.requestAssignmentIds = ko.pureComputed({
    read: function () {
      let aoffices = self.configActionOffices();
      let vps = new Array();
      self.requestAssignments().forEach((ao) => {
        vps.push(ao.ID);
        vps.push(ao.Title);
      });

      return vps.join(";#");
    },
    write: function (val) {
      if (val.length > 0) {
        console.log("Action Office IDs: ", val[0].get_lookupValue());
      } else {
        self.requestAssignments(new Array());
      }
    },
  });

  // JSON Object for the requesting office
  self.requestorOffice = ko.observable();
  // Gets and sets the ID for above
  self.requestorOfficeLookupId = ko.pureComputed({
    read: function () {
      if (self.requestorOffice()) {
        return parseInt(self.requestorOffice().ID);
      } else {
        return null;
      }
    },
    write: function (value) {
      if (value) {
        self.requestorOffice(
          self
            .configRequestingOffices()
            .find((ro) => ro.ID == value.get_lookupId())
        );
      } else {
        self.requestorOffice("");
      }
    },
  });

  self.requestorOfficeUserOpt = ko.pureComputed(function () {
    let groupIds = self.userGroupMembership().map((ug) => ug.ID);
    let activeFilteredRO = self
      .configRequestingOffices()
      .filter((ro) => ro.Active) //Check if we're active
      .filter((ro) => groupIds.includes(ro.ROGroup.get_lookupId()));

    return activeFilteredRO;
  });

  self.requestSubmittedDate = ko.observable();
  self.requestClosedDate = ko.observable();

  // Service Type Lookup is set from the request header,
  // and is mapped to ServiceType field on workorder
  self.requestServiceTypeLookupId = ko.pureComputed({
    read: function () {
      if (self.selectedServiceType()) {
        return parseInt(self.selectedServiceType().ID);
      } else {
        return null;
      }
    },
    write: function (value) {
      self.selectedServiceType(
        self
          .configServiceTypes()
          .find((stype) => stype.ID == value.get_lookupId())
      );
    },
  });

  self.requestorOffice.subscribe(function () {
    // When the requesting office changes, so changes the manager
    self.requestorManager(managingDirectors[self.requestorOffice()]);
  });
}
/* Binding handlers */
// ko.bindingHandlers.nicedit = {
//     init: function(element, valueAccessor) {
//         console.log('initing nicedit')

//         var value = valueAccessor();
//         var area = new nicEditor({fullPanel : true}).panelInstance(element.id, {hasPanel : true});
//         $(element).text(ko.utils.unwrapObservable(value));

//         // function for updating the right element whenever something changes
//         var textAreaContentElement = $($(element).prev()[0].childNodes[0]);
//         var areachangefc = function() {
//             value(textAreaContentElement.html());
//         };

//         // Make sure we update on both a text change, and when some HTML has been added/removed
//         // (like for example a text being set to "bold")
//         $(element).prev().keyup(areachangefc);
//         $(element).prev().bind('DOMNodeInserted DOMNodeRemoved', areachangefc);
//     },
//     update: function(element, valueAccessor) {
//         console.log('updating nicedit')
//         var value = valueAccessor();
//         var textAreaContentElement = $($(element).prev()[0].childNodes[0]);
//         textAreaContentElement.html(value());
//     }
// };

ko.bindingHandlers.trix = {
  init: function (element, valueAccessor) {
    console.log(element);
    var value = valueAccessor();
    var areachangefc = function () {
      //console.log("change registered");
      value(textAreaContentElement.html());
    };
    var textAreaContentElement = $(element);
    $(element).keyup(areachangefc);
    $(element).bind("DOMNodeInserted DOMNodeRemoved", areachangefc);
    textAreaContentElement.html(value());
  },
  update: function (element, valueAccessor) {
    console.log("Doing something in trix");
    //$(element).html(valueAccessor());
  },
};

var camlq = "<Query></Query>";
var callback = function (items) {
  console.log(items);
};

ko.unapplyBindings = function ($node, remove = false) {
  // unbind events
  $node.find("*").each(function () {
    $(this).unbind();
  });

  // Remove KO subscriptions and references
  if (remove) {
    ko.removeNode($node[0]);
  } else {
    ko.cleanNode($node[0]);
  }
};
