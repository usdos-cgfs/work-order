Workorder = window.Workorder || new Object();
Workorder.Deployment = Workorder.Deployment || new Object();

// Set up our lists/libraries default states etc.
function addActionOfficeUsersToGroups() {
  let arrays = new Object();
  vm.configActionOffices().forEach((ao) => {
    if (ao.UserAddress) {
      console.log(
        `finding ${ao.ID}: ${ao.Title} - ${ao.UserAddress.get_lookupValue()}`
      );
      //Get the request org group
      let reqOrg = vm
        .configRequestOrgs()
        .find((ro) => ro.ID == ao.RequestOrg.get_lookupId());

      //Add the users to the group
      if (reqOrg) {
        if (!arrays[reqOrg.Title]) {
          arrays[reqOrg.Title] = new Object();
          arrays[reqOrg.Title].group = reqOrg.UserGroup.get_lookupValue();
          arrays[reqOrg.Title].arr = new Array();
        }
        arrays[reqOrg.Title].arr.push(ao.UserAddress.get_lookupValue());

        new sal.addUsersToGroup(
          [ao.UserAddress.get_lookupValue()],
          reqOrg.UserGroup.get_lookupValue()
        );
      }
    }
  });
  arrays.forEach((ro) => {
    new sal.addUsersToGroup(ro.arr, ro.group);
  });
}

function loadListDefsToSP() {
  $.each(woViews, function (name, view) {
    //vm["listRef" + name]().setValuePairs(["ListDef", JSON.stringify(view.listDef]));

    if (view.spid && view.spid != null) {
      console.log("Saving: ", view.name);
      vm.listRefConfigServiceType().updateListItem(
        view.spid,
        [["ListDef", JSON.stringify(view.listDef)]],
        () => console.log("saved")
      );
    }
  });
}

function loadPipelinesToSP() {
  $.each(vm.configServiceTypes(), function (index, serviceType) {
    console.log(serviceType);
    let vp = [
      ["Title", "Assigned"],
      ["ServiceType", serviceType.ID.toString()],
      ["Step", 2],
      ["ActionType", "Pending Resolution"],
    ];
    vm.listRefConfigPipelines().createListItem(vp, function (idx) {
      console.log("Index Created", idx);
    });
  });
}

function buildROFoldersServiceTypes() {
  // Build a folder for each Requesting Office in each of our lists
  window.alert = function () {};
  vm.configServiceTypes().forEach((stype) => {
    if (stype.listRef) {
      console.log("Creating ", stype.Title);
      buildROFolders(stype.listRef);
    }
  });
}

function buildROFoldersAssocLists() {
  buildROFolders(vm.listRefAction());
  buildROFolders(vm.listRefApproval());
  buildROFolders(vm.listRefAssignment());
  buildROFolders(vm.listRefComment());
  buildROFolders(vm.listRefWO());
  buildROFolders(vm.libRefWODocs());
  buildROFolders(vm.listRefWOEmails());
}

function buildROFolders(listRef) {
  // Build a folder for each Requesting Office in each of our lists
  window.alert = function () {};

  let actionOffices = [
    ...new Set(
      vm.configRequestOrgs().map((ro) => ro.UserGroup.get_lookupValue())
    ),
  ];

  vm.configRequestingOffices().forEach((ro) => {
    let vp = [[]];
    listRef.createListFolder(ro.Title, (id) => {
      console.log(`Create Folder Success:  ${ro.Title} id: ${id}`);
      let vp = [[ro.ROGroup.get_lookupValue(), "Restricted Contribute"]];
      vp.push(["workorder Owners", "Full Control"]);
      vp.push(["workorder Members", "Contribute"]);
      actionOffices.forEach((ao) => vp.push([ao, "Restricted Contribute"]));
      listRef.setItemPermissions(id, vp);
      console.log(`Setting Permissions: ${vp[0][0]} - ${vp[0][1]}`);
    });
  });
}

