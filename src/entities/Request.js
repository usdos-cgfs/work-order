export const requestStates = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
};

export class RequestEntity {
  constructor({ ID, Title }) {
    this.ID = ID;
    this.Title = Title;
    this.LookupValue = Title;
  }

  static Create = function ({ ID, LookupValue }) {
    return new ServiceType({ ID, title: LookupValue });
  };
}
