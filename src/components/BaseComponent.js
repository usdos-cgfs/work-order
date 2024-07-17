export const html = String.raw;

export class BaseComponent {
  constructor() {}

  static name = "base-component";
  static template = html`<div>No Component Registered!</div>`;
}
