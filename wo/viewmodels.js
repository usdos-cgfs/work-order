// console.log('viewmodel loaded');
/************************************************************
 * Generic Viewmodels
 ************************************************************/
woViews = {
  access: {
    name: "Building Access",
    spid: 2,
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-check-double",
    daysToClose: 3,
    id: "#wo-access",
    hasAttachments: true,
    attachmentDesc: "<p>Please Add building access request attachments.</p>",
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Manager/Supervisor Approval",
        isActionable: false,
        progress: 30,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        isActionable: false,
        progress: 30,
      },
      3: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 0,
      },
    },
    listDef: {
      name: "st_access",
      title: "st_access",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        AccessType: { type: "Text", koMap: "accessType" },
        EmployeeType: { type: "Text", koMap: "accessEmployeeType" },
        FullName: { type: "Text", koMap: "accessFullName" },
        BadgeNum: { type: "Text", koMap: "accessBadgeNum" },
        ExpirationDate: { type: "Text", koMap: "accessExpirationDate" },
        Locations: { type: "Text", koMap: "accessLocations" },
        Justification: { type: "Text", koMap: "accessJustification" },
        Description: { type: "Text", koMap: "accessDesc" },
        SpecialInstructions: { type: "Text", koMap: "accessSpecInst" },
      },
    },
  },
  diplomatic_passport: {
    name: "Diplomatic Passport",
    spid: 4,
    description:
      "<div><p>Complete this form to obtain a new diplomatic passport or renew an existing one</p></div>",
    icon: "fa-passport",
    daysToClose: 5,
    id: "#wo-diplomatic-passport",
    hasAttachments: true,
    attachmentDesc:
      '<p>Please attach a completed and signed copy of the appropriate form for this service type:</p><ul><li>New: <a target="blank" href="https://mydata.service-now.com/sys_attachment.do?sys_id=d5fc826adb769300c4c7708c96193c">DS-11</a></li><li>Renewal: <a target="blank">DS-82</a></li></ul><p>OR provide to CGFS/EX/ADMIN by fax (703-875-5547), email (<a target="blank" href="mailto:rmadmin@state.gov">rmadmin@state.gov</a>), or hand delivered.</p>',
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "Card Holder Purchasing",
        progress: 90,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_diplomatic_passport",
      title: "st_diplomatic_passport",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        RequestType: { type: "Text", koMap: "diplomaticPassportSelectedType" },
        Grade: { type: "Text", koMap: "diplomaticPassportGrade" },
        DestinationCity: {
          type: "Text",
          koMap: "diplomaticPassportDestinationCity",
        },
        DestinationCountry: {
          type: "Text",
          koMap: "diplomaticPassportDestinationCountry",
        },
        Departure: { type: "Text", koMap: "diplomaticPassportDeparture" },
        Return: { type: "Text", koMap: "diplomaticPassportReturn" },
        Purpose: { type: "Text", koMap: "diplomaticPassportPurpose" },
        BirthLocation: {
          type: "Text",
          koMap: "diplomaticPassportBirthLocation",
        },
        Expiration: { type: "Text", koMap: "diplomaticPassportExpiration" },
      },
    },
  },
  it_hardware: {
    name: "IT Hardware",
    spid: 8,
    description:
      "<div><p>Complete this request to obtain new IT hardware</p></div>",
    icon: "fa-laptop",
    daysToClose: 5,
    id: "#wo-it-hardware",
    hasAttachments: true,
    attachmentDesc: "<p>Please attach a quote for your purchase request:</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "Card Holder Purchasing",
        progress: 90,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_it_hardware",
      title: "st_it_hardware",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Name: { type: "Text", koMap: "itHardwareName" },
        Quantity: { type: "Text", koMap: "itHardwareQuantity" },
        POCName: { type: "Text", koMap: "itHardwarePOCName" },
        Cost: { type: "Text", koMap: "itHardwareCost" },
        Description: { type: "Text", koMap: "itHardwareDescription" },
      },
    },
  },
  locksmith: {
    name: "Locksmith Services",
    spid: 9,
    description:
      "<div><p>Complete this request to order locksmith services.</p></div>",
    icon: "fa-key",
    daysToClose: 5,
    id: "#wo-locksmith-passport",
    hasAttachments: true,
    attachmentDesc: "<p>Attachments:</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "Card Holder Purchasing",
        progress: 90,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_locksmith",
      title: "st_locksmith",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Location: { type: "Text", koMap: "locksmithLocation" },
        LockType: { type: "Text", koMap: "locksmithLockType" },
        Justification: { type: "Text", koMap: "locksmithJustification" },
      },
    },
  },
  network_drop: {
    name: "Network Drops",
    spid: 12,
    description:
      "<div><p>Complete this request for a new network drop.</p></div>",
    icon: "fa-ethernet",
    daysToClose: 5,
    id: "#wo-network-drop",
    hasAttachments: true,
    attachmentDesc: "<p>Attachments:</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_network_drop",
      title: "st_network_drop",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Description: { type: "Text", koMap: "networkDropDescription" },
      },
    },
  },
  news_subscription: {
    name: "Newspapers and Subscriptions",
    spid: 13,
    description:
      "<div><p>Complete this request for a new newpaper subscriptions.</p></div>",
    icon: "fa-newspaper",
    daysToClose: 5,
    id: "#wo-news-subscription",
    hasAttachments: true,
    attachmentDesc:
      "<p>A proper quote contains:</p><ul><li>Vendor Name</li><li>Item Name (including Item Number)</li><li>Quantity</li><li>Cost</li></ul>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_news_subscription",
      title: "st_news_subscription",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        SubName: { type: "Text", koMap: "newsSubName" },
        Quantity: { type: "Text", koMap: "newsSubQuantity" },
      },
    },
  },
  office_furniture: {
    name: "Office Furniture",
    spid: 15,
    description:
      "<div><p>Complete this request for Office Furniture requests.</p></div>",
    icon: "fa-chair",
    daysToClose: 5,
    id: "#wo-office-furniture",
    hasAttachments: true,
    attachmentDesc:
      "<p>A proper quote contains:</p><ul><li>Vendor Name</li><li>Item Name (including Item Number)</li><li>Quantity</li><li>Cost</li></ul>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_office_furniture",
      title: "st_office_furniture",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Description: { type: "Text", koMap: "officeFurnitureDesc" },
      },
    },
  },
  pu10k: {
    name: "Purchase Under 10k",
    description:
      "<div><p>Purchases Under 10k require the following:</p><ul><li>Quote</li><li>Description</li></ul></div>",
    //icon: '<i class="fa fa-credit-card fa-5x" aria-hidden="true"></i>',
    icon: "fa-credit-card",
    daysToClose: 5,
    id: "#wo-pu10k",
    hasAttachments: true,
    attachmentDesc: "<p>Please attach the quote for your purchase request.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "Card Holder Purchasing",
        progress: 90,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_pu10k",
      title: "st_pu10k",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Description: { type: "Text", koMap: "pu10kDescription" },
        CostEst: { type: "Text", koMap: "pu10kCostEst" },
        CurrentStage: { type: "Text", koMap: "pu10kStage" },
      },
    },
  },
  tel: {
    name: "Telephone",
    spid: 19,
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-phone",
    daysToClose: 2,
    id: "#wo-tel",
    hasAttachments: true,
    attachmentDesc:
      "<p>Attach Approvals - This work order can not be submitted until approved email is uploaded.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Manager/Supervisor Approval",
        isActionable: false,
        progress: 30,
      },
      2: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 0,
      },
    },
    listDef: {
      name: "st_telephone",
      title: "st_telephone",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        PhoneNum: { type: "Text", koMap: "telPhoneNum" },
        Location: { type: "Text", koMap: "telLocation" },
        RequestType: { type: "Text", koMap: "telSelectedType" },
        To: { type: "Text", koMap: "telTo" },
        From: { type: "Text", koMap: "telFrom" },
        Description: { type: "Text", koMap: "telDesc" },
      },
    },
  },
  presentation: {
    name: "Presentation",
    spid: 16,
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-desktop",
    daysToClose: 1,
    id: "#wo-presentation",
    hasAttachments: false,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Manager/Supervisor Approval",
        isActionable: false,
        progress: 30,
      },
      2: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 0,
      },
    },
    listDef: {
      name: "st_presentation",
      title: "st_presentation",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "empty" },
      },
    },
  },
  property: {
    name: "Property/Asset Management",
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-warehouse",
    daysToClose: 5,
    id: "#wo-property",
    hasAttachments: true,
    attachmentDesc: "<p>Please attach the Recieving Report.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_property",
      title: "st_property",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        PropertyTransfer: { type: "Bool", koMap: "propertyTransfer" },
        ExcessProperty: { type: "Bool", koMap: "propertyExcess" },
        RecievingReport: { type: "Text", koMap: "propertyRecievingReport" },
        SerialNumber: { type: "Text", koMap: "propertySerialNumber" },
        PropertyLocation: { type: "Text", koMap: "propertyLocation" },
      },
    },
  },
  facilities: {
    name: "Facilities/Building Services",
    spid: 3,
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-tools",
    daysToClose: 5,
    id: "#wo-facilities",
    hasAttachments: true,
    attachmentDesc: "<p>Please add Facilities/Building attachments.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_facilities",
      title: "st_facilities",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        Services: { type: "Text", koMap: "facilitiesService" },
        Description: { type: "Text", koMap: "facilitiesDesc" },
        Location: { type: "Text", koMap: "facilitiesLoc" },
        SpecialAccomodation: { type: "Bool", koMap: "facilitiesSpecAcc" },
        SpecialInstructions: { type: "Text", koMap: "facilitiesSpecInst" },
      },
    },
  },
  print: {
    name: "GPO Print Request",
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-print",
    daysToClose: 5,
    id: "#wo-print",
    hasAttachments: true,
    attachmentDesc: "<p>Please add print request attachments.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_print",
      title: "st_print",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        DateNeeded: { type: "DateTime", koMap: "printDateNeeded" },
        Quantity: { type: "Text", koMap: "printQuantity" },
        Description: { type: "Text", koMap: "printDesc" },
        SpecialInstructions: { type: "Text", koMap: "printSpecialInst" },
      },
    },
  },
  supplies: {
    name: "Office Supplies",
    spid: 15,
    description:
      '<div class="ui placeholder"><div class="paragraph"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div></div>',
    icon: "fa-paperclip",
    daysToClose: 5,
    id: "#wo-supplies",
    hasAttachments: true,
    attachmentDesc: "<p>Add any attachments for printing.</p>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      2: {
        type: "Approval",
        displayName: "DED Approval",
        adjudicator: "washdc\\backlundpf",
        progress: 40,
      },
      3: {
        type: "Action",
        displayName: "CGFS Admin Services",
        isActionable: false,
        progress: 60,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_supplies",
      title: "st_supplies",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        DateNeeded: { type: "DateTime", koMap: "suppliesDateNeeded" },
        Name: { type: "Text", koMap: "suppliesName" },
        SpecialInstructions: { type: "Text", koMap: "suppliesSpecialInst" },
      },
    },
  },
  requisition: {
    name: "Requisition",
    spid: 18,
    description:
      "<div><p>Complete this request for Office Furniture requests.</p></div>",
    icon: "fa-redo",
    daysToClose: 5,
    id: "#wo-office-furniture",
    hasAttachments: true,
    attachmentDesc:
      "<p>A proper quote contains:</p><ul><li>Vendor Name</li><li>Item Name (including Item Number)</li><li>Quantity</li><li>Cost</li></ul>",
    hasStages: true,
    pipeline: {
      0: {
        type: "Editing",
        displayName: "New Work Order",
        progress: 0,
      },
      1: {
        type: "Approval",
        displayName: "Managing Director Approval",
        progress: 20,
      },
      10: {
        type: "Closed",
        displayName: "Completed",
        progress: 100,
      },
    },
    listDef: {
      name: "st_requisition",
      title: "st_requisition",
      viewFields: {
        ID: { type: "Text", koMap: "empty" },
        Title: { type: "Text", koMap: "requestID" },
        RequisitionType: { type: "Text", koMap: "requisitionType" },
        Quantity: { type: "Text", koMap: "requisitionQuantity" },
        Comments: { type: "Text", koMap: "requisitionComments" },
      },
    },
  },
};

