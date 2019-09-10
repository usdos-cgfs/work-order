console.log('viewmodel loaded');
/************************************************************
 * Generic Viewmodels
 ************************************************************/
woViews = {
    select: {
        name: 'Select One',
        hasAttachments: false,
    },
    pu10k: {
        name: 'Purchase Under 10k',
        id: '#wo-pu10k',
        hasAttachments: true,
        attachmentDesc: 'Please attach the quote for your purchase request.',
        hasStages: true,
        stages: [
            { stage: 'Submitted to Managing Director', progress: '20' },
            { stage: 'Submitted to DED', progress: '40' },
            { stage: 'Rejected by DED', progress: '20' },
            { stage: 'Submitted to Budget Officer', progress: '60' },
            { stage: 'Rejected by Budget Officer', progress: '20' },
            { stage: 'Submitted for Obligation of Funds', progress: '80' },
            { stage: 'Submitted to Card Holder', progress: '90' },
        ]
    },
    tel: {
        name: 'Telephone',
        id: '#wo-tel',
        hasAttachments: true,
        attachmentDesc: 'Attach Approvals: WO can not be submitted until fully approved email is uploaded.',
    },
    presentation: {
        name: 'Presentation',
        id: '#wo-presentation',
        hasAttachments: false,
    },
    rsa: {
        name: 'RSA Token',
        id: '#wo-rsa',
        hasAttachments: false,
        attachmentDesc: 'Please attach the quote for your purchase request.'
    },
}

var managingDirectors = {
    'Select': '',
    'CGFS/F': 'Joan Lugo',
    'CGFS/GC': 'Amy Self',
    'CGFS/S/CST': 'Richard Sizemore',
    'CGFS/GSO': 'Susan Bowers',
}


/************************************************************
 * Set SharePoint definitions here for use with SAL
 ************************************************************/
var workOrderListDef = {
    name: 'WorkOrder',
    title: 'Work Order',
    viewFields: {
        'Title': { type: 'Text', koMap: 'requestID' },
        'ManagingDirector': { type: 'Person', koMap: 'requestorManager' },
        'RequestType': { type: 'Text', koMap: 'requestServiceTypeName' },
        'RequestorName': { type: 'Text', koMap: 'requestorName' },
        'RequestorPhone': { type: 'Text', koMap: 'requestorTelephone' },
        'RequestorEmail': { type: 'Text', koMap: 'requestorEmail' },
        'RequestorOffice': { type: 'Text', koMap: 'requestorOffice' },
    }
};

var approvalListDef = {
    name: 'Adjudication',
    title: 'Adjudication',
    viewFields: {
        'Title': { type: 'Text', koMap: 'requestID' },
        'Adjudication': { type: 'Choice', koMap: 'empty' },
        'Comment': { type: 'Text', koMap: 'empty' },
        'Author': { type: 'Text', koMap: 'empty' },
        'Created': { type: 'Text', koMap: 'empty' },
    }
}

var assignmentListDef = {
    name: 'Assignment',
    title: 'Assignment',
    viewFields: {
        'Title': { type: 'Text', koMap: 'empty' },
        'Assignee': { type: 'Person', koMap: 'empty' },
        'Role': { type: 'Text', koMap: 'empty' },
        'Author': { type: 'Text', koMap: 'empty' },
        'Created': { type: 'Text', koMap: 'empty' },
    }
}

var workOrderDocDef = {
    name: 'WorkOrderDocuments',
    title: 'Work Order Documents',
    viewFields: {
        'Title': { type: 'Text', koMap: 'empty' }
    }
}

var pu10kListDef = {
    name: 'st_pu10k',
    title: 'st_pu10k',
    viewFields: {
        'Title': { type: 'Text', koMap: 'requestID' },
        'Description': { type: 'Text', koMap: 'pu10kDescription' },
        'CostEst': { type: 'Text', koMap: 'pu10kCostEst' },
        'CurrentStage': { type: 'Text', koMap: 'pu10kStage' },
    }
};

/************************************************************
 * Set Knockout View Model
 ************************************************************/
