export function CreateRequestOrg(instData) {
  return new RequestOrg(instData.get_lookupId(), instData.get_lookupValue());
}

export function RequestOrg(id, title) {
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
