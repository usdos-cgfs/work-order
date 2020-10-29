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

function initSal() {
  console.log("we are initing sal");
  // Initialize the sitewide settings here.
  sal.globalConfig.siteUrl =
    _spPageContextInfo.webServerRelativeUrl == "/"
      ? ""
      : _spPageContextInfo.webServerRelativeUrl;

  //sal.globalConfig.user =
  sal.globalConfig.listServices = "../_vti_bin/ListData.svc/";

  sal.globalConfig.currentContext = new SP.ClientContext.get_current();
  sal.globalConfig.website = sal.globalConfig.currentContext.get_web();
  //sal.site = sal.siteConnection;

  var user = sal.globalConfig.website.get_currentUser(); //must load this to access info.
  sal.globalConfig.currentContext.load(user);

  var siteGroupCollection = sal.globalConfig.website.get_siteGroups();
  sal.globalConfig.currentContext.load(siteGroupCollection);

  sal.globalConfig.currentContext.executeQueryAsync(
    function () {
      sal.globalConfig.currentUser = user;
      // SP.SOD.executeOrDelayUntilScriptLoaded(
      //   getUserProperties,
      //   "SP.UserProfiles.js"
      // );

      getUserProperties();

      sal.globalConfig.siteGroups = m_fnLoadSiteGroups(siteGroupCollection);
      //alert("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
    },
    function () {
      alert(":(");
    }
  );
  // console.log()
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

ensureUserRest = (userName = "i:0#.w|cgfs\backlundpf") => {
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
  let m_arrSiteGroups = new Array();

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

    m_arrSiteGroups.push(groupObject);
  }

  return m_arrSiteGroups;
}

