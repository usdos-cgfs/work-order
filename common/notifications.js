var Workorder = window.Workorder || {};

function InitNotifications() {
  Workorder.Notifications = new Workorder.NewNotifications();
}

Workorder.NewNotifications = function () {
  function newWorkorderEmails() {
    // 1. Send emails to request orgs letting them know there's a new email.
    let to = vm
      .requestOrgs()
      .map((ao) => vm.configRequestOrgs().find((aoid) => aoid.ID == ao.ID))
      .map((aoids) => aoids.UserGroup);

    let subject = `Work Order -New- ${
      vm.selectedServiceType().Title
    } - ${vm.requestID()}`;

    let body =
      `Greetings Colleagues,<br><br> A new service request has been opened requiring your attention:<br>` +
      `<a href="${vm.requestLinkAdmin()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLinkAdmin()}`;

    createEmail(to, [], [], subject, body);

    // 2. Send email to user, letting them know their request has been created
    let toUser = [sal.globalConfig.currentUser];

    let subjectUser = subject;

    let bodyUser =
      `You're ${
        vm.selectedServiceType().Title
      } request  has been successfully submitted.</br></br>` +
      `<a href="${vm.requestLink()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLink()}`;

    createEmail(toUser, [], [], subjectUser, bodyUser);
  }

  function workorderReminderEmails(id) {
    if (vm.selectedServiceType().ReminderDays) {
      // If we have reminders create our New Work Order Email
      let to = vm
        .requestOrgs()
        .map((ao) => vm.configRequestOrgs().find((aoid) => aoid.ID == ao.ID))
        .map((aoids) => aoids.UserGroup);

      let days = vm.selectedServiceType().ReminderDays.split(",");

      days.forEach((day) => {
        let intDay = parseInt(day);

        let sendDate = businessDaysFromDate(vm.requestEstClosed(), intDay);
        if (sendDate > new Date()) {
          let reminder = intDay > 0 ? intDay + " Day " : "";

          let subject = `Work Order -${reminder}Reminder- ${
            vm.selectedServiceType().Title
          } - ${vm.requestID()}`;

          let body =
            `Greetings Colleagues,<br><br> This is a ${reminder}reminder for the following` +
            ` service request requiring your attention:<br>` +
            `<a href="${vm.requestLinkAdmin()}" target="blank">${vm.requestID()}</a> - ${
              vm.selectedServiceType().Title
            }<br><br>` +
            `This request has an estimated completion date of: ${vm
              .requestEstClosed()
              .toDateString()}<br><br>` +
            `To view the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
            `${vm.requestLinkAdmin()}`;

          createEmail(to, [], [], subject, body, sendDate, id);
        }
      });
    }
  }

  function breakingPermissionsTimeout() {
    //TODO email cgfssharepoint that a timeout occurred.
  }

  function newAssignmentNotification(role, id) {
    let to = [];
    if (vm.assignAssignee() && vm.assignAssignee().userName()) {
      to.push(vm.assignAssignee().lookupUser());
    } else if (vm.assignActionOffice()) {
      to.push(vm.assignActionOffice().UserAddress);
    }

    let subject = `Work Order -${vm.requestStage().Title}- ${
      vm.selectedServiceType().Title
    } - ${vm.requestID()}`;

    let body =
      `Greetings Colleagues,<br><br> You have been assigned to the following workorder request by your action office assignor:<br>` +
      `<a href="${vm.requestLinkAdmin()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLinkAdmin()}`;
    let addendum = new String();
    if ((role = "Approver")) {
      let valuePairs = getValuePairs(
        vm.selectedServiceType().listDef.viewFields
      );
      addendum += "<br><br><ul>";
      if (valuePairs.length) {
        valuePairs.forEach((vp) => {
          addendum += `<li>${vp[0]} - ${vp[1]}</li>`;
        });
      }
      addendum += "</ul>";
      addendum +=
        `<br>Click the link below to quick approve this request:<br>` +
        `<a href="${vm.requestLinkAdminApprove(
          id
        )}" target="blank">${vm.requestLinkAdminApprove(id)}</a><br><br>`;
      addendum +=
        `<br>Click the link below to quick reject this request:<br>` +
        `<a href="${vm.requestLinkAdminReject(
          id
        )}" target="blank">${vm.requestLinkAdminReject(id)}</a><br><br>`;
    }
    createEmail(to, [], [], subject, body + addendum);
  }

  function workorderClosedEmail(reason) {
    let to = [vm.requestHeader().Author];
    let cc = vm
      .requestOrgs()
      .map((ao) => vm.configRequestOrgs().find((aoid) => aoid.ID == ao.ID))
      .map((aoids) => aoids.UserGroup);

    let subject = `Work Order -${reason}- ${
      vm.selectedServiceType().Title
    } - ${vm.requestID()}`;

    // Let's switch verbiage
    if (reason == "Closed") {
      reason = "Fulfilled";
    }

    let body =
      `Greetings Colleagues,<br><br> The following service request has been ${reason.toLocaleLowerCase()}:<br>` +
      `<a href="${vm.requestLink()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view an archive of the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLinkAdmin()}<br><br>`;

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
    let to = [
      vm.requestStageOffice() ? vm.requestStageOffice().UserAddress : null,
    ];

    let cc = new Array();
    if (vm.requestStageOrg()) {
      cc.push(vm.requestStageOrg().UserGroup);
    }

    let subject = `Work Order -${vm.requestStage().Title}- ${
      vm.selectedServiceType().Title
    } - ${vm.requestID()}`;

    let body =
      `Greetings Colleagues,<br><br> The following service request has changed, requiring your attention:<br>` +
      `<a href="${vm.requestLinkAdmin()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLinkAdmin()}`;

    createEmail(to, cc, [], subject, body);
  }

  function createEmail(
    to,
    cc,
    bcc,
    subject,
    body,
    sendDate = null,
    id = vm.requestHeader().ID
  ) {
    let toArr = createEmailAddressee(to);
    let ccArr = createEmailAddressee(cc);
    let bccArr = createEmailAddressee(bcc);

    let vp = [
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
      () => newEmailCallback(SP.UI.DialogResult.OK, null),
      vm.requestFolderPath()
    );
  }

  function createEmailAddressee(arr) {
    let vps = new Array();

    arr.forEach((ao) => {
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
    newWorkorderEmails,
    workorderReminderEmails,
    breakingPermissionsTimeout,
    newAssignmentNotification,
    workorderClosedEmail,
    pipelineStageNotification,
  };

  return publicMembers;
};
