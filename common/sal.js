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
      sal.globalConfig.siteGroups = m_fnLoadSiteGroups(siteGroupCollection);
      //alert("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
    },
    function () {
      alert(":(");
    }
  );
  // console.log()
}
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
        {
            name: 'GFMS Systems List',
            title: 'GFMS Systems List',
            viewFields: [
                'Title', 'Program', 'Index', 'System', 'Level', 'System Manager',
            ],
            childLists: [{name: 'Agreements Dashboard', key: {source: 'Title', target: 'System'}}],
            childLibraries: [{lib: this.libraries.subLib0, key: {source: 'Title', target: 'System'}}]
        }
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
    console.log("sal function", this);
    self.callbackCreateListItem = callback;
    //self.updateConfig();
    var oList = self.config.listRef;
    console.log("context loaded: ", oList);

    var itemCreateInfo = new SP.ListItemCreationInformation();
    if (folderName) {
      let folderUrl =
        sal.globalConfig.siteUrl +
        "/Lists/" +
        self.config.def.name +
        "/" +
        folderName;
      itemCreateInfo.set_folderUrl(folderUrl);
      console.log(folderUrl);
    }
    this.oListItem = oList.addItem(itemCreateInfo);
    for (i = 0; i < valuePairs.length; i++) {
      this.oListItem.set_item(valuePairs[i][0], valuePairs[i][1]);
    }
    this.oListItem.update();

    self.config.currentContext.load(this.oListItem);
    self.config.currentContext.executeQueryAsync(
      onCreateListItemSucceeded.bind(this),
      Function.createDelegate(this, onQueryFailed)
    );
  };

  onCreateListItemSucceeded = function () {
    var self = this;
    console.log("sal callback", this);
    //alert('Item created: ' + this.oListItem.get_id());
    console.log("calling callback create");

    self.callbackCreateListItem(this.oListItem.get_id());
  };

  /*****************************************************************
                                getListItems      
    ******************************************************************/
  self.getListItems = function (caml, callback) {
    /*
        Obtain all list items that match the querystring passed by caml.
        */
    self.callbackGetListItem = callback;
    //self.updateConfig();
    console.log("context loaded", self.config);
    var camlQuery = new SP.CamlQuery.createAllItemsQuery();

    camlQuery.set_viewXml(caml);
    self.collListItem = self.config.listRef.getItems(camlQuery);
    self.config.currentContext.load(self.collListItem);
    self.config.currentContext.executeQueryAsync(
      onGetListItemsSucceeded.bind(this),
      onQueryFailed.bind(this)
    );
  };

  onGetListItemsSucceeded = function (sender, args) {
    var self = this;
    var listItemEnumerator = self.collListItem.getEnumerator();
    self.focusedItems = [];
    console.log("Get list succeeded");
    var keys = [];
    $.each(this.config.def.viewFields, function (field, obj) {
      keys.push(field);
    });
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      //console.log(oListItem);
      var listObj = {};
      console.log("keys", keys);
      $.each(keys, function (idx, item) {
        var getItem = oListItem.get_item(item);
        console.log("getting: " + item + " " + getItem);
        //console.log(getItem)
        //console.log(item + ' item: ', getItem)
        listObj[item] = getItem;
      });
      listObj.oListItem = oListItem;
      self.focusedItems.push(listObj);
    }
    //this.setState({ focusedItems })
    console.log("calling callback get list");
    self.callbackGetListItem(self.focusedItems);
  };

  /*****************************************************************
                            updateListItem      
    ******************************************************************/
  self.updateListItem = function (id, valuePairs, callback) {
    //[["ColName", "Value"], ["Col2", "Value2"]]
    self.callbackUpdateListItem = callback;
    //self.updateConfig();
    var oList = self.config.listRef;

    this.oListItem = oList.getItemById(id);
    for (i = 0; i < valuePairs.length; i++) {
      this.oListItem.set_item(valuePairs[i][0], valuePairs[i][1]);
    }

    //oListItem.set_item('Title', 'My Updated Title');
    this.oListItem.update();

    self.config.currentContext.load(this.oListItem);
    self.config.currentContext.executeQueryAsync(
      onUpdateListItemsSucceeded.bind(this),
      onQueryFailed.bind(this)
    );
  };

  function onUpdateListItemsSucceeded(sender, args) {
    //alert('Item updated!');
    self.callbackUpdateListItem();
  }

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
  self.setItemPermissions = function (id, valuePairs) {
    //TODO: Validate that the groups and permissions exist on the site.
    var currCtx = new SP.ClientContext.get_current();
    var web = currCtx.get_web();

    var oList = web.get_lists().getByTitle(self.config.def.title);

    let oListItem = oList.getItemById(id);
    oListItem.resetRoleInheritance();
    oListItem.breakRoleInheritance(false, false);

    valuePairs.forEach((vp) => {
      let roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(
        currCtx
      );
      roleDefBindingColl.add(web.get_roleDefinitions().getByName(vp[1]));
      oListItem
        .get_roleAssignments()
        .add(sal.getSPSiteGroupByName(vp[0]), roleDefBindingColl);
    });

    oListItem
      .get_roleAssignments()
      .getByPrincipal(sal.globalConfig.currentUser)
      .deleteObject();

    function onUpdatePermsSucceeded() {
      console.log(
        "Successfully set permissions on " + this.oListItem.get_item("Title")
      );
    }

    function onUpdatePermsFailed(sender, args) {
      SP.UI.Notify.addNotification(
        "Failed to update permissions on item: " +
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
    this.callbackGetFolderContents = callback;
    var folder = sal.globalConfig.website.getFolderByServerRelativeUrl(
      sal.globalConfig.siteUrl +
        "/" +
        self.config.def.name +
        "/" +
        encodeURI(folderName)
    );
    this.files = folder.get_files();

    self.config.currentContext.load(this.files);
    self.config.currentContext.executeQueryAsync(
      onGetListFilesSucceeded.bind(this),
      ongetListFilesFailed.bind(this)
    );
  };

  onGetListFilesSucceeded = function (sender, args) {
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
      });
    }
    console.log("filearr", fileArr);
    console.log("this", this);
    console.log("self", self);
    this.callbackGetFolderContents(fileArr);
  };

  ongetListFilesFailed = function (sender, args) {
    // let's log this but suppress any alerts
    console.log("WARN: something went wrong fetching files", args);
  };

  /*****************************************************************
                                  
    ******************************************************************/

  self.showModal = function (formName, title, args, callback) {
    var id = "";
    var options = SP.UI.$create_DialogOptions();
    options.title = title;
    options.dialogReturnValueCallback = callback;
    if (args.id) {
      id = getItemId(args.id.fieldRef, args.id.valueType, args.id.value);
      //alert(id);
    }
    options.args = JSON.stringify(args);

    let siteString =
      sal.globalConfig.siteUrl == "/" ? "" : sal.globalConfig.siteUrl;

    options.url =
      siteString +
      "/Lists/" +
      self.config.def.name +
      "/" +
      formName +
      "?ID=" +
      id +
      "&Source=" +
      location.pathname;
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

  self.createFolder = function (folderName, callback) {
    // Used in document libraries
    self.requestedCallback = callback;

    var folder = self.config.listRef
      .get_rootFolder()
      .get_folders()
      .add(folderName);
    self.config.currentContext.load(folder);
    self.config.currentContext.executeQueryAsync(function () {
      self.requestedCallback();
    }, onQueryFailed);
  };

  self.createListFolder = function (folderName, callback) {
    // Used for lists, duh
    self.requestedCallback = callback;

    var itemCreateInfo = new SP.ListItemCreationInformation();
    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
    itemCreateInfo.set_leafName(folderName);
    var newItem = self.config.listRef.addItem(itemCreateInfo);
    newItem.set_item("Title", folderName);

    newItem.update();

    self.config.currentContext.load(newItem);
    self.config.currentContext.executeQueryAsync(function () {
      self.requestedCallback();
    }, onQueryFailed);
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
