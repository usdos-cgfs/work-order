import { html } from "../index.js";

export const emailRequestTemplate = html`
  <div>
    <button
      title="Create Email from Request"
      type="button"
      class="btn btn-link"
      data-bind="click: showDialog"
    >
      <i class="fa-solid fa-envelope"></i>
    </button>
  </div>
  <dialog id="dialog-email-request" class="card">
    <div class="card-body">
      <div class="card-title d-flex justify-content-between align-items-center">
        <div>
          <h3>Send Request as Email</h3>
        </div>
        <div class="d-flex justify-content-end">
          <i
            class="fa-solid fa-xmark pointer"
            data-bind="click: closeDialog"
          ></i>
        </div>
      </div>
      <div data-bind="with: notification">
        <div>
          <div
            data-bind="component: {name: ToString.components.edit, params: ToString}"
          ></div>
          <div
            data-bind="component: {name: CCString.components.edit, params: CCString}"
          ></div>
        </div>
        <div
          data-bind="component: {name: Title.components.edit, params: Title}"
        ></div>
        <div
          data-bind="component: {name: SendAs.components.edit, params: SendAs}"
        ></div>
        <div
          data-bind="component: {name: Body.components.edit, params: Body}"
        ></div>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-link"
          data-bind="click: insertRequestLink"
          title="Insert a hyperlink to this request"
        >
          <i class="fa-solid fa-link"></i>
          Insert Request Link
        </button>
        <button
          type="button"
          class="btn btn-link"
          data-bind="click: includeAttachments"
          title="Include attachments from request"
        >
          Include Request Attachments
        </button>
      </div>
      <div data-bind="if: attachments().length" class="attachments-section">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: attachments">
            <tr>
              <td>
                <div data-bind="text: Title"></div>
              </td>
              <td>
                <a
                  target="_blank"
                  data-bind="attr: { href: FileRef }, text: FileLeafRef"
                ></a>
              </td>
              <td>
                <i
                  class="fa-solid fa-circle-xmark"
                  title="Don't include"
                  data-bind="click:  $parent.removeAttachment"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end gap-3">
        <button
          type="button"
          class="btn btn-danger"
          data-bind="click: closeDialog"
          title="Close cancel"
        >
          <i class="fa-solid fa-circle-xmark"></i>
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-success"
          data-bind="click: sendEmail"
          title="Send email"
        >
          <i class="fa-solid fa-paper-plane"></i>
          Send
        </button>
      </div>
    </div>
  </dialog>
`;
