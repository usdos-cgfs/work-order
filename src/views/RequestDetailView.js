import { RequestHeader } from "../entities/RequestHeader.js";
import {
  serviceTypeStore,
  ServiceTypeTemplate,
} from "../entities/ServiceType.js";

export const DisplayModes = {
  New: "New",
  Edit: "Edit",
  View: "View",
};
//export const WorkOrderListRef = new SPList(WorkOrderListDef);

export class RequestDetailView {
  DisplayModes = DisplayModes;

  constructor({
    displayMode = DisplayModes.New,
    serviceType = null,
    title = null,
    _context,
  }) {
    this._context = _context;
    this.RequestHeader = new RequestHeader({ title, displayMode });

    this.DisplayMode(displayMode);

    if (serviceType) {
      this.ServiceType(serviceType);
    }
  }

  Title = ko.observable();

  ServiceType = ko.observable();
  ServiceTypeTemplate = ko.computed(() => {
    console.log("checking service type", this.ServiceType());
    if (!this.ServiceType()) {
      return null;
    }
    const serviceTypeTemplate = new ServiceTypeTemplate(this.ServiceType());
    serviceTypeTemplate.Load();

    return serviceTypeTemplate;
  });

  DisplayMode = ko.observable();

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

  Init = async function () {
    // Load related items
    if (this.DisplayMode() != DisplayMode.New && !this.Title()) {
    }

    // if (this.ServiceType()?.UID) {
    //   await ServiceTypeTemplate.Create(this.ServiceType()?.UID);
    // }
  };

  static ViewRequest = async function ({ id, title, _context }) {
    var viewRequest = new RequestDetailView({
      id,
      displayMode: DisplayModes.View,
      title,
      _context,
    });
    if (!(await _context.RequestHeaders.Load(viewRequest.RequestHeader))) {
      console.error("RequestDetail Could not find request", title);
    }

    return viewRequest;
  };

  static NewRequest = async function ({ serviceType = null, _context }) {
    var newRequest = new RequestDetailView({
      displayMode: DisplayModes.New,
      serviceType: serviceType,
      _context,
    });

    if (serviceType) {
      newRequest.ServiceType(serviceType);
    }
  };
}
