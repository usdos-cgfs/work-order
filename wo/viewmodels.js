// console.log('viewmodel loaded');
/************************************************************
 * Generic Viewmodels
 ************************************************************/
woViews = {
    pu10k: {
        name: 'Purchase Under 10k',
        description: '<div><p>Purchases Under 10k require the following:</p><ul><li>Quote</li><li>Description</li></ul></div>',
        icon: '<i class="fa fa-credit-card fa-5x" aria-hidden="true"></i>',
        daysToClose: 5,
        id: '#wo-pu10k',
        hasAttachments: true,
        attachmentDesc: 'Please attach the quote for your purchase request.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Managing Director Approval',
                progress: 20
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                adjudicator: 'washdc\\backlundpf',
                progress: 40
            },
            3: {
                type: 'Action',
                displayName: 'Card Holder Purchasing',
                progress: 90
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 100
            }
        },
        listDef: {
            name: 'st_pu10k',
            title: 'st_pu10k',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'Description': { type: 'Text', koMap: 'pu10kDescription' },
                'CostEst': { type: 'Text', koMap: 'pu10kCostEst' },
                'CurrentStage': { type: 'Text', koMap: 'pu10kStage' }
            }
        }
    },
    tel: {
        name: 'Telephone',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-phone fa-5x" aria-hidden="true"></i>',
        daysToClose: 2,
        id: '#wo-tel',
        hasAttachments: true,
        attachmentDesc: 'Attach Approvals - This work order can not be submitted until approved email is uploaded.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Manager/Supervisor Approval',
                isActionable: false,
                progress: 30
            },
            2: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 0
            }
        },
        listDef: {
            name: 'st_telephone',
            title: 'st_telephone',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'PhoneNum': { type: 'Text', koMap: 'telPhoneNum' },
                'Location': { type: 'Text', koMap: 'telLocation' },
                'RequestType': { type: 'Text', koMap: 'telSelectedType' },
                'To': { type: 'Text', koMap: 'telTo' },
                'From': { type: 'Text', koMap: 'telFrom' },
                'Description': { type: 'Text', koMap: 'telDesc' }
            }
        }
    },
    presentation: {
        name: 'Presentation',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-desktop fa-5x" aria-hidden="true"></i>',
        daysToClose: 1,
        id: '#wo-presentation',
        hasAttachments: false,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Manager/Supervisor Approval',
                isActionable: false,
                progress: 30
            },
            2: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 0
            }
        },
        listDef: {
            name: 'st_presentation',
            title: 'st_presentation',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'empty' }
            }
        }
    },
    access: {
        name: 'Building Access',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-check-double fa-5x" aria-hidden="true"></i>',
        daysToClose: 3,
        id: '#wo-access',
        hasAttachments: true,
        attachmentDesc: 'Please Add building access request attachments.',
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Manager/Supervisor Approval',
                isActionable: false,
                progress: 30
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                isActionable: false,
                progress: 30
            },
            3: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 0
            }
        },
        listDef: {
            name: 'st_access',
            title: 'st_access',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'empty' },
                'AccessType': { type: 'Text', koMap: 'accessType' },
                'EmployeeType': { type: 'Text', koMap: 'accessEmployeeType' },
                'Description': { type: 'Text', koMap: 'accessDesc' },
                'SpecialInstructions': { type: 'Text', koMap: 'accessSpecInst' }
            }
        }
    },
    property: {
        name: 'Property/Asset Management',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-warehouse fa-5x" aria-hidden="true"></i>',
        daysToClose: 5,
        id: '#wo-property',
        hasAttachments: true,
        attachmentDesc: 'Please attach the Recieving Report.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Managing Director Approval',
                progress: 20
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                adjudicator: 'washdc\\backlundpf',
                progress: 40
            },
            3: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 100
            }
        },
        listDef: {
            name: 'st_property',
            title: 'st_property',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'PropertyTransfer': { type: 'Bool', koMap: 'propertyTransfer' },
                'ExcessProperty': { type: 'Bool', koMap: 'propertyExcess' },
                'RecievingReport': { type: 'Text', koMap: 'propertyRecievingReport' },
                'SerialNumber': { type: 'Text', koMap: 'propertySerialNumber' },
                'PropertyLocation': { type: 'Text', koMap: 'propertyLocation' },
            }
        }
    },
    facilities: {
        name: 'Facilities/Building Services',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-tools fa-5x" aria-hidden="true"></i>',
        daysToClose: 5,
        id: '#wo-facilities',
        hasAttachments: true,
        attachmentDesc: 'Please add Facilities/Building attachments.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Managing Director Approval',
                progress: 20
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                adjudicator: 'washdc\\backlundpf',
                progress: 40
            },
            3: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 100
            }
        },
        listDef: {
            name: 'st_facilities',
            title: 'st_facilities',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'Services': { type: 'Text', koMap: 'facilitiesService' },
                'Description': { type: 'Text', koMap: 'facilitiesDesc' },
                'Location': { type: 'Text', koMap: 'facilitiesLoc' },
                'SpecialAccomodation': { type: 'Bool', koMap: 'facilitiesSpecAcc' },
                'SpecialInstructions': { type: 'Text', koMap: 'facilitiesSpecInst' },
            }
        }
    },
    print: {
        name: 'GPO Print Request',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-print fa-5x" aria-hidden="true"></i>',
        daysToClose: 5,
        id: '#wo-print',
        hasAttachments: true,
        attachmentDesc: 'Please add print request attachments.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Managing Director Approval',
                progress: 20
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                adjudicator: 'washdc\\backlundpf',
                progress: 40
            },
            3: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 100
            }
        },
        listDef: {
            name: 'st_print',
            title: 'st_print',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'DateNeeded': { type: 'DateTime', koMap: 'printDateNeeded' },
                'Quantity': { type: 'Text', koMap: 'printQuantity' },
                'Description': { type: 'Text', koMap: 'printDesc' },
                'SpecialInstructions': { type: 'Text', koMap: 'printSpecialInst' },
            }
        }
    },
    supplies: {
        name: 'Office Supplies',
        description: '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
        icon: '<i class="fa fa-paperclip fa-5x" aria-hidden="true"></i>',
        daysToClose: 5,
        id: '#wo-supplies',
        hasAttachments: true,
        attachmentDesc: 'Add any attachments for printing.',
        hasStages: true,
        pipeline: {
            0: {
                type: 'Editing',
                displayName: 'New Work Order',
                progress: 0
            },
            1: {
                type: 'Approval',
                displayName: 'Managing Director Approval',
                progress: 20
            },
            2: {
                type: 'Approval',
                displayName: 'DED Approval',
                adjudicator: 'washdc\\backlundpf',
                progress: 40
            },
            3: {
                type: 'Action',
                displayName: 'CGFS Admin Services',
                isActionable: false,
                progress: 60
            },
            10: {
                type: 'Closed',
                displayName: 'Completed',
                progress: 100
            }
        },
        listDef: {
            name: 'st_supplies',
            title: 'st_supplies',
            viewFields: {
                'ID': { type: 'Text', koMap: 'empty' },
                'Title': { type: 'Text', koMap: 'requestID' },
                'DateNeeded': { type: 'DateTime', koMap: 'suppliesDateNeeded' },
                'Name': { type: 'Text', koMap: 'suppliesName' },
                'SpecialInstructions': { type: 'Text', koMap: 'suppliesSpecialInst' },
            }
        }
    }
}

