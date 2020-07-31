var args = "";

$(document).ready(function () {
  console.log("In the chop");
  var args = JSON.parse(window.frameElement.dialogArgs);

  $("[title$=' Required Field']").each(function () {
    $(this).attr("title", $(this).attr("title").replace(" Required Field", ""));
  });

  $('input[title="Title"]').val(args.woId);
  $('input[title="Title"]').prop("disabled", true);

  $('select[title="Status"]').closest("tr").hide();

  $('input[Title="Completion Date"]').closest("table").closest("tr").hide();

  if (args.role) {
    $('select[title="Role"]').val(args.role);
    $('select[title="Role"]').prop("disabled", true);
  }
});

function PreSaveAction() {
  $('input[title="Title"]').prop("disabled", false);
  $('select[title="Role"]').prop("disabled", false);

  return true;
}
