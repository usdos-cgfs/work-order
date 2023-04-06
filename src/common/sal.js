/*
    SharePoint Acces Layer - SAL.js

    Abstract any functions that rely on reading or setting SP items to here.

    Create a new "Connection" object type that will store information for 
    interfacing with a specific list.

    Author: Peter Backlund 
    Contact: backlundpf <@> state.gov
    Created: 2019-02-12
*/

window.console = window.console || { log: function () {} };

var sal = window.sal || {};
sal.globalConfig = sal.globalConfig || {};
sal.site = sal.site || {};

//ExecuteOrDelayUntilScriptLoaded(InitSal, "sp.js");

export function GetSiteGroups() {
  if (sal.globalConfig.siteGroups) {
    return sal.globalConfig.siteGroups;
  }
  sal.globalConfig.siteGroups = [];
}

export async function InitSal() {
  sal.globalConfig.siteGroups = [];

  console.log("we are initing sal");
  // Initialize the sitewide settings here.
  sal.globalConfig.siteUrl =
    _spPageContextInfo.webServerRelativeUrl == "/"
      ? ""
      : _spPageContextInfo.webServerRelativeUrl;

  //sal.globalConfig.user =
  sal.globalConfig.listServices =
    sal.globalConfig.siteUrl + "/_vti_bin/ListData.svc/";

  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();
  //sal.site = sal.siteConnection;

  // Get default groups
  sal.globalConfig.defaultGroups = {
    owners: web.get_associatedOwnerGroup(),
    members: web.get_associatedMemberGroup(),
    visitors: web.get_associatedVisitorGroup(),
  };
  currCtx.load(sal.globalConfig.defaultGroups.owners);
  currCtx.load(sal.globalConfig.defaultGroups.members);
  currCtx.load(sal.globalConfig.defaultGroups.visitors);

  // Get Current User information
  var user = web.get_currentUser(); //must load this to access info.
  currCtx.load(user);

  // Get the site groups
  var siteGroupCollection = web.get_siteGroups();
  currCtx.load(siteGroupCollection);

  // Get the roles upfront so we can validate they're present on the site.
  sal.globalConfig.roles = new Array();
  var oRoleDefinitions = currCtx.get_web().get_roleDefinitions();
  currCtx.load(oRoleDefinitions);

  await new Promise((resolve, reject) => {
    currCtx.executeQueryAsync(
      function () {
        sal.globalConfig.currentUser = user;
        // getUserProperties();

        sal.globalConfig.siteGroups = m_fnLoadSiteGroups(siteGroupCollection);
        sal.globalConfig.siteGroups.forEach(function (group) {
          sal.getUsersWithGroup(group.group, function (users) {
            group.users = users;
          });
        });
        //alert("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.

        // Role Definitions
        var oEnumerator = oRoleDefinitions.getEnumerator();
        while (oEnumerator.moveNext()) {
          var oRoleDefinition = oEnumerator.get_current();
          sal.globalConfig.roles.push(oRoleDefinition.get_name());
        }

        sal.config = new sal.NewAppConfig();
        sal.utilities = new sal.NewUtilities();
        resolve();
      },
      function () {
        alert("Error initializing SAL");
        reject();
      }
    );
  });
  // console.log()
}

//ExecuteOrDelayUntilScriptLoaded(initSal, "sp.js");

//initSal();

sal.NewAppConfig = function () {
  var siteRoles = {};
  siteRoles.roles = {
    FullControl: "Full Control",
    Design: "Design",
    Edit: "Edit",
    Contribute: "Contribute",
    Read: "Read",
    LimitedAccess: "Limited Access",
    RestrictedRead: "Restricted Read",
    RestrictedContribute: "Restricted Contribute",
    InitialCreate: "Initial Create",
  };

  siteRoles.validate = function () {
    Object.keys(siteRoles.roles).forEach(function (role) {
      var roleName = siteRoles.roles[role];
      if (!sal.globalConfig.roles.includes(roleName)) {
        console.error(roleName + " is not in the global roles list");
      } else {
        console.log(roleName);
      }
    });
  };

  var siteGroups = new Object();
  siteGroups.groups = {
    Owners: "workorder Owners",
    Members: "workorder Members",
    Visitors: "workorder Visitors",
    RestrictedReaders: "Restricted Readers",
  };

  var publicMembers = {
    siteRoles: siteRoles,
    siteGroups: siteGroups,
  };

  return publicMembers;
};

