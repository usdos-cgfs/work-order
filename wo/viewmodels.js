// console.log('viewmodel loaded');
/************************************************************
 * Generic Viewmodels
 ************************************************************/
woViews = {
    pu10k: {
        name: 'Purchase Under 10k',
        id: '#wo-pu10k',
        hasAttachments: true,
        attachmentDesc: 'Please attach the quote for your purchase request.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0,
            },
            1: {
                type: 'Adjudication',
                displayName: 'Submitted to Managing Director',
                progress: 20,
            },
            2: {
                type: 'Adjudication',
                displayName: 'Submitted to DED',
                adjudicator: 'washdc\\backlundpf',
                progress: 40,
            },
            3: {
                type: 'Assignment',
                displayName: 'Submitted to Budget Officer',
                isActionable: false,
                progress: 60,
            },
            4: {
                type: 'Assignment',
                displayName: 'Submitted for Obligation of Funds',
                isActionable: false,
                progress: 80,
            },
            5: {
                type: 'Assignment',
                displayName: 'Submitted to Card Holder',
                progress: 90,
            },
        },
        listDef: {
            name: 'st_pu10k',
            title: 'st_pu10k',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'Description': { type: 'Text', koMap: 'pu10kDescription' },
                'CostEst': { type: 'Text', koMap: 'pu10kCostEst' },
                'CurrentStage': { type: 'Text', koMap: 'pu10kStage' },
            }
        }
    },
    tel: {
        name: 'Telephone',
        id: '#wo-tel',
        hasAttachments: true,
        attachmentDesc: 'Attach Approvals - This work order can not be submitted until approved email is uploaded.',
        listDef: {
            name: 'st_telephone',
            title: 'st_telephone',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'empty' }
            }
        },
    },
    presentation: {
        name: 'Presentation',
        id: '#wo-presentation',
        hasAttachments: false,
        listDef: {
            name: 'st_telephone',
            title: 'st_telephone',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'empty' }
            },
        },
    },
    rsa: {
        name: 'RSA Token',
        id: '#wo-rsa',
        hasAttachments: false,
        attachmentDesc: 'Please attach the quote for your purchase request.',
        listDef: {
            name: 'st_telephone',
            title: 'st_telephone',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'empty' }
            },
        },
    },
}

var managingDirectors = {
    'Select': '',
    'CGFS/F': 'Lugo, Joan',
    'CGFS/GC': 'Self, Amy',
    'CGFS/S/CST': 'Sizemore, Richard',
    'CGFS/GSO': 'Bowers, Susan',
}


/************************************************************
 * Set SharePoint definitions here for use with SAL
 ************************************************************/
