import { RequestHeader } from "../entities/RequestHeader.js";

const DisplayModes = {
  New: "new",
  Edit: "edit",
  View: "view",
};
//export const WorkOrderListRef = new SPList(WorkOrderListDef);

export class RequestDetail {
  DisplayMode = ko.observable();

  constructor({ displayMode = DisplayModes.New, title = null, _context }) {
    this._context = _context;
    this.RequestHeader = new RequestHeader({ title, displayMode });
    this.DisplayMode(displayMode);
  }

  SaveRequest = async () => {
    await this._context.RequestHeaders.Add(this.RequestHeader);
  };

  static ViewRequest = async function ({ title, _context }) {
    var newRequest = new RequestDetail({
      displayMode: DisplayModes.View,
      title,
      _context,
    });
    if (!(await _context.RequestHeaders.Load(newRequest.RequestHeader))) {
      console.error("RequestDetail Could not find request", title);
    }

    return newRequest;
  };
}