sal.NewUtilities = function () {
  function createSiteGroup(groupName, permissions, callback) {
    /* groupName: the name of the new SP Group
     *  permissions: an array of permissions to assign to the group
     * groupOwner: the name of the owner group
     */
    callback = callback === undefined ? null : callback;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var groupCreationInfo = new SP.GroupCreationInformation();
    groupCreationInfo.set_title(groupName);
    this.oGroup = oWebsite.get_siteGroups().add(groupCreationInfo);
    oGroup.set_owner(oWebsite.get_associatedOwnerGroup());

    oGroup.update();
    var collRoleDefinitionBinding =
      SP.RoleDefinitionBindingCollection.newObject(clientContext);

    this.oRoleDefinitions = [];

    permissions.forEach(function (perm) {
      var oRoleDefinition = oWebsite.get_roleDefinitions().getByName(perm);
      this.oRoleDefinitions.push(oRoleDefinition);
      collRoleDefinitionBinding.add(oRoleDefinition);
    });

    var collRollAssignment = oWebsite.get_roleAssignments();
    collRollAssignment.add(oGroup, collRoleDefinitionBinding);

    function onCreateGroupSucceeded() {
      var roleInfo =
        oGroup.get_title() +
        " created and assigned to " +
        oRoleDefinitions.forEach(function (rd) {
          rd + ", ";
        });
      if (callback) {
        callback(oGroup.get_id());
      }
      console.log(roleInfo);
    }

    function onCreateGroupFailed(sender, args) {
      alert(
        groupnName +
          " - Create group failed. " +
          args.get_message() +
          "\n" +
          args.get_stackTrace()
      );
    }

    clientContext.load(oGroup, "Title");

    var data = {
      groupName: groupName,
      oGroup: oGroup,
      oRoleDefinition: oRoleDefinition,
      callback: callback,
    };

    clientContext.executeQueryAsync(
      Function.createDelegate(data, onCreateGroupSucceeded),
      Function.createDelegate(data, onCreateGroupFailed)
    );
  }

  function getUserGroups(user, callback) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var everyone = web.ensureUser(user);
    var oGroups = everyone.get_groups();

    function onQueryGroupsSucceeded() {
      var groups = new Array();
      var groupsInfo = new String();
      var groupsEnumerator = oGroups.getEnumerator();
      while (groupsEnumerator.moveNext()) {
        var oGroup = groupsEnumerator.get_current();
        var group = {};
        group.ID = oGroup.get_id();
        group.Title = oGroup.get_title();
        groupsInfo +=
          "\n" +
          "Group ID: " +
          oGroup.get_id() +
          ", " +
          "Title : " +
          oGroup.get_title();
        groups.push(group);
      }
      console.log(groupsInfo.toString());
      callback(groups);
    }

    function onQueryGroupsFailed(sender, args) {
      console.error(
        " Everyone - Query Everyone group failed. " +
          args.get_message() +
          "\n" +
          args.get_stackTrace()
      );
    }
    currCtx.load(everyone);
    currCtx.load(oGroups);
    data = { everyone: everyone, oGroups: oGroups, callback: callback };

    currCtx.executeQueryAsync(
      Function.createDelegate(data, onQueryGroupsSucceeded),
      Function.createDelegate(data, onQueryGroupsFailed)
    );
  }

  function getUsersWithGroup(oGroup, callback) {
    var context = new SP.ClientContext.get_current();

    var oUsers = oGroup.get_users();

    function onGetUserSuccess() {
      var userObjs = [];
      var userEnumerator = oUsers.getEnumerator();
      while (userEnumerator.moveNext()) {
        var userObj = {};
        var oUser = userEnumerator.get_current();
        userObj.title = oUser.get_title();
        userObj.loginName = oUser.get_loginName();
        userObjs.push(userObj);
      }
      callback(userObjs);
    }

    function onGetUserFailed(sender, args) {}

    var data = { oUsers: oUsers, callback: callback };
    context.load(oUsers);
    context.executeQueryAsync(
      Function.createDelegate(data, onGetUserSuccess),
      Function.createDelegate(data, onGetUserFailed)
    );
  }

  function copyFiles(sourceLib, destLib, callback, onError) {
    var context = new SP.ClientContext.get_current();
    var web = context.get_web();
    var folderSrc = web.getFolderByServerRelativeUrl(sourceLib);
    context.load(folderSrc, "Files");
    context.executeQueryAsync(
      function () {
        console.log("Got the source folder right here!");
        var files = folderSrc.get_files();
        var e = files.getEnumerator();
        var dest = [];
        while (e.moveNext()) {
          var file = e.get_current();
          var destLibUrl = destLib + "/" + file.get_name();
          dest.push(destLibUrl); //delete this when we're happy we got the file paths right
          file.copyTo(destLibUrl, true);
        }
        console.log(dest); //delete this when we're happy we got the file paths right
        context.executeQueryAsync(
          function () {
            console.log("Files moved successfully!");
            callback();
          },
          function (sender, args) {
            console.log("error: ") + args.get_message();
            onError;
          }
        );
      },
      function (sender, args) {
        console.log("Sorry, something messed up: " + args.get_message());
      }
    );
  }

  function copyFilesAsync(sourceFolder, destFolder) {
    return new Promise((resolve, reject) => {
      copyFiles(sourceFolder, destFolder, resolve, reject);
    });
  }
  var publicMembers = {
    copyFiles: copyFiles,
    copyFilesAsync: copyFilesAsync,
    createSiteGroup: createSiteGroup,
    getUserGroups: getUserGroups,
    getUsersWithGroup: getUsersWithGroup,
  };

  return publicMembers;
};

