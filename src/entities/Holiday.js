export const holidayStore = ko.observable();

export class Holiday {
  static Views = {
    All: ["ID", "Title", "Date", "Repeating"],
  };

  static ListDef = {
    name: "ConfigHolidays",
    title: "ConfigHolidays",
    fields: Holiday.Views.All,
  };
}