var workOrderListDef = {
    name: 'WorkOrder',
    title: 'Work Order',
    viewFields: {
        'ID': { type: 'Text', koMap: 'empty' },
        'Title': { type: 'Text', koMap: 'requestID' },
        'ManagingDirector': { type: 'Person', koMap: 'requestorManager' },
        'RequestType': { type: 'Text', koMap: 'requestServiceTypeName' },
        'RequestorName': { type: 'Text', koMap: 'requestorName' },
        'RequestorPhone': { type: 'Text', koMap: 'requestorTelephone' },
        'RequestorEmail': { type: 'Text', koMap: 'requestorEmail' },
        'RequestorOffice': { type: 'Text', koMap: 'requestorOffice' },
        'RequestStage': { type: 'Text', koMap: 'requestStage' },
        'Created': { type: 'Date', koMap: 'requestSubmittedDate' },
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
        'Title': { type: 'Text', koMap: 'empty' },
        'WorkOrderID': { type: 'Text', koMap: 'empty' },
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

    self.empty = ko.observable();

    // What page is the user on? App, Approval, Admin
    self.page = ko.observable();
    self.showWorkOrder = function (workorder) {
        console.log('clicked', workorder);
        viewWorkOrder(workorder.Title);
    };
    /************************************************************
     * Hold a reference to each of our SAL items
     ************************************************************/
    self.listRefWO = ko.observable();
    self.libRefWODocs = ko.observable();
    self.listRefApproval = ko.observable();
    self.listRefAssignment = ko.observable();

    self.listRefpu10k = ko.observable();
    self.listReftel = ko.observable();
    self.listRefpresentation = ko.observable();
    self.listRefrsa = ko.observable();

    /************************************************************
     * Hold current info about our lists
     ************************************************************/
    self.woCount = ko.observable();
    self.allOpenOrders = ko.observableArray();
    self.assignedOpenOrders = ko.observableArray();

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
        return self.currentView() == 'view' && self.page() != 'approval';
    });

    self.showRouting = ko.pureComputed(function () {
        return self.page() == 'admin';
    })

    /************************************************************
     * Observables for each work order type here
     ************************************************************/

    /************************************************************
    * Observables for work order header
    ************************************************************/
    self.requestID = ko.observable(); // This is the key that will map everything together.

    self.requestHeader = ko.observable(); // This is the raw JSON object returned by the work order query.
    self.serviceTypeHeader = ko.observable(); // This is the raw JSON object object returned by the service type query.

    // Requestor/Header Info
    self.requestorName = ko.observable();
    self.requestorTelephone = ko.observable();
    self.requestorEmail = ko.observable();
    self.requestorManager = ko.observable();


    self.requestStage = ko.observable('0');

    self.requestStageName = ko.pureComputed({
        read: function () {
            if (self.requestServiceType()) {
                return woViews[self.requestServiceType()].pipeline[self.requestStage()].displayName
            } else {
                return ''
            }
        }
    })

    self.requestorOffice = ko.observable();

    self.requestorOfficeOptions = ko.observable(Object.keys(managingDirectors));

    self.requestSubmittedDate = ko.observable();

    self.requestServiceType = ko.observable();
    self.requestServiceTypeName = ko.pureComputed({
        read: function () {
            if (this.requestServiceType()) {
                return woViews[this.requestServiceType()].name;
            } else {
                return '';
            }
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
        if (self.requestServiceType()) {
            return woViews[self.requestServiceType()].hasAttachments == true;
        } else {
            return false;
        }
    })

    self.requestServiceType.subscribe(function () {
        self.requestListDef(woViews[self.requestServiceType()])
    })

    self.requestListDef = ko.observable();


    // Deal with progress/stages here.
    self.requestProgress = ko.observable();
    self.requestStage.subscribe(function () {
        if (self.requestServiceType() && self.requestStage()) {
            self.requestProgress(
                woViews[self.requestServiceType()].pipeline[self.requestStage()].progress
            )
        }
    })

    self.hasProgressBar = ko.pureComputed(function () {
        if (!self.requestServiceType()) {
            return false;
        } else {
            return woViews[self.requestServiceType()].hasStages && self.requestProgress() > 0;
        }
    })

    self.requestorOffice.subscribe(function () {
        // When the requesting office changes, so changes the manager
        self.requestorManager(
            managingDirectors[self.requestorOffice()]
        )
    })

    self.requestProgress.subscribe(function () {
        //console.log('Progress: ', self.request)
        $('#wo-progress-bar').progressbar('option', { value: self.requestProgress() })
    })

    self.requestAttachmentDesc = ko.pureComputed(function () {
        if (self.requestServiceType() && woViews[self.requestServiceType()].hasAttachments) {
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

        return self.currentView() != 'new'
            && self.pu10kStage() == 'Submitted to Managing Director';
    })

    /************************************************************
    * Telephone
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

/* Binding handlers */
// ko.bindingHandlers.nicedit = {
//     init: function(element, valueAccessor) {
//         console.log('initing nicedit')

//         var value = valueAccessor();
//         var area = new nicEditor({fullPanel : true}).panelInstance(element.id, {hasPanel : true});
//         $(element).text(ko.utils.unwrapObservable(value)); 

//         // function for updating the right element whenever something changes
//         var textAreaContentElement = $($(element).prev()[0].childNodes[0]);
//         var areachangefc = function() {
//             value(textAreaContentElement.html());
//         };

//         // Make sure we update on both a text change, and when some HTML has been added/removed
//         // (like for example a text being set to "bold")
//         $(element).prev().keyup(areachangefc);
//         $(element).prev().bind('DOMNodeInserted DOMNodeRemoved', areachangefc);
//     },
//     update: function(element, valueAccessor) {
//         console.log('updating nicedit')
//         var value = valueAccessor();
//         var textAreaContentElement = $($(element).prev()[0].childNodes[0]);
//         textAreaContentElement.html(value());
//     }
// };

// ko.bindingHandlers.trix = {
//     init: function(element, valueAccessor) {
//         console.log(element)
//         var value = valueAccessor();
//         var areachangefc = function() {
//             console.log('change registered')
//             value(textAreaContentElement.html());
//         };
//         var textAreaContentElement = $(element);
//         //$(element).keyup(areachangefc);
//         $(element).bind('DOMNodeInserted DOMNodeRemoved', areachangefc)
//         textAreaContentElement.html(valueAccessor());
//     }
// }

var camlq = '<Query></Query>';
var callback = function (items) { console.log(items) };