function getWoByName(value) {
    console.log(value);
    var view = {}
    $.each(woViews, function (key, obj) {
        console.log(obj.name)
        if (obj.name == value) {
            console.log('found')
            view = obj;
            return false;
        }
    })
    return view;
}

var managingDirectors = {
    'Select': '',
    'CGFS/EX': 'Backlund, Peter',
    'CGFS/F': 'Lugo, Joan',
    'CGFS/GC': 'Self, Amy',
    'CGFS/S/CST': 'Sizemore, Richard',
    'CGFS/GSO': 'Bowers, Susan'
}

var offices = ['CGFS/EX', 'CGFS/F', 'CGFS/GC', 'CGFS/S/CST', 'CGFS/GSO'];


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
        'RequestType': { type: 'Text', koMap: 'requestTypeName' },
        'RequestorName': { type: 'Text', koMap: 'requestorName' },
        'RequestorPhone': { type: 'Text', koMap: 'requestorTelephone' },
        'RequestorEmail': { type: 'Text', koMap: 'requestorEmail' },
        'RequestorOffice': { type: 'Text', koMap: 'requestorOffice' },
        'RequestStage': { type: 'Text', koMap: 'requestStageNum' },
        'RequestStatus': { type: 'Text', koMap: 'requestStatus' },
        'ClosedDate': { type: 'Text', koMap: 'requestClosedDate' },
        'Created': { type: 'Date', koMap: 'requestSubmittedDate' }
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
        'Created': { type: 'Text', koMap: 'empty' }
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
        'Created': { type: 'Text', koMap: 'empty' }
    }
}

var commentListDef = {
    name: 'Comment',
    title: 'Comment',
    viewFields: {
        'Title': { type: 'Text', koMap: 'empty' },
        'Comment': { type: 'Text', koMap: 'empty' },
        'Author': { type: 'Text', koMap: 'empty' },
        'Created': { type: 'Text', koMap: 'empty' }
    }
}

