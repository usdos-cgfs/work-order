
function initListRefs() {
    vm.listRefWO(new SPList(workOrderListDef));
    vm.listRefpu10k(new SPList(pu10kListDef));

    vm.listRefApproval(new SPList(approvalListDef));
    vm.libRefWODocs(new SPList(workOrderDocDef));
    vm.listRefAssignment(new SPList(assignmentListDef));
}

// function initPageListeners() {
//     // $('#new-order-button').click(function () {
//     //     var formname = 'NewForm.aspx';
//     //     var title = 'New Work Order';
//     //     var args = {};
//     //     vm.listRefWO().showModal(formname, title, args, onSaveNewWorkOrderCallback)
//     // })
// }

function initVMVars() {
    // set the wo types
    var wotypes = [];
    $.each(woViews, function (item) { wotypes.push(woViews[item].name) });

    vm.requestServiceTypes(wotypes);
}

function fetchOpenOrders() {
    vm.listRefWO().getListItems('<Query></Query>', function (items) {
        console.log('loading open orders', items)
        vm.allOpenOrders(items);
    })
}

function newWorkOrder(woType) {
    // Open the detail tab view
    $("#tabs").tabs({ active: 1 });
    console.log(woViews[woType].id);


    //set the select for which view we're on.
    vm.requestServiceType(woType);
    vm.currentView('new');

    // Set our VM fields
    vm.requestID(new Date().toISOString().substr(-4))
    //vm.requestID('209Z');
    //fetchAttachments();
    vm.requestorName(sal.globalConfig.currentUser.get_title());
    vm.requestorTelephone();
    vm.requestorEmail(sal.globalConfig.currentUser.get_email());
    vm.requestorOffice();
}

function viewWorkOrder(woID) {
    // Set the tab to detail view
    $("#tabs").tabs({ active: 1 });
    vm.currentView('view');
    vm.requestID(woID);
    fetchApprovals();
    fetchAttachments();

    var camlq = '<Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + vm.requestID() + '</Value></Eq></Where></Query>'
    vm.listRefWO().getListItems(camlq, function (items) {
        vm.requestHeader(items[0]);
    })
}

function editWorkOrder() {
    //make the editable fields editable.
    //$('.editable-field').prop('disabled', false)
    vm.currentView('edit')
}

function saveWorkOrder() {
    /* Save button handler switch based off of current view: 
        Saving edits to an already existing document
        Saving a new document
    */
    SP.UI.ModalDialog.showWaitScreenWithNoClose('Saving Work Order...');

    // First, save or update the parent work order item.
    switch (vm.currentView()) {
        case 'edit':
            // We are saving an edit form, get the id and update.
            setTimeout(function() {onSaveEditWorkOrderCallback('12')}, 1000);
            break;
        case 'new':
            // we are saving a new record, create a new copy of each of the record types.
            // Save the current work order 
            //var valuePairs = [['Title', 'Test Work Order'], ['RequestType', vm.requestServiceTypeName()]]
            var valuePairs = getValuePairs(workOrderListDef.viewFields);

            // TODO: Figure out how to submit people to people picker fields.
            console.log('vp', valuePairs);
            vm.listRefWO().createListItem(valuePairs, function (id) { console.log('saved', id) });
            //setTimeout(function () {onSaveNewWorkOrderMaster('12')}, 1200);
            vm.requestSubmittedDate(new Date().toLocaleString())
            break;
    };

    switch (vm.requestServiceType()) {
        case 'pu10k':
            save_pu10k();
            break;
        default:
            onSaveNewWorkOrderMaster('01');
    }


    //$('.editable-field').prop('disabled', true)
    vm.currentView('view');
}

function onSaveNewWorkOrderMaster(id) {
    console.log('callback this: ', this);
    console.log('callback val: ', id);
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

function onSaveEditWorkOrderCallback(val) {
    console.log('callback val: ', val);
    SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
}

/************************************************************
 * Work Order Specific handlers.
 ************************************************************/
function save_pu10k() {
    // console.log('master wo saved')
    var valuePairs = getValuePairs(pu10kListDef.viewFields);
    console.log('pu10k valuepairs', valuePairs);
    switch (vm.currentView()) {
        case 'new':
            vm.pu10kStage('Submitted to Managing Director');
            vm.requestStage('Submitted to Managing Director')
            vm.listRefpu10k().createListItem(valuePairs, onSaveNewWorkOrderMaster);
            vm.requestProgress(20);
            break;
        case 'edit':
            // TODO: Pass the correct item 
            vm.listRefpu10k().updateListItem('1', valuepairs, onSaveEditWorkOrderCallback);
            break;
        default:

    }
}

function getValuePairs(listDef) {
    var valuePairs = []
    $.each(listDef, function (field, obj) {
        valuePairs.push([field, !$.isEmptyObject(vm[obj.koMap]()) ? vm[obj.koMap]() : ''])
    })
    return valuePairs;
}
/************************************************************
 * Attachments
 ************************************************************/
function newAttachment() {
    vm.libRefWODocs().createFolder(vm.requestID(), function () {
        vm.libRefWODocs().uploadNewDocument(vm.requestID(), 'Attach a New Document', { id: vm.requestID() }, function () {
            console.log('success');
        fetchAttachments()})
    })
}

function fetchAttachments() {
    //Update the attachments from SAL and load them to the page.
    vm.libRefWODocs().getFolderContents(vm.requestID(), function (files) {
        console.log('attachments fetched');
        vm.requestAttachments(files);
    })
}

/************************************************************
 * Assignments
 ************************************************************/
function newAssignment() {
    vm.listRefAssignment().showModal('NewForm.aspx', 'New Assignment', { woId: vm.requestID() }, function (args) {
        //console.log('approval args', args)
        // TODO: If this pushes the process forward, handle that here.
        //approvalUpdateProgress()
        fetchAssignments();
    })
}

function fetchAssignments() {
    var camlq = '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + vm.requestID() + '</Value></Eq></Where></Query></View>'
    vm.listRefAssignment().getListItems(camlq, function (assignments) { vm.requestAssignees(assignments) });
}

/************************************************************
 * Approvals
 ************************************************************/
function newApproval() {
    vm.listRefApproval().showModal('NewForm.aspx', 'New adjudication', { woId: vm.requestID() }, function (args) {
        console.log('approval args', args)
        // TODO: If this pushes the process forward, handle that here.
        approvalUpdateProgress()
        fetchApprovals();
    })
}

function fetchApprovals() {
    var camlq = '<View><Query><Where><Eq><FieldRef Name="Title"/><Value Type="Text">' + vm.requestID() + '</Value></Eq></Where></Query></View>'
    vm.listRefApproval().getListItems(camlq, function (approvals) { vm.requestApprovals(approvals) });
}

function approvalUpdateProgress() {
    vm.pu10kStage('Submitted to DED');
    vm.requestStage('Submitted to DED')
    vm.requestProgress(40);
}

function initApp() {
    $('.non-editable-field').prop('disabled', true)
    $("#tabs").tabs();
    $('#wo-progress-bar').progressbar({
        value: 0,
    })
    console.log('initialized listeners')
    // Initialize our SharePoint Access Layer
    initSal();
    //Initialize our tabs

    vm = new koviewmodel();
    ko.applyBindings(vm);

    initListRefs();
    // initPageListeners();
    initVMVars();

    fetchOpenOrders();
}

$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ExecuteOrDelayUntilScriptLoaded(initApp, "sp.js"));
});