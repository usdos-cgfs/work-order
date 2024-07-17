ko.bindingHandlers.showModal = {
  init: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
  },
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    // This will be called once when the binding is first applied to an element,
    // and again whenever any observables/computeds that are accessed change
    // Update the DOM element based on the supplied values here.

    const value = ko.unwrap(valueAccessor());
    if (value) {
      element.showModal();
    } else {
      element.close();
    }
  },
};

const roleAssignmentsRequest =
  "_api/web/RoleAssignments?$expand=RoleDefinitionBindings,Member/Users";

class GroupReport {
  constructor() {
    document
      .getElementById("inputImportGroupsCsv")
      .addEventListener("change", this.clickViewImportModal);

    this.importProcessor = new ImportProcessor({
      siteRoleAssignments: this.siteRoleAssignments,
    });
  }

  showImportModal = ko.observable(false);
  chkRowPerUser = ko.observable(false);

  siteRoleAssignments = ko.observableArray();

  siteGroupsAssignments = ko.pureComputed(() => {
    return this.siteRoleAssignments().filter((roleAssignment) => {
      return roleAssignment.Member.PrincipalType == 8;
    });
  });

  requestUri = ko.observable();

  async submitRequest() {
    const result = await fetchData(this.requestUri());
    console.log(result);
  }

  formatUsersItem(user) {
    return `${user.Title} (${user.Email})`;
  }

  formatUsersCellExport(groupAssignment) {
    return groupAssignment.Member.Users.results
      .map((user) => user.LoginName)
      .join("; ");
  }

  formatPermissionsCellExport(groupAssignment) {
    return groupAssignment.RoleDefinitionBindings.results
      .map((role) => role.Name)
      .join("; ");
  }

  async fetchRoleAssignments() {
    const results = await fetchData(roleAssignmentsRequest);
    console.log(results.results);
    this.siteRoleAssignments(results.results);
  }

  clickViewExportModal() {
    document.getElementById("dlgExportView").showModal();
  }

  clickCloseExportModal() {
    document.getElementById("dlgExportView").close();
  }

  clickExportSiteGroups() {
    const fileName =
      _spPageContextInfo.webTitle +
      "-SiteGroups_" +
      new Date().format("yyyy-MM-dd");
    exportToCsv(fileName, "tblSiteGroupsExport", false);
  }

  importSiteGroupsValidationResults = ko.observableArray();

  clickViewImportModal = async () => {
    const file = document.getElementById("inputImportGroupsCsv").files[0];
    const result = await convertFromCsv(file);
    const validationResults = await this.importProcessor.processInput(result);
    this.importSiteGroupsValidationResults(validationResults);
    this.showImportModal(true);
  };

  clickCloseImportModal() {
    this.showImportModal(false);
  }

  clickImportSiteGroups() {}

  static async Create() {
    const newReport = new GroupReport();
    await newReport.fetchRoleAssignments();
    return newReport;
  }
}

class ImportProcessor {
  constructor({ siteRoleAssignments }) {
    this.siteRoleAssignments = siteRoleAssignments;
  }

  getSiteGroupByNameUrl = (groupName) =>
    `_api/web/SiteGroups/GetByName('${groupName}')?$expand=Users`;

  async processInput(inputArr) {
    const siteRoleAssignments = ko.unwrap(this.siteRoleAssignments);
    const validationResults = [];
    for (const input of inputArr) {
      const validationResult = new GroupValidationResult(input);

      // 1. validate group roleassignments exists, else if group exists
      const existingAssignment = siteRoleAssignments.find(
        (assignment) => assignment.Member.Title == input.Title
      );

      if (!existingAssignment) {
        // Check that the group even exists on the site collection
        const existingGroup = await fetch(
          this.getSiteGroupByNameUrl(input.Title)
        );
        if (existingGroup) validationResult.existingGroup = existingGroup;
      } else {
        validationResult.existingGroup = existingAssignment.Member;
        validationResult.existingRoleDefinitions =
          existingAssignment.RoleDefinitionBindings.results;
      }

      // 2. validate users
      const newGroupUsers = input.Users;
      // 3. validate permissions
      validationResults.push(validationResult);
    }

    return validationResults;
  }

