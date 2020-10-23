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
          arrays[reqOrg.Title] = new Object();
          arrays[reqOrg.Title].group = reqOrg.UserGroup.get_lookupValue()
          arrays[reqOrg.Title].arr = new Array();
        } 
          arrays[reqOrg.Title].arr.push(ao.UserAddress.get_lookupValue());
        // Use this to do each user at a time
        new sal.addUsersToGroup( [ao.UserAddress.get_lookupValue()], reqOrg.UserGroup.get_lookupValue())
      }
    }
  });
  /*for (const [key, ro] of Object.entries(arrays)) {
   new sal.addUsersToGroup( ro.arr, ro.group)
  }*/
}
