/**
 * This field needs to convert between locale and UTC Dates stored on the server;
 */
export class DateField {
  ObservableDateTime = ko.observable();

  constructor(date = null) {
    this.ObservableDateTime(date);
  }

  get = () => {
    if (
      !this.ObservableDateTime() ||
      isNaN(this.ObservableDateTime().valueOf())
    ) {
      return null;
    }

    return this.ObservableDateTime().toISOString();
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
        d.getUTCFullYear().toString().padStart(4, "0"),
        (d.getUTCMonth() + 1).toString().padStart(2, "0"),
        d.getUTCDate().toString().padStart(2, "0"),
      ].join("-");
    },
    write: (val) => {
      if (!val) return;
      //writes in format
      this.ObservableDateTime(new Date(val));
    },
  });
}