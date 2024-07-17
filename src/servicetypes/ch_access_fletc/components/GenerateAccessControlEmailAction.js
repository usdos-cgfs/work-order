import { ResolverModule, html } from "../../../components/index.js";

const generateEmailTemplate = html`
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
            Please click generate and send the email, then click confirm to
            proceed!
          </p>
          <div class="d-flex justify-content-start">
            <a
              target="_blank"
              class="btn btn-link"
              data-bind="attr: {href: linkGenerateEmail}"
              title="Generate email for Access Control"
            >
              Generate
            </a>

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

export class CH_GenerateAccessControlEmailActions extends ResolverModule {
  constructor(params) {
    super(params);
    this.request = params.request;
    this.serviceType = params.request.RequestBodyBlob?.Value();
  }

  linkGenerateEmail = ko.pureComputed(() => {
    const subject = `New FLETC Access Request`;
    const to = "backlundpf@state.gov";
    const cc = "";

    const body =
      `A new access request has been submitted:\n` +
      `Full Name: \t${this.serviceType.FieldMap.FullName.toString()}` +
      `Employee Type: \t${this.serviceType.FieldMap.EmployeeType.toString()}`;

    const link =
      `https://outlook.office.com/mail/deeplink/compose?` +
      `to=${to}&cc=${cc}` +
      `&subject=${subject}&body=${body}`;

    return link;
  });

  static name = "generate-access-control-email";
  static template = generateEmailTemplate;
}
