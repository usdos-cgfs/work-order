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
    Requestor: { type: "Person", koMap: "requestor" },
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
    ActionTaker: { type: "Person", koMap: "empty" },
    CanDelegate: { type: "Bool" },
    Comment: { type: "Text", koMap: "empty" },
    IsActive: { type: "Bool", koMap: "empty" },
    Role: {
      type: "Text",
      opts: {
        Resolver: {
          Name: "Action Resolver",
          Desc: "This role can complete actions.",
        },
        Approver: {
          Name: "Approver",
          Desc: "This role can approve or reject a request",
        },
        Viewer: {
          Name: "Viewer",
          Desc: "This role grants access to the request, but cannot make updates.",
        },
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

var dateRangesListDef = {
  name: "DateRanges",
  title: "DateRanges",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    StartDateTime: { type: "DateTime", koMap: "empty" },
    EndDateTime: { type: "DateTime", koMap: "empty" },
    Label: { type: "Text", koMap: "empty" },
    TableName: { type: "Text", koMap: "empty" },
  },
};

var workOrderEmailsListDef = {
  name: "WorkOrderEmails",
  title: "WorkOrderEmails",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    To: { type: "Text", koMap: "empty" },
    ToString: { type: "Text", koMap: "empty" },
    CC: { type: "Text", koMap: "empty" },
    CCString: { type: "Text", koMap: "empty" },
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
    Active: { type: "Bool", koMap: "empty" },
    CanAssign: { type: "Bool", koMap: "empty" },
    PreferredEmail: { type: "Text", koMap: "empty" },
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
    OrgType: {
      type: "Text",
      koMap: "empty",
      opts: {
        ACTIONOFFICES: "Action Offices",
        REQUESTINGOFFICE: "Requesting Office",
        DEPARTMENT: "Department",
      },
    },
    BreakAccess: { type: "Bool", koMap: "empty" },
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
    AttachmentsRequiredCnt: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    DescriptionRequired: { type: "Bool", koMap: "empty" },
    DescriptionTitle: { type: "Bool", koMap: "empty" },
    DaysToCloseBusiness: { type: "Text", koMap: "empty" },
    EmailPipelineOnClose: { type: "Bool", koMap: "empty" },
    HideReport: { type: "Bool", koMap: "empty" },
    ReminderDays: { type: "Text", koMap: "empty" },
    KPIThresholdYellow: { type: "Text", koMap: "empty" },
    KPIThresholdGreen: { type: "Text", koMap: "empty" },
    Icon: { type: "Text", koMap: "empty" },
    RequestOrgs: { type: "Lookup", koMap: "empty" },
    st_list: { type: "Text", koMap: "empty" },
    SupervisorRequired: { type: "Bool", koMap: "empty" },
    TemplateName: { type: "Lookup", koMap: "empty" },
    UID: { type: "Text", koMap: "empty" },
  },
};

var appBusyStates = {
  init: "Initializing the Application",
  save: "Saving Request...",
  cancelAction: "Cancelling Action...",
  view: "Viewing Request...",
  refresh: "Refreshing Request...",
  lock: "Locking Request...",
  closing: "Closing Request...",
  pipeline: "Progressing to Next Stage...",
  newComment: "Refreshing Comments...",
  newAction: "Refreshing Actions...",
  approve: "Approving Request...",
};

