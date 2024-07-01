import { Notification } from "../../entities/index.js";
import { createRequestDetailNotification } from "../../infrastructure/Notifications.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import { BaseComponent, html } from "../index.js";
import { emailRequestTemplate } from "./EmailRequestTemplate.js";

const dialogId = "dialog-email-request";

export class EmailRequestModule extends BaseComponent {
  constructor(params) {
    super(params);

    this.request = params.request;
  }

  request;
  notification = ko.observable();

  insertRequestLink = () => {
    const link = this.request.getAppLinkElement();

    const body = this.notification().Body.Value();

    this.notification().Body.Value(body + `<br>` + link);
  };

  sendEmail = () => {};

  init() {
    const notification = createRequestDetailNotification({
      request: this.request,
    });

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
