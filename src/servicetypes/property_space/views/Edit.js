import { html } from "../../../components/BaseComponent.js";
export const propSpaceEditTemplate = html`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <div class="alert alert-warning" data-bind="visible: ShowEndofLoanAlert">
      <h4>End of Loan Return of Items</h4>
      All property which was borrowed must be returned to the Bureau by the
      employee when the property is no longer needed for the use for which it
      was originally provided 14 FAM 425 3-4. The employee must email the
      CGFS/EX/ADMIN team at
      <a href="mailto:CGFS_EX_ADMIN@state.gov">CGFS_EX_ADMIN@state.gov</a> to
      coordinate return. Reminder, any lost or damaged property is the
      responsibility of the borrowing employee. Any lost or damaged property
      must be immediately reported to the CGFS/EX/ADMIN team.
    </div>
  </div>
`;