var workOrderDocDef = {
    name: 'WorkOrderDocuments',
    title: 'Work Order Documents',
    viewFields: {
        'Title': { type: 'Text', koMap: 'empty' },
        'WorkOrderID': { type: 'Text', koMap: 'empty' }
    }
}



/************************************************************
 * Set Knockout View Model
 ************************************************************/
function koviewmodel() {
    var self = this;

    self.empty = ko.observable();

    self.serviceTypeAbbreviations = ko.observableArray(Object.keys(woViews))
    self.serviceTypeViews = ko.observable(woViews);
    /************************************************************
    * Authorize Current user to make changes
    ************************************************************/
    self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
    self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

    // Can the current user take action on the record?
    self.requestCurUserAction = ko.pureComputed(function () {
        if (self.requestStage()) {
            return self.requestStage().type == 'Action';
        } else {
            return false;
        }
    });

    // Can the current user approve the record?
    self.requestCurUserApprove = ko.pureComputed(function () {
        if (self.requestStage()) {
            return self.requestStage().type == 'Approval';
        } else {
            return false;
        }
    });

    /************************************************************
    * Page/Tab Specific handlers
    ************************************************************/
    // What page is the user on? App, Approval, Admin
    self.page = ko.observable();

    // What tab is the user on? 
    self.tab = ko.observable();
    self.tab.subscribe(function (newPage) {
        console.log('New Page: ', newPage)
        $('.ui.menu').find('.item').tab('change tab', newPage);

    })

    /************************************************************
     * Hold a reference to each of our SAL items
     ************************************************************/
    self.listRefWO = ko.observable();
    self.libRefWODocs = ko.observable();
    self.listRefApproval = ko.observable();
    self.listRefAssignment = ko.observable();
    self.listRefComment = ko.observable();

    self.listRefpu10k = ko.observable();
    self.listReftel = ko.observable();
    self.listRefpresentation = ko.observable();
    self.listRefrsa = ko.observable();
    self.listRefaccess = ko.observable();
    self.listRefproperty = ko.observable();
    self.listReffacilities = ko.observable();
    self.listRefprint = ko.observable();
    self.listRefsupplies = ko.observable();

    self.currentListRef = ko.pureComputed({
        read: function () {
            if (self.requestType()) {
                return self['listRef' + self.requestType()]()
            } else {
                return null;
            }
        }
    })

    /************************************************************
     * Hold current info about our lists
     ************************************************************/
    self.woCount = ko.observable();
    self.allOpenOrders = ko.observableArray();
    self.assignedOpenOrders = ko.observableArray();
    self.allAssignments = ko.observableArray();

    /************************************************************
    * allOpenOrders Table Handlers
    ************************************************************/
    self.showWorkOrder = function (request) {
        console.log('clicked', request);
        viewWorkOrder(request.Title);
    };

    self.getRequestStage = function (request) {
        return getWoByName(request.RequestType).pipeline[request.RequestStage].displayName;
    };

    self.estimateClosingDate = function (request) {
        console.log('est closing date', request);
        var daysOffset = getWoByName(request.RequestType).daysToClose;
        var closeDate = businessDaysFromDate(request.Created, daysOffset);
        return closeDate.format('yyyy-MM-dd');
    }

    /************************************************************
     * Hold generic Work Order vars
     ************************************************************/
    // The available service types (we'll set this from a json array)
    self.requestTypes = ko.observableArray();

    self.currentView = ko.observable();

    self.requestAttachments = ko.observableArray();

    self.requestApprovals = ko.observableArray();

    self.requestAssignees = ko.observableArray();
    self.requestComments = ko.observableArray();


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
        return true; //self.page() == 'admin';
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

    self.requestStatus = ko.observable(); // Open, Closed, etc
    self.requestStageNum = ko.observable(0); // 0, 1, 2 etc, used for our view pipelines.

    self.requestStage = ko.observable(); // Actual stage object {}

    self.requestStageNum.subscribe(function () {
        buildPipelineElement();
        if (self.requestType() && self.requestStageNum()) {
            self.requestStage(self.requestTypeView().pipeline[self.requestStageNum()])
        } else {
            return ''
        }
    })

    self.requestStageName = ko.pureComputed({
        read: function () {
            if (self.requestType() && self.requestStageNum()) {
                return self.requestTypeView().pipeline[self.requestStageNum()].displayName
            } else {
                return ''
            }
        }
    })



    // Requestor/Header Info
    self.requestorName = ko.observable();
    self.requestorTelephone = ko.observable();
    self.requestorEmail = ko.observable();
    self.requestorManager = ko.observable();
    self.requestorOffice = ko.observable();
    self.requestorOfficeOptions = ko.observable(offices);

    self.requestSubmittedDate = ko.observable();
    self.requestClosedDate = ko.observable();

    self.requestType = ko.observable();
    self.requestTypeView = ko.observable();

    self.requestType.subscribe(function (val) {
        console.log('subscription event triggered', val)
        self.requestTypeView(woViews[val])
        buildPipelineElement();
    }, self, 'change')

    self.requestTypeName = ko.pureComputed({
        read: function () {
            if (self.requestType()) {
                return self.requestTypeView().name;
            } else {
                return '';
            }
        },
        write: function (value) {
            $.each(woViews, function (key) {
                if (woViews[key].name == value) {
                    self.requestType(key.toString());
                }
            })
        },
        owner: this
    }, this);


    self.requestTypeIcon = ko.pureComputed({
        read: function () {
            return self.requestType() ? self.requestTypeView().icon : '';
        }
    })

    self.requestTypeHasAttachments = ko.pureComputed(function () {
        if (self.requestType()) {
            return self.requestTypeView().hasAttachments == true;
        } else {
            return false;
        }
    })

    //self.requestTypeView = ko.pureComputed(function () {
    //        console.log('Request Type View', self.requestType())
    //        var rt = self.requestType();
    //        return woViews[rt];
    //    }
    //);
    //self.requestType.subscribe(function () {
    //    self.requestTypeView(self.requestTypeView())
    //})

    // Deal with progress/stages here.
    self.requestProgress = ko.observable();
    self.requestStageNum.subscribe(function () {
        if (self.requestType() && (self.requestStageNum() != undefined)) {
            self.requestProgress(
                self.requestTypeView().pipeline[self.requestStageNum()].progress
            )
        }
    })

    self.hasProgressBar = ko.pureComputed(function () {
        if (!self.requestType()) {
            return false;
        } else {
            return self.requestTypeView().hasStages && self.requestProgress() > 0;
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
        if (self.requestType() && self.requestTypeView().hasAttachments) {
            return self.requestTypeView().attachmentDesc;
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
    self.telPhoneNum = ko.observable();
    self.telLocation = ko.observable();

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

    /************************************************************
    * Building Access
    ************************************************************/
    self.accessTypeOpts = ko.observableArray(['Normal work day', '24/7', 'FLETC', 'Other'])
    self.accessEmployeeTypeOpts = ko.observable(['CGFS Government', 'CGFS Contractor', 'Other'])

    self.accessType = ko.observable()
    self.accessEmployeeType = ko.observable()
    self.accessDesc = ko.observable()
    self.accessSpecInst = ko.observable()

    /************************************************************
    * Property
    ************************************************************/
    self.propertyTransfer = ko.observable();
    self.propertyExcess = ko.observable();
    self.propertyRecievingReport = ko.observable();
    self.propertySerialNumber = ko.observable();
    self.propertyLocation = ko.observable();


    /************************************************************
    * Facilities/Building Services
    ************************************************************/
    self.facilitiesServiceOpts = ko.observableArray(['Labor Services/Moving', 'Facilities Maintenance',
                                            'Office Furniture', 'Office Space', 'Workstation Reconfiguration'])    // Choice

    self.facilitiesService = ko.observable()    // Choice
    self.facilitiesDesc = ko.observable()       // Multiline
    self.facilitiesLoc = ko.observable()        // Multiline
    self.facilitiesSpecAcc = ko.observable()    // Bool
    self.facilitiesSpecInst = ko.observable()   // Multiline

    /************************************************************
    * GPO Print Request
    ************************************************************/
    self.printDateNeededStr = ko.pureComputed({
        read: function () {
            return new Date(self.printDateNeeded()).format('yyyy-MM-dd');
        },
        write: function (val) {
            self.printDateNeeded(new Date(val + 'T00:00:00'));
        }
    })
    self.printDateNeeded = ko.observable(new Date())
    self.printQuantity = ko.observable();
    self.printDesc = ko.observable();
    self.printSpecialInst = ko.observable();

    /************************************************************
    * Office Supplies
    ************************************************************/
    self.suppliesDateNeededStr = ko.pureComputed({
        read: function () {
            return new Date(self.suppliesDateNeeded()).format('yyyy-MM-dd');
        },
        write: function (val) {
            self.suppliesDateNeeded(new Date(val + 'T00:00:00'));
        }
    })
    self.suppliesDateNeeded = ko.observable(new Date());
    self.suppliesName = ko.observable();
    self.suppliesSpecialInst = ko.observable();

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