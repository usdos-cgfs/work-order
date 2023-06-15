export function makeDataTable(tableId) {
  tableId = tableId.startsWith("#") ? tableId : "#" + tableId;
  return new DataTable(tableId, {
    dom:
      "<'ui stackable grid'" +
      "<'row'" +
      "<'eight wide column'l>" +
      "<'right aligned eight wide column'f>" +
      ">" +
      "<'row dt-table'" +
      "<'sixteen wide column'tr>" +
      ">" +
      "<'row'" +
      "<'six wide column'i>" +
      "<'d-flex justify-content-center'B>" +
      "<'right aligned six wide column'p>" +
      ">" +
      ">",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
    order: [[0, "desc"]],
    iDisplayLength: 25,
    deferRender: true,
    bDestroy: true,
    // columnDefs: [{ width: "10%", targets: 0 }],
    initComplete: function () {
      this.api()
        .columns()
        .every(function () {
          var column = this;
          var tbl = $(column.header()).closest("table");
          // Set the row we want our filter to show up in
          // var filterCell = tbl.find("thead tr:eq(1) th").eq(column.index());
          var filterCell = $(column.footer());

          var select = $(
            '<select class="form-select"><option value=""></option></select>'
          );
          switch (filterCell.attr("data-filter")) {
            case "select-filter":
              select.attr("multiple", "true");
            case "single-select-filter":
              select.appendTo(filterCell.empty()).on("change", function () {
                var vals = $(this).val();
                if (!vals) {
                  vals = [];
                } else {
                  vals = vals.map(function (value) {
                    return value
                      ? "^" + $.fn.dataTable.util.escapeRegex(value) + "$"
                      : null;
                  });
                }
                var val = vals.join("|");
                column.search(val, true, false).draw();
              });
              // Populate our select option values based on column cells.
              column
                .data()
                .unique()
                .sort()
                .each(function (optionText, j) {
                  // first try to parse html
                  try {
                    let parsedElement = $(optionText);

                    if (parsedElement.is("a")) {
                      optionText = parsedElement.text();
                    }
                  } catch (e) {
                    //Nothing to do here, it's not valid html
                  }
                  select.append(
                    `<option value="${optionText}" title="${optionText}">${optionText}</option>`
                  );
                });
              break;
            case "search-filter":
              $(
                '<div class="">' +
                  '<input class="form-control" type="text" placeholder="Search..." style="width: 100%"/>' +
                  "</div>"
              )
                .appendTo(filterCell.empty())
                .on("keyup change clear", function () {
                  const inputSearchText =
                    this.getElementsByTagName("input")[0].value;
                  if (column.search() !== inputSearchText) {
                    column.search(inputSearchText).draw();
                  }
                });
              break;
            case "bool-filter":
              // Does this row contain data?
              var checkbox = $('<input type="checkbox"></input>')
                .appendTo(filterCell.empty())
                .change(function () {
                  if (this.checked) {
                    column.search("true").draw();
                  } else {
                    column.search("").draw();
                  }
                });
              break;
            default:
          }
          if (filterCell.attr("clear-width")) {
            // Clear width to contents
            tbl.find("thead tr:eq(0) th").eq(column.index()).width("");
          }
        });
    },
  });
}