function createROGroups() {
  // Create a group for each RO and assign the restricted read role.
  vm.configRequestingOffices().forEach((ro) => {
    createSiteGroup("RO_" + ro.Title, ["Restricted Read"], "workorder Owners");
  });
}
function syncListDefs() {
  let cnt = 0;
  vm.listDefs().forEach((listDef) => {
    let strListDef = JSON.stringify(listDef);
    let stype = vm
      .configServiceTypes()
      .find((stype) => stype.UID == listDef.uid);
    if (stype.ListDef != strListDef) {
      cnt++;
      //Our listdefs don't match, update the sharepoint item.
      vm.listRefConfigServiceType().updateListItem(
        stype.ID,
        [["ListDef", strListDef]],
        () => {
          console.log("updated: ", stype.Title);
          if (!--cnt) {
            alert("Synchronized all lists, reloading");
            location.reload();
          }
        }
      );
    }
  });
}

Workorder.Deployment.NewPipelinesCharleston = function () {
  let pipelineDefs = new Object();
  pipelineDefs.ch_equip_repair = [
    [
      ["Step", 1],
      ["Title", "Supervisor Approval"],
      ["ServiceType", 32],
      ["ActionType", "Pending Approval"],
      ["ActionOffice", 15], //ADO
      ["RequestOrg", 5], //ADO
      ["WildCardAssignee", "repairSupervisor"],
    ],
    [
      ["Step", 2],
      ["Title", "ADO Approval"],
      ["ServiceType", 32],
      ["ActionType", "Pending Approval"],
      ["ActionOffice", 16],
      ["RequestOrg", 5],
    ],
  ];

  pipelineDefs.ch_hr_classification = [
    [
      ["Step", 1],
      ["Title", "Manager Approval"],
      ["ServiceType", 33],
      ["ActionType", "Pending Approval"],
      ["ActionOffice", 12], // HR
      ["RequestOrg", 6], //ADO
      ["WildCardAssignee", "classificationSupervisor"],
    ],
    [
      ["Step", 2],
      ["Title", "Assignment"],
      ["ServiceType", 33],
      ["ActionType", "Pending Assignment"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
    [
      ["Step", 3],
      ["Title", "Fulfillment"],
      ["ServiceType", 33],
      ["ActionType", "Pending Resolution"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
  ];

  pipelineDefs.ch_hr_personnel_action = [
    [
      ["Step", 1],
      ["Title", "Manager Approval"],
      ["ServiceType", 34],
      ["ActionType", "Pending Approval"],
      ["ActionOffice", 12], // HR
      ["RequestOrg", 6], //ADO
      ["WildCardAssignee", "hrActionSupervisor"],
    ],
    [
      ["Step", 2],
      ["Title", "Assignment"],
      ["ServiceType", 34],
      ["ActionType", "Pending Assignment"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
    [
      ["Step", 3],
      ["Title", "Fulfillment"],
      ["ServiceType", 34],
      ["ActionType", "Pending Resolution"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
  ];

  pipelineDefs.ch_hr_training = [
    [
      ["Step", 1],
      ["Title", "Manager Approval"],
      ["ServiceType", 36],
      ["ActionType", "Pending Approval"],
      ["ActionOffice", 12], // HR
      ["RequestOrg", 6], //ADO
      ["WildCardAssignee", "requestorManager"],
    ],
    [
      ["Step", 2],
      ["Title", "Assignment"],
      ["ServiceType", 36],
      ["ActionType", "Pending Assignment"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
    [
      ["Step", 3],
      ["Title", "Fulfillment"],
      ["ServiceType", 36],
      ["ActionType", "Pending Resolution"],
      ["ActionOffice", 12],
      ["RequestOrg", 6],
    ],
  ];

  function buildAllPipelines() {
    [
      "ch_equip_repair",
      "ch_hr_classification",
      "ch_hr_personnel_action",
      "ch_hr_training",
    ].forEach((type) => {
      pipelineDefs[type].forEach((stage) => {
        vm.listRefConfigPipelines().createListItem(stage, function (id) {
          console.log("Created");
        });
      });
    });
  }

  function buildServicePipeline(serviceUID) {
    pipelineDefs[serviceUID].forEach((stage) => {
      vm.listRefConfigPipelines().createListItem(stage, function (id) {
        console.log("Created");
      });
    });
  }
  let publicMembers = {
    buildServicePipeline,
    buildAllPipelines,
  };
  return publicMembers;
};
