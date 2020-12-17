Workorder = window.Workorder || new Object();
Workorder.Deployment = Workorder.Deployment || new Object();

// Set up our lists/libraries default states etc.

Workorder.Deployment.NewPermissions = function () {
  var debug = true;
  /*************************************************** */
  //1. Validate Permission roles exist on site.
  /*************************************************** */
  function validatePermissionRoles() {
    console.log("Validating Site Roles exist");
    sal.config.siteRoles.validate();
  }

  /*************************************************** */
  //2. Validate our Requesting Offices exist on the site and have their folders
  /*************************************************** */
  function validateRequestingOffices() {
    console.log("Validating Requesting Offices Exist");
    var siteGroupArr = sal.globalConfig.siteGroups.map(function (group) {
      return group.title;
    });
    vm.configRequestingOffices().forEach(function (ro) {
      // If the group column hasn't been set, let's check for it and add if not found
      if (!ro.ROGroup) {
        var roTitle = "RO_" + ro.Title;

        // Check we're in the sitegroups first
        if (!siteGroupArr.includes(roTitle)) {
          // Group doesn't exist on site, let's attempt to create.
          console.log(
            "Looks like " +
              roTitle +
              " isn't in the sitegroups, attempting to create."
          );
          sal.utilities.createSiteGroup(roTitle, [
            sal.config.siteRoles.roles.RestrictedContribute,
          ]);
        }
      }
    });

    console.log("Validating Requesting Offices Have folders on assoc lists");

    // Build the RO Folders -
    // The base method buildROFolders is overwrite safe and
    // can be run multiple times.

    //Check that we have a folder on each of our generic lists,
    buildROFoldersAssocLists();

    //Check that we have a folder on each of our generic lists
    buildROFoldersServiceTypes();
  }

  function buildROFoldersServiceTypes() {
    // Build a folder for each Requesting Office in each of our lists
    window.alert = function () {};
    vm.configServiceTypes().forEach(function (stype) {
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

    var requestOrgs = new Set(
      vm.configRequestOrgs().map(function (ro) {
        return ro.UserGroup.get_lookupValue();
      })
    ).map(function (item) {
      return item;
    });

    vm.configRequestingOffices().forEach(function (ro) {
      var vp = [[]];
      listRef.upsertListFolderPath(ro.Title, function (id) {
        console.log("Create Folder Success:  " + ro.Title + " id: " + id);
        var vp = [
          [
            ro.ROGroup.get_lookupValue(),
            sal.config.siteRoles.roles.InitialCreate,
          ],
        ];
        vp.push([
          sal.config.siteGroups.groups.Owners,
          sal.config.siteRoles.roles.FullControl,
        ]);
        vp.push([
          sal.config.siteGroups.groups.Members,
          sal.config.siteRoles.roles.RestrictedContribute,
        ]);
        vp.push([
          sal.config.siteGroups.groups.RestrictedReaders,
          sal.config.siteRoles.roles.RestrictedContribute,
        ]);
        requestOrgs.forEach(function (ro) {
          vp.push([ro, sal.config.siteRoles.roles.RestrictedContribute]);
        });
        listRef.setItemPermissions(id, vp);
        console.log(
          "Setting " + listRef.title + " - " + ro.Title + " Permissions:",
          vp
        );
      });
    });
  }

  function createROGroups() {
    // Create a group for each RO and assign the restricted read role.
    vm.configRequestingOffices().forEach(function (ro) {
      sal.utilities.createSiteGroup("RO_" + ro.Title, [
        sal.config.siteRoles.roles.RestrictedContribute,
      ]);
    });
  }

  /*************************************************** */
  // 3. Ensure Request Orgs are set up and ready to go
  /*************************************************** */
  function validateRequestOrgs() {
    console.log("Validating Request Orgs");
    vm.configRequestOrgs().forEach(function (reqOrg) {
      reqOrgTitle = "AO_" + reqOrg.Title.replaceAll("/", "_");
      if (!reqOrg.UserGroup) {
        if (
          window.confirm("Group not found, create " + reqOrgTitle + " group?")
        ) {
          sal.utilities.createSiteGroup(reqOrgTitle, [
            sal.config.siteRoles.roles.RestrictedContribute,
          ]);
        }
      }
    });
  }

  /*************************************************** */
  // 4. Ensure Action Offices are set up and ready to go
  /*************************************************** */
  function validateActionOffices() {
    console.log("Validating Action Offices");
    // Check that each of the action office userAddress is in the
    // corresponding RequestOrgs group.
    addActionOfficeUsersToGroups();
  }
  function addActionOfficeUsersToGroups() {
    vm.configActionOffices().forEach(function (ao) {
      if (ao.UserAddress) {
        console.log(
          "finding " +
            ao.ID +
            ": " +
            ao.Title +
            " - " +
            ao.UserAddress.get_lookupValue()
        );
        //Get the request org group
        var reqOrg = vm.configRequestOrgs().find(function (ro) {
          return ro.ID == ao.RequestOrg.get_lookupId();
        });

        //Add the users to the group
        if (reqOrg) {
          new sal.addUsersToGroup(
            [ao.UserAddress.get_lookupValue()],
            reqOrg.UserGroup.get_lookupValue()
          );
        }
      }
    });
  }

  function validateAll() {
    validatePermissionRoles();
    validateRequestingOffices();
    validateRequestOrgs();
    validateActionOffices();
  }

  var publicMembers = {
    validatePermissionRoles: validatePermissionRoles,
    validateRequestingOffices: validateRequestingOffices,
    validateRequestOrgs: validateRequestOrgs,
    validateActionOffices: validateActionOffices,
    validateAll: validateAll,
  };

  return publicMembers;
};

Workorder.Deployment.NewPipelinesCharleston = function () {
  var pipelineDefs = new Object();
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
    ].forEach(function (type) {
      pipelineDefs[type].forEach(function (stage) {
        vm.listRefConfigPipelines().createListItem(stage, function (id) {
          console.log("Created");
        });
      });
    });
  }

  function buildServicePipeline(serviceUID) {
    pipelineDefs[serviceUID].forEach(function (stage) {
      vm.listRefConfigPipelines().createListItem(stage, function (id) {
        console.log("Created");
      });
    });
  }
  var publicMembers = {
    buildServicePipeline: buildServicePipeline,
    buildAllPipelines: buildAllPipelines,
  };
  return publicMembers;
};
