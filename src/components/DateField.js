/**
 * This field needs to convert between locale and UTC Dates stored on the server;
 */
export class DateField {
  ObservableDateTime = ko.observable();

  constructor(date = null) {
    this.ObservableDateTime(date);
  }

  get = () => {
    return this.ObservableDateTime()?.toISOString();
  };

  set = (newDate) => {
    if (!newDate) return null;
    if (!newDate.constructor.getName() == "Date") {
      console.warn("DateField: Not a date", date);
    }
    if (newDate.getTimezoneOffset()) {
    }
    this.ObservableDateTime(newDate);
  };

  inputBinding = ko.pureComputed({
    read: () => {
      if (!this.ObservableDateTime()) return null;
      const d = this.ObservableDateTime();
      return [
        d.getUTCFullYear(),
        d.getUTCMonth().toString().padStart(2, "0"),
        d.getUTCDate().toString().padStart(2, "0"),
      ].join("-");
    },
    write: (val) => {
      //writes in format
      this.ObservableDateTime(new Date(val));
    },
  });
}
