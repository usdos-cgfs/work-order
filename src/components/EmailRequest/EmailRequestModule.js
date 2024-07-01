import { Notification } from "../../entities/index.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import { BaseComponent } from "../index.js";
import { emailRequestTemplate } from "./EmailRequestTemplate.js";

const dialogId = "dialog-email-request";

export class EmailRequestModule extends BaseComponent {
  constructor(params) {
    super(params);

    this.request = params.request;
  }

  request;
  notification = ko.observable();

  init() {
    const notification = new Notification();

    notification.Body.Value(this.request.RequestBodyBlob?.Value()?.toHTML());

    this.notification(notification);
  }

  showDialog() {
    this.init();
    document.getElementById(dialogId)?.showModal();
  }

  closeDialog() {
    document.getElementById(dialogId)?.close();
  }

  static name = "send-request-as-email";
  static template = emailRequestTemplate;
}