async function FetchUserProperties() {
  var headers = {
    "Content-Type": "application/json;odata=verbose",
    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
  };
  try {
    var response = await fetch(
      _spPageContextInfo.webAbsoluteUrl +
        "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
      {
        method: "GET",
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();
  } catch (error) {
    console.error("Unable to fetch User Properties:", error);
  }
}

function getUserProperties() {
  var requestHeaders = {
    Accept: "application/json;odata=verbose",
    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
  };

  jQuery.ajax({
    url:
      _spPageContextInfo.webAbsoluteUrl +
      "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
    type: "GET",
    contentType: "application/json;odata=verbose",
    headers: requestHeaders,
    success: function (data) {
      sal.globalConfig.currentUserProfile = data.d;
      vm.requestorTelephone(
        data.d.UserProfileProperties.results.find(function (prop) {
          return prop.Key == "WorkPhone";
        }).Value
      );
    },
    error: function (jqxr, errorCode, errorThrown) {
      console.error(jqxr.responseText);
    },
  });
}

function ensureUser(userName, callback) {
  var group = sal.globalConfig.siteGroups.find(function (group) {
    return group.loginName == userName;
  });

  if (group) {
    callback(group.group);
    return;
  }

  var context = new SP.ClientContext.get_current();
  var user = context.get_web().ensureUser(userName);

  function onEnsureUserSucceeded(sender, args) {
    var self = this;
    self.callback(user);
  }

  function onEnsureUserFailed(sender, args) {
    console.error(
      "Failed to ensure user :" +
        args.get_message() +
        "\n" +
        args.get_stackTrace()
    );
  }
  data = { user: user, callback: callback };

  context.load(user);
  context.executeQueryAsync(
    Function.createDelegate(data, onEnsureUserSucceeded),
    Function.createDelegate(data, onEnsureUserFailed)
  );
}

function ensureUserById(userId, callback) {
  // First check if this is a group
  var group = sal.globalConfig.siteGroups.find(function (group) {
    return group.ID == userId;
  });

  if (group) {
    callback(group.group);
    return;
  }

  var context = new SP.ClientContext.get_current();
  var user = context.get_web().getUserById(userId);

  function onRequestSuccess() {
    callback(user);
    var loginName = user.get_loginName();
  }

  function onRequestFail(sender, args) {
    alert("Could not find user with id: ", userId);
  }
  data = { user: user, callback: callback };

  context.load(user);
  context.executeQueryAsync(
    Function.createDelegate(data, onRequestSuccess),
    Function.createDelegate(data, onRequestFail)
  );
}

export function EnsureUserByIdAsync(userId) {
  return new Promise((resolve, reject) => {
    // First check if this is a group
    var group = sal.globalConfig.siteGroups.find(function (group) {
      return group.ID == userId;
    });

    if (group) {
      resolve(group.group);
      return;
    }

    var context = new SP.ClientContext.get_current();
    var user = context.get_web().getUserById(userId);

    function onRequestSuccess() {
      resolve(user);
    }

    function onRequestFail(sender, args) {
      alert("Could not find user with id: ", userId);
      reject(args);
    }
    const data = { user: user, resolve: resolve, reject };

    context.load(user);
    context.executeQueryAsync(
      Function.createDelegate(data, onRequestSuccess),
      Function.createDelegate(data, onRequestFail)
    );
  });
}

sal.ensureUserRest = function (userName) {
  userName = userName === undefined ? "i:0#.w|cgfs\backlundpf" : userName;

  // sample userName
  var item = {
    logonName: userName,
  };
  var UserId = $.ajax({
    url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/ensureuser",
    type: "POST",
    async: false,
    contentType: "application/json;odata=verbose",
    data: JSON.stringify(item),
    headers: {
      Accept: "application/json;odata=verbose",
      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
    },
    success: function (data) {
      return data.Id + ";#" + data.Title + ";#";
    },
    error: function (data) {
      failure(data);
    },
  });
  return (
    JSON.parse(UserId.responseText).d.Id +
    ";#" +
    JSON.parse(UserId.responseText).d.Title +
    ";#"
  );
};

function m_fnLoadSiteGroups(itemColl) {
  var m_arrSiteGroups = new Array();
  var listItemEnumerator = itemColl.getEnumerator();

  while (listItemEnumerator.moveNext()) {
    var oListItem = listItemEnumerator.get_current();

    var id = oListItem.get_id();
    var loginName = oListItem.get_loginName();
    var title = oListItem.get_title();

    var groupObject = new Object();
    groupObject["ID"] = id;
    groupObject["loginName"] = loginName;
    groupObject["title"] = title;
    groupObject["group"] = oListItem;

    // sal.getUsersWithGroup(oListItem, (users) => {
    //   groupObject["users"] = users;
    //   //sal.globalConfig.siteGroups.push(groupObject);
    // });

    m_arrSiteGroups.push(groupObject);
  }

  return m_arrSiteGroups;
}

sal.getUsersWithGroup = function (oGroup, callback) {
  var context = new SP.ClientContext.get_current();

  var oUsers = oGroup.get_users();

  function onGetUserSuccess() {
    var userObjs = [];
    var userEnumerator = oUsers.getEnumerator();
    while (userEnumerator.moveNext()) {
      var userObj = {};
      var oUser = userEnumerator.get_current();
      userObj.title = oUser.get_title();
      userObj.loginName = oUser.get_loginName();
      userObjs.push(userObj);
    }
    callback(userObjs);
  }

  function onGetUserFailed(sender, args) {}

  var data = { oUsers: oUsers, callback: callback };
  context.load(oUsers);
  context.executeQueryAsync(
    Function.createDelegate(data, onGetUserSuccess),
    Function.createDelegate(data, onGetUserFailed)
  );
};

sal.getSPSiteGroupByName = function (groupName) {
  var userGroup = null;
  if (this.globalConfig.siteGroups != null) {
    userGroup = this.globalConfig.siteGroups.find(function (group) {
      return group.title == groupName;
    });
  }
  if (userGroup) {
    return userGroup.group;
  } else {
    return null;
  }
};

sal.generateEmptyItem = function (viewFields) {
  /* Create an empty object that matches the viewfields */
  focusedItems = [{}];
  $(viewFields).each(function (item) {
    focusedItems[0][item] = 0;
  });
  return focusedItems;
};

function getCurrentUserGroups(callback) {
  var clientContext = SP.ClientContext.get_current();
  var web = clientContext.get_web();
  oUser = web.get_currentUser();
  oGroups = oUser.get_groups();

  everyone = web.ensureUser("Everyone");
  everyoneGroups = everyone.get_groups();

  this.getCurrentUserGroupsCallback = callback;
  clientContext.load(oUser);
  clientContext.load(oGroups);
  clientContext.load(everyone);
  clientContext.load(everyoneGroups);

  clientContext.executeQueryAsync(
    Function.createDelegate(this, function () {
      var groupsInfo = "";
      var groups = [];
      var groupsEnumerator = oGroups.getEnumerator();
      console.log("Count of current user groups: " + oGroups.get_count());
      while (groupsEnumerator.moveNext()) {
        var oGroup = groupsEnumerator.get_current();
        var group = {};
        group.ID = oGroup.get_id();
        group.Title = oGroup.get_title();
        groupsInfo +=
          "\n" +
          "Group ID: " +
          oGroup.get_id() +
          ", " +
          "Title : " +
          oGroup.get_title();
        groups.push(group);
      }
      var everyoneGroupsEnumerator = everyoneGroups.getEnumerator();
      console.log("Count of current user groups: " + oGroups.get_count());
      while (everyoneGroupsEnumerator.moveNext()) {
        var oGroup = everyoneGroupsEnumerator.get_current();
        var group = {};
        group.ID = oGroup.get_id();
        group.Title = oGroup.get_title();
        groupsInfo +=
          "\n" +
          "Group ID: " +
          oGroup.get_id() +
          ", " +
          "Title : " +
          oGroup.get_title();
        groups.push(group);
      }
      getCurrentUserGroupsCallback(groups);
      console.log(groupsInfo.toString());
    }),
    Function.createDelegate(this, function () {
      console.log("failed");
    })
  );
}

sal.addUsersToGroup = function (userNameArr, groupName) {
  var currCtx = new SP.ClientContext.get_current();
  var web = currCtx.get_web();

  var siteGroups = web.get_siteGroups();
  var group = siteGroups.getByName(groupName);
  var userCollection = group.get_users();

  var ensuredUsers = new Array();

  //TODO: If one user fails validation, the whole process fails. Fix?
  userNameArr.forEach(function (userName) {
    ensuredUsers.push(web.ensureUser(userName));
  });

  ensuredUsers.forEach(function (user) {
    currCtx.load(user);
  });

  currCtx.load(group);

  var data = {
    ensuredUsers: ensuredUsers,
    group: group,
    groupName: groupName,
    userCollection: userCollection,
    userNameArr: userNameArr,
  };

  function onQuerySucceeded() {
    console.log("Found Group: " + group.get_title(), userNameArr);
    console.log("Ensured Users: ");

    var currCtx = new SP.ClientContext.get_current();

    ensuredUsers.forEach(function (user) {
      userCollection.addUser(user);
    });

    currCtx.load(group);
    currCtx.executeQueryAsync(
      function () {
        console.log("great success!");
      },
      function () {
        console.log("Terrible Failure!");
      }
    );
  }

  function onQueryFailed(sender, args) {
    console.warn("Unable to add users to group " + groupName, userNameArr);
    console.warn(groupName, args);
  }

  currCtx.executeQueryAsync(
    Function.createDelegate(data, onQuerySucceeded),
    Function.createDelegate(data, onQueryFailed)
  );
};

export function MapListItem(listItem, fieldMap) {
  Object.keys(fieldMap).forEach((key) => {
    if (typeof fieldMap[key].obs == "function") {
      fieldMap[key].obs(listItem.get_item(key));
    } else if (fieldMap[key].obs.SPMap) {
      fieldMap[key].obs.SPMap(listItem.get_item(key));
    } else {
      console.error("Unable to Map Field");
    }
  });
}

export function SPList(listDef) {
  /*
      Expecting a list definition object in the following format:
        var assignmentListDef = {
        name: "Assignment",
        title: "Assignment"
      };
    */

  /*****************************************************************
                                Globals       
    ******************************************************************/

  var self = this;

  self.state = {};

  self.setState = function (newState) {
    // TODO
    self.state = newState;
  };

  self.config = {
    def: listDef,
  };

  /*****************************************************************
                                Common Private Methods       
    ******************************************************************/
  self.onQueryFailed = function (sender, args) {
    console.log("unsuccessful read", sender);
    // alert(
    //   "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    // );
    alert(
      "Request on list " +
        self.config.def.name +
        " failed, producing the following error: \n" +
        args.get_message() +
        "\nStackTrack: \n" +
        args.get_stackTrace()
    );
  };

  self.updateConfig = function () {
    //console.log('update', self.config)
    self.config.currentContext = new SP.ClientContext.get_current();
    self.config.website = self.config.currentContext.get_web();
    self.config.listRef = self.config.website
      .get_lists()
      .getByTitle(self.config.def.title);
    self.getLibGUID(function () {});
  };

  self.getLibGUID = function (callback) {
    self.callbackGUID = callback;

    self.config.currentContext.load(self.config.listRef);
    self.config.currentContext.executeQueryAsync(
      function () {
        self.config.guid = self.config.listRef.get_id().toString();
        //console.log("calling callback guid");
        self.callbackGUID(self.config.guid);
        //console.log('item count: ', self.config.itemCount)
      }.bind(this),
      self.onQueryFailed
    );
  };

  //self.updateConfig();

  /*****************************************************************
                                Common Public Methods       
    ******************************************************************/

  function setListPermissionsAsync(valuePairs, reset) {
    return new Promise((resolve, reject) => {
      setListPermissions(valuePairs, resolve, reset);
    });
  }

  function setListPermissions(valuePairs, callback, reset) {
    reset = reset === undefined ? false : reset;

    var users = new Array();
    var resolvedGroups = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    valuePairs.forEach(function (vp) {
      var resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
      if (resolvedGroup) {
        resolvedGroups.push([resolvedGroup, vp[1]]);
      } else {
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
      }
    });

    function onFindItemSucceeded() {
      console.log("Successfully found item");
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      if (reset) {
        oList.resetRoleInheritance();
        oList.breakRoleInheritance(false, false);
        oList
          .get_roleAssignments()
          .getByPrincipal(sal.globalConfig.currentUser)
          .deleteObject();
      } else {
        oList.breakRoleInheritance(false, false);
      }

      this.resolvedGroups.forEach(function (groupPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(groupPairs[1])
        );
        oList.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
      });

      this.users.forEach(function (userPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        oList.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      var data = { oList: oList, callback: callback };

      function onSetItemPermissionsSuccess() {
        console.log("Successfully set permissions");
        callback(oList);
      }

      function onSetItemPermissionsFailure(sender, args) {
        console.error(
          "Failed to update permissions on List: " +
            this.oList.get_title() +
            args.get_message() +
            "\n",
          args.get_stackTrace()
        );
      }

      currCtx.load(oList);
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onSetItemPermissionsSuccess),
        Function.createDelegate(data, onSetItemPermissionsFailure)
      );
    }

    function onFindItemFailed(sender, args) {
      console.error(
        "Failed to find List: " + this.oList.get_title + args.get_message(),
        args.get_stackTrace()
      );
    }
    var data = {
      oList: oList,
      users: users,
      resolvedGroups: resolvedGroups,
      callback: callback,
    };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oList);
    users.map(function (user) {
      currCtx.load(user[0]);
    });
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindItemSucceeded),
      Function.createDelegate(data, onFindItemFailed)
    );
  }

  self.getItemCount = function (callback) {
    self.callbackItemCount = callback;
    self.updateConfig();
    self.config.currentContext.load(self.config.listRef);
    self.config.currentContext.executeQueryAsync(
      function () {
        self.config.itemCount = self.config.listRef.get_itemCount();
        self.callbackItemCount(self.config.itemCount);
        //console.log('item count: ', self.config.itemCount)
      }.bind(this),
      self.onQueryFailed
    );
  };

  /*****************************************************************
                                createListItem      
    ******************************************************************/
  function createListItem(valuePairs, callback, folderName) {
    folderName = folderName === undefined ? "" : folderName;

    //self.updateConfig();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    var itemCreateInfo = new SP.ListItemCreationInformation();

    if (folderName) {
      var folderUrl =
        sal.globalConfig.siteUrl +
        "/Lists/" +
        self.config.def.name +
        "/" +
        folderName;
      itemCreateInfo.set_folderUrl(folderUrl);
    }

    var oListItem = oList.addItem(itemCreateInfo);
    for (i = 0; i < valuePairs.length; i++) {
      oListItem.set_item(valuePairs[i][0], valuePairs[i][1]);
    }

    oListItem.update();

    function onCreateListItemSucceeded(sender, args) {
      var self = this;
      self.callback(self.oListItem.get_id());
    }

    function onCreateListItemFailed(sender, args) {
      alert(
        "Failed to create new item :" +
          args.get_message() +
          "\n" +
          args.get_stackTrace()
      );
    }
    data = { oListItem: oListItem, callback: callback };

    self.config.currentContext.load(oListItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateListItemSucceeded),
      Function.createDelegate(data, onCreateListItemFailed)
    );
  }

  /*****************************************************************
                                getListItems      
    ******************************************************************/
  function getListItems(caml, fields, callback) {
    /*
        Obtain all list items that match the querystring passed by caml.
        */
    var camlQuery = new SP.CamlQuery.createAllItemsQuery();

    camlQuery.set_viewXml(caml);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    var collListItem = oList.getItems(camlQuery);

    function onGetListItemsSucceeded() {
      var self = this;
      var listItemEnumerator = self.collListItem.getEnumerator();

      const foundObjects = [];

      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var listObj = {};
        fields.forEach((field) => {
          var colVal = oListItem.get_item(field);
          listObj[field] = Array.isArray(colVal)
            ? colVal.map((val) => mapListItemToObject(val))
            : mapListItemToObject(colVal);
        });
        //listObj.fileUrl = oListItem.get_item("FileRef");
        listObj.oListItem = oListItem;
        foundObjects.push(listObj);
      }
      //this.setState({ focusedItems })
      //console.log("calling callback get list");
      callback(foundObjects);
    }

    function mapListItemToObject(val) {
      var out;
      switch (val.constructor.getName()) {
        case "SP.FieldLookupValue":
        case "SP.FieldUserValue":
          out = {
            id: val.get_lookupId(),
            value: val.get_lookupValue(),
          };
          break;
        default:
          out = val;
      }
      return out;
    }

    function onGetListItemsFailed(sender, args) {
      console.log("unsuccessful read", sender);

      alert(
        "Request on list " +
          self.config.def.name +
          " failed, producing the following error: \n " +
          args.get_message() +
          "\nStackTrack: \n " +
          args.get_stackTrace()
      );
    }
    var data = {
      collListItem: collListItem,
      callback: callback,
      fields,
    };

    currCtx.load(collListItem, `Include(${fields.join(", ")})`);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onGetListItemsSucceeded),
      Function.createDelegate(data, onGetListItemsFailed)
    );
  }

  function getListItemsAsync(caml, viewFields) {
    viewFields = typeof viewFields !== "undefined" ? viewFields : null;
    return new Promise((resolve, reject) => {
      getListItems(caml, viewFields, resolve);
    });
  }

  /**
   *
   * @param {string} title
   * @param {Array} fields
   * @returns promise. Resolves to Object with fields and values.
   */
  function findByTitleAsync(title, fields) {
    var caml =
      '<View Scope="RecursiveAll"><Query><Where><And><Eq>' +
      '<FieldRef Name="FSObjType"/><Value Type="int">0</Value>' +
      "</Eq><Eq>" +
      '<FieldRef Name="Title"/><Value Type="Text">' +
      title +
      "</Value>" +
      "</Eq></And></Where></Query><RowLimit>1</RowLimit></View>";
    return new Promise((resolve, reject) => {
      getListItems(caml, fields, resolve);
    });
  }
  /*****************************************************************
                            updateListItem      
    ******************************************************************/
  function updateListItem(id, valuePairs, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    var oListItem = oList.getItemById(id);
    for (i = 0; i < valuePairs.length; i++) {
      oListItem.set_item(valuePairs[i][0], valuePairs[i][1]);
    }

    //oListItem.set_item('Title', 'My Updated Title');
    oListItem.update();

    function onUpdateListItemsSucceeded() {
      //alert('Item updated!');
      console.log("Successfully updated " + this.oListItem.get_item("Title"));
      this.callback();
    }

    function onUpdateListItemFailed(sender, args) {
      console.error("Update Failed - List: " + self.config.def.name);
      console.error("ValuePairs", valuePairs);
      console.error(sender, args);
    }

    self.config.currentContext.load(oListItem);
    data = { oListItem: oListItem, callback: callback };
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onUpdateListItemsSucceeded),
      Function.createDelegate(data, onUpdateListItemFailed)
    );
  }

  function updateListItemAsync(id, valuePairs) {
    return new Promise((resolve, reject) => {
      updateListItem(id, valuePairs, resolve);
    });
  }

  /*****************************************************************
                            deleteListItem      
    ******************************************************************/
  function deleteListItem(id, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    //self.callbackDeleteListItem = callback;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    var data = { callback: callback };
    this.oListItem = oList.getItemById(id);
    this.oListItem.deleteObject();

    function onDeleteListItemsSucceeded(sender, args) {
      //alert('Item updated!');
      callback();
    }

    function onDeleteListItemsFailed(sender, args) {
      console.error(
        "sal.SPList.deleteListItem: Request on list " +
          self.config.def.name +
          " failed, producing the following error: \n " +
          args.get_message() +
          "\nStackTrack: \n " +
          args.get_stackTrace()
      );
    }

    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onDeleteListItemsSucceeded),
      Function.createDelegate(data, onDeleteListItemsFailed)
    );
  }

  /*****************************************************************
                            Set Item Permissions  
    ******************************************************************/

  function setItemPermissionsAsync(id, valuePairs, reset) {
    return new Promise((resolve, reject) => {
      setItemPermissions(id, valuePairs, resolve, reset);
    });
  }
  /**
   * Documentation - setItemPermissions
   * @param {number} id Item identifier, obtain using getListItems above
   * @param {Array} valuePairs A 2d array containing groups/users and permission levels
   *    e.g. [["Owners", "Full Control"], ["backlundpf", "Contribute"]]
   */
  function setItemPermissions(id, valuePairs, callback, reset) {
    reset = reset === undefined ? false : reset;

    //TODO: Validate that the groups and permissions exist on the site.
    var users = new Array();
    var resolvedGroups = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    var oListItem = oList.getItemById(id);

    valuePairs.forEach(function (vp) {
      // var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
      //   currCtx
      // );
      var resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
      if (resolvedGroup) {
        resolvedGroups.push([resolvedGroup, vp[1]]);

        // roleDefBindingColl.add(web.get_roleDefinitions().getByName(vp[1]));
        // oListItem.get_roleAssignments().add(resolvedGroup, roleDefBindingColl);
      } else {
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        // ensureUser(vp[0], function(resolvedUser)  {
        //   self.setItemPermissionsUser(id, resolvedUser, vp[1]);
        // });
      }
    });

    function onFindItemSucceeded() {
      console.log("Successfully found item");
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      if (reset) {
        oListItem.resetRoleInheritance();
        oListItem.breakRoleInheritance(false, false);
        oListItem
          .get_roleAssignments()
          .getByPrincipal(sal.globalConfig.currentUser)
          .deleteObject();
      } else {
        oListItem.breakRoleInheritance(false, false);
      }
      //var oList = web.get_lists().getByTitle(self.config.def.title);

      this.resolvedGroups.forEach(function (groupPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(groupPairs[1])
        );
        oListItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
      });

      this.users.forEach(function (userPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        oListItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      var data = { oListItem: oListItem, callback: callback };

      function onSetItemPermissionsSuccess() {
        console.log("Successfully set permissions");
        callback(oListItem);
      }

      function onSetItemPermissionsFailure(sender, args) {
        console.error(
          "Failed to update permissions on item: " +
            this.oListItem.get_lookupValue() +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
      }

      currCtx.load(oListItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onSetItemPermissionsSuccess),
        Function.createDelegate(data, onSetItemPermissionsFailure)
      );
    }

    function onFindItemFailed(sender, args) {
      console.error(
        "Failed to update permissions on item: " +
          this.title +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );
    }
    var data = {
      id: id,
      oListItem: oListItem,
      users: users,
      resolvedGroups: resolvedGroups,
      callback: callback,
    };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oListItem);
    users.map(function (user) {
      currCtx.load(user[0]);
    });
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindItemSucceeded),
      Function.createDelegate(data, onFindItemFailed)
    );
  }
  /*****************************************************************
                            Get Item Permissions  
    ******************************************************************/
  /**
   * Documentation - getItemPermissions
   * @param {number} id Item identifier, obtain using getListItems above
   * @param {Function} callback The callback function to execute after
   *  obtaining permissions
   */
  function getItemPermissions(id, callback) {
    var users = new Array();
    var resolvedGroups = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    var oListItem = oList.getItemById(id);
    var roles = oListItem.get_roleAssignments();

    function onFindItemSucceeded() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var principals = [];
      var roleEnumerator = this.roles.getEnumerator();
      // enumerate the roles
      while (roleEnumerator.moveNext()) {
        var role = roleEnumerator.get_current();
        var principal = role.get_member();
        // get the principal
        currCtx.load(principal);
        principals.push(principal);
      }

      currCtx.executeQueryAsync(
        // success
        function (sender, args) {
          // alert the title
          //alert(principal.get_title());
          var logins = principals.map(function (principal) {
            return principal.get_loginName();
          });
          callback(logins);
        },
        // failure
        function (sender, args) {
          alert(
            "Request failed. " +
              args.get_message() +
              "\n" +
              args.get_stackTrace()
          );
        }
      );
    }

    function onFindItemFailed(sender, args) {
      console.error(
        "Failed to update permissions on item: " +
          this.title +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );
    }

    var data = {
      id: id,
      oListItem: oListItem,
      roles: roles,
      callback: callback,
    };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oListItem);
    currCtx.load(roles);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindItemSucceeded),
      Function.createDelegate(data, onFindItemFailed)
    );
  }

  /*****************************************************************
                            getFolderContents          
    ******************************************************************/
  function getFolderContents(folderName, callback) {
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var folder = web.getFolderByServerRelativeUrl(
      sal.globalConfig.siteUrl + "/" + self.config.def.name + "/" + folderName
    );
    files = folder.get_files();
    //files.get_listItemAllFields();

    function onGetListFilesSucceeded() {
      var fileArr = [];
      var listItemEnumerator = this.files.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var file = listItemEnumerator.get_current();
        //console.log(file);
        var fileUrl = file.get_serverRelativeUrl();
        currCtx.load(file, "ListItemAllFields");
        fileArr.push({
          fileUrl: fileUrl,
          title: file.get_title(),
          name: file.get_name(),
          created: file.get_timeCreated(),
          file: file,
        });
      }
      currCtx.executeQueryAsync(
        function () {
          fileArr.forEach(function (file) {
            file.ID = file.file.get_listItemAllFields().get_id();
          });
          callback(fileArr);
        },
        function (sender, args) {
          console.warn("Unable to fetch file info");
        }
      );
    }

    function ongetListFilesFailed(sender, args) {
      // let's log this but suppress any alerts
      timedNotification(
        "WARN: something went wrong fetching files: " + args.toString()
      );
    }

    data = { files: files, callback: callback };

    currCtx.load(files);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onGetListFilesSucceeded),
      Function.createDelegate(data, ongetListFilesFailed)
    );
  }

  function getFolderContentsAsync(folderName) {
    return new Promise((resolve, reject) => {
      getFolderContents(folderName, resolve);
    });
  }

  /*****************************************************************
                                  
    ******************************************************************/

  function showModal(formName, title, args, callback) {
    var id = "";
    var options = SP.UI.$create_DialogOptions();
    options.title = title;
    options.dialogReturnValueCallback = callback;
    if (args.id) {
      id = args.id;
    }

    var listPath = self.config.listRef.get_baseType()
      ? "/" + self.config.def.name + "/"
      : "/Lists/" + self.config.def.name + "/";

    var rootFolder = "";

    if (args.rootFolder) {
      rootFolder = sal.globalConfig.siteUrl + listPath;
      rootFolder += args.rootFolder;
    }

    options.args = JSON.stringify(args);

    //Check if we are a document library or a list
    // Basetype 1 = lib
    // BaseType 0 = list
    //Document library
    var formsPath = self.config.listRef.get_baseType()
      ? "/" + self.config.def.name + "/Forms/"
      : "/Lists/" + self.config.def.name + "/";

    options.url =
      sal.globalConfig.siteUrl +
      formsPath +
      formName +
      "?ID=" +
      id +
      "&Source=" +
      location.pathname +
      "&RootFolder=" +
      rootFolder;
    console.log("Options url: " + options.url);
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function uploadNewDocument(folder, title, args, callback) {
    //folder = folder != '/' ? folder : '';
    var options = SP.UI.$create_DialogOptions();
    options.title = title;
    options.dialogReturnValueCallback = callback;

    var siteString =
      sal.globalConfig.siteUrl == "/" ? "" : sal.globalConfig.siteUrl;

    options.args = JSON.stringify(args);
    options.url =
      siteString +
      "/_layouts/Upload.aspx?List=" +
      self.config.guid +
      "&RootFolder=" +
      siteString +
      "/" +
      self.config.def.name +
      "/" +
      encodeURI(folder) +
      "&Source=" +
      location.pathname +
      "&args=" +
      encodeURI(JSON.stringify(args));

    console.log("Options url: " + options.url);
    SP.UI.ModalDialog.showModalDialog(options);
  }

  function upsertListFolderPath(folderPath, callback) {
    var folderArr = folderPath.split("/");
    var idx = 0;

    var upsertListFolderInner = function (parentPath, folderArr, idx, success) {
      var folderName = folderArr[idx];
      idx++;
      var curPath = folderArr.slice(0, idx).join("/");
      ensureListFolder(
        curPath,
        function (iFolder) {
          if (idx >= folderArr.length) {
            //We've reached the innermost folder and found it exists
            success(iFolder.get_id());
          } else {
            upsertListFolderInner(curPath, folderArr, idx, success);
          }
        },
        function () {
          self.createListFolder(
            folderName,
            function (iFolder) {
              if (idx >= folderArr.length) {
                //We've reached the innermost folder and found it exists
                success(iFolder);
              } else {
                upsertListFolderInner(curPath, folderArr, idx, success);
              }
            },
            parentPath
          );
        }
      );
    };
    upsertListFolderInner("", folderArr, idx, callback);
  }
  /**
   * CreateListFolder
   * Creates a folder at the specified path
   * @param {String} folderName
   * @param {Function} callback
   * @param {String} path
   */
  self.createListFolder = function (folderName, callback, path) {
    path = path === undefined ? "" : path;

    // Used for lists, duh
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);
    var folderUrl = "";
    var itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName(folderName);
    if (path) {
      folderUrl =
        sal.globalConfig.siteUrl +
        "/Lists/" +
        self.config.def.name +
        "/" +
        path;
      itemCreateInfo.set_folderUrl(folderUrl);
    }

    var newItem = oList.addItem(itemCreateInfo);
    newItem.set_item("Title", folderName);

    newItem.update();

    function onCreateFolderSucceeded(sender, args) {
      callback(this.newItem.get_id());
    }

    function onCreateFolderFailed(sender, args) {
      alert(
        "Request on list " +
          self.config.def.name +
          " failed, producing the following error: \n" +
          args.get_message() +
          "\nStackTrack: \n" +
          args.get_stackTrace()
      );
    }

    var data = { folderName: folderName, callback: callback, newItem: newItem };

    self.config.currentContext.load(newItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateFolderSucceeded),
      Function.createDelegate(data, onCreateFolderFailed)
    );
  };

  function ensureListFolder(path, onExists, onNonExists) {
    var folderUrl =
      sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;

    var ctx = SP.ClientContext.get_current();

    // Could also call getFileByServerRelativeUrl() here. Doesn't matter.
    // The way this works is identical for files and folders.
    var folder = ctx.get_web().getFolderByServerRelativeUrl(folderUrl);
    folder.get_listItemAllFields();
    var data = {
      folder: folder,
      path: path,
      onExists: onExists,
      onNonExists: onNonExists,
    };
    ctx.load(folder, "Exists", "Name");

    function onQueryFolderSucceeded() {
      if (folder.get_exists()) {
        // Folder exists and isn't hidden from us. Print its name.
        console.log(
          "Folder " + folder.get_name() + " exists in " + self.config.def.name
        );
        var currCtx = new SP.ClientContext.get_current();

        var folderItem = folder.get_listItemAllFields();
        function onQueryFolderItemSuccess() {
          onExists(folderItem);
        }
        function onQueryFolderItemFailure(sender, args) {
          console.error("Failed to find folder at " + path, args);
        }
        data = { folderItem: folderItem, path: path, onExists: onExists };
        currCtx.load(folderItem);
        currCtx.executeQueryAsync(
          Function.createDelegate(data, onQueryFolderItemSuccess),
          Function.createDelegate(data, onQueryFolderItemFailure)
        );
      } else {
        console.warn("Folder exists but is hidden (security-trimmed) for us.");
      }
    }

    function onQueryFolderFailed(sender, args) {
      if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
        // Folder doesn't exist at all.
        console.log(
          "SAL.SPList.ensureListFolder: \
          Folder " +
            path +
            " does not exist in " +
            self.config.def.name
        );
        onNonExists();
      } else {
        // An unexpected error occurred.
        console.error("Error: " + args.get_message());
      }
    }
    ctx.executeQueryAsync(
      Function.createDelegate(data, onQueryFolderSucceeded),
      Function.createDelegate(data, onQueryFolderFailed)
    );
  }

  function createFolderRec(folderUrl, success) {
    var ctx = SP.ClientContext.get_current();
    var list = self.config.listRef;
    var createFolderInternal = function (parentFolder, folderUrl, success) {
      var ctx = parentFolder.get_context();
      var folderNames = folderUrl.split("/");
      var folderName = folderNames[0];
      var curFolder = parentFolder.get_folders().add(folderName);
      ctx.load(curFolder);
      ctx.executeQueryAsync(
        function () {
          if (folderNames.length > 1) {
            var subFolderUrl = folderNames
              .slice(1, folderNames.length)
              .join("/");
            createFolderInternal(curFolder, subFolderUrl, success);
          } else {
            success(curFolder);
          }
        },
        function () {
          console.log("error creating new folder");
        }
      );
    };
    createFolderInternal(list.get_rootFolder(), folderUrl, success);
  }

  function setLibFolderPermissions(path, valuePairs, callback, reset) {
    reset = reset === undefined ? false : reset;
    var users = new Array();
    var resolvedGroups = new Array();
    var relativeUrl =
      sal.globalConfig.siteUrl + "/" + self.config.def.name + "/" + path;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var folder = web.getFolderByServerRelativeUrl(relativeUrl);

    valuePairs.forEach(function (vp) {
      var resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
      if (resolvedGroup) {
        resolvedGroups.push([resolvedGroup, vp[1]]);
      } else {
        //This doesn't appear to be a group, let's see if we can find a user
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
      }
    });

    function onFindFolderSuccess() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      var folderItem = this.folder.get_listItemAllFields();
      if (reset) {
        folderItem.resetRoleInheritance();
        folderItem.breakRoleInheritance(false, false);
        folderItem
          .get_roleAssignments()
          .getByPrincipal(sal.globalConfig.currentUser)
          .deleteObject();
      } else {
        folderItem.breakRoleInheritance(false, false);
      }

      this.resolvedGroups.forEach(function (groupPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(groupPairs[1])
        );
        folderItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
      });

      this.users.forEach(function (userPairs) {
        var roleDefBindingColl =
          SP.RoleDefinitionBindingCollection.newObject(currCtx);
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        folderItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      var data = { folderItem: folderItem, callback: callback };

      function onSetFolderPermissionsSuccess() {
        console.log("Successfully set permissions");
        this.callback(folderItem);
      }

      function onSetFolderPermissionsFailure(sender, args) {
        console.error(
          "Failed to update permissions on item: " +
            this.folderItem.get_lookupValue() +
            args.get_message() +
            "\n" +
            args.get_stackTrace(),
          false
        );
      }

      currCtx.load(folderItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onSetFolderPermissionsSuccess),
        Function.createDelegate(data, onSetFolderPermissionsFailure)
      );
    }

    function onFindFolderFailure(sender, args) {
      console.error(
        "Something went wrong setting perms on library folder",
        args
      );
    }

    var data = {
      folder: folder,
      users: users,
      callback: callback,
      resolvedGroups: resolvedGroups,
      valuePairs: valuePairs,
      reset: reset,
    };

    users.map(function (user) {
      currCtx.load(user[0]);
    });
    currCtx.load(folder);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindFolderSuccess),
      Function.createDelegate(data, onFindFolderFailure)
    );
  }

  function showListView(filter) {
    // Redirect to the default sharepoint list view
    listUrl =
      sal.globalConfig.siteUrl +
      "/Lists/" +
      config.listName +
      "/AllItems.aspx" +
      filter;
    window.location.assign(listUrl);
  }

  var publicMembers = {
    config: this.config,
    setListPermissions: setListPermissions,
    setListPermissionsAsync: setListPermissionsAsync,
    createListItem: createListItem,
    getListItems: getListItems,
    getListItemsAsync: getListItemsAsync,
    findByTitleAsync,
    updateListItem: updateListItem,
    updateListItemAsync: updateListItemAsync,
    deleteListItem: deleteListItem,
    setItemPermissions: setItemPermissions,
    setItemPermissionsAsync: setItemPermissionsAsync,
    getItemPermissions: getItemPermissions,
    getFolderContents: getFolderContents,
    getFolderContentsAsync: getFolderContentsAsync,
    showModal: showModal,
    uploadNewDocument: uploadNewDocument,
    upsertListFolderPath: upsertListFolderPath,
    ensureListFolder: ensureListFolder,
    createFolderRec: createFolderRec,
    setLibFolderPermissions: setLibFolderPermissions,
    showListView: showListView,
  };

  return publicMembers;
}
