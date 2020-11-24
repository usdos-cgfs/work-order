folderTester = function () {
  let folderId = 0;
  let foo = (folder) => {
    console.log(folder);
    folderId = folder;
  };
  vm.listRefApproval().upsertListFolderPath("test", foo);

  folderId = 178;
  let folderPermissions = [
    [sal.globalConfig.currentUser.get_loginName(), "Restricted Contribute"],
    ["workorder Owners", "Full Control"],
    ["Restricted Readers", "Restricted Read"],
  ];

  vm.listRefApproval().setItemPermissions(
    folderId,
    folderPermissions,
    () => {
      console.log("success");
    },
    true
  );

  var camlq =
    '<View Scope="RecursiveAll"><Query><Where><Eq>' +
    '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
    "</Eq></Where></Query></View>";

  SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
};

loadTester = function () {
  var intervalId;
  var workorderCnt = 0;
  var workorderCntTarget = 0;

  function createWorkOrder() {
    if (vm.currentView() != "new") {
      newWorkOrder();
    }

    $.each(vm.selectedServiceType().listDef.viewFields, function (idx, field) {
      console.log(field);
      if (field.koMap != "empty" && field.koMap != "requestID") {
        switch (field.type) {
          case "Text":
            if (vm[field.koMap + "Opts"]) {
              var obs = vm[field.koMap + "Opts"];
              var opt = Math.floor(Math.random() * obs().length);
              vm[field.koMap](obs()[opt]);
              console.log(
                `text opt ${field.koMap} ${vm[field.koMap + "Opts"]()[opt]}`
              );
            } else {
              console.log("text ", field);
              vm[field.koMap](randString());
            }
            break;

          case "Number":
            vm[field.koMap](Math.floor(Math.random() * 1000));
            break;
          default:
        }
      }
    });

    vm.requestDescriptionHTML(randString());

    saveWorkOrder();
  }

  function createWorkOrderCnt(cnt) {
    workorderCnt = 0;
    workorderCntTarget = cnt;

    intervalId = window.setInterval(function () {
      if (workorderCnt++ < workorderCntTarget) {
        createWorkOrder();
      } else {
        window.clearInterval(intervalId);
        workorderCntTarget = 0;
      }
    }, 5000);
  }

  function randString(length = null) {
    if (!length) {
      length = Math.floor(Math.random() * 200);
    }
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  var publicMembers = {
    createWorkOrder,
    createWorkOrderCnt,
  };

  return publicMembers;
};
