import { html } from "../index.js";

export const emailRequestTemplate = html`
  <button
    title="Create Email from Request"
    type="button"
    class="btn btn-link action"
    data-bind="click: showDialog"
  >
    <i class="fa-solid fa-envelope"></i>
  </button>
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
      <div data-bind="with: Notification">
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
          title="Add a hyperlink to the request"
          data-bind="click: insertRequestLink"
          title="Insert a hyperlink to this request"
        >
          <i class="fa-solid fa-link"></i>
          Insert Direct Link to Request
        </button>
        <button
          type="button"
          class="btn btn-link"
          title="Add request attachments to this notification"
          data-bind="click: includeAttachments, enable: ShowIncludeAttachments"
          title="Include attachments from request"
        >
          <i class="fa-solid fa-file-circle-plus"></i>
          Include Request Attachments
        </button>
      </div>
      <div data-bind="if: Attachments().length" class="attachments-section">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: Attachments">
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
                <button
                  type="button"
                  class="btn btn-link"
                  title="Don't include this attachment on the notification"
                >
                  <i
                    class="fa-solid fa-circle-xmark"
                    data-bind="click:  $parent.removeAttachment"
                  ></i>
                </button>
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
