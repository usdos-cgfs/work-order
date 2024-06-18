import {
  ConstrainedEntityEditModule,
  ConstrainedEntityViewModule,
} from "../../components/index.js";
import { TextField, SelectField } from "../../fields/index.js";
import { registerComponentFromConstructor } from "../../infrastructure/RegisterComponents.js";
import BaseServiceDetail from "../BaseServiceDetail.js";
import { propSpaceEditTemplate } from "./views/Edit.js";
import { propSpaceViewTemplate } from "./views/View.js";

const components = {
  view: "svc-prop_space-view",
  edit: "svc-prop_space-edit",
  new: "svc-prop_space-edit",
};

class PropertySpaceEditModule extends ConstrainedEntityEditModule {
  constructor(params) {
    super(params);
  }

  static name = components.edit;
  static template = propSpaceEditTemplate;
}

class PropertySpaceViewModule extends ConstrainedEntityViewModule {
  constructor(params) {
    super(params);
  }

  static name = components.view;
  static template = propSpaceViewTemplate;
}

registerComponentFromConstructor(PropertySpaceEditModule);
registerComponentFromConstructor(PropertySpaceViewModule);

export default class PropertySpace extends BaseServiceDetail {
  constructor(params) {
    super(params);
  }

  serviceTypes = {
    Property: "Property",
    Space: "Space",
  };

  // property logic
  propertySvcTypes = {
    Inventory: "Inventory Request",
    Move: "Property move from one space to another",
    Excess: "Property excess request",
    Loanable: "Loanable Property",
  };

  propertyTypeOptions = [
    "Backpack",
    "Computer Monitor",
    "Computer Speakers",
    "Headset",
    "Keyboard",
    "Mouse",
    "PIV Card Reader",
    "Web Camera",
  ];

  // Space Logic

  spaceSvcTypes = {
    Move: "Moving from one space to another",
    New: "Request for new office space",
  };

  ShowEndofLoanAlert = ko.pureComputed(() => {
    return (
      this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property &&
      this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Loanable
    );
  });

  FieldMap = {
    ...this.FieldMap,
    PropOrSpace: new SelectField({
      displayName: " Type",
      options: Object.values(this.serviceTypes),
      isRequired: true,
    }),
    //Property
    PropRequestType: new SelectField({
      displayName: "Property Request Type",
      options: Object.values(this.propertySvcTypes),
      isRequired: true,
      Visible: ko.pureComputed(
        () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property
      ),
    }),
    LocationChoice: new SelectField({
      displayName: "Location",
      options: ["On Premise", "Off Premise"],
      isRequired: true,
      Visible: ko.pureComputed(() => {
        return (
          this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property &&
          this.FieldMap.PropRequestType.Value() ==
            this.propertySvcTypes.Inventory
        );
      }),
    }),
    // Space
    SpaceRequestType: new SelectField({
      displayName: "Space Request Type",
      options: Object.values(this.spaceSvcTypes),
      isRequired: true,
      Visible: ko.pureComputed(
        () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space
      ),
    }),
    NumberEmployees: new TextField({
      displayName: "Number of Employees",
      isRequired: true,
      Visible: ko.pureComputed(
        () =>
          this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space &&
          this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.New
      ),
    }),
    Timeframe: new TextField({
      displayName: "New Location",
      isRequired: true,
      Visible: ko.pureComputed(
        () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space
      ),
    }),
    // Shared
    CurrentLocation: new TextField({
      displayName: "Current Location",
      isRequired: true,
      Visible: ko.pureComputed(() => {
        const svcType = this.FieldMap.PropOrSpace.Value();
        if (!svcType) return false;

        if (svcType == this.serviceTypes.Property) {
          return (
            this.FieldMap.PropRequestType.Value() ==
              this.propertySvcTypes.Move ||
            this.FieldMap.PropRequestType.Value() ==
              this.propertySvcTypes.Excess
          );
        }

        if (svcType == this.serviceTypes.Space) {
          return (
            this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move
          );
        }
      }),
    }),
    NewLocation: new TextField({
      displayName: "New Location",
      isRequired: true,
      Visible: ko.pureComputed(() => {
        const svcType = this.FieldMap.PropOrSpace.Value();
        if (!svcType) return false;

        if (svcType == this.serviceTypes.Property) {
          return (
            this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Move
          );
        }

        if (svcType == this.serviceTypes.Space) {
          return (
            this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move
          );
        }
      }),
    }),
    NumberItems: new TextField({
      displayName: "Number of Items",
      isRequired: true,
      Visible: ko.pureComputed(() => {
        const svcType = this.FieldMap.PropOrSpace.Value();
        if (!svcType) return false;
        if (svcType == this.serviceTypes.Property)
          return this.FieldMap.PropRequestType.Value();
        return (
          this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move
        );
      }),
    }),
    // Property Bottom
    //TODO: Minor - This is using a single line of text instead of a lookup, formatting is weird
    PropertyType: new SelectField({
      displayName: "Type of Property",
      options: this.propertyTypeOptions,
      multiple: true,
      isRequired: true,
      Visible: ko.pureComputed(() => {
        return (
          this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property &&
          this.FieldMap.PropRequestType.Value()
        );
      }),
    }),
  };

  components = components;

  static Views = {
    All: [
      "ID",
      "Title",
      "PropOrSpace",
      "PropRequestType",
      "LocationChoice",
      "SpaceRequestType",
      "NumberEmployees",
      "Timeframe",
      "CurrentLocation",
      "NewLocation",
      "NumberItems",
      "PropertyType",
    ],
  };

  static ListDef = {
    name: "st_property_space",
    title: "st_property_space",
    fields: PropertySpace.Views.All,
  };
}