function getWoByName(value) {
  console.log(value);
  var view = {};
  $.each(woViews, function (key, obj) {
    console.log(obj.name);
    if (obj.name == value) {
      console.log("found");
      view = obj;
      return false;
    }
  });
  return view;
}

var managingDirectors = {
  Select: "",
  "CGFS/EX": "Backlund, Peter",
  "CGFS/F": "Lugo, Joan",
  "CGFS/GC": "Self, Amy",
  "CGFS/S/CST": "Sizemore, Richard",
  "CGFS/GSO": "Bowers, Susan",
};

var offices = ["CGFS/EX", "CGFS/F", "CGFS/GC", "CGFS/S/CST", "CGFS/GSO"];

/************************************************************
 * Set SharePoint definitions here for use with SAL
 ************************************************************/
var workOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    ManagingDirector: { type: "Person", koMap: "requestorManager" },
    RequestType: { type: "Text", koMap: "requestTypeName" },
    RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    RequestorOffice: { type: "Text", koMap: "requestorOffice" },
    RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { type: "Text", koMap: "requestStatus" },
    ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Created: { type: "Date", koMap: "requestSubmittedDate" },
  },
};

var approvalListDef = {
  name: "Adjudication",
  title: "Adjudication",
  viewFields: {
    Title: { type: "Text", koMap: "requestID" },
    Adjudication: { type: "Choice", koMap: "empty" },
    Comment: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var assignmentListDef = {
  name: "Assignment",
  title: "Assignment",
  viewFields: {
    Title: { type: "Text", koMap: "empty" },
    Assignee: { type: "Person", koMap: "empty" },
    Role: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var commentListDef = {
  name: "Comment",
  title: "Comment",
  viewFields: {
    Title: { type: "Text", koMap: "empty" },
    Comment: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var workOrderDocDef = {
  name: "WorkOrderDocuments",
  title: "Work Order Documents",
  viewFields: {
    Title: { type: "Text", koMap: "empty" },
    WorkOrderID: { type: "Text", koMap: "empty" },
  },
};

/************************************************************
 * SharePoint Configuration Lists
 ************************************************************/
var configActionOfficesListDef = {
  name: "ConfigActionOffices",
  title: "ConfigActionOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Office: { type: "Text", koMap: "empty" },
    AOGroup: { type: "Text", koMap: "empty" },
  },
};

var configHolidaysListDef = {
  name: "ConfigHolidays",
  title: "ConfigHolidays",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Date: { type: "Text", koMap: "empty" },
    Repeating: { type: "Text", koMap: "empty" },
  },
};

var configPipelinesListDef = {
  name: "ConfigPipelines",
  title: "ConfigPipelines",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    ServiceType: { type: "Text", koMap: "empty" },
    Step: { type: "Text", koMap: "empty" },
    ActionType: { type: "Text", koMap: "empty" },
    Assignee: { type: "Text", koMap: "empty" },
  },
};

var configRequestingOfficesListDef = {
  name: "ConfigRequestingOffices",
  title: "ConfigRequestingOffices",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
  },
};

// Service type configuration list
var configServiceTypeListDef = {
  name: "ConfigServiceTypes",
  title: "ConfigServiceTypes",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Active: { type: "Text", koMap: "empty" },
    st_list: { type: "Text", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    AttachmentRequired: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    ListDef: { type: "Text", koMap: "empty" },
    ElementID: { type: "Text", koMap: "empty" },
    DaysToCloseBusiness: { type: "Text", koMap: "empty" },
    DaysToCloseDisp: { type: "Text", koMap: "empty" },
    KPIThresholdYellow: { type: "Text", koMap: "empty" },
    KPIThresholdGreen: { type: "Text", koMap: "empty" },
  },
};

/************************************************************
 * Set Knockout View Model
 ************************************************************/
function koviewmodel() {
  var self = this;

  self.empty = ko.observable();

  self.serviceTypeAbbreviations = ko.observableArray(Object.keys(woViews));
  self.serviceTypeViews = ko.observable(woViews);
  /************************************************************
   * Authorize Current user to make changes
   ************************************************************/
  self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
  self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

  // Can the current user take action on the record?
  self.requestCurUserAction = ko.pureComputed(function () {
    if (self.requestStage()) {
      return self.requestStage().type == "Action";
    } else {
      return false;
    }
  });

  // Can the current user approve the record?
  self.requestCurUserApprove = ko.pureComputed(function () {
    if (self.requestStage()) {
      return self.requestStage().type == "Approval";
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
    console.log("New Page: ", newPage);
    $(".ui.menu").find(".item").tab("change tab", newPage);
  });

  /************************************************************
   * Hold a reference to each of our SAL items
   ************************************************************/
  self.listRefWO = ko.observable();
  self.libRefWODocs = ko.observable();
  self.listRefApproval = ko.observable();
  self.listRefAssignment = ko.observable();
  self.listRefComment = ko.observable();

  // Configuration Lists
  self.listRefConfigActionOffices = ko.observable();
  self.listRefConfigHolidays = ko.observable();
  self.listRefConfigPipelines = ko.observable();
  self.listRefConfigRequestingOffices = ko.observable();
  self.listRefConfigServiceType = ko.observable();

  self.listRefServiceTypesArr = ko.observableArray();

  //TODO: Replace all of these with an array!
  self.listRefaccess = ko.observable();
  self.listRefdiplomatic_passport = ko.observable();
  self.listRefit_hardware = ko.observable();
  self.listReflocksmith = ko.observable();
  self.listRefnetwork_drop = ko.observable();
  self.listRefnews_subscription = ko.observable();
  self.listRefpu10k = ko.observable();
  self.listReftel = ko.observable();
  self.listRefpresentation = ko.observable();
  self.listRefrsa = ko.observable();
  self.listRefoffice_furniture = ko.observable();
  self.listRefproperty = ko.observable();
  self.listReffacilities = ko.observable();
  self.listRefprint = ko.observable();
  self.listRefsupplies = ko.observable();
  self.listRefrequisition = ko.observable();

  self.currentListRef = ko.pureComputed({
    read: function () {
      if (self.requestType()) {
        return self["listRef" + self.requestType()]();
      } else {
        return null;
      }
    },
  });

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
    console.log("clicked", request);
    viewWorkOrder(request.Title);
  };

  self.getRequestStage = function (request) {
    return getWoByName(request.RequestType).pipeline[request.RequestStage]
      .displayName;
  };

  self.estimateClosingDate = function (request) {
    console.log("est closing date", request);
    var daysOffset = getWoByName(request.RequestType).daysToClose;
    var closeDate = businessDaysFromDate(request.Created, daysOffset);
    return closeDate.format("yyyy-MM-dd");
  };

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
    return self.currentView() == "new" || self.currentView() == "edit";
  });

  self.canEditForm = ko.pureComputed(function () {
    return self.currentView() == "view" && self.page() != "approval";
  });

  self.showRouting = ko.pureComputed(function () {
    return true; //self.page() == 'admin';
  });

  /************************************************************
   * Configuration List Data Here
   ************************************************************/

  self.listItemsConfigActionOffices = ko.observable();
  self.listItemsConfigHolidays = ko.observable();
  self.listItemsConfigPipelines = ko.observable();
  self.listItemsConfigRequestingOffices = ko.observable();
  self.listItemsConfigServiceType = ko.observable();

  self.loadedListItemLists = ko.observable(0);

  self.incLoadedListItems = function () {
    self.loadedListItemLists(self.loadedListItemLists() + 1);
  };

  self.loadedListItemLists.subscribe(function (val) {
    if (val == 5) {
      initComplete();
    }
  });

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
      self.requestStage(
        self.requestTypeView().pipeline[self.requestStageNum()]
      );
    } else {
      return "";
    }
  });

  self.requestStageName = ko.pureComputed({
    read: function () {
      if (self.requestType() && self.requestStageNum()) {
        return self.requestTypeView().pipeline[self.requestStageNum()]
          .displayName;
      } else {
        return "";
      }
    },
  });

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

  self.requestType.subscribe(
    function (val) {
      console.log("subscription event triggered", val);
      self.requestTypeView(woViews[val]);
      buildPipelineElement();
    },
    self,
    "change"
  );

  self.requestTypeName = ko.pureComputed(
    {
      read: function () {
        if (self.requestType()) {
          return self.requestTypeView().name;
        } else {
          return "";
        }
      },
      write: function (value) {
        $.each(woViews, function (key) {
          if (woViews[key].name == value) {
            self.requestType(key.toString());
          }
        });
      },
      owner: this,
    },
    this
  );

  self.requestTypeIcon = ko.pureComputed({
    read: function () {
      return self.requestType() ? self.requestTypeView().icon : "";
    },
  });

  self.requestTypeHasAttachments = ko.pureComputed(function () {
    if (self.requestType()) {
      return self.requestTypeView().hasAttachments == true;
    } else {
      return false;
    }
  });

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
    if (self.requestType() && self.requestStageNum() != undefined) {
      self.requestProgress(
        self.requestTypeView().pipeline[self.requestStageNum()].progress
      );
    }
  });

  self.hasProgressBar = ko.pureComputed(function () {
    if (!self.requestType()) {
      return false;
    } else {
      return self.requestTypeView().hasStages && self.requestProgress() > 0;
    }
  });

  self.requestorOffice.subscribe(function () {
    // When the requesting office changes, so changes the manager
    self.requestorManager(managingDirectors[self.requestorOffice()]);
  });

  self.requestProgress.subscribe(function () {
    //console.log('Progress: ', self.request)
    $("#wo-progress-bar").progressbar("option", {
      value: self.requestProgress(),
    });
  });

  self.requestAttachmentDesc = ko.pureComputed(function () {
    if (self.requestType() && self.requestTypeView().hasAttachments) {
      return self.requestTypeView().attachmentDesc;
    } else {
      return "";
    }
  });

  /************************************************************
   * Building Access
   ************************************************************/
  self.accessTypeOpts = ko.observableArray([
    "Normal work day",
    "24/7",
    "FLETC",
    "Other",
  ]);
  self.accessEmployeeTypeOpts = ko.observable([
    "CGFS Government",
    "CGFS Contractor",
    "Other",
  ]);

  self.accessType = ko.observable();
  self.accessEmployeeType = ko.observable();
  self.accessDesc = ko.observable();
  self.accessSpecInst = ko.observable();

  self.accessFullName = ko.observable();
  self.accessBadgeNum = ko.observable();
  self.accessExpirationDate = ko.observable();
  self.accessLocations = ko.observable();
  self.accessJustification = ko.observable();

  self.accessExpirationDateStr = ko.pureComputed({
    read: function () {
      return new Date(self.accessExpirationDate()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.accessExpirationDate(new Date(val + "T00:00:00"));
    },
  });

  /************************************************************
   * Diplomatic Passport
   ************************************************************/
  self.diplomaticPassportSelectedType = ko.observable();
  self.diplomaticPassportGrade = ko.observable();
  self.diplomaticPassportDestinationCity = ko.observable();
  self.diplomaticPassportDestinationCountry = ko.observable();
  self.diplomaticPassportDeparture = ko.observable();
  self.diplomaticPassportReturn = ko.observable();
  self.diplomaticPassportPurpose = ko.observable();
  self.diplomaticPassportBirthLocation = ko.observable();
  self.diplomaticPassportExpiration = ko.observable();

  self.diplomaticPassportServiceTypes = ko.observableArray(["New", "Renewal"]);

  self.diplomaticPassportExpirationStr = ko.pureComputed({
    read: function () {
      return new Date(self.diplomaticPassportExpiration()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.diplomaticPassportExpiration(new Date(val + "T00:00:00"));
    },
  });

  self.diplomaticPassportDepartureStr = ko.pureComputed({
    read: function () {
      return new Date(self.diplomaticPassportDeparture()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.diplomaticPassportDeparture(new Date(val + "T00:00:00"));
    },
  });

  self.diplomaticPassportReturnStr = ko.pureComputed({
    read: function () {
      return new Date(self.diplomaticPassportReturn()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.diplomaticPassportReturn(new Date(val + "T00:00:00"));
    },
  });

  /************************************************************
   * Locksmith Services
   ************************************************************/
  self.locksmithLocation = ko.observable();
  self.locksmithLockType = ko.observable();
  self.locksmithJustification = ko.observable();

  /************************************************************
   * IT Hardware
   ************************************************************/
  self.itHardwareName = ko.observable();
  self.itHardwareQuantity = ko.observable();
  self.itHardwarePOCName = ko.observable();
  self.itHardwareCost = ko.observable();
  self.itHardwareDescription = ko.observable();

  /************************************************************
   * Network Drop
   ************************************************************/
  self.networkDropDescription = ko.observable();

  /************************************************************
   * Newspaper Subscriptions
   ************************************************************/
  self.newsSubName = ko.observable();
  self.newsSubQuantity = ko.observable();

  /************************************************************
   * Office Furniture
   ************************************************************/
  self.officeFurnitureDesc = ko.observable();

  /************************************************************
   * Purchase Under 10k
   ************************************************************/
  self.pu10kDescription = ko.observable();
  self.pu10kCostEst = ko.observable();
  self.pu10kStage = ko.observable();

  self.pu10kShowAdmin = ko.pureComputed(function () {
    return (
      self.currentView() != "new" &&
      self.pu10kStage() == "Submitted to Managing Director"
    );
  });

  /************************************************************
   * Telephone
   ************************************************************/
  self.telPhoneNum = ko.observable();
  self.telLocation = ko.observable();

  self.telServiceTypes = ko.observableArray([
    "Installation",
    "Move",
    "Issues",
    "Password Reset",
  ]);

  self.telSelectedType = ko.observable("Installation");
  self.telTo = ko.observable();
  self.telFrom = ko.observable();

  self.telDesc = ko.observable();

  /************************************************************
   * Presentation
   ************************************************************/
  self.presentationServiceTypes = ko.observableArray([
    "DVC",
    "Conference Room",
    "Presentation",
  ]);

  self.presentationSelectedType = ko.observable();

  self.presentationCallTypes = ko.observableArray(["Incoming", "Outgoing"]);
  self.presentationCallType = ko.observable();

  self.presentationDialOuts = ko.observableArray([
    "202-555-1992",
    "202-555-1993",
    "202-555-1123",
    "202-555-1155",
  ]);
  self.presentationDialOut = ko.observable();

  self.presentationConnectionTypes = ko.observableArray(["Open", "DSN", "IP"]);
  self.presentationConnectionType = ko.observable();

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
  self.facilitiesServiceOpts = ko.observableArray([
    "Labor Services/Moving",
    "Facilities Maintenance",
    "Office Furniture",
    "Office Space",
    "Workstation Reconfiguration",
  ]); // Choice

  self.facilitiesService = ko.observable(); // Choice
  self.facilitiesDesc = ko.observable(); // Multiline
  self.facilitiesLoc = ko.observable(); // Multiline
  self.facilitiesSpecAcc = ko.observable(); // Bool
  self.facilitiesSpecInst = ko.observable(); // Multiline

  /************************************************************
   * GPO Print Request
   ************************************************************/
  self.printDateNeededStr = ko.pureComputed({
    read: function () {
      return new Date(self.printDateNeeded()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.printDateNeeded(new Date(val + "T00:00:00"));
    },
  });
  self.printDateNeeded = ko.observable(new Date());
  self.printQuantity = ko.observable();
  self.printDesc = ko.observable();
  self.printSpecialInst = ko.observable();

  /************************************************************
   * Office Supplies
   ************************************************************/
  self.suppliesDateNeededStr = ko.pureComputed({
    read: function () {
      return new Date(self.suppliesDateNeeded()).format("yyyy-MM-dd");
    },
    write: function (val) {
      self.suppliesDateNeeded(new Date(val + "T00:00:00"));
    },
  });
  self.suppliesDateNeeded = ko.observable(new Date());
  self.suppliesName = ko.observable();
  self.suppliesSpecialInst = ko.observable();
}

/************************************************************
 * Requisitions
 ************************************************************/
self.requisitionTypes = ko.observableArray([
  "Requisition",
  "De-Obligation",
  "Re-Alignment",
]); // Choice

self.requisitionType = ko.observable(); // Choice
self.requisitionQuantity = ko.observable(); // Multiline
self.requisitionComments = ko.observable(); // Multiline

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

var camlq = "<Query></Query>";
var callback = function (items) {
  console.log(items);
};
