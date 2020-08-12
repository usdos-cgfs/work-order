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
        ID: { type: "Text", koMap: "empty", required: false },
        Title: { type: "Text", koMap: "requestID", required: false },
        AccessType: { type: "Text", koMap: "accessType", required: false },
        EmployeeType: {
          type: "Text",
          koMap: "accessEmployeeType",
          required: false,
        },
        FullName: { type: "Text", koMap: "accessFullName", required: false },
        BadgeNum: { type: "Text", koMap: "accessBadgeNum", required: false },
        ExpirationDate: {
          type: "Text",
          koMap: "accessExpirationDate",
          required: false,
        },
        Locations: { type: "Text", koMap: "accessLocations", required: false },
        Justification: {
          type: "Text",
          koMap: "accessJustification",
          required: false,
        },
        Description: { type: "Text", koMap: "accessDesc" },
        SpecialInstructions: {
          type: "Text",
          koMap: "accessSpecInst",
          required: false,
        },
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
        ID: { type: "Text", koMap: "empty", required: false },
        Title: { type: "Text", koMap: "requestID", required: false },
        RequestType: {
          type: "Text",
          koMap: "diplomaticPassportSelectedType",
          required: false,
        },
        Grade: {
          type: "Text",
          koMap: "diplomaticPassportGrade",
          required: false,
        },
        DestinationCity: {
          type: "Text",
          koMap: "diplomaticPassportDestinationCity",
          required: false,
        },
        DestinationCountry: {
          type: "Text",
          koMap: "diplomaticPassportDestinationCountry",
          required: false,
        },
        Departure: {
          type: "Text",
          koMap: "diplomaticPassportDeparture",
          required: false,
        },
        Return: {
          type: "Text",
          koMap: "diplomaticPassportReturn",
          required: false,
        },
        Purpose: {
          type: "Text",
          koMap: "diplomaticPassportPurpose",
          required: false,
        },
        BirthLocation: {
          type: "Text",
          koMap: "diplomaticPassportBirthLocation",
          required: false,
        },
        Expiration: {
          type: "Text",
          koMap: "diplomaticPassportExpiration",
          required: false,
        },
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
      name: "st_IT_hardware",
      title: "st_IT_hardware",
      viewFields: {
        ID: {
          type: "Text",
          koMap: "empty",
        },
        Title: {
          type: "Text",
          koMap: "requestID",
          required: false,
        },
        Name: {
          type: "Text",
          koMap: "itHardwareName",
          required: false,
          displayName: "Hardware Name",
        },
        Quantity: {
          type: "Text",
          koMap: "itHardwareQuantity",
          required: false,
          displayName: "Quantity",
        },
        POCName: {
          type: "Text",
          koMap: "itHardwarePOCName",
          required: true,
          displayName: "POC Name",
        },
        Cost: {
          type: "Text",
          koMap: "itHardwareCost",
          required: true,
          displayName: "Cost",
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        Location: { type: "Text", koMap: "locksmithLocation", required: false },
        LockType: { type: "Text", koMap: "locksmithLockType", required: false },
        Justification: {
          type: "Text",
          koMap: "locksmithJustification",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        Description: {
          type: "Text",
          koMap: "networkDropDescription",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        SubName: { type: "Text", koMap: "newsSubName", required: false },
        Quantity: { type: "Text", koMap: "newsSubQuantity", required: false },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        Description: {
          type: "Text",
          koMap: "officeFurnitureDesc",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        Description: {
          type: "Text",
          koMap: "pu10kDescription",
          required: false,
        },
        CostEst: { type: "Text", koMap: "pu10kCostEst", required: false },
        CurrentStage: { type: "Text", koMap: "pu10kStage", required: false },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        PhoneNum: { type: "Text", koMap: "telPhoneNum", required: false },
        Location: { type: "Text", koMap: "telLocation", required: false },
        RequestType: {
          type: "Text",
          koMap: "telSelectedType",
          required: false,
        },
        To: { type: "Text", koMap: "telTo", required: false },
        From: { type: "Text", koMap: "telFrom", required: false },
        Description: { type: "Text", koMap: "telDesc", required: false },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        PropertyTransfer: {
          type: "Bool",
          koMap: "propertyTransfer",
          required: false,
        },
        ExcessProperty: {
          type: "Bool",
          koMap: "propertyExcess",
          required: false,
        },
        RecievingReport: {
          type: "Text",
          koMap: "propertyRecievingReport",
          required: false,
        },
        SerialNumber: {
          type: "Text",
          koMap: "propertySerialNumber",
          required: false,
        },
        PropertyLocation: {
          type: "Text",
          koMap: "propertyLocation",
          required: false,
        },
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
        ID: { type: "Text", koMap: "empty", required: false },
        Title: { type: "Text", koMap: "requestID", required: false },
        Services: { type: "Text", koMap: "facilitiesService", required: false },
        Description: { type: "Text", koMap: "facilitiesDesc", required: false },
        Location: { type: "Text", koMap: "facilitiesLoc", required: false },
        SpecialAccomodation: {
          type: "Bool",
          koMap: "facilitiesSpecAcc",
          required: false,
        },
        SpecialInstructions: {
          type: "Text",
          koMap: "facilitiesSpecInst",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        DateNeeded: {
          type: "DateTime",
          koMap: "printDateNeeded",
          required: false,
        },
        Quantity: { type: "Text", koMap: "printQuantity", required: false },
        Description: { type: "Text", koMap: "printDesc", required: false },
        SpecialInstructions: {
          type: "Text",
          koMap: "printSpecialInst",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        DateNeeded: {
          type: "DateTime",
          koMap: "suppliesDateNeeded",
          required: false,
        },
        Name: { type: "Text", koMap: "suppliesName", required: false },
        SpecialInstructions: {
          type: "Text",
          koMap: "suppliesSpecialInst",
          required: false,
        },
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
        Title: { type: "Text", koMap: "requestID", required: false },
        RequisitionType: {
          type: "Text",
          koMap: "requisitionType",
          required: false,
        },
        Quantity: {
          type: "Text",
          koMap: "requisitionQuantity",
          required: false,
        },
        Comments: {
          type: "Text",
          koMap: "requisitionComments",
          required: false,
        },
      },
    },
  },
};

/*
sampleServiceType = {
  Active: true,
  AttachmentDescription:
    '<div class="ExternalClass3AC99BB72627496B872A696D6ED66F96"><p>A​ttachments&#58;<br></p></div>',
  AttachmentRequired: true,
  DaysToCloseBusiness: 30,
  DaysToCloseDisp: 14,
  Description:
    '<div class="ExternalClassDB16BCB87118415CBB8161EE9FB6EBE9"><p>C​omplete this request for a new network drop.<br></p></div>',
  ElementID: "wo-network-drop",
  ID: 12,
  Icon: "fa-ethernet",
  KPIThresholdGreen: null,
  KPIThresholdYellow: null,
  ListDef: {},
  Title: "Network Drops",
  UID: "network_drop",
  st_list: "st_network_drop",
};
*/

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
 * Set Static SharePoint definitions here for use with SAL
 ************************************************************/
var workOrderListDef = {
  name: "WorkOrder",
  title: "Work Order",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    EstClosedDate: { type: "Date", koMap: "requestEstClosed" },
    ManagingDirector: { type: "Person", koMap: "requestorManager" },
    RequestDescription: { type: "Text", koMap: "requestDescriptionHTML" },
    RequestorEmail: { type: "Text", koMap: "requestorEmail" },
    RequestorName: { type: "Text", koMap: "requestorName" },
    RequestorOffice: { type: "Person", koMap: "requestorOfficeLookupId" },
    RequestorPhone: { type: "Text", koMap: "requestorTelephone" },
    RequestStage: { type: "Text", koMap: "requestStageNum" },
    RequestStatus: { type: "Text", koMap: "requestStatus" },
    RequestSubject: { type: "Text", koMap: "requestSubject" },
    RequestSubmitted: { type: "DateTime", koMap: "requestSubmittedDate" },
    ServiceType: { type: "Text", koMap: "requestServiceTypeLookupId" },
    ClosedDate: { type: "Text", koMap: "requestClosedDate" },
    Created: { type: "Date", koMap: "empty" },
  },
};

var actionListDef = {
  name: "Action",
  title: "Action",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "requestID" },
    ActionType: { type: "Choice", koMap: "empty" },
    Description: { type: "Text", koMap: "empty" },
    SendEmail: { type: "Bool", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var approvalListDef = {
  name: "Adjudication",
  title: "Adjudication",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
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
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Assignee: { type: "Person", koMap: "empty" },
    ActionOffice: { type: "Lookup", koMap: "empty" },
    Role: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var commentListDef = {
  name: "Comment",
  title: "Comment",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    Comment: { type: "Text", koMap: "empty" },
    Author: { type: "Text", koMap: "empty" },
    Created: { type: "Text", koMap: "empty" },
  },
};

var workOrderEmailsListDef = {
  name: "WorkOrderEmails",
  title: "WorkOrderEmails",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
    Title: { type: "Text", koMap: "empty" },
    To: { type: "Person", koMap: "empty" },
    CC: { type: "Person", koMap: "empty" },
    BCC: { type: "Person", koMap: "empty" },
    Body: { type: "Text", koMap: "empty" },
    Sent: { type: "Bool", koMap: "empty" },
    DateSent: { type: "Date", koMap: "empty" },
  },
};

var workOrderDocDef = {
  name: "WorkOrderDocuments",
  title: "Work Order Documents",
  viewFields: {
    ID: { type: "Text", koMap: "empty" },
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
    AOGroup: { type: "Person", koMap: "empty" },
    CanAssign: { type: "Bool", koMap: "empty" },
    SysAdmin: { type: "Bool", koMap: "empty" },
    UserAddress: { type: "Person", koMap: "empty" },
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
    ROGroup: { type: "Person", koMap: "empty" },
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
    DescriptionRequired: { type: "Bool", koMap: "empty" },
    AttachmentRequired: { type: "Text", koMap: "empty" },
    AttachmentDescription: { type: "Text", koMap: "empty" },
    ListDef: { type: "Text", koMap: "empty" },
    ElementID: { type: "Text", koMap: "empty" },
    DaysToCloseBusiness: { type: "Text", koMap: "empty" },
    DaysToCloseDisp: { type: "Text", koMap: "empty" },
    KPIThresholdYellow: { type: "Text", koMap: "empty" },
    KPIThresholdGreen: { type: "Text", koMap: "empty" },
    Icon: { type: "Text", koMap: "empty" },
    UID: { type: "Text", koMap: "empty" },
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

  self.userGroupMembership = ko.observable();

  /************************************************************
   * ADMIN: Authorize Current user to take actions
   ************************************************************/
  self.userRole = ko.observable(); // Determine whether the user is in the admin group or not.
  self.userRecordRole = ko.observable(); // Determine how the user is associated to the selected record.

  self.userActionOfficeMembership = ko.pureComputed(() => {
    // Return the configActionOffice offices this user is a part of
    return self
      .configActionOffices()
      .filter(
        (ao) =>
          ao.UserAddress.get_lookupId() == sal.globalConfig.currentUser.get_id()
      );
  });

  self.userActionOfficeOwnership = ko.pureComputed(() => {
    return self.userActionOfficeMembership().filter((uao) => {
      return uao.CanAssign;
    });
  });

  // Can the current user take action on the record?
  self.requestCurUserAction = ko.pureComputed(function () {
    return true;
  });

  // Can the current user approve the record?
  self.requestCurUserApprove = ko.pureComputed(function () {
    return false;
  });

  /************************************************************
   * ADMIN: Assignment
   ************************************************************/
  self.requestCurUserAssign = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      // does the current user have CanAssign to any offices?
      let uao = self.userActionOfficeOwnership().map((uao) => uao.Office);

      // Get the office assigned to this stage,
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == self.requestStage().Assignee.get_lookupId());

      return uao.includes(assignedOffice.Office);
    }
  });

  self.assignCurUserAssignees = ko.pureComputed(function () {
    //Who can the current user assign to?
    let uao = self
      .userActionOfficeMembership()
      .filter((uao) => {
        return uao.CanAssign;
      })
      .map((uao) => uao.Office);

    if (!uao) {
      // This person isn't an action office, how did we get here?
      return [];
    } else if (uao.map((uao) => uao.SysAdmin).includes(true)) {
      // User is sysadmin, return all action offices
      return self.configActionOffices();
    } else {
      return self.configActionOffices().filter((ao) => {
        return uao.includes(ao.Office);
      });
    }
  });

  self.assignRemove = function (assignment) {
    console.log("deleting assignee", assignment);
    self.listRefAssignment().deleteListItem(assignment.ID, () => {
      // SP.UI.Notify.addNotification(
      //   assignment.ActionOffice.get_lookupValue() + " Removed",
      //   true
      // );

      timedNotification(
        assignment.ActionOffice.get_lookupValue() + " Removed",
        2 * 1000
      );
      fetchAssignments();
    });
  };

  self.assignAssignee = ko.observable();

  /************************************************************
   * ADMIN: Advance
   ************************************************************/
  self.requestCurUserAdvance = ko.pureComputed(function () {
    if (self.requestStage() && self.requestStage().Title != "Closed") {
      // which offices is the current user a member of?
      let uao = self.userActionOfficeMembership().map((uao) => uao.Office);

      // Get the office assigned to this stage,
      let assignedOffice = self
        .configActionOffices()
        .find((ao) => ao.ID == self.requestStage().Assignee.get_lookupId());

      return uao.includes(assignedOffice.Office);
    }
  });

  /************************************************************
   * ADMIN: Approvals/Actions Table
   ************************************************************/
  self.showActionsTable = ko.pureComputed(() => {
    return true;
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
    if (newPage == "order-detail") {
      console.log("Activate Accordion");
      $(".ui.accordion").accordion();
    }

    if (self.requestID()) {
      updateUrlParam("reqid", self.requestID());
    }
    updateUrlParam("tab", newPage);
  });

  /************************************************************
   * Hold a reference to each of our SAL items
   ************************************************************/
  self.listRefWO = ko.observable();
  self.libRefWODocs = ko.observable();
  self.listRefAction = ko.observable();
  self.listRefApproval = ko.observable();
  self.listRefAssignment = ko.observable();
  self.listRefComment = ko.observable();
  self.listRefWOEmails = ko.observable();

  // Configuration Lists
  self.listRefConfigActionOffices = ko.observable();
  self.listRefConfigHolidays = ko.observable();
  self.listRefConfigPipelines = ko.observable();
  self.listRefConfigRequestingOffices = ko.observable();
  self.listRefConfigServiceType = ko.observable();

  /************************************************************
   * Hold current info about our lists
   ************************************************************/
  self.woCount = ko.observable();
  self.allOrders = ko.observableArray();
  self.assignedOpenOrders = ko.observableArray();
  self.allAssignments = ko.observableArray();
  self.lookupOrders = ko.observableArray();

  /************************************************************
   * My Orders Tab
   ************************************************************/

  self.allOpenOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Open")
  );

  self.allClosedOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Closed")
  );

  self.allCancelledOrders = ko.pureComputed(() =>
    self.allOrders().filter((req) => req.RequestStatus == "Cancelled")
  );

  /************************************************************
   * allOpenOrders Table Handlers
   ************************************************************/
  self.showWorkOrder = function (request) {
    console.log("clicked", request);
    viewWorkOrderItem(request.Title);
  };

  self.getRequestStage = function (request) {
    const curStage = selectPipelineById(
      request.ServiceType.get_lookupId()
    ).find((step) => step.Step == request.RequestStage);
    return curStage ? curStage.Title : "Closed";
  };

  self.estimateClosingDate = function (request) {
    // TODO: Add the holidays list in here somewhere
    console.log("est closing date", request);

    let daysOffset = self
      .configServiceTypes()
      .find((stype) => stype.ID == request.ServiceType.get_lookupId())
      .DaysToCloseDisp;

    var closeDate = businessDaysFromDate(request.Created, daysOffset);
    return closeDate.format("yyyy-MM-dd");
  };

  /************************************************************
   * Lookup Tab
   ************************************************************/
  self.lookupServiceType = ko.observable();
  self.lookupInactiveBool = ko.observable(false);

  self.lookupTableCol = ko.observableArray([]);

  self.lookupServiceType.subscribe(
    (oldstype) => {
      let tableElements = $("#lookup-orders-container").children();
      //ko.removeNode(document.getElementById("lookup-orders_wrapper"));
      if (tableElements.length) {
        ko.unapplyBindings(tableElements, true);
        //$("#lookup-table-container").children().remove();
      }
    },
    null,
    "beforeChange"
  );

  self.lookupServiceType.subscribe((stype) => {
    let tableElements = $("#lookup-orders-container").children();
    //ko.removeNode(document.getElementById("lookup-orders_wrapper"));
    // if (tableElements.length) {
    //   ko.unapplyBindings(tableElements, true);
    //   //$("#lookup-table-container").children().remove();
    // }
    // tableElements.hide();
    if (stype != undefined) {
      updateUrlParam("ServiceType", stype.UID);

      self.lookupTableCol([]);

      stype = self.lookupServiceType();

      if (stype.listDef) {
        let lookupKeys = Object.keys(
          self.lookupServiceType().listDef.viewFields
        ).filter((col) => col != "ID" && col != "Title");

        self.lookupTableCol(lookupKeys);
      }
      self.lookupOrderUpdate();
    }
  });

  self.lookupInactiveBool.subscribe((Inactive) => {
    self.lookupOrderUpdate();
  });

  self.lookupOrderUpdate = function () {
    self.lookupOrders([]);
    stype = self.lookupServiceType();

    // Take the selected service type and updated the open orders table
    if (self.lookupInactiveBool()) {
      //Include inactive requests
      let camlq =
        '<View Scope="RecursiveAll"><Query><Where><Eq>' +
        '<FieldRef Name="ServiceType" LookupId="TRUE"/>' +
        '<Value Type="Lookup">' +
        stype.ID +
        "</Value>" +
        "</Eq></Where></Query></View>";

      self.listRefWO().getListItems(camlq, (lookupOrdersTemp) => {
        self.lookupUpdateRelated(lookupOrdersTemp);
      });
    } else {
      let lookupOrdersTemp = self.allOrders().filter((order) => {
        return order.ServiceType.get_lookupId() == stype.ID;
      });

      self.lookupUpdateRelated(lookupOrdersTemp);
    }
  };

  self.lookupUpdateRelated = function (lookupOrdersTemp) {
    // If there's an associated lookup list, let's add it.
    if (stype.ListDef) {
      let count = lookupOrdersTemp.length - 1;
      let i = 0;
      lookupOrdersTemp.forEach((order) => {
        let camlq =
          '<View Scope="RecursiveAll"><Query><Where><Eq>' +
          '<FieldRef Name="Title"/>' +
          '<Value Type="Text">' +
          order.Title +
          "</Value>" +
          "</Eq></Where></Query></View>";

        stype.listRef.getListItems(camlq, function (val) {
          order.ServiceItem = val[0];
          self.lookupOrders.push(order);
          if (i == count) {
            $("#lookup-orders-container").load(
              "../SiteAssets/workorder/wo/lookupTable.txt",
              () => {
                ko.applyBindings(
                  self,
                  document.getElementById("lookup-orders")
                );

                makeDataTable("#lookup-orders");
                //self.lookupOrders.valueHasMutated();
              }
            );
          } else {
            console.log(i + "/" + count);
            i++;
          }
        });
      });
    } else {
      self.lookupOrders(lookupOrdersTemp);
      makeDataTable("#lookup-orders");
    }
  };

  self.lookupColNames = function (col) {
    console.log("looking up column: ", col);
    return self.lookupServiceType().listDef.viewFields[col].displayName;
  };

  self.lookupServiceTypeListDef = ko.pureComputed(() => {
    return JSON.parse(self.lookupServiceType().ListDef);
  });

  self.lookupParseText = function (col, val) {
    // Parse the type of val and return text
    switch (self.lookupServiceTypeListDef().viewFields[col].type) {
      case "RichText":
        return $(val).text();
        break;
      default:
        return val;
    }
  };

  /************************************************************
   * Hold generic Work Order vars
   ************************************************************/
  // The available service types (we'll set this from a json array)

  self.currentView = ko.observable();

  self.requestIsSaveable = ko.observable();
  self.requestAttachments = ko.observableArray();

  self.requestActions = ko.observableArray();
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

  self.configActionOffices = ko.observable();
  self.configHolidays = ko.observable();
  self.configPipelines = ko.observable();
  self.configRequestingOffices = ko.observable();
  // We'll update this to hold listRef objects
  self.configServiceTypes = ko.observable();

  // Hold the selected configServiceTypes
  self.selectedServiceType = ko.observable();

  // return the selected service type pipeline
  self.selectedPipeline = ko.pureComputed(function () {
    if (self.selectedServiceType()) {
      return selectPipelineById(self.selectedServiceType().ID).sort((a, b) => {
        return a.Step - b.Step;
      });
    }
  });

  function selectPipelineById(stypeId) {
    // Should we sort here?
    return self
      .configPipelines()
      .filter((pipeline) => pipeline.ServiceType.get_lookupId() == stypeId);
  }

  // Track the number of loaded list items for initialization process
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
  self.requestSubject = ko.observable();
  // The general description for this request. Some service types only have this
  self.requestDescriptionHTML = ko.observable();
  self.requestEstClosed = ko.observable();

  // self.requestDescription = ko.pureComputed({
  //   read: function () {
  //     if (self.currentView() != "view") {
  //       console.log("we are editing");
  //       return $("#request-description").val();
  //     } else {
  //       console.log("we are viewing");
  //       return self.requestDescriptionHTML();
  //     }
  //   },
  //   write: (val) => {
  //     self.requestDescriptionHTML(val);
  //   },
  // });

  self.requestStatus = ko.observable(); // Open, Closed, etc
  self.requestStageNum = ko.observable(0); // 0, 1, 2 etc, used for our view pipelines.

  self.requestStage = ko.pureComputed(function () {
    if (self.selectedServiceType() && self.requestStageNum()) {
      let stage = self
        .selectedPipeline()
        .find((stage) => stage.Step == self.requestStageNum());

      return stage ? stage : { Step: self.requestStageNum(), Title: "Closed" };
    } else {
      return "";
    }
  });

  // Requestor/Header Info
  self.requestorName = ko.observable();
  self.requestorTelephone = ko.observable();
  self.requestorEmail = ko.observable();
  self.requestorManager = ko.observable();

  // JSON Object for the requesting office
  self.requestorOffice = ko.observable();
  // Gets and sets the ID for above
  self.requestorOfficeLookupId = ko.pureComputed({
    read: function () {
      if (self.requestorOffice()) {
        return parseInt(self.requestorOffice().ID);
      } else {
        return null;
      }
    },
    write: function (value) {
      if (value) {
        self.requestorOffice(
          self
            .configRequestingOffices()
            .find((ro) => ro.ID == value.get_lookupId())
        );
      } else {
        self.requestorOffice("");
      }
    },
  });

  self.requestorOfficeUserOpt = ko.pureComputed(function () {
    let groupIds = self.userGroupMembership().map((ug) => ug.ID);
    let activeFilteredRO = self
      .configRequestingOffices()
      .filter((ro) => ro.Active) //Check if we're active
      .filter((ro) => groupIds.includes(ro.ROGroup.get_lookupId()));

    return activeFilteredRO;
  });

  self.requestSubmittedDate = ko.observable();
  self.requestClosedDate = ko.observable();

  // Service Type Lookup is set from the request header,
  // and is mapped to ServiceType field on workorder
  self.requestServiceTypeLookupId = ko.pureComputed({
    read: function () {
      if (self.selectedServiceType()) {
        return parseInt(self.selectedServiceType().ID);
      } else {
        return null;
      }
    },
    write: function (value) {
      self.selectedServiceType(
        self
          .configServiceTypes()
          .find((stype) => stype.ID == value.get_lookupId())
      );
    },
  });

  self.requestorOffice.subscribe(function () {
    // When the requesting office changes, so changes the manager
    self.requestorManager(managingDirectors[self.requestorOffice()]);
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

ko.bindingHandlers.trix = {
  init: function (element, valueAccessor) {
    console.log(element);
    var value = valueAccessor();
    var areachangefc = function () {
      //console.log("change registered");
      value(textAreaContentElement.html());
    };
    var textAreaContentElement = $(element);
    $(element).keyup(areachangefc);
    $(element).bind("DOMNodeInserted DOMNodeRemoved", areachangefc);
    textAreaContentElement.html(value());
  },
  update: function (element, valueAccessor) {
    console.log("Doing something in trix");
    //$(element).html(valueAccessor());
  },
};

var camlq = "<Query></Query>";
var callback = function (items) {
  console.log(items);
};

ko.unapplyBindings = function ($node, remove = false) {
  // unbind events
  $node.find("*").each(function () {
    $(this).unbind();
  });

  // Remove KO subscriptions and references
  if (remove) {
    ko.removeNode($node[0]);
  } else {
    ko.cleanNode($node[0]);
  }
};
