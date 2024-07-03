import { Notification } from "../../entities/index.js";
import CheckboxField from "../../fields/CheckboxField.js";
import {
  createRequestDetailNotification,
  submitNotification,
} from "../../infrastructure/Notifications.js";
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
  attachments = ko.observableArray();

  insertRequestLink = () => {
    const link = this.request.getAppLinkElement();

    const body = this.notification().Body.Value();

    this.notification().Body.Value(link + `<br>` + body);
  };

  includeAttachments = () => {
    // Load attachments
    const attachments = this.request.Attachments.list
      .Active()
      .map((attachment) => attachment);
    this.attachments(attachments);
  };

  removeAttachment = (attachment) => {
    this.attachments.remove(attachment);
  };

  sendEmail = async () => {
    const notification = ko.unwrap(this.notification);
    // TODO: Validate notification
    if (!notification) return;

    const attachments = ko.unwrap(this.attachments);

    await submitNotification(
      notification,
      this.request.getRelativeFolderPath(),
      attachments
    );
  };

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

class NotificationAttachment {
  constructor(attachment) {}
}
