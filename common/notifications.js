var Workorder = window.Workorder || {};

function InitNotifications() {
  Workorder.Notifications = new Workorder.NewNotifications();
}

Workorder.NewNotifications = function () {
  function newWorkorderEmails() {
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
    }
    createEmail(to, [], [], subject, body + addendum);
  }

  function workorderClosedEmail(reason) {
    let to = vm
      .requestOrgs()
      .map((ao) => vm.configRequestOrgs().find((aoid) => aoid.ID == ao.ID))
      .map((aoids) => aoids.UserGroup);

    let subject = `Work Order -${reason}- ${
      vm.selectedServiceType().Title
    } - ${vm.requestID()}`;

    let body =
      `Greetings Colleagues,<br><br> The following service request has been ${reason.toLocaleLowerCase()}:<br>` +
      `<a href="${vm.requestLinkAdmin()}" target="blank">${vm.requestID()}</a> - ${
        vm.selectedServiceType().Title
      }<br><br>` +
      `To view an archive of the request, please click the link above, or copy and paste the below URL into your browser: <br>` +
      `${vm.requestLinkAdmin()}`;

    createEmail(to, [], [], subject, body);
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
      vps.push(ao.get_lookupId());
      vps.push(ao.get_lookupValue());
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