sal.getSPSiteGroupByName = function (groupName) {
  var userGroup = null;
  if (this.globalConfig.siteGroups != null) {
    userGroup = this.globalConfig.siteGroups.find(
      (group) => group.title == groupName
    );
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

function createSiteGroup(groupName, permissions, groupOwner) {
  /* groupName: the name of the new SP Group
   *  permissions: an array of permissions to assign to the group
   * groupOwner: the name of the owner group
   */

  var clientContext = SP.ClientContext.get_current();
  this.oWebsite = clientContext.get_web();

  var groupCreationInfo = new SP.GroupCreationInformation();
  groupCreationInfo.set_title(groupName);
  this.oGroup = oWebsite.get_siteGroups().add(groupCreationInfo);
  oGroup.set_owner(oWebsite.get_associatedOwnerGroup());

  oGroup.update();
  var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(
    clientContext
  );

  this.oRoleDefinitions = [];

  permissions.forEach((perm) => {
    let oRoleDefinition = oWebsite.get_roleDefinitions().getByName(perm);
    this.oRoleDefinitions.push(oRoleDefinition);
    collRoleDefinitionBinding.add(oRoleDefinition);
  });

  var collRollAssignment = oWebsite.get_roleAssignments();
  collRollAssignment.add(oGroup, collRoleDefinitionBinding);

  clientContext.load(oGroup, "Title");
  //clientContext.load(oRoleDefinition, "Name");

  clientContext.executeQueryAsync(
    Function.createDelegate(this, this.onCreateGroupSucceeded),
    Function.createDelegate(this, this.onCreateGroupFailed)
  );
}

function onCreateGroupSucceeded() {
  var roleInfo =
    oGroup.get_title() +
    " created and assigned to " +
    oRoleDefinitions.forEach((rd) => rd + ", ");
  console.log(roleInfo);
}

function onCreateGroupFailed(sender, args) {
  alert("Request failed. " + args.get_message() + "\n" + args.get_stackTrace());
}

function getCurrentUserGroups(callback) {
  var clientContext = SP.ClientContext.get_current();
  oUser = clientContext.get_web().get_currentUser();
  oGroups = oUser.get_groups();
  this.getCurrentUserGroupsCallback = callback;
  clientContext.load(oUser);
  clientContext.load(oGroups);
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
  let userCollection = group.get_users();

  var ensuredUsers = new Array();

  //TODO: If one user fails validation, the whole process fails. Fix?
  userNameArr.forEach((userName) => {
    ensuredUsers.push(web.ensureUser(userName));
  });

  ensuredUsers.forEach((user) => currCtx.load(user));

  currCtx.load(group);

  let data = { ensuredUsers, group, groupName, userCollection, userNameArr };

  function onQuerySucceeded() {
    console.log("Found Group: " + group.get_title(), userNameArr);
    console.log("Ensured Users: ");

    var currCtx = new SP.ClientContext.get_current();

    ensuredUsers.forEach((user) => userCollection.addUser(user));

    currCtx.load(group);
    currCtx.executeQueryAsync(
      () => console.log("great success!"),
      () => console.log("Terrible Failure!")
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

sal.NewSPList = function (listDef) {
  /*
      Expecting a list definition object in the following format:
        var assignmentListDef = {
        name: "Assignment",
        title: "Assignment",
        viewFields: {
          ID: { type: "Text"},
          Title: { type: "Text"},
          Assignee: { type: "Person"},
          ActionOffice: { type: "Lookup"},
          Comment: { type: "Text"},
          IsActive: { type: "Bool"},
          Role: { type: "Text"},
          Status: { type: "Text"},
          Author: { type: "Text"},
          Created: { type: "Text"},
        },
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
  onQueryFailed = function (sender, args) {
    console.log("unsuccessful read", sender);
    // alert(
    //   "Request failed: " + args.get_message() + "\n" + args.get_stackTrace()
    // );
    alert(
      `Request on list ${
        self.config.def.name
      } failed, producing the following error: \n ${args.get_message()} \nStackTrack: \n ${args.get_stackTrace()}`
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
    //self.updateConfig();
    self.config.currentContext.load(self.config.listRef);
    self.config.currentContext.executeQueryAsync(
      function () {
        self.config.guid = self.config.listRef.get_id().toString();
        console.log("calling callback guid");
        self.callbackGUID(self.config.guid);
        //console.log('item count: ', self.config.itemCount)
      }.bind(this),
      onQueryFailed
    );
  };

  self.updateConfig();

  /*****************************************************************
                                Common Public Methods       
    ******************************************************************/

  self.generateEmptyItem = function () {
    /* Create an empty object that matches the viewfields */
    var focusedItems = [{}];
    var keys = [];
    $.each(this.config.def.viewFields, function (field, obj) {
      keys.push(field);
    });
    $.each(keys, function (item) {
      focusedItems[0][item] = 0;
    });
    return focusedItems;
  };

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
      onQueryFailed
    );
  };

  /*****************************************************************
                                createListItem      
    ******************************************************************/
  function createListItem(valuePairs, callback, folderName = "") {
    //self.updateConfig();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    var itemCreateInfo = new SP.ListItemCreationInformation();

    if (folderName) {
      let folderUrl =
        sal.globalConfig.siteUrl +
        "/Lists/" +
        self.config.def.name +
        "/" +
        folderName;
      itemCreateInfo.set_folderUrl(folderUrl);
    }

    let oListItem = oList.addItem(itemCreateInfo);
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
    data = { oListItem, callback };

    self.config.currentContext.load(oListItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateListItemSucceeded),
      Function.createDelegate(data, onCreateListItemFailed)
    );
  }

  /*****************************************************************
                                getListItems      
    ******************************************************************/
  function getListItems(caml, callback) {
    /*
        Obtain all list items that match the querystring passed by caml.
        */
    //self.updateConfig();
    console.log("context loaded", self.config);
    var camlQuery = new SP.CamlQuery.createAllItemsQuery();

    camlQuery.set_viewXml(caml);

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    let collListItem = oList.getItems(camlQuery);

    function onGetListItemsSucceeded(sender, args) {
      var self = this;
      var listItemEnumerator = self.collListItem.getEnumerator();
      self.focusedItems = [];
      console.log("Get list succeeded");
      var keys = [];
      $.each(this.def.viewFields, function (field, obj) {
        keys.push(field);
      });
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        //console.log(oListItem);
        var listObj = {};
        //console.log("keys", keys);
        $.each(keys, function (idx, item) {
          try {
            var getItem = oListItem.get_item(item);
            //console.log("getting: " + item + " " + getItem);
            //console.log(getItem)
            //console.log(item + ' item: ', getItem)
            listObj[item] = getItem;
          } catch (err) {
            console.error(
              `Unable to retrieve ${item} from ${self.def.name}. Does this column exist?\n\n`,
              err
            );
          }
        });
        //listObj.fileUrl = oListItem.get_item("FileRef");
        listObj.oListItem = oListItem;
        self.focusedItems.push(listObj);
      }
      //this.setState({ focusedItems })
      console.log("calling callback get list");
      callback(self.focusedItems);
    }

    function onGetListItemsFailed(sender, args) {
      console.log("unsuccessful read", sender);

      alert(
        `Request on list ${
          self.config.def.name
        } failed, producing the following error: \n ${args.get_message()} \nStackTrack: \n ${args.get_stackTrace()}`
      );
    }
    let data = {
      collListItem,
      callback,
      def: self.config.def,
    };

    self.config.currentContext.load(collListItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onGetListItemsSucceeded),
      Function.createDelegate(data, onGetListItemsFailed)
    );
  }

  /*****************************************************************
                            updateListItem      
    ******************************************************************/
  function updateListItem(id, valuePairs, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    //self.updateConfig();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    let oListItem = oList.getItemById(id);
    for (i = 0; i < valuePairs.length; i++) {
      oListItem.set_item(valuePairs[i][0], valuePairs[i][1]);
    }

    //oListItem.set_item('Title', 'My Updated Title');
    oListItem.update();

    function onUpdateListItemsSucceeded(sender, args) {
      //alert('Item updated!');
      console.log("Successfully updated " + this.oListItem.get_item("Title"));
      this.callback();
    }

    function onUpdateListItemFailed(sender, args) {
      console.error(`Update Failed - List: ${self.config.def.name}`);
      console.error(`ValuePairs`, valuePairs);
      console.error(sender, args);
    }

    self.config.currentContext.load(oListItem);
    data = { oListItem, callback };
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onUpdateListItemsSucceeded),
      Function.createDelegate(data, onUpdateListItemFailed)
    );
  }

  /*****************************************************************
                            deleteListItem      
    ******************************************************************/
  function deleteListItem(id, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    //self.callbackDeleteListItem = callback;
    //self.updateConfig();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);

    let data = { callback };
    this.oListItem = oList.getItemById(id);
    this.oListItem.deleteObject();

    function onDeleteListItemsSucceeded(sender, args) {
      //alert('Item updated!');
      callback();
    }

    function onDeleteListItemsFailed(sender, args) {
      console.error(
        `sal.SPList.deleteListItem: Request on list ${
          self.config.def.name
        } failed, producing the following error: \n ${args.get_message()} \nStackTrack: \n ${args.get_stackTrace()}`
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
  /**
   * Documentation - setItemPermissions
   * @param {number} id Item identifier, obtain using getListItems above
   * @param {Array} valuePairs A 2d array containing groups and permission levels
   *    e.g. [["Owners", "Full Control"], ["Members", "Contribute"]]
   */
  function setItemPermissions(id, valuePairs, callback, reset = false) {
    //TODO: Validate that the groups and permissions exist on the site.
    var users = new Array();
    var resolvedGroups = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    let oListItem = oList.getItemById(id);

    valuePairs.forEach((vp) => {
      // let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
      //   currCtx
      // );
      let resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
      if (resolvedGroup) {
        resolvedGroups.push([resolvedGroup, vp[1]]);

        // roleDefBindingColl.add(web.get_roleDefinitions().getByName(vp[1]));
        // oListItem.get_roleAssignments().add(resolvedGroup, roleDefBindingColl);
      } else {
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        // ensureUser(vp[0], (resolvedUser) => {
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

      this.resolvedGroups.forEach((groupPairs) => {
        let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
          currCtx
        );
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(groupPairs[1])
        );
        oListItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
      });

      this.users.forEach((userPairs) => {
        let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
          currCtx
        );
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        oListItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      let data = { oListItem, callback };

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
    let data = { id, oListItem, users, resolvedGroups, callback };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oListItem);
    users.map((user) => currCtx.load(user[0]));
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindItemSucceeded),
      Function.createDelegate(data, onFindItemFailed)
    );
  }

  /*****************************************************************
                            getFolderContents          
    ******************************************************************/
  function getFolderContents(folderName, callback) {
    var folder = sal.globalConfig.website.getFolderByServerRelativeUrl(
      sal.globalConfig.siteUrl + "/" + self.config.def.name + "/" + folderName
    );
    files = folder.get_files();
    //files.get_listItemAllFields();

    function onGetListFilesSucceeded(sender, args) {
      var fileArr = [];
      var listItemEnumerator = this.files.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var file = listItemEnumerator.get_current();
        //console.log(file);
        var fileUrl = file.get_serverRelativeUrl();
        fileArr.push({
          fileUrl: fileUrl,
          title: file.get_title(),
          name: file.get_name(),
          created: file.get_timeCreated(),
          file: file,
        });
      }
      callback(fileArr);
    }

    function ongetListFilesFailed(sender, args) {
      // let's log this but suppress any alerts
      timedNotification(
        "WARN: something went wrong fetching files: " + args.toString()
      );
    }

    data = { files, callback };

    self.config.currentContext.load(files);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onGetListFilesSucceeded),
      Function.createDelegate(data, ongetListFilesFailed)
    );
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

    let listPath = self.config.listRef.get_baseType()
      ? `/${self.config.def.name}/`
      : `/Lists/${self.config.def.name}/`;

    let rootFolder = "";

    if (args.rootFolder) {
      rootFolder = sal.globalConfig.siteUrl + listPath;
      rootFolder += args.rootFolder;
    }

    options.args = JSON.stringify(args);

    //Check if we are a document library or a list
    // Basetype 1 = lib
    // BaseType 0 = list
    //Document library
    let formsPath = self.config.listRef.get_baseType()
      ? `/${self.config.def.name}/Forms/`
      : `/Lists/${self.config.def.name}/`;

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

    let siteString =
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

    let upsertListFolderInner = function (parentPath, folderArr, idx, success) {
      let folderName = folderArr[idx];
      idx++;
      let curPath = folderArr.slice(0, idx).join("/");
      ensureListFolder(
        curPath,
        (iFolder) => {
          if (idx >= folderArr.length) {
            //We've reached the innermost folder and found it exists
            success(iFolder.get_id());
          } else {
            upsertListFolderInner(curPath, folderArr, idx, success);
          }
        },
        () => {
          self.createListFolder(
            folderName,
            (iFolder) => {
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
  self.createListFolder = function (folderName, callback, path = "") {
    // Used for lists, duh
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var oList = web.get_lists().getByTitle(self.config.def.title);
    let folderUrl = "";
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
        `Request on list ${
          self.config.def.name
        } failed, producing the following error: \n ${args.get_message()} \nStackTrack: \n ${args.get_stackTrace()}`
      );
    }

    let data = { folderName, callback, newItem };

    self.config.currentContext.load(newItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateFolderSucceeded),
      Function.createDelegate(data, onCreateFolderFailed)
    );
  };

  function ensureListFolder(path, onExists, onNonExists) {
    let folderUrl =
      sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;

    var ctx = SP.ClientContext.get_current();

    // Could also call getFileByServerRelativeUrl() here. Doesn't matter.
    // The way this works is identical for files and folders.
    var folder = ctx.get_web().getFolderByServerRelativeUrl(folderUrl);
    folder.get_listItemAllFields();
    var data = { folder, path, onExists, onNonExists };
    ctx.load(folder, "Exists", "Name");

    function onQueryFolderSucceeded() {
      if (folder.get_exists()) {
        // Folder exists and isn't hidden from us. Print its name.
        console.log(
          `Folder ${folder.get_name()} exists in ${self.config.def.name}`
        );
        var currCtx = new SP.ClientContext.get_current();

        var folderItem = folder.get_listItemAllFields();
        function onQueryFolderItemSuccess() {
          onExists(folderItem);
        }
        function onQueryFolderItemFailure(sender, args) {
          console.error("Failed to find folder at " + path, args);
        }
        data = { folderItem, path, onExists };
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
          `SAL.SPList.ensureListFolder: \
          Folder ${path} does not exist in ${self.config.def.name}`
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

  function setLibFolderPermissions(path, valuePairs, callback, reset = false) {
    var users = new Array();
    var resolvedGroups = new Array();
    let relativeUrl =
      sal.globalConfig.siteUrl + "/" + self.config.def.name + "/" + path;

    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();
    var folder = web.getFolderByServerRelativeUrl(relativeUrl);

    valuePairs.forEach((vp) => {
      let resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
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

      let folderItem = this.folder.get_listItemAllFields();
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

      this.resolvedGroups.forEach((groupPairs) => {
        let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
          currCtx
        );
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(groupPairs[1])
        );
        folderItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
      });

      this.users.forEach((userPairs) => {
        let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
          currCtx
        );
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        folderItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      let data = { folderItem, callback };

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

    var data = { folder, users, callback, resolvedGroups, valuePairs, reset };

    users.map((user) => currCtx.load(user[0]));
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

  let publicMembers = {
    createListItem,
    getListItems,
    updateListItem,
    deleteListItem,
    setItemPermissions,
    getFolderContents,
    showModal,
    uploadNewDocument,
    upsertListFolderPath,
    ensureListFolder,
    createFolderRec,
    setLibFolderPermissions,
    showListView,
  };

  return publicMembers;
};
