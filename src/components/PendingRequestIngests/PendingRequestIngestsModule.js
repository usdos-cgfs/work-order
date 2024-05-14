import { requestIngests } from "../../stores/Requests.js";
import { serviceTypeStore } from "../../entities/ServiceType.js";
import { RequestEntity } from "../../entities/Request.js";

import { currentUser } from "../../infrastructure/Authorization.js";
import { getAppContext } from "../../infrastructure/ApplicationDbContext.js";
import { Attachment } from "../../entities/Attachment.js";

export default class PendingRequestIngestsModule {
  PendingRows = ko.pureComputed(() => {
    // return [];
    return requestIngests().map((item) => new RequestIngestItem(item));
  });

  ConvertToOptions = ko.pureComputed(() =>
    serviceTypeStore().filter((serviceType) =>
      serviceType.userCanInitiate(currentUser())
    )
  );

  deleteItem = async (requestIngest) => {
    const context = getAppContext();

    // Delete attachments
    const folderPath = requestIngest.getStagedAttachmentsFolderPath();
    await context.Attachments.DeleteFolderByPath(folderPath);

    // Delete item
    await context.RequestIngest.RemoveEntity(requestIngest);

    requestIngests(await this.context.RequestIngests.ToList());
  };
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

  // Attempt any service type specific mapping
  newRequest.RequestDescription.Value(requestIngest.Body.Value());

  // Check if there are any attachments
  const context = getAppContext();
  const requestIngestAttachmentPath = "Staged/" + requestIngest.ID;
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
