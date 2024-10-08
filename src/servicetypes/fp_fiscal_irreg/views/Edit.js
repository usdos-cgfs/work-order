import { html } from "../../../components/BaseComponent.js";
export const fiscalIrregEditTemplate = html`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <div class="row row-cols-1" data-bind="if: ShowShortageDocs">
      <div class="col">
        <h4>Supporting Documentation</h4>
        <!-- ko if: USDValue.Value() > 500 -->
        <ul>
          <li>FI report of investigation.</li>
          <li>
            Principle Officer recommendation for shortages greater than $500.
          </li>
          <li>
            GFS-365 Cashier Daily Reconciliation Statement showing
            accountability out of balance.
          </li>
          <li>Class B Cashier memo to FMO reporting shortage.</li>
        </ul>
        <!-- /ko -->
        <!-- ko ifnot: USDValue.Value() > 500 -->
        <ul>
          <li>FI report of investigation.</li>
          <li>
            Principle Officer determination for shortages less than equal to
            $500.
          </li>
          <li>
            For FI shortages of $500 or less with relief granted: DS-2076
            voucher charging the FI loss to the post allotment.
          </li>
          <li>
            For FI shortages of $500 or less with relief not granted and the
            accountable officer has made restitution: memorandum to the cashier
            acknowledging that restitution was made.
          </li>
          <li>
            Subsequent GFS-365 statement showing cashier accountability back in
            balance.
          </li>
        </ul>
        <h5>Counterfeit Currency</h5>
        <ul>
          <li>Class B Cashier memo to FMO reporting counterfeit currency.</li>
          <li>
            Secret Service Or Bank report/statement confirming counterfeit
            currency.
          </li>
          <li>Photocopies of the counterfeit bills (front and back).</li>
        </ul>
        <!-- /ko -->
      </div>
    </div>
  </div>
`;
