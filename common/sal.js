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
      SP.SOD.executeFunc(
        "SP.UserProfiles.js",
        "SP.UserProfiles",
        getUserProperties
      );
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
        data.d.UserProfileProperties.results.find(
          (prop) => prop.Key == "WorkPhone"
        ).Value
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
  data = { user, callback };

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

function SPList(listDef) {
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
  self.createListItem = function (valuePairs, callback, folderName = "") {
    //self.updateConfig();
    var oList = self.config.listRef;

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
  };

  /*****************************************************************
                                getListItems      
    ******************************************************************/
  self.getListItems = function (caml, callback) {
    /*
        Obtain all list items that match the querystring passed by caml.
        */
    //self.updateConfig();
    console.log("context loaded", self.config);
    var camlQuery = new SP.CamlQuery.createAllItemsQuery();

    camlQuery.set_viewXml(caml);
    let collListItem = self.config.listRef.getItems(camlQuery);

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
          this.def.name
        } failed, producing the following error: \n ${args.get_message()} \nStackTrack: \n ${args.get_stackTrace()}`
      );
    }
    let data = {
      collListItem,
      callback,
      def: this.config.def,
    };

    self.config.currentContext.load(collListItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onGetListItemsSucceeded),
      Function.createDelegate(data, onGetListItemsFailed)
    );
  };

  /*****************************************************************
                            updateListItem      
    ******************************************************************/
  self.updateListItem = function (id, valuePairs, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    //self.updateConfig();
    var oList = self.config.listRef;

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
  };

  /*****************************************************************
                            deleteListItem      
    ******************************************************************/
  self.deleteListItem = function (id, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    self.callbackDeleteListItem = callback;
    //self.updateConfig();
    var oList = self.config.listRef;

    this.oListItem = oList.getItemById(id);
    this.oListItem.deleteObject();

    self.config.currentContext.executeQueryAsync(
      onDeleteListItemsSucceeded.bind(this),
      onQueryFailed.bind(this)
    );
  };

  function onDeleteListItemsSucceeded(sender, args) {
    //alert('Item updated!');
    self.callbackDeleteListItem();
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
  self.setItemPermissions = function (id, valuePairs, removeCurUser = false) {
    //TODO: Validate that the groups and permissions exist on the site.
    var users = new Array();
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    let oListItem = oList.getItemById(id);
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);

    if (removeCurUser) {
      oListItem
        .get_roleAssignments()
        .getByPrincipal(sal.globalConfig.currentUser)
        .deleteObject();
    }

    valuePairs.forEach((vp) => {
      let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
        currCtx
      );
      let resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
      if (resolvedGroup) {
        roleDefBindingColl.add(web.get_roleDefinitions().getByName(vp[1]));
        oListItem.get_roleAssignments().add(resolvedGroup, roleDefBindingColl);
      } else {
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        // ensureUser(vp[0], (resolvedUser) => {
        //   self.setItemPermissionsUser(id, resolvedUser, vp[1]);
        // });
      }
    });

    function onUpdatePermsSucceeded() {
      console.log(
        "Successfully set group permissions on " +
          this.oListItem.get_item("Title")
      );
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      var oList = web.get_lists().getByTitle(self.config.def.title);

      let iListItem = oList.getItemById(id);
      users.forEach((userPairs) => {
        let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
          currCtx
        );
        roleDefBindingColl.add(
          web.get_roleDefinitions().getByName(userPairs[1])
        );
        iListItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
      });

      currCtx.load(iListItem);
      currCtx.executeQueryAsync(
        () => console.log("Successfully set user perms"),
        (sender, args) => console.error("Failed to set user perms", args)
      );
    }

    function onUpdatePermsFailed(sender, args) {
      console.error(
        "Failed to update permissions on item: " +
          this.title +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );
    }
    let data = { id, oListItem, users };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oListItem);
    users.map((user) => currCtx.load(user[0]));
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdatePermsSucceeded),
      Function.createDelegate(data, onUpdatePermsFailed)
    );
  };

  self.setItemPermissionsUser = function (id, ensuredUser, permission) {
    //Expect a fully resolved SP.User.
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    let oListItem = oList.getItemById(id);
    // oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);

    let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
      currCtx
    );

    roleDefBindingColl.add(web.get_roleDefinitions().getByName(permission));
    oListItem.get_roleAssignments().add(ensuredUser, roleDefBindingColl);

    function onUpdatePermsSucceeded() {
      console.log(
        "Successfully set permissions on " + this.oListItem.get_item("Title")
      );
    }

    function onUpdatePermsFailed(sender, args) {
      console.error(
        "Failed to update permissions on user: " +
          this.title +
          args.get_message() +
          "\n" +
          args.get_stackTrace(),
        false
      );
    }
    let data = { oListItem: oListItem };
    //let data = { title: oListItem.get_item("Title"), oListItem: oListItem };

    currCtx.load(oListItem);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onUpdatePermsSucceeded),
      Function.createDelegate(data, onUpdatePermsFailed)
    );
  };

  /*****************************************************************
                            getFolderContents          
    ******************************************************************/
  self.getFolderContents = function (folderName, callback) {
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
  };

  /*****************************************************************
                                  
    ******************************************************************/

  self.showModal = function (formName, title, args, callback) {
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
  };

  self.uploadNewDocument = function (folder, title, args, callback) {
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
  };

  self.createFolder = function (folderName, callback, requestingOffice = null) {
    // Used in document libraries
    self.requestedCallback = callback;

    if (requestingOffice) {
      var folder = self.config.listRef
        .get_rootFolder()
        .get_folders()
        .add(folderName);
    } else {
      var folder = self.config.listRef
        .get_rootFolder()
        .get_folders()
        .add(folderName);
    }
    function onCreateFolderSucceeded(sender, args) {
      this.callback();
    }

    let data = { folderName, callback, folder };
    self.config.currentContext.load(folder);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateFolderSucceeded),
      onQueryFailed
    );
  };

  self.createListFolder = function (folderName, callback, path = "") {
    // Used for lists, duh
    self.requestedCallback = callback;

    var itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName(folderName);
    if (path) {
      let folderUrl =
        sal.globalConfig.siteUrl +
        "/Lists/" +
        self.config.def.name +
        "/" +
        path;
      itemCreateInfo.set_folderUrl(folderUrl);
    }

    var newItem = self.config.listRef.addItem(itemCreateInfo);
    newItem.set_item("Title", folderName);

    newItem.update();

    function onCreateFolderSucceeded(sender, args) {
      this.callback(this.newItem.get_id());
    }

    let data = { folderName, callback, newItem };

    self.config.currentContext.load(newItem);
    self.config.currentContext.executeQueryAsync(
      Function.createDelegate(data, onCreateFolderSucceeded),
      onQueryFailed
    );
  };

  self.createFolderRec = function (folderUrl, success) {
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
  };

  self.setLibFolderPermissions = function (
    path,
    valuePairs,
    removeCurUser = false
  ) {
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
        //This doesn't appear to be a group, let's see if we can find them
        users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
      }
    });

    function onFindFolderSuccess() {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();

      let folderItem = this.folder.get_listItemAllFields();
      folderItem.breakRoleInheritance(false, false);

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

      currCtx.load(folderItem);
      currCtx.executeQueryAsync(
        () => console.log("Successfully set permissions"),
        (sender, args) => console.error("Failed to set lib folder permissions")
      );
    }

    function onFindFolderFailure(sender, args) {
      console.error(
        "Something went wrong setting perms on library folder",
        args
      );
    }

    var data = { folder, users, resolvedGroups, valuePairs };

    users.map((user) => currCtx.load(user[0]));
    currCtx.load(folder);
    currCtx.executeQueryAsync(
      Function.createDelegate(data, onFindFolderSuccess),
      Function.createDelegate(data, onFindFolderFailure)
    );
  };

  self.showListView = function (filter) {
    // Redirect to the default sharepoint list view
    listUrl =
      sal.globalConfig.siteUrl +
      "/Lists/" +
      config.listName +
      "/AllItems.aspx" +
      filter;
    window.location.assign(listUrl);
  };
}
