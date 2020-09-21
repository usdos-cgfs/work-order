var args = "";

$(document).ready(function () {
  $("[title$=' Required Field']").each(function () {
    $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
  });

  args = decodeURI(GetUrlKeyValue("args"));
  if (args) {
    //If args, this is a new upload.
    args = JSON.parse(args);
    $('input[title="WorkOrderID"]').val(args.id);
  }

  $('input[title="WorkOrderID"]').prop("disabled", true);
  $('input[title="IsActive"]').prop("disabled", true);
  $('input[title="Title"]').val($('input[title="Name"]').val());
});

function PreSaveAction() {
  $('input[title="IsActive"]').prop("disabled", false);
  $('input[title="WorkOrderID"]').prop("disabled", false);
  return true;
}
