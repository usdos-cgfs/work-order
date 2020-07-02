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
  sal.globalConfig.siteUrl = _spPageContextInfo.webServerRelativeUrl;
  //sal.globalConfig.user =
  sal.globalConfig.listServices = "../_vti_bin/ListData.svc/";

  sal.globalConfig.currentContext = new SP.ClientContext.get_current();
  sal.globalConfig.website = sal.globalConfig.currentContext.get_web();
  //sal.site = sal.siteConnection;

  var user = sal.globalConfig.website.get_currentUser(); //must load this to access info.
  sal.globalConfig.currentContext.load(user);
  sal.globalConfig.currentContext.executeQueryAsync(
    function () {
      sal.globalConfig.currentUser = user;
      //alert("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
    },
    function () {
      alert(":(");
    }
  );
  // console.log()
}

sal.siteConnection = function () {
  function userInGroup(group) {
    $().SPServices({
      operation: "GetGroupCollectionFromUser",
      userLoginName: $().SPServices.SPGetCurrentUser(),
      async: false,
      completefunc: function (xData, Status) {
        if (
          $(xData.responseXML).find('Group[Name="' + group + '"]').length == 1
        ) {
          alert("login inside of the Group user");
        } else {
          alert("login outside of the Group user");
        }
      },
    });
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
    alert(
      "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
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
  self.createListItem = function (valuePairs, callback) {
    console.log("sal function", this);
    self.callbackCreateListItem = callback;
    //self.updateConfig();
    var oList = self.config.listRef;
    console.log("context loaded: ", oList);

    var itemCreateInfo = new SP.ListItemCreationInformation();
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
    var camlQuery = new SP.CamlQuery();
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
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      //console.log(oListItem);
      var listObj = {};
      var keys = [];
      $.each(this.config.def.viewFields, function (field, obj) {
        keys.push(field);
      });
      console.log("keys", keys);
      $.each(keys, function (idx, item) {
        var getItem = oListItem.get_item(item);
        console.log("getting: " + item + " " + getItem);
        //console.log(getItem)
        //console.log(item + ' item: ', getItem)
        listObj[item] = getItem;
      });
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
    options.url =
      sal.globalConfig.siteUrl +
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

    options.args = JSON.stringify(args);
    options.url =
      sal.globalConfig.siteUrl +
      "/_layouts/Upload.aspx?List=" +
      self.config.guid +
      "&RootFolder=" +
      sal.globalConfig.siteUrl +
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