function Incremental(entry, target, next) {
  var entry = entry === undefined ? 0 : entry;
  var target = target === undefined ? null : target;
  var next = next === undefined ? null : next;

  var self = this;
  this.val = ko.observable(entry);
  this.inc = function (increment) {
    var incrementAmt = increment === undefined ? 1 : increment;
    self.val(self.val() + incrementAmt);
  };
  this.dec = function (decrement) {
    var decrementAmt = decrement === undefined ? 1 : decrement;
    self.val(self.val() - decrementAmt);
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

function EnsuredUserOrGroup(userOrGroup, isGroup) {
  var self = {};
  if (isGroup) {
    // Assume this is coming from sal.globalConfig.siteGroups
    self.id = userOrGroup.ID;
    self.title = userOrGroup.title;
    self.loginName = userOrGroup.loginName;
  } else {
    self.id = userOrGroup.get_id();
    self.title = userOrGroup.get_title();
    self.loginName = userOrGroup.get_loginName();
  }
  return self;
}

function GroupField() {
  var self = {};
  self.EnsuredGroup = ko.observable();
  return ko.pureComputed({
    read: function () {
      return self.EnsuredGroup();
    },
    write: function (val) {
      if (!val) {
        self.EnsuredGroup(null);
        return;
      }
      var foundGroup = sal.globalConfig.siteGroups.find(function (group) {
        return group.ID == val.get_lookupId();
      });
      // if (!foundGroup){
      //   return null;
      // }
      self.EnsuredGroup(foundGroup);
    },
  });
}

function PeopleField(schemaOpts) {
  // We need to refactor this whole thing to support groups/arrays.
  var self = this;
  self.loading = ko.observable(false);
  this.schemaOpts = schemaOpts || {};
  this.user = ko.observable();
  this.userName = ko.pureComputed({
    read: function () {
      return self.user() ? self.user().userName : "";
    },
  });
  this.title = ko.pureComputed(function () {
    return self.user() ? self.user().title : "";
  });
  this.setItemFormat = ko.pureComputed(function () {
    return self.user()
      ? self.user().ID + ";#" + self.user().userName + ";#"
      : "";
  });
  this.ID = function () {
    // We need to refactor
    return self.userId();
  };
  this.userId = ko.pureComputed(
    {
      read: function () {
        if (self.user()) {
          return self.user().ID;
        }
        return "";
      },
      write: function (value) {
        self.loading(true);
        if (value) {
          var user = {};
          switch (value.constructor.getName()) {
            case "SP.FieldUserValue":
              ensureUserById(value.get_lookupId(), function (ensuredUser) {
                user.ID = ensuredUser.get_id();
                user.userName = ensuredUser.get_loginName();
                user.title = ensuredUser.get_title();
                user.isEnsured = false;
                self.user(user);
                self.lookupUser(value);
                self.loading(false);
              });
              break;
            case "SP.User":
              user.ID = value.get_id();
              user.userName = value.get_loginName();
              user.title = value.get_title();
              user.isEnsured = false;
              self.user(user);
              self.lookupUser(value);
              self.loading(false);
              break;
            default:
              break;
          }
        } else {
          self.user(null);
          self.lookupUser(null);
          self.loading(false);
        }
      },
    },
    this
  );
  this.lookupUser = ko.observable();
  this.ensuredUser = ko.observable();
}

function DateField(newOpts, newDate) {
  newOpts =
    newOpts === undefined
      ? {
          type: "date",
        }
      : newOpts;
  newDate = newDate === undefined ? new Date() : newDate;

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

function DateRange(name) {
  var opts = { minTimeGap: 15 };
  var self = this;
  this.name = ko.observable(name);
  this.label = ko.observable();
  this.start = new DateField(opts);
  this.end = new DateField(opts);
  this.save = function () {
    createDateRange(self);
  };
  var publicMembers = {
    name: this.name,
    label: this.label,
    save: this.save,
    start: this.start,
    end: this.end,
  };
  return publicMembers;
}

function DateRangeTable(name) {
  var self = this;
  this.testDate = new DateField();
  this.name = name;
  this.dateRanges = ko.pureComputed(function () {
    // Filter this requests date ranges to return ones saved
    return vm.request.dateRanges.all().filter(function (dateRange) {
      return (dateRange.name = self.name);
    });
  });
  self.new = new DateRange(self.name);
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

  self.testDateRange = new DateRange("test");

  self.timers = new timers();

  self.empty = ko.observable();

  self.applicationIsLoaded = ko.observable(false);

  self.applicationIsLoaded.subscribe(function (state) {
    // Whatever page we're on, now is the time to init our local app
    if (state && typeof initAppPage === typeof Function) {
      initAppPage();
    }
  });

  /************
   * Handle Application Busy States
   */
  //
  self.busy = {};
  self.busy.addTask = function (task) {
    newTask = {
      id: Math.floor(Math.random() * 100000 + 1),
      task: task,
      active: ko.observable(true),
    };

    newTask.timeout = window.setTimeout(function () {
      console.error("this task is aging:", newTask);
      alert(
        "Something seems to have gone wrong performing the following action: " +
          newTask.task
      );
    }, 5000);
    vm.busy.tasks.push(newTask);
    return newTask.id;
  };
  self.busy.finishTask = function (task) {
    let activeTask = vm.busy.tasks().find(function (taskItem) {
      return taskItem.task == task && taskItem.active();
    });
    if (activeTask) {
      window.clearTimeout(activeTask.timeout);
      activeTask.active(false);
      window.setTimeout(function () {
        vm.busy.removeTask(activeTask);
      }, 1000);
    }
  };
  self.busy.removeTask = function (taskToRemove) {
    self.busy.tasks(
      self.busy.tasks().filter(function (task) {
        return task.id != taskToRemove.id;
      })
    );
  };
  self.busy.tasks = ko.observableArray();

  //self.serviceTypeAbbreviations = ko.observableArray(Object.keys(woViews));
  //self.serviceTypeViews = ko.observable(woViews);

  self.userGroupMembership = ko.observableArray();

  self.request = {
    header: {},
    body: {},
    dateRanges: {
      all: ko.observableArray(),
      createNew: function (dateRange) {
        var vp = [
          ["Title", self.requestID()],
          ["StartDateTime", dateRange.start.date()],
          ["EndDateTime", dateRange.end.date()],
          ["Label", dateRange.label()],
          ["Field", dateRange.field()],
        ];
        self.listRefDateRanges().createListItem(vp, function () {
          self.request.dateRanges.fetch();
        });
      },
      fetch: function () {
        var camlq =
          '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
          '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
          '</Eq><Eq><FieldRef Name="Title"/><Value Type="Text">' +
          vm.requestID() +
          "</Value></Eq></And></Where></Query></View>";
        self.listRefDateRanges().getListItems(camlq, function (items) {
          self.request.dateRanges.all(items);
        });
      },
    },
    pipeline: {},
  };
  // self.request.body = {};
  // self.request.pipeline = {};

  /************************************************************
   * ADMIN: Authorize Current user to take actions
   ************************************************************/
  self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
  self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

  self.userActionOfficeMembership = ko.pureComputed(function () {
    // Return the configActionOffice offices this user is a part of
    return self.configActionOffices().filter(function (ao) {
      if (ao.UserAddress) {
        var isAO =
          ao.UserAddress.get_lookupId() ==
          sal.globalConfig.currentUser.get_id();

        var isGroup =
          self
            .userGroupMembership()
            .map(function (group) {
              return group.Title;
            })
            .indexOf(ao.UserAddress.get_lookupValue()) >= 0;

        return isAO || isGroup;
      } else {
        return false;
      }
    });
  });

  self.userActionOfficeOwnership = ko.pureComputed(function () {
    return self.userActionOfficeMembership().filter(function (uao) {
      return uao.CanAssign;
    });
  });

  self.user = {};

  self.user.requestOrgMembership = ko.pureComputed(function () {
    // Determine which request orgs the current user is a member of
    var reqOrgIds = [];
    self.userActionOfficeMembership().forEach(function (ao) {
      if (reqOrgIds.indexOf(ao.RequestOrg.get_lookupId()) < 0) {
        reqOrgIds.push(ao.RequestOrg.get_lookupId());
      }
    });

    return self.configRequestOrgs().filter(function (reqOrg) {
      return reqOrgIds.indexOf(reqOrg.ID) >= 0;
    });
  });

  self.userIsSysAdmin = ko.pureComputed(function () {
    return self.userActionOfficeMembership().find(function (uao) {
      return uao.SysAdmin;
    })
      ? true
      : false;
  });

  self.assignmentCurUserActions = ko.pureComputed(function () {
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
      var uao = self.userActionOfficeOwnership().map(function (uao) {
        return uao.RequestOrg.get_lookupValue();
      });

      // Check if this has been assigned to an entire office.
      return (
        uao.indexOf(
          self.requestStageOrg() ? self.requestStageOrg().Title : null
        ) >= 0
      );
    }
  });

  self.assignments = {};
  self.assignments.new = {
    actionOffice: ko.observable(),
    role: ko.observable(),
  }; // Hold the details for our new assignment
  self.assignments.assigneeOpts = ko.pureComputed(function () {
    var activeActionOffices = self
      .configActionOffices()
      .filter(function (office) {
        return office.Active;
      });
    //Who can the current user assign to?
    var uao = self.userActionOfficeOwnership().filter(function (uao) {
      return uao.CanAssign;
    });

    if (!uao) {
      // This person isn't an action office, how did we get here?
      return [];
    }

    if (
      uao
        .map(function (uao) {
          return uao.SysAdmin;
        })
        .indexOf(true) >= 0
    ) {
      // User is sysadmin, return all action offices
      return activeActionOffices;
    }

    // Finally, return only action offices that have our Request Org
    // that our user is in (This should be done differently for legibility)
    var myOrgIds = uao.map(function (office) {
      return office.RequestOrg.get_lookupId();
    });

    return activeActionOffices.filter(function (office) {
      return myOrgIds.indexOf(office.RequestOrg.get_lookupId()) >= 0;
    });
  });

  self.assignments.roleOpts = function () {
    var opts = assignmentListDef.viewFields.Role.opts;

    return Object.keys(opts).map(function (role) {
      return opts[role].Name;
    });
  };

  self.assignments.new.create = function () {
    // Create a new assignment based off our assignments.new object
    if (!self.assignments.new.role()) {
      alert("Role missing");
    } else if (!self.assignments.new.actionOffice()) {
      alert("Action Office missing");
    } else {
      self.assignActionOffice(self.assignments.new.actionOffice());
      createAssignment(self.assignments.new.role(), true);
      self.assignments.new.actionOffice(null);
      self.assignments.new.role(null);
    }
  };

  self.assignmentShowAssignment = function (assignment) {
    var args = { id: assignment.ID };
    self
      .listRefAssignment()
      .showModal("DispForm.aspx", assignment.Title, args, function () {
        fetchRequestAssignments();
      });
  };

  self.assignmentCurUserIsAOorAssignee = function (assignment) {
    var isAssignee = false;
    var isAO = false;
    if (self.userIsSysAdmin()) {
      return true;
    }
    if (assignment.Assignee) {
      isAssignee =
        assignment.Assignee.get_lookupId() ==
        sal.globalConfig.currentUser.get_id();
    } else if (assignment.ActionOffice) {
      isAO =
        self
          .userActionOfficeMembership()
          .map(function (ao) {
            return ao.ID;
          })
          .indexOf(assignment.ActionOffice.get_lookupId()) >= 0;
    }
    return isAO || isAssignee;
  };

  // Assignment Level: Action Item
  self.assignmentCurUserCanComplete = function (assignment) {
    var isStatus = assignment.Status == "In Progress";
    var isType = assignment.Role == "Action Resolver";
    if (isType && isStatus) {
      // This is the most intensive check, so let's only perform if the easy
      // ones are true
      return self.assignmentCurUserIsAOorAssignee(assignment);
    } else {
      return false;
    }
  };

  self.assignmentComplete = function (assignment, advance) {
    advance = advance === undefined ? false : advance;
    // Update this assignment with our approval
    var vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Completed"],
      ["ActionTaker", sal.globalConfig.currentUser.get_id()],
    ];

    self.listRefAssignment().updateListItem(assignment.ID, vp, function () {
      timedNotification(assignment.actionOffice.Title + " Completed", 2000);
      // Create a new action
      createAction("Completed", "The assignment has been completed.");

      fetchRequestAssignments();
    });
  };

  // Request Level: Can the current user approve the record?
  self.requestCurUserApprove = ko.pureComputed(function () {
    var flag = false;
    self.requestAssignments().forEach(function (assignment) {
      if (self.assignmentCurUserCanApprove(assignment)) {
        flag = true;
      }
    });
    return flag;
  });

  // Assignment Level: Can the current user approve this assignment
  self.assignmentCurUserCanApprove = function (assignment) {
    var isStatus = assignment.Status == "In Progress";
    var isType = assignment.Role == "Approver";

    if (isType && isStatus) {
      // This is the most intensive check, so let's only perform if the easy
      // ones are true
      return self.assignmentCurUserIsAOorAssignee(assignment);
    } else {
      return false;
    }
  };

  self.assignmentApprove = function (assignment, advance) {
    advance = advance === undefined ? false : advance;
    // Update this assignment with our approval
    var vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Approved"],
      ["ActionTaker", sal.globalConfig.currentUser.get_id()],
    ];

    self.listRefAssignment().updateListItem(assignment.ID, vp, function () {
      timedNotification(assignment.actionOffice.Title + " Approved", 2000);
      // Create a new action
      createAction("Approved", "The request has been approved.");

      fetchRequestAssignments(self.requestID(), function (assignment) {
        if (advance) {
          // Check if there aren't any active assignments
          if (
            self.requestAssignments().every(function (assignment) {
              return !assignment.IsActive;
            })
          ) {
            showAdvancePrompt();
          }
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
    var vp = [
      ["IsActive", 0],
      ["CompletionDate", new Date()],
      ["Status", "Rejected"],
      ["Comment", self.assignmentRejectComment()],
    ];

    self
      .listRefAssignment()
      .updateListItem(self.assignmentRejectAssignment().ID, vp, function () {
        timedNotification(
          self.assignmentRejectAssignment().actionOffice.Title + " Approved",
          2000
        );
        // Create a new action
        createAction(
          "Rejected",
          "The request has been rejected with the following comment:\n" +
            self.assignmentRejectComment()
        );
        fetchRequestAssignments();
      });
  };

  self.assignmentCurUserCanRemove = function (assignment) {
    if (!vm.requestIsActive()) {
      return false;
    }
    return (
      self.assignments
        .assigneeOpts()
        .map(function (assignee) {
          return assignee.ID;
        })
        .indexOf(assignment.actionOffice.ID) >= 0 || self.userIsSysAdmin()
    );
  };

  self.assignmentRemove = function (assignment) {
    console.log("deleting assignee", assignment);
    self.listRefAssignment().deleteListItem(assignment.ID, function () {
      timedNotification(assignment.actionOffice.Title + " Removed", 2000);
      self.allAssignments(
        self.allAssignments().filter(function (allAssignment) {
          return allAssignment.ID != assignment.ID;
        })
      );
      fetchRequestAssignments();
    });
  };

  self.assignOfficeRemove = function (assignment) {
    self.requestOrgs(
      self.requestOrgs().filter(function (ao) {
        return ao.ID != assignment.ID;
      })
    );
  };

  self.assignActionOffice = ko.observable();
  self.assignAssignee = ko.observable();

  self.assignRequestOffice = ko.observable();

  /************************************************************
   * ADMIN: Advance
   ************************************************************/

  self.promptAdvanceMessage = ko.pureComputed(function () {
    // Check if we have any open assignments or if we can just
    // advance.
    var openAssignments = self
      .requestAssignments()
      .filter(function (assignment) {
        return assignment.IsActive;
      });

    if (openAssignments.length > 0) {
      return (
        "<p>This request still has " +
        openAssignments.length +
        " open assignments.</p>" +
        "<p>Are you sure you wish to continue?</p>"
      );
    } else {
      return (
        "<p>All the required actions have been completed for current stage.</p>" +
        "<p> This request is ready to be advanced.</p>"
      );
    }
  });

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
                  assignment.Role == roleOpts.Resolver.Name ||
                  assignment.Role == roleOpts.Approver.Name
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
  self.showActionsTable = ko.pureComputed(function () {
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
  self.listRefDateRanges = ko.observable();
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
    read: function () {
      var orders = new Object();
      self.allOrders().forEach(function (order) {
        orders[order.Title] = self
          .allAssignments()
          .filter(function (assignment) {
            return assignment.Title == order.Title;
          });
      });
      return orders;
    },
  });

  /************************************************************
   * My Orders Tab
   ************************************************************/

  self.showRequestAssignments = ko.observable(true);

  self.readRequestAssignments = function (req) {
    return ko.computed(function () {
      return req
        ? self.allRequestAssignmentsMap()[req.Title]
        : self.allRequestAssignmentsMap()[self.requestID()];
    });
  };

  self.allOfficeOrders = ko.pureComputed(function () {
    var orgs = self.userActionOfficeMembership().map(function (ao) {
      return ao.RequestOrg.get_lookupValue();
    });
    // Get the types of orders we're responsible for based on the ConfigServiceType

    if (self.adminAllOrdersBool()) {
      // All order option checked
      return self.allOrders();
    } else if (orgs.length > 0) {
      // we're in an action office
      var officeOrders = self.allOrders().filter(function (order) {
        return order.RequestOrgs.find(function (ro) {
          return orgs.indexOf(ro.get_lookupValue()) >= 0;
        });
      });

      return officeOrders;
    } else {
      // We're some other approver, filter based off assignments
      return self.assignedOrders();
    }
  });

  self.allOpenOrders = ko.pureComputed(function () {
    return self.allOrders().filter(function (req) {
      return req.RequestStatus == "Open";
    });
  });

  self.allClosedOrders = ko.pureComputed(function () {
    return self.allOrders().filter(function (req) {
      return req.RequestStatus == "Closed";
    });
  });

  self.allCancelledOrders = ko.pureComputed(function () {
    return self.allOrders().filter(function (req) {
      return req.RequestStatus == "Cancelled";
    });
  });

  // For the admin dash, we'll need to limit these to the current
  // users office + in addition too, as well as which they're assigned.
  self.officeAllOpenOrders = ko.pureComputed(function () {
    return self.allOfficeOrders().filter(function (req) {
      return req.RequestStatus == "Open";
    });
  });

  self.officeAllClosedOrders = ko.pureComputed(function () {
    return self.allOfficeOrders().filter(function (req) {
      return req.RequestStatus == "Closed";
    });
  });

  self.officeAllCancelledOrders = ko.pureComputed(function () {
    return self.allOfficeOrders().filter(function (req) {
      return req.RequestStatus == "Cancelled";
    });
  });

  /************************************************************
   * allOpenOrders Table Handlers
   ************************************************************/
  self.showWorkOrder = function (request) {
    console.log("clicked", request);
    viewWorkOrderItem(request.Title);
  };

  self.getRequestStage = function (request) {
    var curStage = selectPipelineById(request.ServiceType.get_lookupId()).find(
      function (step) {
        return step.Step == request.RequestStage;
      }
    );
    return curStage ? curStage.Title : "Closed";
  };

  self.estimateClosingDate = function (request) {
    // TODO: Add the holidays list in here somewhere
    console.log("est closing date", request);
    if (!request.EstClosedDate) {
      var daysOffset = self.configServiceTypes().find(function (stype) {
        return stype.ID == request.ServiceType.get_lookupId();
      }).DaysToCloseBusiness;

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
    } else if (days < 5) {
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

  self.lookupServiceTypeOptions = ko.pureComputed(function () {
    // return only the options that are available
    var uniqueSet = new Set(
      self.allOrders().map(function (order) {
        return order.ServiceType.get_lookupValue();
      })
    );

    var unique = [];
    uniqueSet.forEach(function (item) {
      unique.push(item);
    });
    return self.configServiceTypes().filter(function (stype) {
      return unique.indexOf(stype.Title) >= 0;
    });
  });

  self.lookupTables = ko.observableArray();

  self.lookupTableCol = ko.observableArray([]);

  self.lookupServiceType.subscribe(function (stype) {
    // First verify we have a valid servicetype that hasn't already been
    // looked up.
    // This whole thing should probably be refactored. Should we do tables on
    // a service type level?
    if (
      stype != undefined &&
      !self.lookupTables().find(function (tstype) {
        return tstype.stype.UID == stype.UID;
      })
    ) {
      self.lookupTableCol([]);

      var newServiceTable = new Object();
      newServiceTable.id = stype.UID + "-lookup-table";
      newServiceTable.stype = stype;

      newServiceTable.cols = new Array();
      newServiceTable.requests = new Array();

      if (stype.listDef) {
        var lookupKeys = Object.keys(stype.listDef.viewFields).filter(function (
          col
        ) {
          return col != "ID" && col != "Title";
        });

        newServiceTable.cols = lookupKeys;
        newServiceTable.viewFields = stype.listDef.viewFields;
      }

      var camlq =
        '<View Scope="RecursiveAll"><Query><Where><Eq>' +
        '<FieldRef Name="ServiceType" LookupId="TRUE"/>' +
        '<Value Type="Lookup">' +
        stype.ID +
        "</Value>" +
        "</Eq></Where></Query></View>";

      self.listRefWO().getListItems(camlq, function (lookupOrdersTemp) {
        if (stype.listDef) {
          // If this request type has related orders, let's query those
          var count = lookupOrdersTemp.length - 1;
          var i = 0;
          lookupOrdersTemp.forEach(function (order) {
            var camlq =
              '<View Scope="RecursiveAll"><Query><Where><And>' +
              '<Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq>' +
              "<Eq>" +
              '<FieldRef Name="Title"/>' +
              '<Value Type="Text">' +
              order.Title +
              "</Value>" +
              "</Eq></And></Where></Query></View>";

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

  self.lookupServiceTypeListDef = ko.pureComputed(function () {
    return self.lookupServiceType().listDef;
  });

  self.lookupParseText = function (col, viewFields, item) {
    var targetValue = item ? item[col] : "";
    // If there's a value for this field
    if (targetValue) {
      // Parse the type of val and return text
      switch (viewFields[col].type) {
        case "RichText":
          return $(targetValue).text();
          break;
        case "DateTime":
          return new Date(targetValue).toLocaleDateString();
          break;
        case "Person":
          return targetValue.get_lookupValue();
          break;
        default:
          return targetValue;
      }
    }
  };

  /************************************************************
   * Assigned Orders Tab
   ************************************************************/
  self.myAssignments = ko.pureComputed(function () {
    //we have two types of assignments
    // 1. Assigned to our action office
    // 2. One we are listed as the Assignee one
    var myAOIDs = self.userActionOfficeMembership().map(function (ao) {
      return ao.ID;
    });
    return self.allAssignments().filter(function (asg) {
      if (myAOIDs.indexOf(asg.actionOffice.ID) >= 0) {
        return true;
      } else if (asg.Assignee) {
        return (
          asg.Assignee.get_lookupId() == sal.globalConfig.currentUser.get_id()
        );
      }
      return false;
    });
  });

  self.assignedOrders = ko.pureComputed(function () {
    var myAssignedIds = [];

    self.myAssignments().map(function (asg) {
      if (myAssignedIds.indexOf(asg.Title) < 0) {
        myAssignedIds.push(asg.Title);
      }
    });

    return self.allOrders().filter(function (order) {
      return myAssignedIds.indexOf(order.Title) >= 0;
    });
  });

  self.assignedOpenOrders = ko.pureComputed(function () {
    var myAssignedIds = [];

    self.myAssignments().map(function (asg) {
      if (myAssignedIds.indexOf(asg.Title) < 0) {
        myAssignedIds.push(asg.Title);
      }
    });

    return self.allOpenOrders().filter(function (order) {
      return myAssignedIds.indexOf(order.Title) >= 0;
    });
  });

  self.assignmentStatus = function (asgTitle) {
    return ko.computed(function () {
      var asgs = self.myAssignments().filter(function (masg) {
        return masg.Title == asgTitle;
      });
      if (asgs.length > 1) {
        var statuses = new Array();
        statuses.push("<ul>");
        var states = [];
        // Get all the unique statusi
        asgs.map(function (asg) {
          if (states.indexOf(asg.Status) < 0) {
            states.push(asg.Status);
          }
        });
        // states.map(function (item) {
        //   return item;
        // });

        states.forEach(function (status) {
          statuses.push(
            "<li>" +
              status +
              ": " +
              asgs.filter(function (asg) {
                return asg.Status == status;
              }).length +
              "</li>"
          );
        });
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
  // self.currentView.subscribe(function(val)  {
  //   self.setFieldState();
  // });

  self.setFieldState = ko.computed(function () {
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
        "View " + attachment.Title,
        { id: attachment.ID },
        function () {
          fetchAttachments;
        }
      );
  };

  self.attachmentRemove = function (attachment) {
    console.log("removing attachment");
    self
      .libRefWODocs()
      .updateListItem(attachment.ID, [["IsActive", 0]], function () {
        return fetchAttachments();
      });
  };

  self.attachmentMessage = ko.pureComputed(function () {
    var attachmentCnt = self.selectedServiceType().AttachmentsRequiredCnt;

    if (!attachmentCnt) {
      return "This service type has no required attachments.";
    } else if (attachmentCnt > 0) {
      return (
        "This service type has " + attachmentCnt + " required attachments."
      );
    } else {
      return "This service type has required attachments.";
    }
  });

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
    var newServiceType = self.configServiceTypes().find(function (stype) {
      return stype.UID == uid;
    });
    if (newServiceType) {
      self.selectedServiceType(newServiceType);
    } else {
      timedNotification("Error selecting service type: " + uid);
    }
  };

  self.getServiceTypeByUID = function (uid) {
    return self.configServiceTypes().find(function (stype) {
      return stype.UID == uid;
    });
  };

  self.selectedServiceType.subscribe(function (stype) {
    self.requestShowDescription(false);
    if (stype && stype.listDef) {
      clearValuePairs(stype.listDef.viewFields);
    }
  });

  // return the selected service type pipeline
  self.selectedPipeline = ko.pureComputed(function () {
    if (self.selectedServiceType()) {
      return selectPipelineById(self.selectedServiceType().ID).sort(function (
        a,
        b
      ) {
        return a.Step - b.Step;
      });
    }
  });

  self.selectedPipelineElement = ko.pureComputed(function () {
    if (!self.selectedServiceType()) return "<div>No Service Selected</div>";
    // TODO: Fix all this for the current pipeline.
    //Based off the currently selected record and record type, show a pipeline of where we're at in the process at the top of the page.
    var pipeline = '<div class="ui mini ordered steps">';

    // First step is editing, this is always checked
    var inDraft = self.requestStatus() == "Draft" ? "active" : "completed";

    pipeline +=
      '<div class="step completed"><div class="conent"><i class="fa fa-4x ' +
      self.selectedServiceType().Icon +
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
    var curStage = parseInt(self.requestStageNum());
    $.each(self.selectedPipeline(), function (item, stage) {
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

    var completeStatus = status == "completed" ? status : "disabled";
    // Replace status with Request closed status?
    pipeline +=
      '<div class="step ' +
      completeStatus +
      '">' +
      '<div class="content">' +
      '<div class="title">Closed</div>' +
      '<div class="description">Request Closed</div>' +
      "</div></div></div>";

    return pipeline;
  });

  function selectPipelineById(stypeId) {
    // Should we sort here?
    return self.configPipelines().filter(function (pipeline) {
      return pipeline.ServiceType.get_lookupId() == stypeId;
    });
  }

  // Track the number of loaded list items for initialization process
  self.loadedListItemLists = ko.observable(0);

  self.incLoadedListItems = function () {
    self.loadedListItemLists(self.loadedListItemLists() + 1);
  };

  self.loadedListItemLists.subscribe(function (val) {
    var NUM_CONFIG_LISTS = 6;
    var NUM_PREFETCH_LISTS = 2;
    var TOTAL_LISTS_TO_LOAD = NUM_CONFIG_LISTS + NUM_PREFETCH_LISTS;
    if (val == TOTAL_LISTS_TO_LOAD) {
      initServiceTypes();
    }
  });

  /************************************************************
   * Selected Work Order
   ************************************************************/
  self.requestLink = ko.pureComputed(function () {
    var link =
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/app.aspx?tab=order-detail&reqid=";

    var id = self.requestID() ? self.requestID() : "";
    return link + id;
  });

  self.requestLinkAdmin = ko.pureComputed(function () {
    var link =
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/admin.aspx?tab=order-detail&reqid=";

    var id = self.requestID() ? self.requestID() : "";
    return link + id;
  });

  self.requestLinkAdminApprove = function (id) {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/approval.aspx?assignment=" +
      id +
      "&reqid=" +
      self.requestID()
    );
  };

  self.requestLinkAdminReject = function (id) {
    return (
      _spPageContextInfo.webAbsoluteUrl +
      "/Pages/approval.aspx?assignment=" +
      id +
      "&reqid=" +
      self.requestID() +
      "&reject=true"
    );
  };

  /************************************************************
   * Observables for work order Folders
   ************************************************************/
  self.requestFolderPath = ko.pureComputed(function () {
    return self.requestorOffice().Title + "/" + self.requestID();
  });

  self.requestFolderPerms = ko.pureComputed(function () {
    // These offices do not share info among all members
    var restrictedRequestingOffices = ["CGFS"];

    var folderPermissions = [
      ["workorder Owners", "Full Control"],
      ["Restricted Readers", "Restricted Read"],
    ];

    if (vm.requestor.user()) {
      folderPermissions.push([
        vm.requestor.user().userName,
        "Restricted Contribute",
      ]);
    }
    //TODO: Maybe validate based off the author.

    if (restrictedRequestingOffices.indexOf(vm.requestorOffice().Title) < 0) {
      folderPermissions.push([
        vm.requestorOffice().ROGroup.get_lookupValue(),
        "Restricted Contribute",
      ]);
    }

    self.selectedPipeline().forEach(function (stage) {
      // first get the action office
      // TODO: DEPRECATE action office

      var assignedOffice = self.configActionOffices().find(function (ao) {
        return ao.ID == stage.ActionOffice.get_lookupId();
      });

      var assignedOrg = self.configRequestOrgs().find(function (ro) {
        return ro.ID == assignedOffice.RequestOrg.get_lookupId();
      });

      // Break access based on "BreakAccess" flag on Request Org
      // Yes: Grant Access to Action Office UserAddress Only
      // No: Grant Access to Request Org UserGroup
      if (assignedOrg.BreakAccess) {
        var assignee = assignedOffice.UserAddress.get_lookupValue();
      } else {
        var assignee = assignedOrg.UserGroup.get_lookupValue();
      }

      if (assignee) {
        folderPermissions.push([assignee, "Restricted Contribute"]);
      }

      //If there's a wildcard assignee, get them too
      if (stage.WildCardAssignee) {
        var user = self[stage.WildCardAssignee].userName();
        if (user) {
          folderPermissions.push([user, "Restricted Contribute"]);
        }
      }
    });
    return folderPermissions;
  });

  self.request.pipeline.allActionOffices = ko.pureComputed(function () {
    // Return all the action offices associated with this request.
    return self.selectedPipeline().map(function (stage) {
      // Find the corresponding Action office for each stage
      return self.configActionOffices().find(function (ao) {
        return ao.ID == stage.ActionOffice.get_lookupId();
      });
    });
  });

  self.request.pipeline.allRequestOrgs = ko.pureComputed(function () {
    return self.request.pipeline
      .allActionOffices()
      .map(function (assignedOffice) {
        return self.configRequestOrgs().find(function (ro) {
          return ro.ID == assignedOffice.RequestOrg.get_lookupId();
        });
      });
  });

  /************************************************************
   * Observables for work order header
   ************************************************************/
  self.requestSvcTypeListBool = ko.pureComputed(function () {
    return self.requestSvcTypeListDef() ? true : false;
  });

  self.requestSvcTypeListDef = ko.pureComputed(function () {
    return self.selectedServiceType()
      ? self.selectedServiceType().listDef
        ? self.selectedServiceType().listDef
        : null
      : null;
  });

  self.requestSvcTypeListViewFields = ko.pureComputed(function () {
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
      var stage = self.selectedPipeline().find(function (stage) {
        return stage.Step == self.requestStageNum();
      });

      return stage ? stage : { Step: self.requestStageNum(), Title: "Closed" };
    } else {
      return "";
    }
  });

  self.requestStageOrg = ko.pureComputed(function () {
    if (!self.requestStage() || !self.requestIsActive()) {
      return null;
    } else if (self.requestStage().RequestOrg) {
      return self.configRequestOrgs().find(function (ro) {
        return ro.ID == self.requestStage().RequestOrg.get_lookupId();
      });
    } else if (self.requestStageOffice()) {
      return self.configRequestOrgs().find(function (ro) {
        return ro.ID == self.requestStageOffice().RequestOrg.get_lookupId();
      });
    } else {
      return null;
    }
  });

  self.requestStageOffice = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().ActionOffice) {
      return self.configActionOffices().find(function (ao) {
        return ao.ID == self.requestStage().ActionOffice.get_lookupId();
      });
    } else {
      return null;
    }
  });

  // Requestor/Header Info
  self.requestor = new PeopleField();
  self.requestorName = ko.observable();
  self.requestorTelephone = ko.observable();
  self.requestorEmail = ko.observable();
  self.requestorManager = new PeopleField();
  self.requestorSupervisor = new PeopleField();

  self.requestOrgs = ko.observableArray([]);

  self.requestOrgIds = ko.pureComputed({
    read: function () {
      var vps = new Array();
      self.requestOrgs().forEach(function (ao) {
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
      var aoffices = self.configActionOffices();
      var vps = new Array();
      self.requestAssignments().forEach(function (ao) {
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
    var userArr = new Array();
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
          self.configRequestingOffices().find(function (ro) {
            return ro.ID == value.get_lookupId();
          })
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
      var groupIds = self.userGroupMembership().map(function (ug) {
        return ug.ID;
      });
      var activeFilteredRO = self
        .configRequestingOffices()
        .filter(function (ro) {
          return ro.Active;
        }) //Check if we're active
        .filter(function (ro) {
          return groupIds.indexOf(ro.ROGroup.get_lookupId()) >= 0;
        });

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
          self.configServiceTypes().find(function (stype) {
            return stype.ID == value.get_lookupId();
          })
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
//   var result = ko.pureComputed({
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
    var obs = valueAccessor();
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
      var observable = valueAccessor().user;
      var userJSObject = pickerElement.GetControlValueAsJSObject()[0];
      if (userJSObject) {
        ensureUser(userJSObject.Key, function (user) {
          var userObj = new Object();
          userObj["ID"] = user.get_id();
          userObj["userName"] = user.get_loginName();
          userObj["isEnsured"] = true;
          userObj["ensuredUser"] = user;
          userObj["title"] = user.get_title();
          observable(userObj);
        });
      } else {
        observable(null);
      }
      //observable(pickerElement.GetControlValueAsJSObject()[0]);
      //console.log(JSON.stringify(pickerElement.GetControlValueAsJSObject()[0]));
    };

    //  TODO: You can provide schema settings as options
    var mergedOptions = Object.assign(schema, obs.schemaOpts);

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
    var userValue = ko.utils.unwrapObservable(valueAccessor().user);
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

ko.unapplyBindings = function ($node, remove) {
  remove = remove === undefined ? false : remove;
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
