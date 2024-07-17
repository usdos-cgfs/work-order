import {
  Attachment,
  serviceTypeStore,
  RequestEntity,
} from "../../entities/index.js";

import { currentUser } from "../../infrastructure/Authorization.js";
import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";

import { BaseComponent } from "../index.js";
import { pendingRequestsIngestTemplate } from "./PendingRequestIngestsTemplate.js";

import { requestIngests } from "../../stores/Requests.js";

export class PendingRequestIngestsModule extends BaseComponent {
  PendingRows = ko.pureComputed(() => {
    // return [];
    return requestIngests().map((item) => new RequestIngestItem(item));
  });

  ConvertToOptions = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  deleteItem = async ({ requestIngest }) => {
    const context = getAppContext();

    // Delete attachments
    const folderPath = requestIngest.getStagedAttachmentsFolderPath();
    await context.Attachments.DeleteFolderByPath(folderPath);

    // Delete item
    await context.RequestIngests.RemoveEntity(requestIngest);

    requestIngests(await context.RequestIngests.ToList());
  };

  static name = "pending-request-ingests";
  static template = pendingRequestsIngestTemplate;
}

class RequestIngestItem {
  constructor(requestIngest) {
    this.requestIngest = requestIngest;

    this.ConvertTo.subscribe(this.onConvertToChangeHandler);
  }

  ShowBody = ko.observable(false);

  ConvertTo = ko.observable();

  onConvertToChangeHandler = (convertTo) => {
    if (!convertTo) return null;
    this.ConvertTo(null);
    this.ShowBody(false);
    console.log("converting to...", convertTo);
    convertToServiceType(convertTo, this.requestIngest);
  };
}

async function convertToServiceType(serviceType, requestIngest) {
  await serviceType.initializeEntity();

  const newRequest = new RequestEntity({
    ServiceType: serviceType,
  });

  const emailBody = requestIngest.Body.Value();
  // Attempt any service type specific mapping
  if (newRequest.RequestBodyBlob?.Value()?.fromEmail) {
    newRequest.RequestBodyBlob?.Value()?.fromEmail(emailBody);
  }

  // Set the email content as the body
  newRequest.RequestDescription.Value(emailBody);

  // Check if there are any attachments
  const context = getAppContext();
  const requestIngestAttachmentPath =
    requestIngest.getStagedAttachmentsFolderPath();

  const attachmentCount = await context.Attachments.GetItemsByFolderPath(
    requestIngestAttachmentPath,
    Attachment.Views.All
  );

  if (attachmentCount.length) {
    console.log("Copying attachments");
    const folderPath = await newRequest.Attachments.createFolder();
    await context.Attachments.CopyFolderContents(
      requestIngestAttachmentPath,
      folderPath
    );

    await newRequest.Attachments.refresh();
  }

  window.WorkOrder.App.NewRequest({ request: newRequest });
}