  validateGroupByName(groupName) {
    // Check if group exists, if so return it's id

    if (existingAssignment) return existingAssignment;
  }
}

class GroupValidationResult {
  constructor(group) {
    this.title = group.Title;
    this.users = group.Users !== "" ? group.Users?.split("; ") ?? [] : [];
    this.permissions =
      group.Permissions !== "" ? group.Permissions?.split("; ") ?? [] : [];
  }
  existingRoleDefinitions;
  existingGroup;

  title;
  users;
  permissions;

  userInGroup(userKey) {
    return this.existingGroup?.Users?.results?.find(
      (existingUser) => existingUser.LoginName == userKey
    );
  }

  groupHasPermission(permissionKey) {
    return this.existingRoleDefinitions?.find(
      (role) => role.Name == permissionKey
    );
  }
}

async function createReport() {
  const newReport = await GroupReport.Create();
  ko.applyBindings(newReport);
}

createReport();

async function fetchData(uri, method = "GET") {
  const siteEndpoint = uri.startsWith("http")
    ? uri
    : _spPageContextInfo.webAbsoluteUrl + "/" + uri;
  const response = await fetch(siteEndpoint, {
    method: method,
    headers: {
      Accept: "application/json; odata=verbose",
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
    },
  });

  if (!response.ok) {
    if (response.status == 404) {
      return;
    }
    console.error(response);
  }
  const result = await response.json();
  return result.d;
}

//make sure iframe with id csvexprframe is added to page up top
//http://stackoverflow.com/questions/18185660/javascript-jquery-exporting-data-in-csv-not-working-in-ie
function exportToCsv(fileName, tableName, removeHeader) {
  var data = getCellValues(tableName);

  if (!data) {
    alert("No data!");
    return;
  }

  if (removeHeader == true) data = data.slice(1);

  var csv = convertToCsv(data);
  //	console.log( csv );

  var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  var downloadLink = document.createElement("a");
  downloadLink.href = uri;
  downloadLink.download = fileName + ".csv";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function getCellValues(tableName) {
  var table = document.getElementById(tableName);

  if (!table) return;

  var tableArray = [];
  for (var r = 0, n = table.rows.length; r < n; r++) {
    tableArray[r] = [];
    for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
      var text =
        table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
      tableArray[r][c] = text.trim();
    }
  }
  return tableArray;
}

function convertToCsv(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "sep=,\r\n";
  var line = "";
  var index;
  var value;
  for (var i = 0; i < array.length; i++) {
    line = "";
    var array1 = array[i];
    for (index in array1) {
      if (array1.hasOwnProperty(index)) {
        value = array1[index] + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    }
    line = line.slice(0, -1);
    str += line + "\r\n";
  }
  return str;
}

async function convertFromCsv(file) {
  // Take a file object (e.g. from file input) and convert to array of objects
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const carriageReturn = "\r\n";
        const lines = reader.result.split(carriageReturn);

        // Remove the 'sep=,' line
        lines.shift();
        const headerLine = lines.shift();
        const headers = getCsvValuesFromLine(headerLine);

        const allObjects = [];
        for (const line of lines) {
          const lineObj = {};
          const values = getCsvValuesFromLine(line);
          let isNotEmpty = false;

          for (const header of headers) {
            lineObj[header] = values.shift();
            // For some reason we end up with an empty row?
            if (lineObj[header]) isNotEmpty = true;
          }
          if (isNotEmpty) allObjects.push(lineObj);
        }
        resolve(allObjects);
      };
      // start reading the file. When it is done, calls the onload event defined above.
      reader.readAsBinaryString(file);
    } catch (e) {
      reject(e);
    }
  });
}

function getCsvValuesFromLine(line) {
  return line.split(",").map(function (value) {
    return value.replace(/\"/g, "");
  });
}
