import Entity from "./Entity.js";
import { html } from "../components/index.js";
import { defaultComponents } from "./defaultComponents.js";
export class ConstrainedEntity extends Entity {
  constructor(params) {
    super(params);
  }

  toJSON = () => {
    const out = {};
    Object.keys(this.FieldMap).map(
      (key) => (out[key] = this.FieldMap[key]?.get())
    );
    return out;
  };

  fromJSON(inputObj) {
    if (window.DEBUG)
      console.log("Setting constrained entity from JSON", inputObj);
    Object.keys(inputObj).map((key) => this.FieldMap[key]?.set(inputObj[key]));
  }

  toHTMLTable = () => {
    const body =
      `<table><tbody>` +
      Object.entries(this.FormFields)
        .map(([key, value]) => {
          return html`
            <tr>
              <td>${value?.displayName ?? key}</td>
              <td>
                ${value?.toString() ??
                '<span style="font-style: italic;">not provided</span>'}
              </td>
            </tr>
          `;
        })
        .join("") +
      html`
      </tbody></table>
      `;

    return body;
  };

  toHTMLDataList = () => {
    const body =
      `<dl>` +
      Object.entries(this.FieldMap)
        .map(([key, value]) => {
          return html`
            <dt>${value?.displayName ?? key}</dt>
            <dd>
              ${value?.toString() ??
              '<span style="font-style: italic;">not provided</span>'}
            </dd>
          `;
        })
        .join("") +
      html`
      </dl>
      `;

    return body;
  };

  toHTML = () => {
    const body =
      `<p>` +
      Object.entries(this.FieldMap)
        .filter(([key, value]) => value?.Visible())
        .map(([key, value]) => {
          const valueKey = value?.displayName ?? key;
          const valueText =
            value?.toString() ??
            '<span style="font-style: italic;">not provided</span>';

          return `${valueKey}: ${valueText}`;
        })
        .join("<br>") +
      `</p>`;

    return body;
  };

  FormFields = ko.pureComputed(() => {
    return Object.values(this.FieldMap).filter((field) => field?.Visible());
  });

  FormFieldKeys = ko.pureComputed(() =>
    Object.keys(this.FieldMap).filter((key) => this.FieldMap[key]?.Visible())
  );

  validate = (showErrors = true) => {
    Object.values(this.FieldMap).map(
      (field) => field?.validate && field.validate(showErrors)
    );
    this.ShowErrors(showErrors);
    return this.Errors();
  };

  ShowErrors = ko.observable(false);
  Errors = ko.pureComputed(() => {
    // if (!this.ShowErrors()) return [];

    return Object.values(this.FieldMap)
      .filter((field) => field?.Errors && field.Errors())
      .flatMap((field) => field.Errors());
  });

  IsValid = ko.pureComputed(() => !this.Errors().length);

  components = defaultComponents;
}
