import { defaultComponents } from "../../primitives/ConstrainedEntity.js";
import { BaseComponent } from "../BaseComponent.js";
import { constrainedEntityEditTemplate } from "./DefaultEdit.js";
import { constrainedEntityViewTemplate } from "./DefaultView.js";

class ConstrainedEntityBaseModule extends BaseComponent {
  constructor({ Entity }) {
    super();
    Object.assign(this, Entity);
  }
}

export class ConstrainedEntityViewModule extends ConstrainedEntityBaseModule {
  constructor(params) {
    super(params);
  }

  static name = defaultComponents.view;
  static template = constrainedEntityViewTemplate;
}

export class ConstrainedEntityEditModule extends ConstrainedEntityBaseModule {
  constructor(params) {
    super(params);
  }

  static name = defaultComponents.edit;
  static template = constrainedEntityEditTemplate;
}
