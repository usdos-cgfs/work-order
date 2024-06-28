import { ResolverModule, html } from "../../../components/index.js";
import { getAppContext } from "../../../infrastructure/ApplicationDbContext.js";
import { RequestEntity, serviceTypeStore } from "../../../entities/index.js";
import { currentUser } from "../../../infrastructure/Authorization.js";

const createProcurementTemplate = html`
  <!-- ko if: assignment.Status != assignmentStates.Completed -->
  <div class="card m-1">
    <div class="card-body">
      <div>
        <h6>You have been designated as an action office resolver:</h6>
      </div>
      <div class="d-flex justify-content-between">
        <div>
          <div>
            Assignee: <span data-bind="text: assignment.Assignee?.Title"></span>
          </div>
          <div>
            Request Org:
            <span data-bind="text: assignment.RequestOrg?.Title"></span>
          </div>
        </div>
        <div>
          <p>
            If necessary, create a procurement request, then click confirm to
            proceed!
          </p>
          <div class="d-flex justify-content-start">
            <button
              class="btn btn-primary"
              data-bind="click: createProcurement"
              title="Create new procurement from this request"
            >
              Create Procurement
            </button>

            <button
              class="ms-3 btn btn-success"
              title="Confirm email has been sent"
              data-bind="click: completeHandler"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Completed -->
  <div class="alert alert-success">
    <strong>Thank you for confirming!</strong>
  </div>
  <!-- /ko -->
`;

export class CreateProcurementAction extends ResolverModule {
  constructor(params) {
    super(params);
    this.request = params.request;
    this.requestBody = params.request.RequestBodyBlob.Value();
  }

  createProcurement = async () => {
    // 1. Generate the description of the new request
    let procurementDescription = "<ul>";
    Object.values(this.requestBody.FieldMap).forEach((field) => {
      if (field) {
        procurementDescription += `<li>${
          field.displayName
        }: ${field.toString()}</li>`;
      }
    });
    procurementDescription += "</ul>";

    // 2. Create a new request of the procurement
    const procurementServiceTypeDef = serviceTypeStore().find(
      (service) => service.UID == "procurement"
    );

    const newRequest = RequestEntity.CreateByServiceType({
      ServiceType: procurementServiceTypeDef,
    });

    // 3. Populate fields
    newRequest.FieldMap.RequestDescription.set(procurementDescription);
    newRequest.FieldMap.RequestingOffice.set(
      this.request.FieldMap.RequestingOffice.get()
    );

    newRequest.FieldMap.Requestor.set(this.request.FieldMap.Requestor.get());
    newRequest.FieldMap.RequestorEmail(this.request.FieldMap.RequestorEmail());
    newRequest.FieldMap.RequestorPhone(this.request.FieldMap.RequestorPhone());

    newRequest.FieldMap.RequestorOfficeSymbol.set(
      this.request.FieldMap.RequestorOfficeSymbol.get()
    );

    // 4. Copy files
    const sourcePath = this.request.getRelativeFolderPath();
    const targetPath = await newRequest.Attachments.createFolder();

    const _context = getAppContext();
    try {
      await _context.Attachments.CopyFolderContents(sourcePath, targetPath);
      newRequest.Attachments.refresh();
    } catch (e) {
      console.error("Error copying files: ", e);
    }
    // 5. View Request
    window.WorkOrder.App.NewRequest({ request: newRequest });
  };

  static name = "create-procurement";
  static template = createProcurementTemplate;
}
