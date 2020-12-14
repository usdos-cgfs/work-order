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
    RequestorOffice: { type: "Text", koMap: "requestorOfficeLookupId" },
    RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    RequestorSupervisor: { type: "Person", koMap: "requestorSupervisor" },
    RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { type: "Text", koMap: "requestStatus" },
    RequestSubject: { type: "Text", koMap: "requestSubject" },
    RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Author: { type: "Text", koMap: "empty" },
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
    Assignee: { type: "Text", koMap: "empty" },
    ActionOffice: { type: "Lookup", koMap: "empty" },
    CanDelegate: { type: "Bool" },
    Comment: { type: "Text", koMap: "empty" },
    IsActive: { type: "Bool", koMap: "empty" },
    Role: {
      type: "Text",
      opts: {
        Resolver: "Action Resolver",
        Approver: "Approver",
        Viewer: "Viewer",
        Subscriber: "Subscriber",
      },
      koMap: "empty",
    },
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
    To: { type: "Text", koMap: "empty" },
    CC: { type: "Text", koMap: "empty" },
    BCC: { type: "Text", koMap: "empty" },
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
    //AOGroup: { type: "Person", koMap: "empty" },
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
    ContactInfo: { type: "Text", koMap: "empty" },
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
    ActionType: {
      type: "Text",
      opts: {
        Editing: "Editing",
        Action: "Pending Action",
        Approval: "Pending Approval",
        Assignment: "Pending Assignment",
        Resolution: "Pending Resolution",
        Closed: "Closed",
      },
      koMap: "empty",
    },
    ActionOffice: { type: "Lookup", koMap: "empty" },
    RequestOrg: { type: "Lookup", koMap: "empty" },
    WildCardAssignee: { type: "Text", koMap: "empty" },
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
    AttachmentsRequiredCnt: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    DescriptionRequired: { type: "Bool", koMap: "empty" },
    DescriptionTitle: { type: "Bool", koMap: "empty" },
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

function Incremental(entry = 0, target = null, next = null) {
  var self = this;
  this.val = ko.observable(entry);
  this.inc = function (incrementer = 1) {
    self.val(self.val() + incrementer);
  };
  this.dec = function (decrementer = 1) {
    self.val(self.val() - decrementer);
  };
  this.val.subscribe(function (val) {
    if (target != null && val == target) {
      typeof self.callback == "function"
        ? self.callback()
        : console.log("target reached: ", val);
    }
  });
  this.callback = next;
  this.set = function (val) {
    self.val(val);
  };
  this.reset = function () {
    self.val(entry);
  };
}

function PeopleField() {
  this.user = ko.observable();
  this.userName = ko.pureComputed({
    read: () => {
      return this.user() ? this.user().userName : "";
    },
  });
  this.userId = ko.pureComputed(
    {
      read: () => {
        if (this.user()) {
          return this.user().ID;
        }
      },
      write: (value) => {
        if (value) {
          let user = new Object();
          user.ID = value.get_lookupId();
          user.userName = value.get_lookupValue();
          user.isEnsured = false;
          this.user(user);
          this.lookupUser(value);
        }
      },
    },
    this
  );
  this.lookupUser = ko.observable();
  this.ensuredUser = ko.observable();
}

function DateField(
  newOpts = {
    type: "date",
  },
  newDate = new Date()
) {
  var self = this;
  this.opts = newOpts; // These are the options sent to the datepicker
  this.format = "yyyy-MM-dd"; // This is how this will be
  this.date = ko.observable(newDate);
  this.dateFormat = ko.pureComputed({
    read: function () {
      return self.date().format(self.format);
    },
    write: function (val) {
      self.date(new Date(val));
    },
  });
  this.setDate = function (val) {
    self.date(new Date(val));
  };
}

function timers() {
  var self = this;
  self.init = ko.observable();
  self.initComplete = ko.observable();
  self.initDelta = ko.pureComputed(function () {
    return self.timerDelta(self.init(), self.initComplete());
  });

  self.timerDelta = function (start, end) {
    if (start && end) {
      return end - start;
    } else {
      return null;
    }
  };
}

/************************************************************
 * Enums
 ************************************************************/

/************************************************************
 * Set Knockout View Model
 ************************************************************/
