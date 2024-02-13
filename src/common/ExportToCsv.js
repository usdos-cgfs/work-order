//make sure iframe with id csvexprframe is added to page up top
//http://stackoverflow.com/questions/18185660/javascript-jquery-exporting-data-in-csv-not-working-in-ie
export function exportToCsv(fileName, tableName, removeHeader) {
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
