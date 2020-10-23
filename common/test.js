let folderId = 0;
let foo = (folder) => {
  console.log(folder);
  folderId = folder;
};
vm.listRefApproval().upsertListFolderPath("test", foo);

let folderId = 178;
let folderPermissions = [
  [sal.globalConfig.currentUser.get_loginName(), "Restricted Contribute"],
  ["workorder Owners", "Full Control"],
  ["Restricted Readers", "Restricted Read"],
];

vm.listRefApproval().setItemPermissions(
  folderId,
  folderPermissions,
  () => {
    console.log("success");
  },
  true
);

SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel);
