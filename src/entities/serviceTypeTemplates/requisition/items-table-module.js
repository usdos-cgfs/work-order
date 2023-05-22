export default class ItemsTable {
  constructor(params) {
    this.ItemArray = params.itemArray;
    this.NewItemConstructor = RequisitionItem;
    const nextId = this.nextId();
    this.NewItem(new this.NewItemConstructor(nextId));
  }

  remove = (dropItem) => {
    this.ItemArray(this.ItemArray().filter((item) => item.ID != dropItem.ID));
  };

  submit = () => {
    const jsItem = ko.mapping.toJS(this.NewItem);

    this.ItemArray.push(jsItem);
    const nextId = this.nextId();
    this.NewItem(new this.NewItemConstructor(nextId));
  };

  nextId = () => {
    this.ItemArray.sort((left, right) =>
      left.ID === right.ID ? 0 : left.ID < right.ID ? -1 : 1
    );
    const currentId = this.ItemArray().at(-1)?.ID;
    if (!currentId) {
      return 1;
    }
    return currentId + 1;
  };

  NewItem = ko.observable();
}

class RequisitionItem {
  constructor(id) {
    this.ID = id;
  }
  Name = ko.observable();
  Quantity = ko.observable();
  PurchasePrice = ko.observable();

  static FieldMap = {
    Name: { displayName: "Name" },
    Quantity: { displayName: "Quantity" },
    PurchasePrice: { displayName: "Purchase Price" },
  };
}
