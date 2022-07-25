var Workorder = window.Workorder || {};

function InitNotifications() {
  Workorder.Notifications = new Workorder.NewNotifications();
}

Workorder.NewNotifications = function () {
  function newWorkorderEmailUser() {
    // 2. Send email to user, letting them know their request has been created
    var toUser = [sal.globalConfig.currentUser];
    var toStringArr = [];
    var ccString = [];

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
      "Your " +
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

    createEmail(toUser, toStringArr, [], ccString, [], subject, bodyUser);
  }

  function newWorkorderEmailActionOffices() {
    // 1. Send emails to request orgs letting them know there's a new email.
    // var to = vm
    //   .requestOrgs()
    //   .map(function (ao) {
    //     return vm.configRequestOrgs().find(function (aoid) {
    //       return aoid.ID == ao.ID;
    //     });
    //   })
    //   .map(function (aoids) {
    //     return aoids.UserGroup;
    //   });

    var to = vm.request.pipeline.allActionOffices().map(function (ao) {
      return ao.PreferredEmail ? ao.PreferredEmail : ao.UserAddress;
    });

    var toStringArr = [];
    var ccString = [];

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

    createEmail(to, toStringArr, [], ccString, [], subject, body);
  }

  function workorderReminderEmails(id) {
    if (vm.selectedServiceType().ReminderDays) {
      // If we have reminders create our New Work Order Email
      var to = vm.request.pipeline.allActionOffices().map(function (ao) {
        return ao.PreferredEmail ? ao.PreferredEmail : ao.UserAddress;
      });

      var toStringArr = [];
      var ccString = [];

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

          createEmail(
            to,
            toStringArr,
            [],
            ccString,
            [],
            subject,
            body,
            sendDate,
            id
          );
        }
      });
    }
  }

  function breakingPermissionsTimeout() {
    //TODO email cgfssharepoint that a timeout occurred.
  }

  function newAssignmentNotification(role, id) {
    var to = [];
    // Assigning an individual? Or an Action Office
    if (vm.assignAssignee() && vm.assignAssignee().userName()) {
      to.push(vm.assignAssignee().lookupUser());
    } else if (vm.assignActionOffice() && vm.assignActionOffice().UserAddress) {
      // if tha action office has a preferred email, use it.
      to.push(
        vm.assignActionOffice().PreferredEmail
          ? vm.assignActionOffice().PreferredEmail
          : vm.assignActionOffice().UserAddress
      );
    }

    var toStringArr = [];
    var ccString = [];

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
    var valuePairs = [];
    if (vm.selectedServiceType().listDef) {
      valuePairs = getValuePairsHuman(
        vm.selectedServiceType().listDef.viewFields
      );
    }
    addendum += "<br><br><ul>";
    if (valuePairs.length) {
      valuePairs.forEach(function (vp) {
        addendum += "<li>" + vp[0] + " - " + vp[1] + "</li>";
      });
    }
    addendum += "</ul>";

    // TODO: Fix quick approval
    if (role == "Approver" && false) {
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

    createEmail(to, toStringArr, [], ccString, [], subject, body + addendum);
  }

  function workorderPipelineAssignees() {
    // Get all the action offices and wild cards assigned to this request.
    var users = [];
    var addresses = [];

    vm.request.pipeline.allActionOffices().forEach(function (actionOffice) {
      // Check if we have a wildcard user and they were ensured
      if (actionOffice.WildCardAssignee) {
        try {
          var personObservable = vm[actionOffice.WildCardAssignee];
          users.push(personObservable.lookupUser());
        } catch (err) {
          console.error(
            "Something went wrong fetching " + personName + " from viewmodel: ",
            err
          );
        }
        //users.push(self[actionOffice.WildCardAssignee]().lookupUser());
      }

      if (actionOffice.PreferredEmail) {
        addresses.push(actionOffice.PreferredEmail);
      } else {
        users.push(actionOffice.UserAddress);
      }
    });

    return { users: users, addresses: addresses };
  }

  function workorderClosedEmail(reason) {
    var to = [vm.requestHeader().Author, vm.requestor.lookupUser()];
    var toStringArr = [];

    var cc = [];
    var ccString = [];

    if (vm.selectedServiceType().EmailPipelineOnClose) {
      var pipelineAssignees = workorderPipelineAssignees();

      cc = pipelineAssignees.users;
      ccString = pipelineAssignees.addresses;
    }
    //TODO: add other assignees here.

    var subject =
      "Work Order -" +
      reason +
      "- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    // Let's switch verbiage
    // if (reason == "Closed") {
    //   reason = "Fulfilled";
    // }

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

    // TODO: Refactor these templates into a list item.
    if (!location.pathname.split("/").includes("wocharleston")) {
      body +=
        "<div style='color: red'>Thank you for utilizing the CGFS/EX Work Order System. " +
        "Please take a moment to complete the survey below and let us know how we did: " +
        '<a href="https://www.surveymonkey.com/r/6LSSY3W">CGFS/EX Survey</a><br><br></div>';
    }
    body +=
      "<b>Note:</b> This request cannot be reactivated. " +
      "To reinitiate, please create a new service request.<br><br>";

    createEmail(to, toStringArr, cc, ccString, [], subject, body);
  }

  function pipelineStageNotification() {
    var emails = getCurrentEmailOffice();
    var to = emails.email;
    var toStringArr = emails.emailString;

    var cc = [];
    var ccString = [];

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
      "To view the request, please click the link above, " +
      "or copy and paste the below URL into your browser: <br> " +
      vm.requestLinkAdmin();

    // Append our valuepairs
    var addendum = new String();
    var valuePairs = [];
    if (vm.selectedServiceType().listDef) {
      valuePairs = getValuePairsHuman(
        vm.selectedServiceType().listDef.viewFields
      );
    }
    addendum += "<br><br><ul>";
    if (valuePairs.length) {
      valuePairs.forEach(function (vp) {
        addendum += "<li>" + vp[0] + " - " + vp[1] + "</li>";
      });
    }
    addendum += "</ul><br>";

    // append our comments
    addendum += "Comments:<br><ul>";
    vm.requestComments().forEach(function (comment) {
      addendum += "<li>" + comment.Comment + "</li>";
    });
    addendum += "</ul>";

    body += addendum;

    createEmail(to, toStringArr, cc, ccString, [], subject, body);
  }

  /**
   * Get's the current pipeline stages action office either preferred email
   * or their user address,
   * If there's a wildcard assignee, add them too.
   * @returns email [], emailString []
   */
  function getCurrentEmailOffice() {
    var email = [];
    var emailString = [];
    if (!vm.requestStageOffice()) {
    } else if (vm.requestStageOffice().PreferredEmail) {
      emailString.push(vm.requestStageOffice().PreferredEmail);
    } else if (vm.requestStageOffice().UserAddress) {
      email.push(vm.requestStageOffice().UserAddress);
    }

    if (vm.requestStage().WildCardAssignee) {
      var personName = vm.requestStage().WildCardAssignee;
      // This should be a person field
      try {
        var personObservable = vm[personName];
        email.push(personObservable.lookupUser());
      } catch (err) {
        console.error(
          "Something went wrong fetching " + personName + " from viewmodel: ",
          err
        );
      }
    }
    return { email, emailString };
  }

  /**
   * recordStatusNotification
   *
   * Intended for "Notification" pipeline stages. Link to app page.
   */
  function recordStatusNotification() {
    var emails = getCurrentEmailOffice();
    var to = emails.email;
    var toStringArr = emails.emailString;

    var cc = [];
    var ccString = [];

    var subject =
      "Work Order -" +
      vm.requestStage().Title +
      "- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var body =
      "Greetings Colleagues,<br><br> This is a courtesy notification for the following record. No action is required:<br> " +
      '<a href="' +
      vm.requestLink() +
      '" target="blank">' +
      vm.requestID() +
      "</a> - " +
      vm.selectedServiceType().Title +
      "<br><br>" +
      "To view the request, please click the link above, " +
      "or copy and paste the below URL into your browser: <br> " +
      vm.requestLink();

    // Append our valuepairs
    var addendum = new String();
    var valuePairs = [];
    if (vm.selectedServiceType().listDef) {
      valuePairs = getValuePairsHuman(
        vm.selectedServiceType().listDef.viewFields
      );
    }
    addendum += "<br><br><ul>";
    if (valuePairs.length) {
      valuePairs.forEach(function (vp) {
        addendum += "<li>" + vp[0] + " - " + vp[1] + "</li>";
      });
    }
    addendum += "</ul><br>";

    // append our comments
    addendum += "Comments:<br><ul>";
    vm.requestComments().forEach(function (comment) {
      addendum += "<li>" + comment.Comment + "</li>";
    });
    addendum += "</ul>";

    body += addendum;

    createEmail(to, toStringArr, cc, ccString, [], subject, body);
  }

  function sendCommentNotification(comment) {
    var emails = getCurrentEmailOffice();
    var to = emails.email;
    var toStringArr = emails.emailString;

    to.push(sal.globalConfig.currentUser);
    to.push(vm.requestor.lookupUser());

    var subject =
      "Work Order -New Comment- " +
      vm.selectedServiceType().Title +
      " - " +
      vm.requestID();

    var body = `${sal.globalConfig.currentUser.get_title()} has left a new comment on <a href="${vm.requestLink()}" target="blank">${vm.requestID()}</a>:<br><br>`;

    body += comment.Comment;

    createEmail(to, toStringArr, [], [], [], subject, body);
  }

  function createEmail(
    to,
    toStringArr,
    cc,
    ccString,
    bcc,
    subject,
    body,
    sendDate,
    id
  ) {
    sendDate = sendDate === undefined ? null : sendDate;
    id = id === undefined ? vm.requestHeader().ID : id;

    var toArr = createEmailAddressee(to);
    var ccArr = createEmailAddressee(cc);
    var bccArr = createEmailAddressee(bcc);

    var vp = [
      ["To", toArr],
      ["ToString", toStringArr.join(";")],
      ["CC", ccArr],
      ["CCString", ccString.join(";")],
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

    if (arr) {
      arr.forEach(function (ao) {
        if (ao) {
          switch (ao.constructor.getName()) {
            case "SP.FieldUserValue":
              vps.push(ao.get_lookupId());
              vps.push(ao.get_lookupValue());
              break;
            case "SP.User":
              vps.push(ao.get_id());
              vps.push(ao.get_loginName());
              break;
            case "SP.Group":
              vps.push(ao.get_id());
              vps.push(ao.get_loginName());
              break;
            default:
          }
        }
      });
      return vps.join(";#");
    }
  }
  function newEmailCallback(result, value) {
    console.log("Email created successfully");
  }

  var publicMembers = {
    newWorkorderEmailUser: newWorkorderEmailUser,
    newWorkorderEmailActionOffices: newWorkorderEmailActionOffices,
    workorderReminderEmails: workorderReminderEmails,
    workorderPipelineAssignees: workorderPipelineAssignees,
    breakingPermissionsTimeout: breakingPermissionsTimeout,
    newAssignmentNotification: newAssignmentNotification,
    workorderClosedEmail: workorderClosedEmail,
    pipelineStageNotification: pipelineStageNotification,
    recordStatusNotification: recordStatusNotification,
    sendCommentNotification: sendCommentNotification,
  };

  return publicMembers;
};
