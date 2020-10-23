// Set up our lists/libraries default states etc.
function addActionOfficeUsersToGroups() {
  let arrays = new Object();
  vm.configActionOffices().forEach((ao) => {
    if (ao.UserAddress) {
      console.log(
        `finding ${ao.ID}: ${ao.Title} - ${ao.UserAddress.get_lookupValue()}`
      );
      //Get the request org group
      let reqOrg = vm
        .configRequestOrgs()
        .find((ro) => ro.ID == ao.RequestOrg.get_lookupId());

      //Add the users to the group
      if (reqOrg) {
        if (!arrays[reqOrg.Title]) {
          arrays[reqOrg.Title] = new Array();
        } else {
          arrays[reqOrg.Title].push(ao.userAddress.get_lookupValue());
        }
        new sal.addUsersToGroup(
          [ao.UserAddress.get_lookupValue()],
          reqOrg.UserGroup.get_lookupValue()
        );
      }
    }
  });
}
