import { RequestHeader } from "../entities/RequestHeader.js";

export const DisplayModes = {
  New: "New",
  Edit: "Edit",
  View: "View",
};
//export const WorkOrderListRef = new SPList(WorkOrderListDef);

export class RequestDetail {
  DisplayMode = ko.observable();
  DisplayModes = DisplayModes;

  constructor({ displayMode = DisplayModes.New, title = null, _context }) {
    this._context = _context;
    this.RequestHeader = new RequestHeader({ title, displayMode });
    this.DisplayMode(displayMode);
  }

  SubmitNewRequest = async () => {
    await this._context.RequestHeaders.Add(this.RequestHeader);
  };

  EditRequest = async () => {
    this.DisplayMode(DisplayModes.Edit);
  };

  UpdateRequest = async () => {
    this.DisplayMode(DisplayModes.View);
  };

  CancelChanges = async () => {
    //Refresh
    this.DisplayMode(DisplayModes.Edit);
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