function koviewmodel() {
  var self = this;

  self.timers = new timers();

  self.empty = ko.observable();

  self.applicationIsLoaded = ko.observable(false);

  self.applicationIsLoaded.subscribe(function (state) {
    // Whatever page we're on, now is the time to init our local app
    if (state && typeof initAppPage === typeof Function) {
      initAppPage();
    }
  });

  //self.serviceTypeAbbreviations = ko.observableArray(Object.keys(woViews));
  //self.serviceTypeViews = ko.observable(woViews);

  self.userGroupMembership = ko.observableArray();

  /************************************************************
   * ADMIN: Authorize Current user to take actions
   ************************************************************/
  self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
  self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

  self.userActionOfficeMembership = ko.pureComputed(() => {
    // Return the configActionOffice offices this user is a part of
    return self.configActionOffices().filter((ao) => {
      if (ao.UserAddress) {
        let isAO =
          ao.UserAddress.get_lookupId() ==
          sal.globalConfig.currentUser.get_id();

        let isGroup = self
          .userGroupMembership()
          .map((group) => group.Title)
          .includes(ao.UserAddress.get_lookupValue());

        return isAO || isGroup;
      } else {
        return false;
      }
    });
  });

  self.userActionOfficeOwnership = ko.pureComputed(() => {
    return self.userActionOfficeMembership().filter((uao) => {
      return uao.CanAssign;
    });
  });

  self.user = {};

  self.user.requestOrgMembership = ko.pureComputed(function () {
    reqOrgIds = [
      ...new Set(
        self.configActionOffices().map(function (ao) {
          return ao.RequestOrg.get_lookupId();
        })
      ),
    ];
    return self.configRequestOrgs().filter(function (reqOrg) {
      return reqOrgIds.includes(reqOrg.ID);
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

  /************************************************************
   * ADMIN: Assignment
   ************************************************************/
  self.requestCurUserAssign = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      if (self.userIsSysAdmin()) {
        return true;
      }
      // does the current user have CanAssign to any offices?
      let uao = self
        .userActionOfficeOwnership()
        .map((uao) => uao.RequestOrg.get_lookupValue());

      // Check if this has been assigned to an entire office.
      return uao.includes(
        self.requestStageOrg() ? self.requestStageOrg().Title : null
      );
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

  self.assignmentShowAssignment = function (assignment) {
    let args = { id: assignment.ID };
    self
      .listRefAssignment()
      .showModal("DispForm.aspx", assignment.Title, args, function () {
        fetchRequestAssignments();
      });
  };

  self.assignmentCurUserIsAOorAssignee = function (assignment) {
    let isAssignee = false;
    let isAO = false;
    if (self.userIsSysAdmin()) {
      return true;
    }
    if (assignment.Assignee) {
      isAssignee =
        assignment.Assignee.get_lookupId() ==
        sal.globalConfig.currentUser.get_id();
    } else if (assignment.ActionOffice) {
      isAO = self
        .userActionOfficeMembership()
        .map((ao) => ao.ID)
        .includes(assignment.ActionOffice.get_lookupId());
    }
    return isAO || isAssignee;
  };

  // Assignment Level: Action Item
  self.assignmentCurUserCanComplete = function (assignment) {
    let isStatus = assignment.Status == "In Progress";
    let isType = assignment.Role == "Action Resolver";
    if (isType && isStatus) {
      // This is the most intensive check, so let's only perform if the easy
      // ones are true
      return self.assignmentCurUserIsAOorAssignee(assignment);
    } else {
      return false;
    }
  };

  self.assignmentComplete = function (assignment, advance = false) {
    // Update this assignment with our approval
    let vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Completed"],
    ];

    self.listRefAssignment().updateListItem(assignment.ID, vp, () => {
      timedNotification(assignment.actionOffice.Title + " Completed", 2000);
      // Create a new action
      createAction("Completed", `The assignment has been completed.`);

      fetchRequestAssignments();
    });
  };

  // Request Level: Can the current user approve the record?
  self.requestCurUserApprove = ko.pureComputed(() => {
    let flag = false;
    self.requestAssignments().forEach((assignment) => {
      if (self.assignmentCurUserCanApprove(assignment)) {
        flag = true;
      }
    });
    return flag;
  });

  // Assignment Level: Can the current user approve this assignment
  self.assignmentCurUserCanApprove = function (assignment) {
    let isStatus = assignment.Status == "In Progress";
    let isType = assignment.Role == "Approver";

    if (isType && isStatus) {
      // This is the most intensive check, so let's only perform if the easy
      // ones are true
      return self.assignmentCurUserIsAOorAssignee(assignment);
    } else {
      return false;
    }
  };

  self.assignmentApprove = function (assignment, advance = false) {
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

      fetchRequestAssignments(self.requestID(), function (assignment) {
        if (advance) {
          actionComplete();
        }
      });
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
    return (
      self
        .assignCurUserAssignees()
        .map((assignee) => assignee.ID)
        .includes(assignment.actionOffice.ID) || self.userIsSysAdmin()
    );
  };

  self.assignmentRemove = function (assignment) {
    console.log("deleting assignee", assignment);
    self.listRefAssignment().deleteListItem(assignment.ID, () => {
      timedNotification(assignment.actionOffice.Title + " Removed", 2000);
      self.allAssignments(
        self
          .allAssignments()
          .filter((allAssignment) => allAssignment.ID != assignment.ID)
      );
      fetchRequestAssignments();
    });
  };

  self.assignOfficeRemove = function (assignment) {
    self.requestOrgs(self.requestOrgs().filter((ao) => ao.ID != assignment.ID));
  };

  self.assignActionOffice = ko.observable();
  self.assignAssignee = ko.observable();

  self.assignRequestOffice = ko.observable();

  /************************************************************
   * ADMIN: Advance
   ************************************************************/
  self.requestCurUserAdvance = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      if (self.userIsSysAdmin()) {
        // First check if we're a sysadmin
        return true;
      } else if (self.requestCurUserAssign()) {
        // Check if we're an office assignor.
        //TODO: Check if we've assigned anyone or otherwise met the reqs
        // for this stage.
        return true;
      } else {
        // Finally, check if we're listed as an assignee
        var actionOpts = configPipelinesListDef.viewFields.ActionType.opts;
        var roleOpts = assignmentListDef.viewFields.Role.opts;

        var isAdvanceable = false;
        switch (vm.requestStage().ActionType) {
          case actionOpts.Action:
          case actionOpts.Approval:
          case actionOpts.Resolution:
            var allCompleted = true;
            var userAssignmentCnt = 0;
            // Is the user listed as an action office in the assignments?
            self.requestAssignments().forEach(function (assignment) {
              var user = self.requestAssignmentUser(assignment);
              if (
                user &&
                user.get_lookupId() == sal.globalConfig.currentUser.get_id()
              ) {
                // we are the user assigned to this assignment
                if (
                  assignment.Role == roleOpts.Resolver ||
                  assignment.Role == roleOpts.Approver
                ) {
                  userAssignmentCnt += 1;
                  if (assignment.IsActive) {
                    allCompleted = false;
                  }
                }
              }
            });
            isAdvanceable = userAssignmentCnt && allCompleted;
            break;
          default:
        }
        // which offices is the current user a member of?
        return isAdvanceable;
      }
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
    try {
      $(".ui.menu").find(".item").tab("change tab", newPage);
      if (newPage == "order-detail") {
        console.log("Activate Accordion");
        $(".ui.accordion").accordion();
        var elmnt = document.getElementById("tabs");
        elmnt.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      console.warn("Error setting tab, are we on a page that supports it?", e);
    }
    if (self.requestID()) {
      updateUrlParam("reqid", self.requestID());
    }
    updateUrlParam("tab", newPage);
    //self.setFieldState();
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

  self.allAssignments = ko.observableArray();
  self.allAOAssignments = ko.observableArray();

  self.lookupOrders = ko.observableArray();

  self.allRequestAssignmentsMap = ko.pureComputed({
    read: () => {
      let orders = new Object();
      self.allOrders().forEach((order) => {
        orders[order.Title] = self
          .allAssignments()
          .filter((assignment) => assignment.Title == order.Title);
      });
      return orders;
    },
  });

  /************************************************************
   * My Orders Tab
   ************************************************************/

  self.showRequestAssignments = ko.observable(true);

  self.readRequestAssignments = function (req) {
    return ko.computed(() =>
      req
        ? self.allRequestAssignmentsMap()[req.Title]
        : self.allRequestAssignmentsMap()[self.requestID()]
    );
  };

  self.allOfficeOrders = ko.pureComputed(() => {
    let orgs = self
      .userActionOfficeMembership()
      .map((ao) => ao.RequestOrg.get_lookupValue());
    // Get the types of orders we're responsible for based on the ConfigServiceType

    if (!self.adminAllOrdersBool()) {
      let officeOrders = self.allOrders().filter((order) => {
        return order.RequestOrgs.find((ro) =>
          orgs.includes(ro.get_lookupValue())
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
    if (!request.EstClosedDate) {
      let daysOffset = self
        .configServiceTypes()
        .find((stype) => stype.ID == request.ServiceType.get_lookupId())
        .DaysToCloseBusiness;

      var closeDate = businessDaysFromDate(request.Created, daysOffset);
      return closeDate.format("yyyy-MM-dd");
    } else {
      return request.EstClosedDate.format("yyyy-MM-dd");
    }
  };

  self.daysToCloseDate = function (request) {
    if (request.EstClosedDate && request.RequestSubmitted) {
      return businessDays(new Date(), request.EstClosedDate);
    } else {
      return "N/A";
    }
  };

  self.closeDateClass = function (request) {
    var days = self.daysToCloseDate(request);
    if (days == "N/A") {
      return "";
    } else if (days <= 0) {
      return "hl-late";
    } else if (days < 2) {
      return "hl-warn";
    } else if (2 < days < 5) {
      return "hl-info";
    }
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
    return self.lookupServiceType().listDef;
  });

  self.lookupParseText = function (col, viewFields, val) {
    // If there's a value for this field
    if (val) {
      // Parse the type of val and return text
      switch (viewFields[col].type) {
        case "RichText":
          return $(val).text();
          break;
        case "DateTime":
          return new Date(val).toLocaleDateString();
          break;
        case "Person":
          return val.userName();
          break;
        default:
          return val;
      }
    }
  };

  /************************************************************
   * Assigned Orders Tab
   ************************************************************/
  self.myAssignments = ko.pureComputed(() => {
    let myAOIDs = self.userActionOfficeMembership().map((ao) => ao.ID);
    return self
      .allAssignments()
      .filter((asg) =>
        asg.actionOffice
          ? myAOIDs.includes(asg.actionOffice.ID)
          : asg.Assignee.get_lookupId == sal.globalConfig.currentUser.get_id()
      );
  });

  self.assignedOpenOrders = ko.pureComputed(() => {
    let myAssignedIds = [
      ...new Set(self.myAssignments().map((asg) => asg.Title)),
    ];

    return self
      .allOpenOrders()
      .filter((order) => myAssignedIds.includes(order.Title));
  });

  self.assignmentStatus = function (asgTitle) {
    return ko.computed(() => {
      let asgs = self.myAssignments().filter((masg) => masg.Title == asgTitle);
      if (asgs.length > 1) {
        let statuses = new Array();
        statuses.push("<ul>");
        let states = [...new Set(asgs.map((asg) => asg.Status))];
        states.forEach((status) =>
          statuses.push(
            "<li>" +
              status +
              ": " +
              asgs.filter((asg) => asg.Status == status).length +
              "</li>"
          )
        );
        statuses.push("</ul>");
        return statuses.join("");
      } else {
        return asgs[0].Status;
      }
    });
  };
  /************************************************************
   * Hold generic Work Order vars
   ************************************************************/
  // The available service types (we'll set this from a json array)

  self.currentView = ko.observable();
  // self.currentView.subscribe((val) => {
  //   self.setFieldState();
  // });

  self.setFieldState = ko.computed(() => {
    //Based off our current observables, set the abledness
    if (self.tab() == "order-detail") {
      switch (self.currentView()) {
        case "view":
          $(".editable-field").prop("disabled", true);
          $(".editable-field")
            .find('[class$="-delImage"]')
            .each(function () {
              $(this).hide();
            });
          $(".editable-field")
            .find("input")
            .each(function () {
              $(this).prop("disabled", true);
            });

          break;
        case "edit":
        case "new":
          $(".editable-field").prop("disabled", false);
          $(".editable-field")
            .find('[class$="-delImage"]')
            .each(function () {
              $(this).show();
            });
          $(".editable-field")
            .find("input")
            .each(function () {
              $(this).prop("disabled", false);
            });

          break;
        default:
      }
    }
  });

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
    if (self.selectedServiceType()) {
      return "tmpl_" + self.selectedServiceType().UID;
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
    if (stype && stype.listDef) {
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
    let NUM_CONFIG_LISTS = 6;
    let NUM_PREFETCH_LISTS = 2;
    let TOTAL_LISTS_TO_LOAD = NUM_CONFIG_LISTS + NUM_PREFETCH_LISTS;
    if (val == TOTAL_LISTS_TO_LOAD) {
      initServiceTypes();
    }
  });

  /************************************************************
   * Selected Work Order
   ************************************************************/
  self.requestLink = ko.pureComputed(() => {
    var link =
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/app.aspx?tab=order-detail&reqid=";

    var id = self.requestID() ? self.requestID() : "";
    return link + id;
  });

  self.requestLinkAdmin = ko.pureComputed(() => {
    var link =
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/admin.aspx?tab=order-detail&reqid=";

    var id = self.requestID() ? self.requestID() : "";
    return link + id;
  });

  self.requestLinkAdminApprove = (id) => {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      `/Pages/approval.aspx?assignment=` +
      id +
      `&reqid=` +
      self.requestID()
    );
  };

  self.requestLinkAdminReject = (id) => {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      `/Pages/approval.aspx?assignment=` +
      id +
      `&reqid=` +
      self.requestID() +
      `&reject=true`
    );
  };

  /************************************************************
   * Observables for work order Folders
   ************************************************************/
  self.requestFolderPath = ko.pureComputed(() => {
    return `${self.requestorOffice().Title}/${self.requestID()}`;
  });

  self.foldersToCreate = ko.observable();
  self.foldersCreated = ko.observable();
  self.foldersCreatedInc = function () {
    self.foldersCreated(self.foldersCreated() + 1);
  };
  self.foldersCreated.subscribe((numCreated) => {
    // We'll create the attachments folder when they click upload.
    // We'll create the comments folder when they click submit.
    // Otherwise, we'll pre-create the following:
    // Workorder, Action, Assignment, Emails
    let NUM_LIST_FOLDERS = 4;
    let NUM_LIB_FOLDERS = 0;
    let NUM_ST_FOLDERS = self.requestSvcTypeListBool() ? 1 : 0;

    let TOTAL_FOLDERS_TO_CREATE =
      NUM_LIB_FOLDERS + NUM_LIST_FOLDERS + NUM_ST_FOLDERS;

    if (numCreated == TOTAL_FOLDERS_TO_CREATE) {
      createNewWorkorderItems();
    }
  });

  self.requestFolderPerms = ko.pureComputed(() => {
    let folderPermissions = [
      [sal.globalConfig.currentUser.get_loginName(), "Restricted Contribute"],
      ["workorder Owners", "Full Control"],
      ["Restricted Readers", "Restricted Read"],
    ];

    self.selectedPipeline().forEach((stage) => {
      // first get the action office
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == stage.ActionOffice.get_lookupId());
      let assignedOrg = self
        .configRequestOrgs()
        .find((ro) => ro.ID == assignedOffice.RequestOrg.get_lookupId());
      folderPermissions.push([
        assignedOrg.UserGroup.get_lookupValue(),
        "Restricted Contribute",
      ]);

      //If there's a wildcard assignee, get them too
      if (stage.WildCardAssignee) {
        let user = self[stage.WildCardAssignee].userName();
        if (user) {
          folderPermissions.push([
            self[stage.WildCardAssignee].userName(),
            "Restricted Contribute",
          ]);
        }
      }
    });
    return folderPermissions;
  });

  self.request = {};
  self.request.allPipelineOrgs = ko.pureComputed(function () {
    return self.selectedPipeline().map(function (stage) {
      // first get the action office
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == stage.ActionOffice.get_lookupId());

      return self
        .configRequestOrgs()
        .find((ro) => ro.ID == assignedOffice.RequestOrg.get_lookupId());
    });
  });

  /************************************************************
   * Observables for work order header
   ************************************************************/
  self.requestSvcTypeListBool = ko.pureComputed(() => {
    return self.requestSvcTypeListDef() ? true : false;
  });

  self.requestSvcTypeListDef = ko.pureComputed(() => {
    return self.selectedServiceType()
      ? self.selectedServiceType().listDef
        ? self.selectedServiceType().listDef
        : null
      : null;
  });

  self.requestSvcTypeListViewFields = ko.pureComputed(() => {
    return self.requestSvcTypeListDef()
      ? self.requestSvcTypeListDef().viewFields
      : null;
  });

  self.requestLoaded = ko.observable(new Date());
  self.requestID = ko.observable(); // This is the key that will map everything together.
  self.requestHeader = ko.observable(); // This is the raw JSON object returned by the work order query.
  self.serviceTypeHeader = ko.observable(); // This is the raw JSON object object returned by the service type query.
  self.requestSubject = ko.observable();
  // The general description for this request. Some service types only have this
  self.requestDescriptionHTML = ko.observable();
  self.requestEstClosed = ko.observable();

  self.requestShowDescription = ko.observable(false);

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

  self.requestStageOrg = ko.pureComputed(() => {
    if (!self.requestStage() || !self.requestIsActive()) {
      return null;
    } else if (self.requestStage().RequestOrg) {
      return self
        .configRequestOrgs()
        .find((ro) => ro.ID == self.requestStage().RequestOrg.get_lookupId());
    } else if (self.requestStageOffice()) {
      return self
        .configRequestOrgs()
        .find(
          (ro) => ro.ID == self.requestStageOffice().RequestOrg.get_lookupId()
        );
    } else {
      return null;
    }
  });

  self.requestStageOffice = ko.pureComputed(() => {
    if (self.requestStage() && self.requestStage().ActionOffice) {
      return self
        .configActionOffices()
        .find((ao) => ao.ID == self.requestStage().ActionOffice.get_lookupId());
    } else {
      return null;
    }
  });

  // Requestor/Header Info
  self.requestorName = ko.observable();
  self.requestorTelephone = ko.observable();
  self.requestorEmail = ko.observable();
  self.requestorManager = new PeopleField();
  self.requestorSupervisor = new PeopleField();

  self.requestOrgs = ko.observableArray([]);

  self.requestOrgIds = ko.pureComputed({
    read: function () {
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
        var orgs = val.map(function (ro) {
          return vm.configRequestOrgs().find(function (cro) {
            return cro.ID == ro.get_lookupId();
          });
        });
        // Now add each org to our requestOrgs if if isn't already
        // in the array
        orgs.forEach(function (newOrg) {
          if (
            !self.requestOrgs().find(function (existingOrg) {
              return existingOrg.ID == newOrg.ID;
            })
          ) {
            self.requestOrgs.push(newOrg);
          }
        });
        //self.requestOrgs(orgs);
      } else {
        self.requestOrgs([]);
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

  self.requestAssignmentsUsers = ko.pureComputed(function () {
    // Return an array of SP.FieldUser values
    let userArr = new Array();
    self.requestAssignments().map(function (assignment) {
      var assignee = self.requestAssignmentUser(assignment);
      if (assignee) {
        userArr.push(assignment);
      }
    });
    return userArr;
  });

  self.requestAssignmentUser = function (assignment) {
    // Given an assignment, return the user for that assignment
    if (assignment.Assignee) {
      // This was a wildcard assignment
      return assignment.Assignee;
    } else if (assignment.actionOffice) {
      //There's an action office here,
      return assignment.actionOffice.UserAddress;
    }
  };

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
    if (self.userRole() == "admin") {
      return self.configRequestingOffices();
    } else if (self.userActionOfficeMembership().length > 0) {
      return self.configRequestingOffices();
    } else {
      let groupIds = self.userGroupMembership().map((ug) => ug.ID);
      let activeFilteredRO = self
        .configRequestingOffices()
        .filter((ro) => ro.Active) //Check if we're active
        .filter((ro) => groupIds.includes(ro.ROGroup.get_lookupId()));

      return activeFilteredRO;
    }
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
      if (value) {
        self.selectedServiceType(
          self
            .configServiceTypes()
            .find((stype) => stype.ID == value.get_lookupId())
        );
      }
    },
  });

  self.test = {};
  self.test.dateField = new DateField({
    type: "date",
  });
  self.test.datetimeField = new DateField({
    minDate: new Date(),
    minTimeGap: 15,
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

// ko.extenders.peopleField = function (target, associated) {
//   let result = ko.pureComputed({
//     read: target,
//     write: function (newValue) {},
//   });
// };

ko.bindingHandlers.date = {
  init: function (element, valueAccessor, allBindingsAccessor) {
    $(element).change(function () {
      var targDate = new Date($(element).val());
      var value = valueAccessor();
      value(targDate);
    });
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    var value = valueAccessor();
    var valueUnwrapped = ko.unwrap(value);
    var formattedDate = new Date(valueUnwrapped).format("yyyy-MM-dd");
    $(element).val(formattedDate);
  },
};

ko.bindingHandlers.dateField = {
  init: function (element, valueAccessor, allBindingsAccessor) {
    var dateFieldObj = valueAccessor();
    dateFieldObj.opts.selectAdjacentDays = true;

    try {
      $(element).closest(".ui.calendar").calendar(dateFieldObj.opts);
      $(element)
        .closest(".ui.calendar")
        .focusout(function (event) {
          console.log(this);
          date = new Date($(element).val());
          var value = valueAccessor().date;
          value(date);
        });
    } catch (e) {
      console.warn("error", e);
    }
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    var value = valueAccessor().date;
    var valueUnwrapped = ko.unwrap(value);
    var formattedDate = new Date(valueUnwrapped); //.format("yyy-MM-ddThh:mm"); //.format("yyyy-MM-dd");
    $(element).val(valueUnwrapped);
  },
};

ko.bindingHandlers.people = {
  init: function (element, valueAccessor, allBindingsAccessor) {
    var schema = {};
    schema["PrincipalAccountType"] = "User";
    schema["SearchPrincipalSource"] = 15;
    schema["ShowUserPresence"] = true;
    schema["ResolvePrincipalSource"] = 15;
    schema["AllowEmailAddresses"] = true;
    schema["AllowMultipleValues"] = false;
    schema["MaximumEntitySuggestions"] = 50;
    schema["Width"] = "280px";
    schema["OnUserResolvedClientScript"] = function (elemId, userKeys) {
      //  get reference of People Picker Control
      var pickerElement = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
      var observable = valueAccessor();
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      if (userJSObject) {
        ensureUser(userJSObject.Key, (user) => {
          let userObj = new Object();
          userObj["ID"] = user.get_id();
          userObj["userName"] = user.get_loginName();
          userObj["isEnsured"] = true;
          userObj["ensuredUser"] = user;
          observable(userObj);
        });
      }
      //observable(pickerElement.GetControlValueAsJSObject()[0]);
      console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    var mergedOptions = allBindingsAccessor().options || schema;

    //  Initialize the Control, MS enforces to pass the Element ID hence we need to provide
    //  ID to our element, no other options
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(
      element.id,
      null,
      mergedOptions
    );
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    //debugger;
    //  Force to Ensure User
    var userValue = ko.utils.unwrapObservable(valueAccessor());
    if (userValue && !userValue.isEnsured) {
      var pickerControl =
        SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
      var editId = "#" + pickerControl.EditorElementId;
      jQuery(editId).val(userValue.userName);

      // Resolve the User
      pickerControl.AddUnresolvedUserFromEditor(true);
    }
  },
};

ko.bindingHandlers.toggleClick = {
  init: function (element, valueAccessor, allBindings) {
    var value = valueAccessor();

    ko.utils.registerEventHandler(element, "click", function () {
      var classToToggle = allBindings.get("toggleClass");
      var classContainer = allBindings.get("classContainer");
      var containerType = allBindings.get("containerType");

      if (containerType && containerType == "sibling") {
        $(element)
          .nextUntil(classContainer)
          .each(function () {
            $(this).toggleClass(classToToggle);
          });
      } else if (containerType && containerType == "doc") {
        var curIcon = $(element).attr("src");
        if (curIcon == "/_layouts/images/minus.gif")
          $(element).attr("src", "/_layouts/images/plus.gif");
        else $(element).attr("src", "/_layouts/images/minus.gif");

        if ($(element).parent() && $(element).parent().parent()) {
          $(element)
            .parent()
            .parent()
            .nextUntil(classContainer)
            .each(function () {
              $(this).toggleClass(classToToggle);
            });
        }
      } else if (containerType && containerType == "any") {
        if ($("." + classToToggle).is(":visible"))
          $("." + classToToggle).hide();
        else $("." + classToToggle).show();
      } else $(element).find(classContainer).toggleClass(classToToggle);
    });
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
