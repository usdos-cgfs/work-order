var args = '';

$(document).ready(function () {
    console.log('In the chop');
    args = decodeURI(GetUrlKeyValue('args'));
    console.log('decoded args ', args);
    args = JSON.parse(args);
    console.log('args', args);

    $("[title$=' Required Field']").each(function () {
        $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
    });

    $('input[title="WorkOrderID"]').val(args.id);
    $('input[title="WorkOrderID"]').prop('disabled', true);
    $('input[title="Title"]').val($('input[title="Name"]').val())
})

function PreSaveAction() {
    $('input[title="WorkOrderID"]').prop('disabled', false);
    return true;
}