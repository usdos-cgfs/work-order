var Workorder = window.Workorder || {};

function InitNotifications() {
  Workorder.Notifications = new Workorder.NewNotifications();
}

Workorder.NewNotifications = function () {
  function newWorkorderEmailUser() {
    // 2. Send email to user, letting them know their request has been created
    var toUser = [sal.globalConfig.currentUser];

    var subject =
      "Work Order -New- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var requestOrgs = vm.selectedServiceType().RequestOrgs.map(function (ro) {
      return vm.configRequestOrgs().find(function (cro) {
        return cro.ID == ro.get_lookupId();
      });
    });

    var bodyUser =
      "You're " +
      vm.selectedServiceType().Title +
      " request  has been successfully submitted.</br></br>" +
      '<a href="' +
      vm.requestLink() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "Estimated business days to close this request type: " +
      vm.selectedServiceType().DaysToCloseBusiness +
      "<br><br>" +
      "This request will be serviced by: <br>" +
      requestOrgs.map(function (ro) {
        return ro.Title + " - <br>" + ro.ContactInfo + "<br><br>";
      }) +
      "To view the request, please click the link above, or copy and paste the below URL into your browser:" +
      "<br><br>" +
      vm.requestLink();

    createEmail(toUser, [], [], subject, bodyUser);
  }

  function newWorkorderEmailActionOffices() {
    // 1. Send emails to request orgs letting them know there's a new email.
    var to = vm
      .requestOrgs()
      .map(function (ao) {
        return vm.configRequestOrgs().find(function (aoid) {
          return aoid.ID == ao.ID;
        });
      })
      .map(function (aoids) {
        return aoids.UserGroup;
      });

    var subject =
      "Work Order -New- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var body =
      "Greetings Colleagues,<br><br> A new service request has been opened requiring your attention:<br>" +
      '<a href="' +
      vm.requestLinkAdmin() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "Estimated business days to close this request type: " +
      vm.selectedServiceType().DaysToCloseBusiness +
      "<br><br>" +
      "This request will be serviced by: " +
      vm.selectedServiceType().RequestOrgs.get_lookupValue() +
      "<br>" +
      "To view the request, please click the link above, or copy and paste the below URL into your browser:" +
      "<br><br>" +
      vm.requestLinkAdmin();

    createEmail(to, [], [], subject, body);
  }

  function workorderReminderEmails(id) {
    if (vm.selectedServiceType().ReminderDays) {
      // If we have reminders create our New Work Order Email
      var to = vm
        .requestOrgs()
        .map(function (ao) {
          vm.configRequestOrgs().find(function (aoid) {
            return aoid.ID == ao.ID;
          });
        })
        .map(function (aoids) {
          return aoids.UserGroup;
        });

      var days = vm.selectedServiceType().ReminderDays.split(",");

      days.forEach(function (day) {
        var intDay = parseInt(day);

        var sendDate = businessDaysFromDate(vm.requestEstClosed(), intDay);
        if (sendDate > new Date()) {
          var reminder = intDay > 0 ? intDay + " Day " : "";

          var subject =
            "Work Order -" +
            reminder +
            "Reminder- " +
            vm.selectedServiceType().Title +
            " - " +
            vm.requestID();

          var body =
            "Greetings Colleagues,<br><br> This is a " +
            reminder +
            "reminder for the following " +
            " service request requiring your attention:<br> " +
            '<a href="' +
            vm.requestLinkAdmin() +
            '" target="blank">' +
            vm.requestID() +
            "</a> - " +
            vm.selectedServiceType().Title +
            "<br><br> " +
            "This request has an estimated completion date of: " +
            vm.requestEstClosed().toDateString() +
            "<br><br>" +
            "To view the request, please click the link above," +
            " or copy and paste the below URL into your browser: <br> " +
            vm.requestLinkAdmin();

          createEmail(to, [], [], subject, body, sendDate, id);
        }
      });
    }
  }

  function breakingPermissionsTimeout() {
    //TODO email cgfssharepoint that a timeout occurred.
  }

  function newAssignmentNotification(role, id) {
    var to = [];
    if (vm.assignAssignee() && vm.assignAssignee().userName()) {
      to.push(vm.assignAssignee().lookupUser());
    } else if (vm.assignActionOffice() && vm.assignActionOffice().UserAddress) {
      to.push(vm.assignActionOffice().UserAddress);
    }

    var subject =
      "Work Order -" +
      vm.requestStage().Title +
      "- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var body =
      "Greetings Colleagues,<br><br> You have been assigned to the following workorder request by your action office assignor:<br> " +
      '<a href="' +
      vm.requestLinkAdmin() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "To view the request, please click the link above,\
        or copy and paste the below URL into your browser: <br> " +
      vm.requestLinkAdmin();

    var addendum = new String();

    var valuePairs = getValuePairsHuman(
      vm.selectedServiceType().listDef.viewFields
    );
    addendum += "<br><br><ul>";
    if (valuePairs.length) {
      valuePairs.forEach(function (vp) {
        addendum += "<li>" + vp[0] + " - " + vp[1] + "</li>";
      });
    }
    addendum += "</ul>";

    if (role == "Approver") {
      addendum +=
        "<br>Click the link below to quick approve this request:<br> " +
        '<a href="' +
        vm.requestLinkAdminApprove(id) +
        '" target="blank">' +
        vm.requestLinkAdminApprove(id) +
        "</a><br><br>";
      addendum +=
        "<br>Click the link below to quick reject this request:<br> " +
        '<a href="' +
        vm.requestLinkAdminReject(id) +
        '" target="blank">' +
        vm.requestLinkAdminReject(id) +
        "</a><br><br>";
    }

    createEmail(to, [], [], subject, body + addendum);
  }

  function workorderClosedEmail(reason) {
    var to = [vm.requestHeader().Author];
    var cc = vm
      .requestOrgs()
      .map(function (ao) {
        vm.configRequestOrgs().find(function (aoid) {
          return aoid.ID == ao.ID;
        });
      })
      .map(function (aoids) {
        return aoids.UserGroup;
      });

    cc.concat(vm.requestAssignmentsUsers());

    var subject =
      "Work Order -" +
      reason +
      "- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    // Let's switch verbiage
    if (reason == "Closed") {
      reason = "Fulfilled";
    }

    var body =
      "Greetings Colleagues,<br><br> The following service request has been " +
      reason.toLocaleLowerCase() +
      ":<br>" +
      '<a href="' +
      vm.requestLink() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "To view an archive of the request, please click the link above, \
       or copy and paste the below URL into your browser: <br> " +
      vm.requestLinkAdmin() +
      "<br><br>";

    if (reason == "Closed") {
      body += "This request has been succesfully fulfilled.<br><br>";
    } else if (reason == "Cancelled") {
      body +=
        "This request has been cancelled with the following justification:<br>" +
        vm.assignmentRejectComment();
    }
    body +=
      "<b>Note:</b> This request cannot be reactivated. " +
      "To reinitiate, please create a new service request.<br><br>";

    createEmail(to, cc, [], subject, body);
  }

  function pipelineStageNotification() {
    var to = [
      vm.requestStageOffice() ? vm.requestStageOffice().UserAddress : null,
    ];
    if (vm.requestStage().WildCardAssignee) {
      var personName = vm.requestStage().WildCardAssignee;
      // This should be a person field
      try {
        var personObservable = vm[personName];
        to.push(personObservable.lookupUser());
      } catch (err) {
        console.error(
          "Something went wrong fetching " + personName + " from viewmodel: ",
          err
        );
      }
    }

    var cc = new Array();
    if (vm.requestStageOrg()) {
      cc.push(vm.requestStageOrg().UserGroup);
    }

    var subject =
      "Work Order -" +
      vm.requestStage().Title +
      "- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var body =
      "Greetings Colleagues,<br><br> The following service request has changed, requiring your attention:<br> " +
      '<a href="' +
      vm.requestLinkAdmin() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "To view the request, please click the link above, \
       or copy and paste the below URL into your browser: <br> " +
      +vm.requestLinkAdmin();

    createEmail(to, cc, [], subject, body);
  }

  function createEmail(to, cc, bcc, subject, body, sendDate, id) {
    sendDate = sendDate === undefined ? null : sendDate;
    id = id === undefined ? vm.requestHeader().ID : id;

    var toArr = createEmailAddressee(to);
    var ccArr = createEmailAddressee(cc);
    var bccArr = createEmailAddressee(bcc);

    var vp = [
      ["To", toArr],
      ["CC", ccArr],
      ["BCC", bccArr],
      ["Title", subject],
      ["Body", body],
      ["Request", id],
    ];

    if (sendDate) {
      vp.push(["DateToSend", sendDate]);
    }

    vm.listRefWOEmails().createListItem(
      vp,
      function () {
        newEmailCallback(SP.UI.DialogResult.OK, null);
      },
      vm.requestFolderPath()
    );
  }

  function createEmailAddressee(arr) {
    var vps = new Array();

    arr.forEach(function (ao) {
      switch (ao.constructor.getName()) {
        case "SP.FieldUserValue":
          vps.push(ao.get_lookupId());
          vps.push(ao.get_lookupValue());
          break;
        case "SP.User":
          vps.push(ao.get_id());
          vps.push(ao.get_loginName());
          break;
        default:
      }
    });

    return vps.join(";#");
  }
  function newEmailCallback(result, value) {
    console.log("Email created successfully");
  }

  var publicMembers = {
    newWorkorderEmailUser: newWorkorderEmailUser,
    newWorkorderEmailActionOffices: newWorkorderEmailActionOffices,
    workorderReminderEmails: workorderReminderEmails,
    breakingPermissionsTimeout: breakingPermissionsTimeout,
    newAssignmentNotification: newAssignmentNotification,
    workorderClosedEmail: workorderClosedEmail,
    pipelineStageNotification: pipelineStageNotification,
  };

  return publicMembers;
};
