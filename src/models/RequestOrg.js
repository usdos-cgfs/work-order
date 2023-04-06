export function CreateRequestOrg(instData) {
  return new RequestOrg(instData.get_lookupId(), instData.get_lookupValue());
}

export function DequestOrg(id, title) {
  const Id = ko.observable(id);
  const Title = ko.observable(title);

  const SPMap = ko.pureComputed({
    write: function (value) {
      Id(value.get_lookupId());
      Title(value.get_lookupValue());
    },
    read: function () {},
  });

  return {
    Id,
    Title,
    SPMap,
  };
}

export class RequestOrg {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  static factory = function ({ id, title }) {
    return new RequestOrg({ id, title });
  };
}