function koviewmodel() {
    var self = this;

    self.showWorkOrder = function (workorder) {
        console.log('clicked', workorder);
        viewWorkOrder(workorder.Title);
    };
    /************************************************************
     * Hold a reference to each of our SAL items
     ************************************************************/
    self.listRefWO = ko.observable();
    self.libRefWODocs = ko.observable();
    self.listRefpu10k = ko.observable();
    self.listRefApproval = ko.observable();
    self.listRefAssignment = ko.observable();

    /************************************************************
     * Hold current info about our lists
     ************************************************************/
    self.woCount = ko.observable();
    self.allOpenOrders = ko.observableArray();

    /************************************************************
     * Hold generic Work Order vars
     ************************************************************/
    // The available service types (we'll set this from a json array)
    self.requestServiceTypes = ko.observableArray();

    self.currentView = ko.observable();

    self.requestAttachments = ko.observableArray();

    self.requestApprovals = ko.observableArray();

    self.requestAssignees = ko.observableArray();


    //self.getApprovalAuthor = function (approval) {
    //    console.log('getting author', approval)
    //    return approval.Author.get_lookupValue();
    //}


    /************************************************************
     * Declare our form input computed functions
     ************************************************************/
    self.canSaveForm = ko.pureComputed(function () {
        return self.currentView() == 'new' || self.currentView() == 'edit';
    });

    self.canEditForm = ko.pureComputed(function () {
        return self.currentView() == 'view';
    });

    self.showRouting = ko.pureComputed(function () {
        return self.requestProgress() == 40;
    })

    /************************************************************
     * Observables for each work order type here
     ************************************************************/

    /************************************************************
    * Observables for work order header
    ************************************************************/
    self.requestID = ko.observable(); // This is the key that will map everything together.

    self.requestHeader = ko.observable(); // Let this be our sharepoint object

    // Requestor/Header Info
    self.requestorName = ko.observable();
    self.requestorTelephone = ko.observable();
    self.requestorEmail = ko.observable();
    self.requestorManager = ko.pureComputed(function () {
        return managingDirectors[self.requestorOffice()];
    });

    self.requestStage = ko.observable('');

    self.requestorOffice = ko.observable();

    self.requestorOfficeOptions = ko.observable(Object.keys(managingDirectors));

    self.requestSubmittedDate = ko.observable();

    self.requestServiceType = ko.observable('select');
    self.requestServiceTypeName = ko.pureComputed({
        read: function () {
            return woViews[this.requestServiceType()].name;
        },
        write: function (value) {
            $.each(woViews, function (key) {
                if (woViews[key].name == value) {
                    self.requestServiceType(key.toString());
                }
            })
        },
        owner: this,
    }, this);

    self.requestServiceTypeHasAttachments = ko.pureComputed(function () {
        return woViews[self.requestServiceType()].hasAttachments == true;
    })

    // Deal with progress/stages here.
    self.requestProgress = ko.observable();
    self.hasProgressBar = ko.pureComputed(function () {
        return woViews[self.requestServiceType()].hasStages && self.requestProgress() > 0;
    })

    self.requestProgress.subscribe(function () {
        //console.log('Progress: ', self.request)
        $('#wo-progress-bar').progressbar('option', { value: self.requestProgress() })
    })

    self.requestAttachmentDesc = ko.pureComputed(function () {
        if (woViews[self.requestServiceType()].hasAttachments) {
            return woViews[self.requestServiceType()].attachmentDesc;
        } else {
            return '';
        }
    })
    /************************************************************
     * Purchase Under 10k
     ************************************************************/
    self.pu10kDescription = ko.observable();
    self.pu10kCostEst = ko.observable();
    self.pu10kStage = ko.observable();

    self.pu10kShowAdmin = ko.pureComputed(function () {
        return self.currentView() != 'new' && self.pu10kStage() == 'Submitted to Managing Director';
    })

    /************************************************************
    * Purchase Under 10k
    ************************************************************/
    self.telServiceTypes = ko.observableArray([
        'Installation', 'Move', 'Issues', 'Password Reset'
    ]);

    self.telSelectedType = ko.observable('Installation');
    self.telTo = ko.observable();
    self.telFrom = ko.observable();

    self.telDesc = ko.observable();

    /************************************************************
    * Presentation
    ************************************************************/
    self.presentationServiceTypes = ko.observableArray([
        'DVC', 'Conference Room', 'Presentation'
    ]);

    self.presentationSelectedType = ko.observable();

    self.presentationCallTypes = ko.observableArray([
        'Incoming', 'Outgoing'
    ])
    self.presentationCallType = ko.observable();

    self.presentationDialOuts = ko.observableArray([
        '202-555-1992', '202-555-1993', '202-555-1123', '202-555-1155'
    ])
    self.presentationDialOut = ko.observable();

    self.presentationConnectionTypes = ko.observableArray(['Open', 'DSN', 'IP'])
    self.presentationConnectionType = ko.observable();
}

var camlq = '<Query></Query>';
var callback = function (items) { console.log(items) };