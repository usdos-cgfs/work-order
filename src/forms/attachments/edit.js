let isActiveElement,
  requestElement,
  requestTitleElement,
  titleElement,
  nameElement;

document.addEventListener("DOMContentLoaded", function () {
  // Hide legacy fields
  //   document
  //     .querySelector('input[title="WorkOrderID"]')
  //     .closest("tr").style.display = "none";

  isActiveElement = document.querySelector('input[title="IsActive"]');
  requestElement = document.querySelector('select[title="Request"');
  requestTitleElement = document.querySelector('input[title="WorkOrderID"]');
  titleElement = document.querySelector('input[title="Title"]');
  nameElement = document.querySelector('input[title^="Name"]');

  // Preset any fields
  titleElement.value = nameElement.value;
  isActiveElement.checked = true;

  let args = decodeURI(GetUrlKeyValue("args"));
  if (args) {
    args = JSON.parse(args);
    requestElement.value = args.RequestId;
    requestTitleElement.value = args.id ?? args.RequestTitle;
  }

  // Disable non-user fields
  isActiveElement.setAttribute("disabled", true);
  requestElement.setAttribute("disabled", true);
  requestTitleElement.setAttribute("disabled", true);

  //   document.querySelector('input[title="IsActive"]').removeAttribute("disabled");
});

function PreSaveAction() {
  isActiveElement.removeAttribute("disabled");
  requestElement.removeAttribute("disabled");
  requestTitleElement.removeAttribute("disabled");
  return true;
}
