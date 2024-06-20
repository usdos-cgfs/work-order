(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // lib/webcomponents/searchselect/SearchSelectTemplate.js
  var html = String.raw;
  var searchSelectTemplate = html`
<div>
  <style>
    .search-group {
      display: none;
    }
    /* Testing Style HTML Elements */
    .elements-container {
      display: flex;
      column-gap: 20px;
    }
    .select-container {
      width: 150px;
    }

    /* Actual Elements */

    div.search-group {
      display: revert;
      position: relative;
      min-height: 1rem;
    }

    .search-input-group {
      display: flex;
      align-items: center;
      background-color: white;
      border: 1px solid lightgray;
      box-sizing: content-box;
      height: 1rem;
      padding: 1px 0px;
    }

    .search-input-group input {
      border: none;
      width: 100%;
      height: 1rem;
    }

    /* .caret {
      content: "";
      display: inline-block;
      border: 4px solid transparent;
      border-top-color: transparent;
      border-top-color: black;
      margin-left: 12px;
      margin-top: 4px;
    } */

    .caret-bg {
      background-image: url("#svg-caret-down");
      background-repeat: no-repeat;
      min-width: 1rem;
    }

    .search-input-group::after {
      aspect-ratio: 1 / 1;
      height: 1rem;
      content: "\276F";
      color: darkgray;
      font-size: 0.7rem;
      font-weight: bold;
      text-align: center;
      display: flex;
      justify-content: center;
      transition: transform 0.4s ease-in-out;
    }

    .search-group.active .search-input-group::after {
      transform: rotate(90deg);
    }

    .search-input-group .vertical-spacer {
      height: 85%;
      min-height: 0.8rem;
      border-left: 1px solid lightGray;
    }
    .search-input-group svg {
      color: lightGray;
      height: 85%;
      transition-duration: 0.5s;
    }

    .search-group.active .search-input-group svg {
      border: none;
      transform: rotate(180deg);
    }

    .hidden {
      display: none;
    }

    .secondary {
      font-style: italic;
    }

    .test-toggle {
      background-color: green;
    }

    .selected.item {
      display: flex;
      align-items: center;
      width: fit-content;
      color: #212529;
      font-weight: normal;
      font-size: 0.875rem;
      background-color: #f8f9fa;
      border-radius: 0.25rem;
      border: 1px solid #dee2e6;
      /* height: 1.5rem; */
      /* top right bottom left */
      /* padding: 0.1rem 0rem 0.1rem 0.5rem; */
      padding-left: 0.75rem;
      margin-bottom: 1px;
    }

    .selected.item div.remove {
      /* border-style: none;
  border-radius: 50%; */
      border-top-right-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      margin-left: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 1.5rem;
      color: rgb(108, 117, 125);
      aspect-ratio: 1/1;
    }

    .selected.item div.remove:hover {
      background-color: darkgrey;
      color: white;
    }

    .selected.item div.remove svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    .filtered.item {
      background-color: white;
      padding: 0.1rem 1rem;
      font-weight: normal;
    }

    .filtered.item.even {
      background-color: rgb(233, 233, 233);
    }

    .filtered.item:hover {
      background-color: lightgray;
    }

    .filtered.item.active {
      background-color: lightblue;
    }

    #selected-items-text {
      display: flex;
      flex-wrap: wrap;
    }

    .filtered-items {
      list-style: none;
      padding-left: 0;
      margin-top: 3px;
      /* display: none; */
      position: absolute;
      min-width: 100%;
      max-height: 0px;
      overflow-y: auto;
      z-index: 1;
      border: 0px solid lightgray;
      box-sizing: border-box;
      transition: all 0.4s ease-in-out;
    }

    .filtered-items.active {
      /* display: block; */
      max-height: 200px;
      border: 1px solid lightgray;
    }
  </style>
  <div id="search-group" class="search-group" tabindex="-1">
    <div id="selected-items-text"></div>
    <div class="search-input-group" tabindex="-1">
      <input
        id="search-input"
        class="search-input"
        type="text"
        autocomplete="off"
      />
      <div class="vertical-spacer"></div>
    </div>
    <ul id="filtered-items-text" class="filtered-items"></ul>
  </div>
  <div id="icons" class="hidden" style="display: none">
    <div id="icon-close" style="display: none">
      <svg
        class="position-absolute top-50 start-50 translate-middle"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </div>
    <div id="icon-caret-down">
      <svg
        id="svg-caret-down"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.1018 8C5.02785 8 4.45387 9.2649 5.16108 10.0731L10.6829 16.3838C11.3801 17.1806 12.6197 17.1806 13.3169 16.3838L18.8388 10.0731C19.5459 9.2649 18.972 8 17.898 8H6.1018Z"
          fill="#212121"
        />
      </svg>
    </div>
  </div>
</div>
`;

  // lib/webcomponents/searchselect/searchselect.js
  customElements.define(
    "search-select",
    class extends HTMLElement {
      constructor() {
        super();
        const templateText = searchSelectTemplate;
        this.selectableItems = [];
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = templateText;
        this.searchGroupElement = this.shadowRoot.getElementById("search-group");
        this.searchInputGroupElement = this.shadowRoot.querySelector(
          ".search-input-group"
        );
        this.searchInputElement = this.shadowRoot.getElementById("search-input");
        this.filteredItemsElement = this.shadowRoot.getElementById(
          "filtered-items-text"
        );
        this.selectedItemsElement = this.shadowRoot.getElementById(
          "selected-items-text"
        );
        this.options = this.querySelectorAll("option");
      }
      initializeFilteredItems = () => {
        this.options = this.querySelectorAll("option");
        this.filteredItemDivs = [...this.options].map((opt, index) => {
          let li = document.createElement("li");
          li.classList.add("filtered", "item");
          li.classList.toggle("even", index % 2);
          li.innerHTML = opt.innerHTML;
          li.dataset.value = opt.value;
          return li;
        });
        this.filteredItemsElement.replaceChildren(...this.filteredItemDivs);
        this.updateFilteredItems();
        this.updateSelectedItems(true);
      };
      updateFilteredItems = () => {
        const searchText = this.searchInputElement.value;
        this.filteredItemDivs.forEach((opt) => {
          const optContainsText = opt.innerText.toLowerCase().search(searchText.toLowerCase()) >= 0;
          const shouldBeShown = !searchText || optContainsText;
          opt.classList.toggle("hidden", !shouldBeShown);
        });
        [...this.options].filter((opt) => opt.hasAttribute("selected")).map((opt) => {
          this.filteredItemDivs.find((div) => div.dataset.value === opt.value).classList.add("hidden");
        });
        var count = [
          ...this.filteredItemsElement.querySelectorAll("li:not(.hidden)")
        ].map((li, index) => li.classList.toggle("even", index % 2));
      };
      updateActiveFilteredItem = (keyDirection) => {
        const visibleItems = this.filteredItemDivs.find(
          (opt) => !opt.classList.contains("hidden")
        );
        if (!visibleItems) {
          return;
        }
        const activeItemIndex = this.filteredItemDivs.findIndex(
          (opt) => opt.classList.contains("active")
        );
        let index = activeItemIndex + keyDirection;
        let item;
        do {
          if (index >= this.filteredItemDivs.length) {
            index = 0;
          }
          item = this.filteredItemDivs.at(index);
          index += keyDirection;
        } while (item.classList.contains("hidden"));
        item.classList.add("active");
        if (activeItemIndex >= 0) {
          this.filteredItemDivs[activeItemIndex].classList.remove("active");
        }
      };
      selectActiveFilteredItem = () => {
        const activeItem = this.filteredItemDivs.find(
          (opt) => opt.classList.contains("active")
        );
        if (activeItem) {
          this.selectFilteredItem(activeItem);
          this.updateActiveFilteredItem(1);
        }
      };
      updateSelectedItems = (initial = false) => {
        this.selectedOptions = [...this.options].filter(
          (opt) => opt.hasAttribute("selected")
        );
        const closeCopy = this.shadowRoot.getElementById("icon-close").innerHTML;
        const selectedItemDivs = this.selectedOptions.map((opt) => {
          const itemGroup = document.createElement("div");
          itemGroup.classList.add("selected", "item");
          itemGroup.dataset.value = opt.value;
          const itemText = document.createElement("div");
          itemText.innerText = opt.innerHTML;
          const close = document.createElement("div");
          close.classList.add("remove");
          close.innerHTML = closeCopy;
          itemGroup.appendChild(itemText);
          itemGroup.appendChild(close);
          return itemGroup;
        });
        this.selectedItemsElement.replaceChildren(...selectedItemDivs);
        if (!initial) {
          this.dispatchEvent(new Event("change"));
        }
      };
      selectFilteredItem = (item) => {
        [...this.options].find((opt) => opt.value === item.dataset.value).setAttribute("selected", "");
        this.updateSelectedItems();
        this.updateFilteredItems();
      };
      removeSelectedItem = (item) => {
        [...this.options].find((opt) => opt.value === item.dataset.value).removeAttribute("selected");
        this.updateSelectedItems();
        this.updateFilteredItems();
      };
      connectedCallback() {
        this.filteredItemsElement.classList.toggle("active", false);
        this.initializeFilteredItems();
        this.searchGroupElement.addEventListener("focusin", (e) => {
          this.filteredItemsElement.classList.toggle("active", true);
          this.searchGroupElement.classList.toggle("active", true);
          clearTimeout(this.focusOutTimeout);
        });
        this.searchGroupElement.addEventListener("focusout", (e) => {
          this.focusOutTimeout = setTimeout(() => {
            this.filteredItemsElement.classList.remove("active");
            this.searchGroupElement.classList.remove("active");
          }, 0);
        });
        this.searchInputElement.addEventListener("input", (e) => {
          this.updateFilteredItems();
        });
        this.searchInputElement.addEventListener("focusout", (e) => {
        });
        this.searchGroupElement.addEventListener("keydown", (e) => {
          switch (e.code) {
            case "Tab":
              this.filteredItemsElement.classList.remove("active");
              break;
            case "ArrowDown":
              this.updateActiveFilteredItem(1);
              break;
            case "ArrowUp":
              this.updateActiveFilteredItem(-1);
              break;
            case "Enter":
              this.handlingClick = true;
              this.selectActiveFilteredItem();
              break;
            default:
          }
        });
        this.filteredItemsElement.addEventListener("click", (e) => {
          this.selectFilteredItem(e.target);
        });
        this.selectedItemsElement.addEventListener("click", (e) => {
          this.removeSelectedItem(e.target.closest("div.item"));
        });
        const mutationCallback = (mutationList, observer) => {
          for (const mutation of mutationList) {
            if (mutation.type === "childList") {
              this.initializeFilteredItems();
            }
          }
        };
        this.mutationObserver = new MutationObserver(mutationCallback);
        this.mutationObserver.observe(this, { childList: true });
      }
      disconnectedCallback() {
        try {
          this.mutationObserver.disconnect();
        } catch (e) {
          console.warn("cannot remove event listeners");
        }
      }
    }
  );

  // src/app.txt
  var app_default = `<div\r
  style="display: none"\r
  data-bind="visible: BlockingTasks().length"\r
  class="position-fixed w-100 vh-100 top-0 start-0 active dimmer"\r
>\r
  <div\r
    class="d-flex flex-column justify-content-center w-100 h-100 align-items-center text-light"\r
  >\r
    <div class="spinner-border" role="status">\r
      <span class="visually-hidden">Loading...</span>\r
    </div>\r
    <ul class="list-unstyled" data-bind="foreach: BlockingTasks">\r
      <li data-bind="text: msg + '... ' + Status()"></li>\r
    </ul>\r
  </div>\r
</div>\r
\r
<div\r
  style="display: none; z-index: 1201"\r
  data-bind="visible: RunningTasks().length"\r
  class="position-fixed w-100 vh-100 top-0 start-0 pe-none"\r
>\r
  <div class="toast-container p-3 bottom-0 end-0">\r
    <div\r
      class="toast show align-items-center"\r
      role="alert"\r
      aria-live="assertive"\r
      aria-atomic="true"\r
    >\r
      <div class="d-flex">\r
        <div class="toast-body">\r
          <!-- ko foreach: RunningTasks -->\r
          <div data-bind="text: \`\${msg}... \${Status()}\`"></div>\r
          <!-- /ko -->\r
        </div>\r
        <button\r
          type="button"\r
          class="btn-close me-1 m-auto"\r
          data-bs-dismiss="toast"\r
          aria-label="Close"\r
        ></button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
\r
<div class="container" data-bind="hidden: HasLoaded">\r
  <div class="d-flex flex-column align-items-center">\r
    <progress class="w-75 mb-3"></progress>\r
    <div class="w-75 alert alert-warning text-center">\r
      If the url you are viewing begins with\r
      <span class="fw-semibold text-body-secondary"\r
        >https://usdos.sharepoint.com<b>.mcas.ms</b></span\r
      >\r
      please copy and paste the following link into your browser:\r
      <div id="ms-mcas-bypass" class="input-group w-100">\r
        <input id="ms-mcas-bypass-link" class="form-control" disabled />\r
        <button\r
          id="ms-mcas-bypass-copy"\r
          type="button"\r
          class="btn btn-secondary"\r
        >\r
          copy\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
\r
<script>\r
  {\r
    let loc = window.location;\r
\r
    const link = loc.href.replace(".mcas.ms", "");\r
\r
    let cpyLink = document.getElementById("ms-mcas-bypass-link");\r
    cpyLink.value = link;\r
\r
    let cpybtn = document.getElementById("ms-mcas-bypass-copy");\r
    cpybtn.addEventListener("click", (e, element) => {\r
      debugger;\r
      try {\r
        navigator.clipboard.writeText(link);\r
        e.target.innerText = "copied";\r
        e.target.classList.remove("btn-secondary");\r
        e.target.classList.add("btn-success");\r
      } catch (e) {\r
        alert("Copy failed, please select text and copy using CTRL+V");\r
      }\r
    });\r
\r
    // a.click();\r
  }\r
<\/script>\r
\r
<div id="app" class="wo" style="display: none" data-bind="visible: HasLoaded">\r
  <div\r
    data-bind="component: {name: 'quick-info', \r
    params: { ShowActionOfficeFeatures, ToggleActionOfficeFeatures }}"\r
  ></div>\r
  <div class="d-flex justify-content-between">\r
    <div>\r
      <ul class="nav flex-column me-4" id="section-tabs" role="tablist">\r
        <!-- ko if: ShowActionOfficeFeatures -->\r
        <li class="nav-item" role="presentation">\r
          <button\r
            class="nav-link"\r
            id="office-requests-tab"\r
            data-bs-toggle="tab"\r
            data-bs-target="#office-requests"\r
            data-bind="click: TabClicked"\r
            type="button"\r
            role="tab"\r
            aria-controls="office-requests"\r
            aria-selected="true"\r
          >\r
            Team Requests\r
          </button>\r
        </li>\r
        <!-- /ko -->\r
        <li class="nav-item" role="presentation">\r
          <button\r
            class="nav-link"\r
            id="my-requests-tab"\r
            data-bs-toggle="tab"\r
            data-bs-target="#my-requests"\r
            data-bind="click: TabClicked"\r
            type="button"\r
            role="tab"\r
            aria-controls="my-requests"\r
            aria-selected="true"\r
          >\r
            My Requests\r
          </button>\r
        </li>\r
        <!-- ko if: false -->\r
        <li class="nav-item" role="presentation">\r
          <button\r
            class="nav-link position-relative"\r
            id="my-assignments-tab"\r
            data-bs-toggle="tab"\r
            data-bs-target="#my-assignments"\r
            data-bind="click: TabClicked"\r
            type="button"\r
            role="tab"\r
            aria-controls="my-assignments"\r
            aria-selected="true"\r
          >\r
            My Assignments\r
            <span\r
              class="badge text-bg-danger"\r
              data-bind="visible: MyActiveAssignments().length, text: MyActiveAssignments().length"\r
            ></span>\r
          </button>\r
        </li>\r
        <!-- /ko -->\r
        <li class="nav-item" role="presentation">\r
          <button\r
            class="nav-link"\r
            id="new-request-tab"\r
            data-bs-toggle="tab"\r
            data-bs-target="#new-request"\r
            data-bind="click: TabClicked"\r
            type="button"\r
            role="tab"\r
            aria-controls="new-request"\r
            aria-selected="true"\r
          >\r
            New Request\r
          </button>\r
        </li>\r
        <li class="nav-item" role="presentation">\r
          <button\r
            class="nav-link"\r
            id="request-detail-tab"\r
            data-bs-toggle="tab"\r
            data-bs-target="#request-detail"\r
            data-bind="click: TabClicked"\r
            type="button"\r
            role="tab"\r
            aria-controls="request-detail"\r
            aria-selected="false"\r
          >\r
            Detail View\r
          </button>\r
        </li>\r
      </ul>\r
    </div>\r
    <div class="tab-content flex-grow-1">\r
      <!-- ko if: ShowActionOfficeFeatures -->\r
      <div\r
        class="tab-pane"\r
        role="tabpanel"\r
        aria-labelledby="office-requests-tab"\r
        id="office-requests"\r
      >\r
        <div\r
          data-bind="template: {name: 'tmpl-office-requests-view', data: OfficeRequestsView}"\r
        ></div>\r
      </div>\r
      <!-- /ko -->\r
      <div\r
        class="tab-pane"\r
        role="tabpanel"\r
        aria-labelledby="my-requests-tab"\r
        id="my-requests"\r
      >\r
        <div\r
          data-bind="template: {name: 'tmpl-my-requests-view', data: MyRequestsView}"\r
        ></div>\r
      </div>\r
      <!-- ko if: false -->\r
      <div\r
        class="tab-pane"\r
        role="tabpanel"\r
        aria-labelledby="my-assignments-tab"\r
        id="my-assignments"\r
      >\r
        <div\r
          data-bind="template: {name: 'tmpl-my-assignments-view', data: MyAssignmentsView}"\r
        ></div>\r
      </div>\r
      <!-- /ko -->\r
      <div\r
        class="tab-pane"\r
        role="tabpanel"\r
        aria-labelledby="new-request"\r
        id="new-request"\r
      >\r
        <div\r
          data-bind="template: {name: 'tmpl-new-request-view', data: NewRequestView}"\r
        ></div>\r
      </div>\r
      <div\r
        id="request-detail"\r
        class="tab-pane"\r
        role="tabpanel"\r
        aria-labelledby="request-detail-tab"\r
        data-bind=""\r
      >\r
        <!-- ko ifnot: RequestDetailView.Request -->\r
        <div class="">\r
          <h2>Service Request Detail</h2>\r
          <div>Please create a new request, or open an existing request.</div>\r
        </div>\r
        <!-- /ko -->\r
        <!-- ko if: RequestDetailView.Request -->\r
        <div\r
          data-bind="template: {name: 'tmpl-request-detail', data: RequestDetailView}"\r
        ></div>\r
        <!-- /ko -->\r
      </div>\r
    </div>\r
  </div>\r
  <div id="service-type-templates"></div>\r
\r
  <div id="tmpl-views">\r
    <script type="text/html" id="tmpl-office-requests-view">\r
      <h2>Team Requests</h2>\r
      <div class="card bg-white">\r
        <div class="card-body">\r
          <div class="mb-3 d-flex">\r
            <div\r
              class="request-status-options me-3"\r
              id="section-office-requests-tabs"\r
              data-bind="foreach: StatusOptions"\r
            >\r
              <button\r
                class="text-nowrap"\r
                type="button"\r
                data-bind="text: $data,\r
              css: {'active': $parent.ActiveKey() == $data },\r
              click: ()=> $parent.ActiveKey($data)"\r
              ></button>\r
            </div>\r
            <button\r
              type="button"\r
              class="btn btn-outline-primary"\r
              data-bind="css: {'active': ActiveKey() == byServiceTypeKey },\r
            click: ()=> ActiveKey(byServiceTypeKey)"\r
            >\r
              By Service Type\r
            </button>\r
          </div>\r
          <div class="flex-grow-1">\r
            <div\r
              data-bind="component: {name: ActiveTableComponentName, params: ActiveTableParams}"\r
            ></div>\r
          </div>\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-my-requests-view">\r
      <h2>My Requests</h2>\r
      <div class="card bg-white">\r
        <div class="card-body">\r
          <div class="mb-3 d-flex">\r
            <div\r
              class="request-status-options me-3"\r
              id="section-my-requests-tabs"\r
              data-bind="foreach: StatusOptions"\r
            >\r
              <button\r
                class="text-nowrap"\r
                type="button"\r
                data-bind="text: $data,\r
              css: {'active': $parent.ActiveKey() == $data },\r
              click: ()=> $parent.ActiveKey($data)"\r
              ></button>\r
            </div>\r
            <button\r
              type="button"\r
              class="btn btn-outline-primary"\r
              data-bind="css: {'active': ActiveKey() == 'By Service Type' },\r
              click: ()=> ActiveKey('By Service Type')"\r
            >\r
              By Service Type\r
            </button>\r
          </div>\r
          <div class="flex-grow-1">\r
            <div\r
              data-bind="component: {name: ActiveTableComponentName, params: ActiveTableParams}"\r
            ></div>\r
          </div>\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-my-assignments-view">\r
      <h2>My Open Assignments</h2>\r
      <!-- ko if: IsLoading -->\r
      <progress class="w-100"></progress>\r
      <!-- /ko -->\r
      <!-- ko ifnot: IsLoading -->\r
      <my-assignments-table></my-assignments-table>\r
      <!-- /ko -->\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-new-request-view">\r
      <h2>Select the type of request you would like to open:</h2>\r
      <div id="new-request-container">\r
        <div\r
          class="card new-request-ops-container"\r
          data-bind="css: {'service-selected': SelectedServiceType}"\r
        >\r
          <div class="card-body">\r
            <div\r
              class="new-request-opts"\r
              data-bind="foreach: ActiveServiceTypes"\r
            >\r
              <div\r
                class="card new-request-opt"\r
                data-bind="click: $parent.selectServiceTypeHandler, \r
                css: {'active': $parent.SelectedServiceType()?.ID == ID}, \r
                attr: {title: 'New ' + Title + ' Request'}"\r
              >\r
                <div class="card-body">\r
                  <i class="fa fa-3x" data-bind="class: Icon"></i>\r
                  <h5 class="card-title" data-bind="text: Title"></h5>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
        <div\r
          id="new-request-detail"\r
          class="card"\r
          style="height: fit-content"\r
          data-bind="visible: SelectedServiceType"\r
        >\r
          <div class="card-body" data-bind="">\r
            <!-- ko if: SelectedServiceType -->\r
            <h5\r
              class="card-title"\r
              data-bind="text: SelectedServiceType().Title"\r
            ></h5>\r
            <hr />\r
            <b>Description:</b>\r
            <div\r
              data-bind="html: SelectedServiceType().Description"\r
              class="mb-2"\r
            ></div>\r
            <b>Attachments:</b>\r
            <div\r
              data-bind="html: formatAttachmentDescription()"\r
              class="mb-2"\r
            ></div>\r
            <div class="card-text" class="mb-2">\r
              <p>\r
                Once submitted, this request will be routed to the appropriate\r
                action office.\r
              </p>\r
            </div>\r
            <!-- /ko -->\r
            <div class="d-flex justify-content-end">\r
              <button\r
                type="button"\r
                class="btn btn-secondary me-2"\r
                data-bind="click: cancelCreateServiceType"\r
              >\r
                Cancel\r
              </button>\r
              <button\r
                type="button"\r
                class="btn btn-success"\r
                data-bind="click: confirmCreateServiceType, enable: SelectedServiceType"\r
              >\r
                Create\r
              </button>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-request-detail">\r
      <!-- Report.RequestDetailView -->\r
      <!-- ko if: request.IsLoading -->\r
      <progress class="w-100"></progress>\r
      <!-- /ko -->\r
      <!-- ko ifnot: request.IsLoading -->\r
      <div class="">\r
        <h2>\r
          Service Request Detail:\r
          <span data-bind="text: request.RequestType.Title"></span>\r
        </h2>\r
        <div>\r
          <!-- ko if: request.Validation.WasValidated -->\r
          <!-- ko foreach: request.Validation.Errors.All -->\r
          <div\r
            class="alert alert-danger mb-2"\r
            data-bind="text: description"\r
          ></div>\r
          <!-- /ko -->\r
          <!-- /ko -->\r
          <div class="quick-actions-container">\r
            <div\r
              class=""\r
              data-bind="template: {name: 'tmpl-quick-actions-bar'}"\r
            ></div>\r
          </div>\r
          <div class="request-detail-components">\r
            <div class="">\r
              <div\r
                data-bind="component: {name: 'pipeline-component',\r
              params: {request: request}}"\r
              ></div>\r
            </div>\r
            <!-- ko if: DisplayMode() != DisplayModes.New && $root.Authorization.currentUserIsAdmin()-->\r
\r
            <div\r
              class="my-3"\r
              data-bind="template: {name: 'tmpl-assignments-component', data: request.Assignments}"\r
            ></div>\r
            <!-- /ko -->\r
            <div class="">\r
              <div class="card w-100" data-bind="">\r
                <div class="card-body">\r
                  <h3 class="card-title">Requestor Information</h3>\r
                  <div\r
                    data-bind="component: {name: HeaderComponentName, params: request }"\r
                  ></div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="card w-100 request-body" data-bind="using: Request">\r
              <div class="card-body">\r
                <div class="card-title d-flex justify-content-between">\r
                  <h3 class="mx-0" data-bind="text: RequestType.Title"></h3>\r
                  <!-- <i class="fa fa-sync pointer" data-bind="click: refreshEntity"></i> -->\r
                </div>\r
                <div class="detail-container">\r
                  <div class="detail">\r
                    <!-- ko if: RequestBodyBlob -->\r
                    <div\r
                      data-bind="component: {\r
                        name: RequestBodyBlob.components[DisplayMode().toLowerCase()],\r
                        params: RequestBodyBlob},\r
                        class: RequestBodyBlob.width"\r
                    ></div>\r
                    <!-- /ko -->\r
                    <div\r
                      class="col-12 pb-6"\r
                      data-bind="component: {name: RequestDescription.components[DisplayMode().toLowerCase()],\r
                        params: RequestDescription}"\r
                    ></div>\r
                  </div>\r
                  <div class="card attachments">\r
                    <div class="card-body d-flex flex-column">\r
                      <div class="d-flex justify-content-between">\r
                        <div>\r
                          <h5 class="">Attachments</h5>\r
                        </div>\r
                        <i\r
                          class="fa fa-sync pointer"\r
                          data-bind="click: Attachments.refresh"\r
                        ></i>\r
                      </div>\r
                      <!-- ko foreach: Attachments.Validation.Errors -->\r
                      <div\r
                        class="alert"\r
                        data-bind="text: description,\r
                        class: $parent.Validation.WasValidated() ? 'alert-danger' : 'alert-warning'"\r
                      ></div>\r
                      <!-- /ko -->\r
                      <!-- ko if: RequestType.AttachmentDescription -->\r
                      <div\r
                        data-bind="html: RequestType.AttachmentDescription"\r
                      ></div>\r
                      <!-- /ko -->\r
                      <!-- ko ifnot: RequestType.AttachmentDescription -->\r
                      <p class="fst-italic">\r
                        No attachment instructions provided.\r
                      </p>\r
                      <!-- /ko -->\r
                      <!-- ko if: Attachments.list.Active().length -->\r
                      <div>\r
                        <table class="table">\r
                          <thead>\r
                            <tr>\r
                              <th>Title</th>\r
                              <th>FileName</th>\r
                              <th>Actions</th>\r
                            </tr>\r
                          </thead>\r
                          <tbody data-bind="">\r
                            <!-- ko if: Attachments.AreLoading -->\r
                            <tr class="">\r
                              <td colspan="4" class="p-0">\r
                                <progress class="w-100"></progress>\r
                              </td>\r
                            </tr>\r
                            <!-- /ko -->\r
                            <!-- ko foreach: Attachments.list.Active -->\r
                            <tr>\r
                              <td>\r
                                <div data-bind="text: Title"></div>\r
                              </td>\r
                              <td>\r
                                <a\r
                                  target="_blank"\r
                                  data-bind="attr: { href: FileRef }, text: FileLeafRef"\r
                                ></a>\r
                              </td>\r
                              <td>\r
                                <i\r
                                  class="fas fa-search pointer"\r
                                  data-bind="click: $parent.Attachments.view"\r
                                ></i>\r
                                <!-- ko if: $parent.Attachments.userCanRemove($data) -->\r
                                <i\r
                                  class="fas fa-trash pointer"\r
                                  data-bind="click: $parent.Attachments.remove"\r
                                ></i>\r
                                <!-- /ko -->\r
                              </td>\r
                            </tr>\r
                            <!-- /ko -->\r
                          </tbody>\r
                        </table>\r
                      </div>\r
                      <!-- /ko -->\r
                      <div\r
                        data-bind="if: Attachments.userCanAttach"\r
                        class="new-attachments"\r
                      >\r
                        <div>\r
                          <label class="file-upload-field">\r
                            <div class="dropzone" data-bind="">\r
                              Drop Files or Click Here\r
                            </div>\r
                            <input\r
                              type="file"\r
                              style="display: none"\r
                              data-bind="files: Attachments.newAttachmentFiles"\r
                            />\r
                          </label>\r
                        </div>\r
                        <div\r
                          data-bind="if: Attachments.newAttachmentFiles().length"\r
                        >\r
                          <!-- Pending:\r
                          <ul\r
                            data-bind="foreach: Attachments.newAttachmentFiles"\r
                          >\r
                            <li>\r
                              <span data-bind="text: name"></span>\r
                              <i\r
                                title="Remove File"\r
                                data-bind="click: $parent.Attachments.removeFile"\r
                                class="fa-solid fa-xmark pointer"\r
                              ></i>\r
                            </li>\r
                          </ul> -->\r
                          <table class="table table-sm">\r
                            <thead>\r
                              <tr>\r
                                <th>Pending Upload</th>\r
                                <th>Action</th>\r
                              </tr>\r
                            </thead>\r
                            <tbody\r
                              data-bind="foreach: Attachments.newAttachmentFiles"\r
                            >\r
                              <tr>\r
                                <td data-bind="text: name"></td>\r
                                <td>\r
                                  <i\r
                                    title="Remove File"\r
                                    data-bind="click: $parent.Attachments.removeFile"\r
                                    class="fa-solid fa-xmark pointer"\r
                                  ></i>\r
                                </td>\r
                              </tr>\r
                            </tbody>\r
                          </table>\r
                        </div>\r
                        <div class="form-actions">\r
                          <button\r
                            type="button"\r
                            class="btn btn-primary"\r
                            data-bind="click: Attachments.addNew, enable: Attachments.newAttachmentFiles().length"\r
                          >\r
                            Upload\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <!-- ko if: false -->\r
              <div class="col-4" data-bind="using: request">\r
                <div\r
                  class="card"\r
                  data-bind="css: {'border-danger': Validation.WasValidated() && Attachments.Validation.Errors().length}"\r
                >\r
                  <div class="card-body">\r
                    <div class="card-title">\r
                      <h3 class="mx-0">Attachments</h3>\r
                    </div>\r
                    <!-- ko foreach: Attachments.Validation.Errors -->\r
                    <div\r
                      class="alert"\r
                      data-bind="text: description,\r
                      class: $parent.Validation.WasValidated() ? 'alert-danger' : 'alert-warning'"\r
                    ></div>\r
                    <!-- /ko -->\r
                    <div\r
                      data-bind="html: RequestType.AttachmentDescription"\r
                    ></div>\r
                    <div>\r
                      <div class="d-flex justify-content-end">\r
                        <i\r
                          class="fa fa-sync pointer"\r
                          data-bind="click: Attachments.refresh"\r
                        ></i>\r
                      </div>\r
                      <table class="table">\r
                        <thead>\r
                          <tr>\r
                            <th>Title</th>\r
                            <th>FileName</th>\r
                            <th>Actions</th>\r
                          </tr>\r
                        </thead>\r
                        <tbody data-bind="">\r
                          <!-- ko if: Attachments.AreLoading -->\r
                          <tr class="">\r
                            <td colspan="4" class="p-0">\r
                              <progress class="w-100"></progress>\r
                            </td>\r
                          </tr>\r
                          <!-- /ko -->\r
                          <!-- ko foreach: Attachments.list.Active -->\r
                          <tr>\r
                            <td>\r
                              <div data-bind="text: Title"></div>\r
                            </td>\r
                            <td>\r
                              <a\r
                                target="_blank"\r
                                data-bind="attr: { href: FileRef }, text: FileLeafRef"\r
                              ></a>\r
                            </td>\r
                            <td>\r
                              <i\r
                                class="fas fa-search pointer"\r
                                data-bind="click: $parent.Attachments.view"\r
                              ></i>\r
                              <!-- ko if: $parent.Attachments.userCanRemove($data) -->\r
                              <i\r
                                class="fas fa-trash pointer"\r
                                data-bind="click: $parent.Attachments.remove"\r
                              ></i>\r
                              <!-- /ko -->\r
                            </td>\r
                          </tr>\r
                          <!-- /ko -->\r
                        </tbody>\r
                      </table>\r
                      <!-- ko if: Attachments.userCanAttach -->\r
                      <button\r
                        class="btn btn-primary"\r
                        data-bind="click: Attachments.addNew"\r
                      >\r
                        Upload\r
                      </button>\r
                      <!-- /ko -->\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <!-- /ko -->\r
              <!-- ko if: DisplayMode() != DisplayModes.New -->\r
              <div class="">\r
                <div class="card w-100" data-bind="using: request">\r
                  <div class="card-body">\r
                    <h3 class="card-title">Comments</h3>\r
                    <div class="alert alert-warning">\r
                      <strong>Note:</strong> Anyone with access to this record\r
                      is able to view all comments.\r
                    </div>\r
                    <div class="d-flex justify-content-end">\r
                      <i\r
                        class="fa fa-sync pointer"\r
                        data-bind="click: Comments.refresh"\r
                      ></i>\r
                    </div>\r
                    <table class="table">\r
                      <thead>\r
                        <tr>\r
                          <th>Created</th>\r
                          <th>Author</th>\r
                          <th>Notification Sent</th>\r
                          <th>Actions</th>\r
                        </tr>\r
                      </thead>\r
                      <tbody data-bind="">\r
                        <!-- ko if: Comments.AreLoading -->\r
                        <tr class="">\r
                          <td colspan="4" class="p-0">\r
                            <progress class="w-100"></progress>\r
                          </td>\r
                        </tr>\r
                        <!-- /ko -->\r
                        <!-- ko foreach: Comments.list.Active -->\r
                        <tr class="table-group-divider">\r
                          <td data-bind="text: Created.toLocaleString()"></td>\r
                          <td data-bind="text: Author.Title"></td>\r
                          <td data-bind="text: NotificationSent"></td>\r
                          <td>\r
                            <!-- ko if: $parent.Comments.userCanComment -->\r
                            <i\r
                              class="fa fa-envelope pointer"\r
                              data-bind="click: $parent.Comments.sendNotification,\r
                          attr: {title: NotificationSent ? 'Re-Send Email Notification' : 'Send Email Notification'}"\r
                            ></i>\r
                            <i\r
                              class="fa fa-trash pointer ms-1"\r
                              title="Remove Comment"\r
                              data-bind="click: $parent.Comments.remove"\r
                            ></i>\r
                            <!-- /ko -->\r
                          </td>\r
                        </tr>\r
                        <tr class="">\r
                          <td\r
                            colspan="4"\r
                            data-bind="html: Comment"\r
                            class="pb-4"\r
                          ></td>\r
                        </tr>\r
                        <!-- /ko -->\r
                      </tbody>\r
                    </table>\r
                    <!-- ko if: Comments.userCanComment -->\r
                    <div data-bind="using: $parent.newComment">\r
                      <div\r
                        class="mb-2"\r
                        data-bind="component: {name: input.components.edit, params: input}"\r
                      ></div>\r
                      <button class="btn btn-primary" data-bind="click: submit">\r
                        Submit Comment\r
                      </button>\r
                    </div>\r
                    <!-- /ko -->\r
                  </div>\r
                </div>\r
              </div>\r
              <!-- /ko -->\r
            </div>\r
            <!-- ko if: DisplayMode() != DisplayModes.New -->\r
            <div\r
              class=""\r
              data-bind="template: {name: 'tmpl-activity-log-component', data: request.Actions}"\r
            ></div>\r
            <!-- /ko -->\r
            <div>\r
              <!-- ko if: DisplayMode() == DisplayModes.New -->\r
              <button\r
                type="button"\r
                class="btn btn-success"\r
                data-bind="click: submitNewRequest, enable: !request.Validation.WasValidated() || request.Validation.IsValid()"\r
              >\r
                Submit Request\r
              </button>\r
              <!-- /ko -->\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
      <!-- /ko -->\r
      <div\r
        class="modal fade"\r
        id="modal-advance-request"\r
        data-bs-backdrop="static"\r
        data-bs-keyboard="false"\r
      >\r
        <div class="modal-dialog">\r
          <div class="modal-content">\r
            <div class="modal-header">\r
              <h1 class="mx-0 modal-title fs-5" id="staticBackdropLabel">\r
                Confirm Advance\r
              </h1>\r
              <button\r
                type="button"\r
                class="btn-close"\r
                data-bs-dismiss="modal"\r
                aria-label="Close"\r
              ></button>\r
            </div>\r
            <div class="modal-body">\r
              <!-- ko ifnot: request.Assignments.CurrentStage.list.InProgress().length -->\r
              This request is ready to advance.\r
              <!-- /ko -->\r
              <!-- ko if: request.Assignments.CurrentStage.list.InProgress().length -->\r
              This request still has\r
              <span\r
                data-bind="text: request.Assignments.CurrentStage.list.InProgress().length"\r
              ></span>\r
              open assignments.\r
              <table class="table table-sm">\r
                <thead>\r
                  <tr>\r
                    <th>Assignee</th>\r
                    <th>Role</th>\r
                    <th>Stage</th>\r
                  </tr>\r
                </thead>\r
                <tbody\r
                  data-bind="foreach: request.Assignments.CurrentStage.list.InProgress"\r
                >\r
                  <tr>\r
                    <td data-bind="text: Assignee?.Title"></td>\r
                    <td data-bind="text: Role"></td>\r
                    <td data-bind="text: PipelineStage?.Title"></td>\r
                  </tr>\r
                </tbody>\r
              </table>\r
              <!-- /ko -->\r
            </div>\r
            <div class="modal-footer">\r
              <button\r
                type="button"\r
                class="btn btn-secondary"\r
                data-bs-dismiss="modal"\r
              >\r
                Cancel\r
              </button>\r
              <button\r
                type="button"\r
                class="btn btn-primary"\r
                data-bind="click: confirmAdvanceHandler"\r
              >\r
                Advance\r
              </button>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-quick-actions-bar">\r
      <div class="quick-actions-bar card">\r
        <div class="status-container">\r
          <div\r
            class="badge"\r
            data-bind="text: request.State.InternalStatus, \r
            class: request.State.InternalStatusClass, \r
            attr: {title: request.State.InternalStatus}"\r
          ></div>\r
        </div>\r
        <h6 class="">\r
          Request ID <br />\r
          <span data-bind="text: request.ObservableTitle"></span>\r
        </h6>\r
\r
        <h6 class="">\r
          Loaded Date and Time <br />\r
          <span data-bind="text: request.LoadedAt()?.toLocaleString()"></span>\r
        </h6>\r
        <!-- ko if: $root.Authorization.currentUserIsAdmin -->\r
        <a\r
          class=""\r
          target="_blank"\r
          rel="noopener noreferrer"\r
          data-bind="attr: {href: request.getFolderUrl()}"\r
        >\r
          <i class="fa fa-folder" data-bind=""></i\r
        ></a>\r
        <!-- /ko -->\r
        <i\r
          class="fa fa-sync pointer me-3"\r
          title="Refresh this request"\r
          data-bind="click: refreshAll"\r
        ></i>\r
\r
        <div class="actions" role="group">\r
          <!-- ko if: DisplayMode() == DisplayModes.New -->\r
          <button\r
            type="button"\r
            class="btn btn-success ms-3"\r
            data-bind="click: submitNewRequest, enable: !request.Validation.WasValidated() || request.Validation.IsValid()"\r
          >\r
            Submit <span class="fa fa-chevron-right"></span>\r
          </button>\r
          <!-- /ko -->\r
          <!-- ko if: request.Authorization.currentUserCanAdvance -->\r
          <!-- ko if: showPause -->\r
          <div class="dropdown-centered" data-bind="">\r
            <button\r
              type="button"\r
              class="btn btn-secondary toggle-status dropdown-toggle action"\r
              data-bs-toggle="dropdown"\r
              title="Pause Request"\r
            >\r
              <i class="fa-solid fa-pause fa-xl"></i>\r
            </button>\r
            <div class="dropdown-menu p-1">\r
              <label class="">\r
                <input\r
                  placeholder="Reason..."\r
                  class="form-select"\r
                  list="pause-reason-options"\r
                  data-bind="textInput: pauseReason"\r
                />\r
                <datalist\r
                  id="pause-reason-options"\r
                  data-bind="foreach: pauseOptions"\r
                >\r
                  <option\r
                    data-bind="text: value, attr: {value: value}"\r
                  ></option>\r
                </datalist>\r
              </label>\r
              <button\r
                type="button"\r
                class="btn btn-success"\r
                data-bind="click: clickPause, enable: pauseReason"\r
              >\r
                Submit\r
              </button>\r
            </div>\r
          </div>\r
          <!-- /ko -->\r
          <!-- ko if: showResume -->\r
          <button\r
            type="button"\r
            title="Resume Request"\r
            class="btn btn-secondary toggle-status action"\r
            data-bind="click: clickResume"\r
          >\r
            <i class="fa-solid fa-play fa-xl"></i>\r
          </button>\r
          <!-- /ko -->\r
          <!-- ko if: ShowCloseArea  -->\r
          <button\r
            title="Cancel Request"\r
            class="btn btn-danger action"\r
            data-bind="click: promptCancel"\r
          >\r
            <i class="fa-solid fa-ban fa-xl"></i>\r
          </button>\r
          <!-- /ko -->\r
          <!-- ko if: request.Pipeline.getNextStage -->\r
          <button\r
            title="Advance to next stage"\r
            type="button"\r
            class="btn btn-success action"\r
            data-bind="click: nextStageHandler, enable: request.Assignments.CurrentStage.Validation.IsValid"\r
          >\r
            Next Stage <span class="fa fa-chevron-right"></span>\r
          </button>\r
          <button\r
            title="Close Request as Fulfilled"\r
            class="btn btn-success action"\r
            data-bind="click: promptFulfill"\r
          >\r
            <i class="fa-solid fa-angles-right fa-lg"></i>\r
          </button>\r
          <!-- /ko -->\r
          <!-- ko ifnot: request.Pipeline.getNextStage -->\r
          <button\r
            title="Close and finalize"\r
            type="button"\r
            class="btn btn-success action"\r
            data-bind="click: promptClose, enable: request.Assignments.CurrentStage.Validation.IsValid"\r
          >\r
            Close and Finalize\r
          </button>\r
          <!-- /ko -->\r
          <!-- /ko -->\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-request-pipeline-actions">\r
      <!-- ko using: CurrentStage -->\r
      <!-- ko if: AssignmentComponents().length -->\r
      <div class="border border-top-0 rounded-bottom">\r
        <div class="p-3">\r
          <div data-bind="foreach: Validation.Errors">\r
            <div\r
              class="alert alert-warning"\r
              role="alert"\r
              data-bind="text: description"\r
            ></div>\r
          </div>\r
          <div class="">\r
            <!-- ko foreach: AssignmentComponents -->\r
            <div\r
              data-bind="component: {name: actionComponentName, params: $data }"\r
            ></div>\r
            <!-- /ko -->\r
          </div>\r
        </div>\r
      </div>\r
      <!-- /ko -->\r
      <!-- /ko -->\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-assignments-component">\r
      <div class="card">\r
        <div class="card-body accordion-item">\r
          <div\r
            class="card-title d-flex justify-content-between align-items-center accordion-header"\r
          >\r
            <h3\r
              class="mx-0 px-2 flex-grow-1 pointer accordion-title collapsed d-flex align-items-center justify-content-between"\r
              data-bs-toggle="collapse"\r
              data-bs-target="#routing-body"\r
            >\r
              Routing and Assignment\r
              <i class="indicator fa fa-caret-down"></i>\r
            </h3>\r
          </div>\r
          <div id="routing-body" class="accordion-collapse collapse">\r
            <div class="d-flex justify-content-end align-items-center">\r
              <!-- ko if: $root.Authorization.currentUserIsAdmin -->\r
              <a target="_blank" data-bind="attr: {href: getFolderUrl() }">\r
                <i class="fa fa-folder" data-bind=""></i\r
              ></a>\r
              <button\r
                type="button"\r
                style="min-width: 0;"\r
                class="btn btn-link ms-2 px-0"\r
                data-bind="click: () => createStageAssignments()"\r
              >\r
                <i class="fa-solid fa-arrow-down-up-lock"></i>\r
              </button>\r
              <!-- /ko -->\r
              <i class="fa fa-sync pointer ms-2" data-bind="click: refresh"></i>\r
            </div>\r
            <div class="position-relative">\r
              <table class="table">\r
                <thead>\r
                  <tr>\r
                    <th>Stage</th>\r
                    <th>Assignee</th>\r
                    <th>Request Org</th>\r
                    <th>Role</th>\r
                    <th>Status</th>\r
                    <th>Action</th>\r
                  </tr>\r
                </thead>\r
                <tbody>\r
                  <!-- ko if: AreLoading -->\r
                  <tr class="">\r
                    <td colspan="5" class="p-0">\r
                      <progress class="w-100"></progress>\r
                    </td>\r
                  </tr>\r
                  <!-- /ko -->\r
                  <!-- ko foreach: list.All -->\r
                  <tr>\r
                    <td data-bind="text: PipelineStage?.Title"></td>\r
                    <td data-bind="text: Assignee?.Title"></td>\r
                    <td data-bind="text: RequestOrg?.Title"></td>\r
                    <td data-bind="text: Role"></td>\r
                    <td data-bind="text: Status"></td>\r
                    <td>\r
                      <!-- ko if: $parent.userCanAssign -->\r
                      <i\r
                        class="fas fa-search pointer"\r
                        data-bind="click: $parent.view"\r
                      ></i>\r
                      <i\r
                        class="fa fa-trash pointer"\r
                        data-bind="click: $parent.remove"\r
                      ></i>\r
                      <!-- /ko -->\r
                    </td>\r
                  </tr>\r
                  <!-- /ko -->\r
                </tbody>\r
              </table>\r
            </div>\r
            <!-- ko if: userCanAssign -->\r
            <div\r
              data-bind="component: { name: 'new-assignment', params: {addAssignment: addNew } }"\r
            ></div>\r
            <!-- /ko -->\r
          </div>\r
        </div>\r
      </div>\r
    <\/script>\r
\r
    <script type="text/html" id="tmpl-activity-log-component">\r
      <div>\r
        <button\r
          type="button"\r
          class="btn btn-link"\r
          data-bind="click: showDialog"\r
        >\r
          Approvals and Actions Log\r
        </button>\r
      </div>\r
      <dialog id="dialog-action-log" class="card">\r
        <div class="card-body ">\r
          <div\r
            class="card-title d-flex justify-content-between align-items-center"\r
          >\r
            <div>\r
              <h3>Approvals and Actions Log</h3>\r
            </div>\r
            <div class="d-flex justify-content-end">\r
              <i class="fa fa-sync pointer me-2" data-bind="click: refresh"></i>\r
              <i\r
                class="fa-solid fa-xmark pointer"\r
                data-bind="click: closeDialog"\r
              ></i>\r
            </div>\r
          </div>\r
          <div id="actions-body" class="">\r
            <div>\r
              <table class="table">\r
                <thead>\r
                  <tr>\r
                    <th>Stage</th>\r
                    <th>Action Taker</th>\r
                    <th>Action Type</th>\r
                    <th>Description</th>\r
                    <th>Date</th>\r
                  </tr>\r
                </thead>\r
                <tbody>\r
                  <!-- ko if: AreLoading -->\r
                  <tr class="">\r
                    <td colspan="5" class="p-0">\r
                      <progress class="w-100"></progress>\r
                    </td>\r
                  </tr>\r
                  <!-- /ko -->\r
                  <!-- ko foreach: list.All -->\r
                  <tr>\r
                    <td data-bind="if: PipelineStage">\r
                      <span\r
                        class=""\r
                        data-bind="text: 'Step ' + PipelineStage?.Step + ': ' + PipelineStage?.Title"\r
                      >\r
                      </span>\r
                    </td>\r
                    <td data-bind="text: Author?.Title"></td>\r
                    <td data-bind="text: ActionType"></td>\r
                    <td data-bind="html: Description"></td>\r
                    <td data-bind="text: Created.toLocaleString()"></td>\r
                  </tr>\r
                  <!-- /ko -->\r
                </tbody>\r
              </table>\r
            </div>\r
          </div>\r
          <div class="d-flex justify-content-end">\r
            <button\r
              type="button"\r
              class="btn btn-danger"\r
              data-bind="click: closeDialog"\r
            >\r
              Close\r
            </button>\r
          </div>\r
        </div>\r
      </dialog>\r
    <\/script>\r
  </div>\r
\r
  <div id="tmpl-other">\r
    <!-- <script type="text/html" id="tmpl-activity-toast">\r
      <div\r
        class="toast show"\r
        role="alert"\r
        aria-live="assertive"\r
        aria-atomic="true"\r
      >\r
        <div class="toast-header">\r
          <strong class="me-auto">Bootstrap</strong>\r
          <small class="text-body-secondary">just now</small>\r
          <button\r
            type="button"\r
            class="btn-close"\r
            data-bs-dismiss="toast"\r
            aria-label="Close"\r
          ></button>\r
        </div>\r
        <div class="toast-body" data-bind="text: activity">\r
          See? Just like this.\r
        </div>\r
      </div>\r
    <\/script> -->\r
  </div>\r
</div>\r
`;

  // src/components/index.js
  var components_exports = {};
  __export(components_exports, {
    ApprovalActions: () => ApprovalActions,
    AssignModule: () => AssignModule,
    BaseComponent: () => BaseComponent,
    ClosedRequestsTableModule: () => ClosedRequestsTableModule,
    ConstrainedEntityEditModule: () => ConstrainedEntityEditModule,
    ConstrainedEntityViewModule: () => ConstrainedEntityViewModule,
    MyAssignmentsModule: () => MyAssignmentsModule,
    NewAssignmentModule: () => NewAssignmentModule,
    OpenOfficeRequestsTableModule: () => OpenOfficeRequestsTableModule,
    OpenRequestsTableModule: () => OpenRequestsTableModule,
    PendingRequestIngestsModule: () => PendingRequestIngestsModule,
    PipelineModule: () => PipelineModule,
    QuickInfoModule: () => QuickInfoModule,
    RequestHeaderEditModule: () => RequestHeaderEditModule,
    RequestHeaderViewModule: () => RequestHeaderViewModule,
    RequestsByServiceTypeModule: () => RequestsByServiceTypeModule,
    RequestsByServiceTypeTableModule: () => RequestsByServiceTypeTableModule,
    ResolverModule: () => ResolverModule,
    TaskToastModule: () => TaskToastModule,
    html: () => html2
  });

  // src/primitives/ValidationError.js
  var ValidationError2 = class {
    constructor(source, type, description) {
      this.source = source;
      this.type = type;
      this.description = description;
    }
  };

  // src/entities/People.js
  var People = class _People {
    constructor({
      Id,
      ID,
      Title,
      LoginName = null,
      IsGroup = null,
      IsEnsured = false
    }) {
      this.ID = ID ?? Id;
      this.Title = Title;
      this.LookupValue = Title;
      this.LoginName = LoginName != "" ? LoginName : null;
      this.IsGroup = IsGroup;
      this.IsEnsured = IsEnsured;
    }
    ID = null;
    Title = null;
    LoginName = null;
    LookupValue = null;
    getKey = () => this.LoginName ?? this.Title;
    static Create = function(props) {
      if (!props || !props.ID && !(props.Title || props.LookupValue))
        return null;
      return new _People({
        ...props,
        Title: props.Title ?? props.LookupValue
      });
    };
  };

  // src/entities/RequestOrg.js
  var OrgTypes2 = {
    ActionOffice: "Action Office",
    RequestingOffice: "Requesting Office",
    Department: "Department",
    Budget: "Budget PMO"
  };
  var RequestOrg = class _RequestOrg {
    constructor({ ID, Title }) {
      this.ID = ID;
      this.Title = Title;
      this.LookupValue = Title;
    }
    UserGroup;
    Everyone;
    FieldMap = {
      UserGroup: {
        get: () => this.UserGroup,
        set: (val) => this.UserGroup = People.Create(val)
      }
    };
    static Create = function(props) {
      if (!props?.ID) return null;
      return requestOrgStore2().find((entity) => entity.ID == props.ID);
    };
    static FindInStore = function(entity) {
      if (!entity?.ID) return null;
      return requestOrgStore2().find((reqOrg) => reqOrg.ID == entity.ID);
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "UserGroup",
        "ContactInfo",
        "OrgType",
        "BreakAccess",
        "PreferredEmail",
        "Everyone"
      ]
    };
    static ListDef = {
      name: "ConfigRequestOrgs",
      title: "ConfigRequestOrgs",
      fields: _RequestOrg.Views.All
    };
  };
  var requestOrgStore2 = ko.observableArray([]);

  // src/primitives/Entity.js
  var Entity = class {
    constructor(params) {
      if (params?.ID) this.ID = params.ID;
      if (params?.Title) this.Title = params.Title;
    }
    ObservableID = ko.observable();
    ObservableTitle = ko.observable();
    get ID() {
      return this.ObservableID();
    }
    set ID(val) {
      this.ObservableID(val);
    }
    get Title() {
      return this.ObservableTitle();
    }
    set Title(val) {
      this.ObservableTitle(val);
    }
  };

  // src/entities/Assignment.js
  var assignmentStates = {
    InProgress: "In Progress",
    Completed: "Completed",
    Approved: "Approved",
    Rejected: "Rejected",
    Cancelled: "Cancelled"
  };
  var assignmentRoles = {
    ActionResolver: "Action Resolver",
    Approver: "Approver",
    Assigner: "Assigner",
    Viewer: "Viewer",
    Subscriber: "Subscriber"
  };
  var assignmentRoleComponentMap = {
    "Action Resolver": "resolver-actions",
    Approver: "approver-actions",
    Assigner: "assigner-actions"
  };
  var activeAssignmentsError = {
    source: "current-stage-active-assignments",
    type: "current-stage",
    description: "Please complete all assignments"
  };
  var Assignment = class _Assignment extends Entity {
    constructor({
      ID,
      Title,
      Assignee,
      RequestOrg: RequestOrg2,
      PipelineStage: PipelineStage2,
      IsActive = true,
      Role,
      CustomComponent = null
    }) {
      super({ ID, Title });
      this.Assignee = Assignee;
      this.RequestOrg = RequestOrg2;
      this.PipelineStage = PipelineStage2;
      this.IsActive = IsActive;
      this.Role = Role;
      this.CustomComponent = CustomComponent;
    }
    Role;
    Errors = ko.observableArray();
    getComponentName = () => {
      return this.CustomComponent ?? assignmentRoleComponentMap[this.Role];
    };
    getComponent = ({ request: request2 }) => {
      return {
        request: request2,
        assignment: this,
        addAssignment: request2.Assignments.addNew,
        completeAssignment: request2.Assignments.complete,
        errors: this.Errors,
        actionComponentName: this.getComponentName()
      };
    };
    userIsDirectlyAssigned = (user) => {
      return this.Assignee?.ID == user.ID || user.isInGroup(this.Assignee);
    };
    userIsInRequestOrg = (user) => {
      return user.isInRequestOrg(this.RequestOrg);
    };
    isActionable = () => {
      return [
        assignmentRoles.ActionResolver,
        assignmentRoles.Approver,
        assignmentRoles.Assigner
      ].includes(this.Role);
    };
    isUserActionable = (user) => {
      if (!user) user = window.WorkOrder.App.CurrentUser();
      if (!this.isActionable()) return false;
      return this.userIsDirectlyAssigned(user) || this.userIsInRequestOrg(user);
    };
    // Should we really be storing observables here?
    isExpanded = ko.observable(true);
    toggleExpanded = () => this.isExpanded(!this.isExpanded());
    static CreateFromObject = function(assignment) {
      assignment.RequestOrg = RequestOrg.FindInStore(assignment.RequestOrg);
      const newAssignment = new _Assignment();
      Object.assign(newAssignment, assignment);
      return newAssignment;
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "Assignee",
        "Role",
        "Status",
        "RequestOrg",
        "IsActive",
        "Comment",
        "CompletionDate",
        "ActionTaker",
        "PipelineStage",
        "CustomComponent",
        "Request"
      ],
      Dashboard: ["Role", "Assignee", "Status", "Request"]
    };
    static ListDef = {
      name: "Assignments",
      title: "Assignments",
      fields: _Assignment.Views.All
    };
  };

  // src/infrastructure/SAL.js
  window.console = window.console || { log: function() {
  } };
  var sal = window.sal || {};
  sal.globalConfig = sal.globalConfig || {};
  sal.site = sal.site || {};
  window.DEBUG = true;
  function groupItemToObj(oListItem) {
    return {
      ID: oListItem.get_id(),
      Title: oListItem.get_title(),
      LoginName: oListItem.get_loginName(),
      IsEnsured: true,
      IsGroup: true,
      oGroup: oListItem
    };
  }
  function getDefaultGroups() {
    const defaultGroups = sal.globalConfig.defaultGroups;
    const result = {};
    Object.keys(defaultGroups).forEach((key) => {
      result[key] = groupItemToObj(defaultGroups[key]);
    });
    return result;
  }
  var siteGroups = {};
  async function getGroupUsers(groupName) {
    if (siteGroups[groupName]?.Users?.constructor == Array) {
      return siteGroups[groupName].Users;
    }
    const url = `/web/sitegroups/GetByName('${groupName}')?$expand=Users`;
    const groupResult = await spFetch(url);
    const group = groupResult.d;
    group.Users = group.Users?.results;
    siteGroups[groupName] = group;
    return group.Users;
  }
  var webRoot = _spPageContextInfo.webAbsoluteUrl == "/" ? "" : _spPageContextInfo.webAbsoluteUrl;
  async function InitSal() {
    sal.globalConfig.siteGroups = [];
    console.log("we are initing sal");
    sal.globalConfig.siteUrl = _spPageContextInfo.webServerRelativeUrl == "/" ? "" : _spPageContextInfo.webServerRelativeUrl;
    sal.globalConfig.listServices = sal.globalConfig.siteUrl + "/_vti_bin/ListData.svc/";
    var currCtx = SP.ClientContext.get_current();
    var web = currCtx.get_web();
    sal.globalConfig.defaultGroups = {
      owners: web.get_associatedOwnerGroup(),
      members: web.get_associatedMemberGroup(),
      visitors: web.get_associatedVisitorGroup()
    };
    currCtx.load(sal.globalConfig.defaultGroups.owners);
    currCtx.load(sal.globalConfig.defaultGroups.members);
    currCtx.load(sal.globalConfig.defaultGroups.visitors);
    var user = web.get_currentUser();
    currCtx.load(user);
    var siteGroupCollection = web.get_siteGroups();
    currCtx.load(siteGroupCollection);
    sal.globalConfig.roles = [];
    var oRoleDefinitions2 = currCtx.get_web().get_roleDefinitions();
    currCtx.load(oRoleDefinitions2);
    return new Promise((resolve, reject2) => {
      currCtx.executeQueryAsync(
        function() {
          sal.globalConfig.currentUser = user;
          sal.globalConfig.siteGroups = m_fnLoadSiteGroups(siteGroupCollection);
          var oEnumerator = oRoleDefinitions2.getEnumerator();
          while (oEnumerator.moveNext()) {
            var oRoleDefinition2 = oEnumerator.get_current();
            sal.globalConfig.roles.push(oRoleDefinition2.get_name());
          }
          sal.config = new sal.NewAppConfig();
          sal.utilities = new sal.NewUtilities();
          resolve();
        },
        function(sender, args) {
          alert("Error initializing SAL: " + args.get_message());
          console.error("Error initializing SAL: " + args.get_message(), args);
          reject2();
        }
      );
    });
  }
  sal.NewAppConfig = function() {
    var siteRoles = {};
    siteRoles.roles = {
      FullControl: "Full Control",
      Design: "Design",
      Edit: "Edit",
      Contribute: "Contribute",
      RestrictedContribute: "Restricted Contribute",
      InitialCreate: "Initial Create",
      Read: "Read",
      RestrictedRead: "Restricted Read",
      LimitedAccess: "Limited Access"
    };
    siteRoles.fulfillsRole = function(inputRole, targetRole) {
      const roles2 = Object.values(siteRoles.roles);
      if (!roles2.includes(inputRole) || !roles2.includes(targetRole)) return false;
      return roles2.indexOf(inputRole) <= roles2.indexOf(targetRole);
    };
    siteRoles.validate = function() {
      Object.keys(siteRoles.roles).forEach(function(role) {
        var roleName = siteRoles.roles[role];
        if (!sal.globalConfig.roles.includes(roleName)) {
          console.error(roleName + " is not in the global roles list");
        } else {
          console.log(roleName);
        }
      });
    };
    var siteGroups2 = {
      groups: {
        Owners: "workorder Owners",
        Members: "workorder Members",
        Visitors: "workorder Visitors",
        RestrictedReaders: "Restricted Readers"
      }
    };
    var publicMembers = {
      siteRoles,
      siteGroups: siteGroups2
    };
    return publicMembers;
  };
  async function getUserPropsAsync(userId = _spPageContextInfo.userId) {
    const userPropsUrl = `/sp.userprofiles.peoplemanager/getmyproperties`;
    const userInfoUrl = `/Web/GetUserById(${userId})/?$expand=Groups`;
    const userInfo = (await spFetch(userInfoUrl)).d;
    const userProps = (await spFetch(userPropsUrl))?.d.UserProfileProperties.results;
    function findPropValue(props, key) {
      return props.find((prop) => prop.Key == key)?.Value;
    }
    return {
      ID: userId,
      Title: userInfo.Title,
      LoginName: userInfo.LoginName,
      WorkPhone: findPropValue(userProps, "WorkPhone"),
      EMail: findPropValue(userProps, "WorkEmail"),
      // TODO: Do we still need this spelling?
      IsEnsured: true,
      IsGroup: false,
      Groups: userInfo.Groups?.results?.map((group) => {
        return {
          ...group,
          ID: group.Id,
          IsGroup: true,
          IsEnsured: true
          // Users: group.Users?.results.map((user) => {
          //   return {
          //     ID: user.Id,
          //     LoginName: user.LoginName,
          //     Title: user.Title,
          //     EMail: user.Email,
          //   };
          // }),
        };
      }),
      Department: findPropValue(userProps, "Department")
    };
  }
  sal.NewUtilities = function() {
    function createSiteGroup(groupName, permissions2, callback) {
      callback = callback === void 0 ? null : callback;
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var groupCreationInfo = new SP.GroupCreationInformation();
      groupCreationInfo.set_title(groupName);
      this.oGroup = oWebsite.get_siteGroups().add(groupCreationInfo);
      oGroup.set_owner(oWebsite.get_associatedOwnerGroup());
      oGroup.update();
      var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(clientContext);
      this.oRoleDefinitions = [];
      permissions2.forEach(function(perm) {
        var oRoleDefinition2 = oWebsite.get_roleDefinitions().getByName(perm);
        this.oRoleDefinitions.push(oRoleDefinition2);
        collRoleDefinitionBinding.add(oRoleDefinition2);
      });
      var collRollAssignment = oWebsite.get_roleAssignments();
      collRollAssignment.add(oGroup, collRoleDefinitionBinding);
      function onCreateGroupSucceeded() {
        var roleInfo = oGroup.get_title() + " created and assigned to " + oRoleDefinitions.forEach(function(rd) {
          rd + ", ";
        });
        if (callback) {
          callback(oGroup.get_id());
        }
        console.log(roleInfo);
      }
      function onCreateGroupFailed(sender, args) {
        alert(
          groupnName + " - Create group failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
      clientContext.load(oGroup, "Title");
      var data2 = {
        groupName,
        oGroup,
        oRoleDefinition,
        callback
      };
      clientContext.executeQueryAsync(
        Function.createDelegate(data2, onCreateGroupSucceeded),
        Function.createDelegate(data2, onCreateGroupFailed)
      );
    }
    function getUserGroups(user, callback) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var everyone = web.ensureUser(user);
      var oGroups = everyone.get_groups();
      function onQueryGroupsSucceeded() {
        var groups = new Array();
        var groupsInfo = new String();
        var groupsEnumerator = oGroups.getEnumerator();
        while (groupsEnumerator.moveNext()) {
          var oGroup2 = groupsEnumerator.get_current();
          var group = {};
          group.ID = oGroup2.get_id();
          group.Title = oGroup2.get_title();
          groupsInfo += "\nGroup ID: " + oGroup2.get_id() + ", Title : " + oGroup2.get_title();
          groups.push(group);
        }
        console.log(groupsInfo.toString());
        callback(groups);
      }
      function onQueryGroupsFailed(sender, args) {
        console.error(
          " Everyone - Query Everyone group failed. " + args.get_message() + "\n" + args.get_stackTrace()
        );
      }
      currCtx.load(everyone);
      currCtx.load(oGroups);
      data = { everyone, oGroups, callback };
      currCtx.executeQueryAsync(
        Function.createDelegate(data, onQueryGroupsSucceeded),
        Function.createDelegate(data, onQueryGroupsFailed)
      );
    }
    function getUsersWithGroup(oGroup2, callback) {
      var context2 = new SP.ClientContext.get_current();
      var oUsers = oGroup2.get_users();
      function onGetUserSuccess() {
        var userObjs = [];
        var userEnumerator = oUsers.getEnumerator();
        while (userEnumerator.moveNext()) {
          var userObj = {};
          var oUser = userEnumerator.get_current();
          userObj.title = oUser.get_title();
          userObj.loginName = oUser.get_loginName();
          userObjs.push(userObj);
        }
        callback(userObjs);
      }
      function onGetUserFailed(sender, args) {
      }
      var data2 = { oUsers, callback };
      context2.load(oUsers);
      context2.executeQueryAsync(
        Function.createDelegate(data2, onGetUserSuccess),
        Function.createDelegate(data2, onGetUserFailed)
      );
    }
    function copyFiles(sourceLib, destLib, callback, onError) {
      var context2 = new SP.ClientContext.get_current();
      var web = context2.get_web();
      var folderSrc = web.getFolderByServerRelativeUrl(sourceLib);
      context2.load(folderSrc, "Files");
      context2.executeQueryAsync(
        function() {
          console.log("Got the source folder right here!");
          var files = folderSrc.get_files();
          var e = files.getEnumerator();
          var dest = [];
          while (e.moveNext()) {
            var file = e.get_current();
            var destLibUrl = destLib + "/" + file.get_name();
            dest.push(destLibUrl);
            file.copyTo(destLibUrl, true);
          }
          console.log(dest);
          context2.executeQueryAsync(
            function() {
              console.log("Files moved successfully!");
              callback();
            },
            function(sender, args) {
              console.log("error: ") + args.get_message();
              onError;
            }
          );
        },
        function(sender, args) {
          console.log("Sorry, something messed up: " + args.get_message());
        }
      );
    }
    function copyFilesAsync(sourceFolder, destFolder) {
      return new Promise((resolve, reject2) => {
        copyFiles(sourceFolder, destFolder, resolve, reject2);
      });
    }
    var publicMembers = {
      copyFiles,
      copyFilesAsync,
      createSiteGroup,
      getUserGroups,
      getUsersWithGroup
    };
    return publicMembers;
  };
  async function ensureUserByKeyAsync(userName) {
    return new Promise((resolve, reject2) => {
      var group = sal.globalConfig.siteGroups.find(function(group2) {
        return group2.LoginName == userName;
      });
      if (group) {
        resolve(group);
        return;
      }
      var context2 = new SP.ClientContext.get_current();
      var oUser = context2.get_web().ensureUser(userName);
      function onEnsureUserSucceeded(sender, args) {
        const user = {
          ID: oUser.get_id(),
          Title: oUser.get_title(),
          LoginName: oUser.get_loginName(),
          IsEnsured: true,
          IsGroup: false
        };
        resolve(user);
      }
      function onEnsureUserFailed(sender, args) {
        console.error(
          "Failed to ensure user :" + args.get_message() + "\n" + args.get_stackTrace()
        );
        reject2(args);
      }
      const data2 = { oUser, resolve, reject: reject2 };
      context2.load(oUser);
      context2.executeQueryAsync(
        Function.createDelegate(data2, onEnsureUserSucceeded),
        Function.createDelegate(data2, onEnsureUserFailed)
      );
    });
  }
  function m_fnLoadSiteGroups(itemColl) {
    var m_arrSiteGroups = new Array();
    var listItemEnumerator = itemColl.getEnumerator();
    while (listItemEnumerator.moveNext()) {
      var oListItem = listItemEnumerator.get_current();
      m_arrSiteGroups.push(groupItemToObj(oListItem));
    }
    return m_arrSiteGroups;
  }
  sal.getSPSiteGroupByName = function(groupName) {
    var userGroup = null;
    if (this.globalConfig.siteGroups != null) {
      userGroup = this.globalConfig.siteGroups.find(function(group) {
        return group.Title == groupName;
      });
    }
    return userGroup;
  };
  function SPList(listDef) {
    var self = this;
    self.config = {
      def: listDef
    };
    async function init() {
      if (!self.config.fieldSchema) {
        const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/Fields`;
        const fields = await spFetch(apiEndpoint);
        self.config.fieldSchema = fields.d.results;
      }
    }
    init();
    function setListPermissionsAsync(valuePairs, reset) {
      return new Promise((resolve, reject2) => {
        setListPermissions(valuePairs, resolve, reset);
      });
    }
    function setListPermissions(valuePairs, callback, reset) {
      reset = reset === void 0 ? false : reset;
      var users = new Array();
      var resolvedGroups = new Array();
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      valuePairs.forEach(function(vp) {
        var resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
        if (resolvedGroup) {
          resolvedGroups.push([resolvedGroup, vp[1]]);
        } else {
          users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        }
      });
      function onFindItemSucceeded() {
        console.log("Successfully found item");
        var currCtx2 = new SP.ClientContext.get_current();
        var web2 = currCtx2.get_web();
        if (reset) {
          oList.resetRoleInheritance();
          oList.breakRoleInheritance(false, false);
          oList.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        } else {
          oList.breakRoleInheritance(false, false);
        }
        this.resolvedGroups.forEach(function(groupPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(groupPairs[1])
          );
          oList.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
        });
        this.users.forEach(function(userPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(userPairs[1])
          );
          oList.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
        });
        var data3 = { oList, callback };
        function onSetItemPermissionsSuccess() {
          console.log("Successfully set permissions");
          callback(oList);
        }
        function onSetItemPermissionsFailure(sender, args) {
          console.error(
            "Failed to update permissions on List: " + this.oList.get_title() + args.get_message() + "\n",
            args.get_stackTrace()
          );
        }
        currCtx2.load(oList);
        currCtx2.executeQueryAsync(
          Function.createDelegate(data3, onSetItemPermissionsSuccess),
          Function.createDelegate(data3, onSetItemPermissionsFailure)
        );
      }
      function onFindItemFailed(sender, args) {
        console.error(
          "Failed to find List: " + this.oList.get_title + args.get_message(),
          args.get_stackTrace()
        );
      }
      var data2 = {
        oList,
        users,
        resolvedGroups,
        callback
      };
      currCtx.load(oList);
      users.map(function(user) {
        currCtx.load(user[0]);
      });
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onFindItemSucceeded),
        Function.createDelegate(data2, onFindItemFailed)
      );
    }
    function mapObjectToListItem(val) {
      if (!val) {
        return val;
      }
      if (!Array.isArray(val)) {
        return mapItemToListItem(val);
      }
      return val.map((item) => {
        return mapItemToListItem(item);
      }).join(";#");
    }
    function mapItemToListItem(item) {
      if (item.ID) {
        return `${item.ID};#${item.LookupValue ?? ""}`;
      }
      if (item.LookupValue) {
        return item.LookupValue;
      }
      if (item.constructor.getName() == "Date") {
        return item.toISOString();
      }
      return item;
    }
    function createListItemAsync(entity, folderPath = null) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const itemCreateInfo = new SP.ListItemCreationInformation();
        if (folderPath) {
          var folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + folderPath;
          itemCreateInfo.set_folderUrl(folderUrl);
        }
        const oListItem = oList.addItem(itemCreateInfo);
        const restrictedFields = [
          "ID",
          "Author",
          "Created",
          "Editor",
          "Modified"
        ];
        Object.keys(entity).filter((key) => !restrictedFields.includes(key)).forEach((key) => {
          oListItem.set_item(key, mapObjectToListItem(entity[key]));
        });
        oListItem.update();
        function onCreateListItemSucceeded() {
          resolve(oListItem.get_id());
        }
        function onCreateListItemFailed(sender, args) {
          console.error("Create Item Failed - List: " + self.config.def.name);
          console.error("ValuePairs", entity);
          console.error(sender, args);
          reject2(sender);
        }
        const data2 = { entity, oListItem, resolve, reject: reject2 };
        currCtx.load(oListItem);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onCreateListItemSucceeded),
          Function.createDelegate(data2, onCreateListItemFailed)
        );
      });
    }
    function mapListItemToObject(val) {
      if (!val) {
        return val;
      }
      let out = {};
      switch (val.constructor.getName()) {
        case "SP.FieldUserValue":
          out.LoginName = val.get_email();
        case "SP.FieldLookupValue":
          out.ID = val.get_lookupId();
          out.LookupValue = val.get_lookupValue();
          out.Title = val.get_lookupValue();
          break;
        default:
          out = val;
      }
      return out;
    }
    function getListItems(caml, fields, callback) {
      var camlQuery = new SP.CamlQuery.createAllItemsQuery();
      camlQuery.set_viewXml(caml);
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var collListItem = oList.getItems(camlQuery);
      function onGetListItemsSucceeded() {
        var self2 = this;
        var listItemEnumerator = self2.collListItem.getEnumerator();
        const foundObjects = [];
        while (listItemEnumerator.moveNext()) {
          var oListItem = listItemEnumerator.get_current();
          var listObj = {};
          fields.forEach((field) => {
            var colVal = oListItem.get_item(field);
            listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
          });
          foundObjects.push(listObj);
        }
        callback(foundObjects);
      }
      function onGetListItemsFailed(sender, args) {
        console.log("unsuccessful read", sender);
        alert(
          "Request on list " + self.config.def.name + " failed, producing the following error: \n " + args.get_message() + "\nStackTrack: \n " + args.get_stackTrace()
        );
      }
      var data2 = {
        collListItem,
        callback,
        fields,
        camlQuery
      };
      currCtx.load(collListItem, `Include(${fields.join(", ")})`);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onGetListItemsSucceeded),
        Function.createDelegate(data2, onGetListItemsFailed)
      );
    }
    function getListItemsAsync({ fields = null, caml = null }) {
      if (!caml) {
        var caml = '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="FSObjType"/><Value Type="int">0</Value></Eq></Where></Query></View>';
      }
      return new Promise((resolve, reject2) => {
        getListItems(caml, fields, resolve);
      });
    }
    function findByIdAsync(id, fields) {
      return new Promise((resolve, reject2) => {
        try {
          findById(id, fields, resolve);
        } catch (e) {
          reject2(e);
        }
      });
    }
    async function getById(id, fields) {
      const [queryFields, expandFields] = await getQueryFields(fields);
      const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/items(${id})?$Select=${queryFields}&$expand=${expandFields}`;
      const result = await spFetch(apiEndpoint);
      return result.d;
    }
    async function getListFields() {
      if (!self.config.fieldSchema) {
        const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/Fields`;
        const fields = await spFetch(apiEndpoint);
        self.config.fieldSchema = fields.d.results;
      }
      return self.config.fieldSchema;
    }
    async function getQueryFields(fields) {
      const queryFields = [];
      const expandFields = [];
      const listFields = await getListFields();
      fields.map((f) => {
        if (f.includes("/")) {
          queryFields.push(f);
          expandFields.push(f.split("/")[0]);
          return;
        }
        const fieldSchema = listFields.find((lf) => lf.StaticName == f);
        if (!fieldSchema) {
          alert(`Field '${f}' not found on list ${self.config.def.name}`);
          return;
        }
        switch (fieldSchema.TypeAsString) {
          case "UserMulti":
          case "User":
          case "LookupMulti":
          case "Lookup":
            const idString = f + "/ID";
            const titleString = f + "/Title";
            queryFields.push(idString);
            queryFields.push(titleString);
            expandFields.push(f);
            break;
          case "Choice":
          default:
            queryFields.push(f);
        }
      });
      return [queryFields, expandFields];
    }
    async function findByColumnValueAsync(columnFilters, { orderByColumn = null, sortAsc }, { count = null }, fields, includeFolders) {
      const [queryFields, expandFields] = await getQueryFields(fields);
      const orderBy = orderByColumn ? `$orderby=${orderByColumn} ${sortAsc ? "asc" : "desc"}` : "";
      const colFilterArr = [];
      columnFilters.forEach(
        (colFilter) => colFilterArr.push(
          `${colFilter.column} ${colFilter.op ?? "eq"} '${colFilter.value}'`
        )
      );
      if (!includeFolders) colFilterArr.push(`FSObjType eq '0'`);
      const filter = "$filter=(" + colFilterArr.join(`) and (`) + ")";
      const include = "$select=" + queryFields;
      const expand = `$expand=` + expandFields;
      const page = count ? `$top=${count}` : "";
      const apiEndpoint = `/web/lists/GetByTitle('${self.config.def.title}')/items?${include}&${expand}&${orderBy}&${filter}&${page}`;
      const result = await spFetch(apiEndpoint);
      const cursor = {
        results: result?.d?.results,
        _next: result?.d?.__next
      };
      return cursor;
    }
    async function loadNextPage(cursor) {
      const result = await spFetch(cursor._next);
      return {
        results: result?.d?.results,
        _next: result?.d?.__next
      };
    }
    function findById(id, fields, callback) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var oListItem = oList.getItemById(id);
      function onGetListItemSucceeded() {
        const listObj = {};
        fields.forEach((field) => {
          var colVal = oListItem.get_item(field);
          listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
        });
        callback(listObj);
      }
      function onGetListItemFailed(sender, args) {
        console.error("SAL: findById - List: " + self.config.def.name);
        console.error("Fields", this);
        console.error(sender, args);
      }
      var data2 = {
        oListItem,
        callback,
        fields
      };
      currCtx.load(oListItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onGetListItemSucceeded),
        Function.createDelegate(data2, onGetListItemFailed)
      );
    }
    function updateListItemAsync(entity) {
      if (!entity?.ID) {
        return false;
      }
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const oListItem = oList.getItemById(entity.ID);
        const restrictedFields = [
          "ID",
          "Author",
          "Created",
          "Editor",
          "Modified"
        ];
        Object.keys(entity).filter((key) => !restrictedFields.includes(key)).forEach((key) => {
          oListItem.set_item(key, mapObjectToListItem(entity[key]));
        });
        oListItem.update();
        function onUpdateListItemsSucceeded() {
          console.log("Successfully updated " + this.oListItem.get_item("Title"));
          resolve();
        }
        function onUpdateListItemFailed(sender, args) {
          console.error("Update Failed - List: " + self.config.def.name);
          console.error("Item Id", this.oListItem.get_id() ?? "N/A");
          console.error(entity);
          console.error(sender, args);
          reject2(args);
        }
        const data2 = { oListItem, entity, resolve, reject: reject2 };
        currCtx.load(oListItem);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onUpdateListItemsSucceeded),
          Function.createDelegate(data2, onUpdateListItemFailed)
        );
      });
    }
    function deleteListItem(id, callback) {
      var currCtx = new SP.ClientContext.get_current();
      var web = currCtx.get_web();
      var oList = web.get_lists().getByTitle(self.config.def.title);
      var data2 = { callback };
      const oListItem = oList.getItemById(id);
      oListItem.deleteObject();
      function onDeleteListItemsSucceeded(sender, args) {
        callback();
      }
      function onDeleteListItemsFailed(sender, args) {
        console.error(
          "sal.SPList.deleteListItem: Request on list " + self.config.def.name + " failed, producing the following error: \n " + args.get_message() + "\nStackTrack: \n " + args.get_stackTrace()
        );
      }
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onDeleteListItemsSucceeded),
        Function.createDelegate(data2, onDeleteListItemsFailed)
      );
    }
    function deleteListItemAsync(id) {
      return new Promise((resolve, reject2) => deleteListItem(id, resolve));
    }
    function setItemPermissionsAsync(id, valuePairs, reset) {
      return new Promise((resolve, reject2) => {
        setItemPermissions(id, valuePairs, resolve, reset);
      });
    }
    function setItemPermissions(id, valuePairs, callback, reset) {
      reset = reset === void 0 ? false : reset;
      const users = [];
      const resolvedGroups = [];
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      const oListItem = oList.getItemById(id);
      valuePairs.forEach(function(vp) {
        const resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
        if (resolvedGroup?.oGroup) {
          resolvedGroups.push([resolvedGroup.oGroup, vp[1]]);
        } else {
          users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        }
      });
      function onFindItemSucceeded() {
        console.log("Successfully found item");
        const currCtx2 = new SP.ClientContext.get_current();
        const web2 = currCtx2.get_web();
        if (reset) {
          oListItem.resetRoleInheritance();
          oListItem.breakRoleInheritance(false, false);
          oListItem.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        } else {
          oListItem.breakRoleInheritance(false, false);
        }
        this.resolvedGroups.forEach(function(groupPairs) {
          const roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(groupPairs[1])
          );
          oListItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
        });
        this.users.forEach(function(userPairs) {
          const roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(userPairs[1])
          );
          oListItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
        });
        var data3 = { oListItem, callback };
        function onSetItemPermissionsSuccess() {
          console.log("Successfully set permissions");
          callback(oListItem);
        }
        function onSetItemPermissionsFailure(sender, args) {
          console.error(
            "Failed to update permissions on item: " + this.oListItem.get_lookupValue() + args.get_message() + "\n" + args.get_stackTrace(),
            false
          );
        }
        currCtx2.load(oListItem);
        currCtx2.executeQueryAsync(
          Function.createDelegate(data3, onSetItemPermissionsSuccess),
          Function.createDelegate(data3, onSetItemPermissionsFailure)
        );
      }
      function onFindItemFailed(sender, args) {
        console.error(
          "Failed to update permissions on item: " + this.title + args.get_message() + "\n" + args.get_stackTrace(),
          false
        );
      }
      var data2 = {
        id,
        oListItem,
        users,
        resolvedGroups,
        callback
      };
      currCtx.load(oListItem);
      users.map(function(user) {
        currCtx.load(user[0]);
      });
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onFindItemSucceeded),
        Function.createDelegate(data2, onFindItemFailed)
      );
    }
    function getItemPermissionsAsync(id) {
      return new Promise((resolve, reject2) => {
        var currCtx = new SP.ClientContext.get_current();
        var web = currCtx.get_web();
        var oList = web.get_lists().getByTitle(self.config.def.title);
        var oListItem = oList.getItemById(id);
        var roles2 = oListItem.get_roleAssignments();
        function onFindItemSucceeded() {
          var currCtx2 = new SP.ClientContext.get_current();
          var web2 = currCtx2.get_web();
          var principals = [];
          var roleEnumerator = this.roles.getEnumerator();
          while (roleEnumerator.moveNext()) {
            var role = roleEnumerator.get_current();
            var principal = role.get_member();
            currCtx2.load(principal);
            principals.push(principal);
          }
          currCtx2.executeQueryAsync(
            function(sender, args) {
              var logins = principals.map(function(principal2) {
                return {
                  ID: principal2.get_id(),
                  Title: principal2.get_title(),
                  LoginName: principal2.get_loginName()
                };
              });
              resolve(logins);
            },
            function(sender, args) {
              alert(
                "Request failed. " + args.get_message() + "\n" + args.get_stackTrace()
              );
              reject2(args);
            }
          );
        }
        function onFindItemFailed(sender, args) {
          console.error(
            "Failed to get permissions on item: " + args.get_message() + "\n" + args.get_stackTrace(),
            false
          );
          reject2(args);
        }
        const data2 = {
          id,
          oListItem,
          roles: roles2,
          resolve,
          reject: reject2
        };
        currCtx.load(oListItem);
        currCtx.load(roles2);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onFindItemSucceeded),
          Function.createDelegate(data2, onFindItemFailed)
        );
      });
    }
    function getServerRelativeFolderPath(relFolderPath) {
      const listPath = self.config.def.isLib ? "/" + self.config.def.name + "/" : "/Lists/" + self.config.def.name + "/";
      return sal.globalConfig.siteUrl + listPath + relFolderPath;
    }
    function upsertFolderPathAsync(folderPath) {
      if (self.config.def.isLib) {
        return new Promise(
          (resolve, reject2) => upsertLibFolderByPath(folderPath, resolve)
        );
      }
      return new Promise(
        (resolve, reject2) => upsertListFolderByPath(folderPath, resolve)
      );
    }
    async function setFolderReadonlyAsync(folderPath) {
      try {
        const currentPerms = await getFolderPermissionsAsync(folderPath);
        const targetPerms = currentPerms.map((user) => {
          return [user.LoginName, sal.config.siteRoles.roles.RestrictedRead];
        });
        await setFolderPermissionsAsync(folderPath, targetPerms, true);
      } catch (e) {
        console.warn(e);
      }
      return;
    }
    async function ensureFolderPermissionsAsync(relFolderPath, targetPerms) {
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      const apiEndpoint = sal.globalConfig.siteUrl + `/_api/web/GetFolderByServerRelativeUrl('${serverRelFolderPath}')/ListItemAllFields/RoleAssignments?$expand=Member,Member/Users,RoleDefinitionBindings`;
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose"
        }
      });
      if (!response.ok) {
        if (response.status == 404) {
          return;
        }
        console.error(response);
      }
      const result = await response.json();
      const permissionResults = result?.d?.results;
      if (!permissionResults) {
        console.warn("No results found", result);
        return;
      }
      const missingPerms = targetPerms.filter((targetPermPair) => {
        const targetLoginName = targetPermPair[0];
        const targetPerm = targetPermPair[1];
        const permExists = permissionResults.find((curPerm) => {
          if (curPerm.Member.LoginName != targetLoginName) {
            if (!curPerm.Member.Users?.results.find(
              (curUser) => curUser.LoginName == targetLoginName
            )) {
              return false;
            }
          }
          if (curPerm.RoleDefinitionBindings.results?.find(
            (curBinding) => sal.config.siteRoles.fulfillsRole(curBinding.Name, targetPerm)
          )) {
            return true;
          }
          return false;
        });
        return !permExists;
      });
      console.log("Adding missing permissions", missingPerms);
      if (missingPerms.length)
        await setFolderPermissionsAsync(relFolderPath, missingPerms, false);
      return;
    }
    function getFolderContentsAsync(relFolderPath, fields) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
        const camlQuery = SP.CamlQuery.createAllItemsQuery();
        camlQuery.set_folderServerRelativeUrl(serverRelFolderPath);
        const allItems = oList.getItems(camlQuery);
        currCtx.load(allItems, `Include(${fields.join(", ")})`);
        currCtx.executeQueryAsync(
          function() {
            const foundObjects = [];
            var listItemEnumerator = allItems.getEnumerator();
            while (listItemEnumerator.moveNext()) {
              var oListItem = listItemEnumerator.get_current();
              var listObj = {};
              fields.forEach((field) => {
                var colVal = oListItem.get_item(field);
                listObj[field] = Array.isArray(colVal) ? colVal.map((val) => mapListItemToObject(val)) : mapListItemToObject(colVal);
              });
              listObj.oListItem = oListItem;
              foundObjects.push(listObj);
            }
            resolve(foundObjects);
          },
          function(sender, args) {
            console.warn("Unable load list folder contents:");
            console.error(sender);
            console.error(args);
            reject2(args);
          }
        );
      });
    }
    async function getFolderPermissionsAsync(relFolderPath) {
      return new Promise(async (resolve, reject2) => {
        const oListItem = await getFolderItemByPath(relFolderPath);
        if (!oListItem) {
          reject2("Folder item does not exist");
          return;
        }
        const roles2 = oListItem.get_roleAssignments();
        const currCtx = new SP.ClientContext.get_current();
        currCtx.load(oListItem);
        currCtx.load(roles2);
        currCtx.executeQueryAsync(
          function() {
            const currCtx2 = new SP.ClientContext.get_current();
            console.log(oListItem);
            const principals = [];
            const bindings = [];
            const roleEnumerator = roles2.getEnumerator();
            while (roleEnumerator.moveNext()) {
              const role = roleEnumerator.get_current();
              const principal = role.get_member();
              const bindings2 = role.get_roleDefinitionBindings();
              currCtx2.load(bindings2);
              currCtx2.load(principal);
              principals.push({ principal, bindings: bindings2 });
            }
            currCtx2.executeQueryAsync(
              // success
              function(sender, args) {
                const logins = principals.map(function({ principal, bindings: bindings2 }) {
                  const principalRoles = [];
                  const bindingEnumerator = bindings2.getEnumerator();
                  while (bindingEnumerator.moveNext()) {
                    const binding = bindingEnumerator.get_current();
                    principalRoles.push(binding.get_name());
                  }
                  return {
                    ID: principal.get_id(),
                    Title: principal.get_title(),
                    LoginName: principal.get_loginName(),
                    Roles: principalRoles
                  };
                });
                resolve(logins);
              },
              // failure
              function(sender, args) {
                console.warn("Unable load folder principals permissions:");
                console.error(sender);
                console.error(args);
                reject2(args);
              }
            );
          },
          function(sender, args) {
            console.warn("Unable load folder permissions:");
            console.error(sender);
            console.error(args);
            reject2(args);
          }
        );
      });
    }
    async function getFolderItemByPath(relFolderPath) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        const camlQuery = SP.CamlQuery.createAllItemsQuery();
        const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
        var camlq = '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name="FSObjType"/><Value Type="int">1</Value></Eq><Eq><FieldRef Name="FileRef"/><Value Type="Text">' + serverRelFolderPath + "</Value></Eq></And></Where></Query><RowLimit>1</RowLimit></View>";
        camlQuery.set_viewXml(camlq);
        const allFolders = oList.getItems(camlQuery);
        async function onFindItemSucceeded() {
          const foundObjects = [];
          var listItemEnumerator = allFolders.getEnumerator();
          while (listItemEnumerator.moveNext()) {
            const oListItem2 = listItemEnumerator.get_current();
            foundObjects.push(oListItem2);
          }
          if (!foundObjects) {
            console.warn("folder not found");
            resolve(foundObjects);
          }
          if (foundObjects.length > 1) {
            console.warn("Multiple folders found!");
            resolve(foundObjects);
          }
          const oListItem = foundObjects[0];
          resolve(oListItem);
        }
        function onFindItemFailed(sender, args) {
          console.warn("Unable load list folder contents:");
          console.error(sender);
          console.error(args);
          reject2(args);
        }
        const data2 = {
          allFolders,
          resolve,
          reject: reject2
        };
        currCtx.load(allFolders);
        currCtx.executeQueryAsync(
          Function.createDelegate(data2, onFindItemSucceeded),
          Function.createDelegate(data2, onFindItemFailed)
        );
      });
    }
    function upsertListFolderByPath(folderPath, callback) {
      var folderArr = folderPath.split("/");
      var idx = 0;
      var upsertListFolderInner = function(parentPath, folderArr2, idx2, success) {
        var folderName = folderArr2[idx2];
        idx2++;
        var curPath = folderArr2.slice(0, idx2).join("/");
        ensureListFolder(
          curPath,
          function(iFolder) {
            if (idx2 >= folderArr2.length) {
              success(iFolder.get_id());
            } else {
              upsertListFolderInner(curPath, folderArr2, idx2, success);
            }
          },
          function() {
            self.createListFolder(
              folderName,
              function(folderId) {
                if (idx2 >= folderArr2.length) {
                  success(folderId);
                } else {
                  upsertListFolderInner(curPath, folderArr2, idx2, success);
                }
              },
              parentPath
            );
          }
        );
      };
      upsertListFolderInner("", folderArr, idx, callback);
    }
    self.createListFolder = function(folderName, callback, path) {
      path = path === void 0 ? "" : path;
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      let folderUrl = "";
      const itemCreateInfo = new SP.ListItemCreationInformation();
      itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
      itemCreateInfo.set_leafName(folderName);
      if (path) {
        folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;
        itemCreateInfo.set_folderUrl(folderUrl);
      }
      const newItem = oList.addItem(itemCreateInfo);
      newItem.set_item("Title", folderName);
      newItem.update();
      function onCreateFolderSucceeded(sender, args) {
        callback(this.newItem.get_id());
      }
      function onCreateFolderFailed(sender, args) {
        alert(
          "Request on list " + self.config.def.name + " failed, producing the following error: \n" + args.get_message() + "\nStackTrack: \n" + args.get_stackTrace()
        );
      }
      const data2 = {
        folderName,
        callback,
        newItem
      };
      currCtx.load(newItem);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onCreateFolderSucceeded),
        Function.createDelegate(data2, onCreateFolderFailed)
      );
    };
    function ensureListFolder(path, onExists, onNonExists) {
      var folderUrl = sal.globalConfig.siteUrl + "/Lists/" + self.config.def.name + "/" + path;
      var ctx = SP.ClientContext.get_current();
      var folder = ctx.get_web().getFolderByServerRelativeUrl(folderUrl);
      folder.get_listItemAllFields();
      var data2 = {
        folder,
        path,
        onExists,
        onNonExists
      };
      ctx.load(folder, "Exists", "Name");
      function onQueryFolderSucceeded() {
        if (folder.get_exists()) {
          let onQueryFolderItemSuccess = function() {
            onExists(folderItem);
          }, onQueryFolderItemFailure = function(sender, args) {
            console.error("Failed to find folder at " + path, args);
          };
          console.log(
            "Folder " + folder.get_name() + " exists in " + self.config.def.name
          );
          var currCtx = new SP.ClientContext.get_current();
          var folderItem = folder.get_listItemAllFields();
          data2 = { folderItem, path, onExists };
          currCtx.load(folderItem);
          currCtx.executeQueryAsync(
            Function.createDelegate(data2, onQueryFolderItemSuccess),
            Function.createDelegate(data2, onQueryFolderItemFailure)
          );
        } else {
          console.warn("Folder exists but is hidden (security-trimmed) for us.");
        }
      }
      function onQueryFolderFailed(sender, args) {
        if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
          console.log(
            "SAL.SPList.ensureListFolder:           Folder " + path + " does not exist in " + self.config.def.name
          );
          onNonExists();
        } else {
          console.error("Error: " + args.get_message());
        }
      }
      ctx.executeQueryAsync(
        Function.createDelegate(data2, onQueryFolderSucceeded),
        Function.createDelegate(data2, onQueryFolderFailed)
      );
    }
    function upsertLibFolderByPath(folderUrl, success) {
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const oList = web.get_lists().getByTitle(self.config.def.title);
      var createFolderInternal = function(parentFolder, folderUrl2, success2) {
        var ctx = parentFolder.get_context();
        var folderNames = folderUrl2.split("/");
        var folderName = folderNames[0];
        var curFolder = parentFolder.get_folders().add(folderName);
        ctx.load(curFolder);
        ctx.executeQueryAsync(
          function() {
            if (folderNames.length > 1) {
              var subFolderUrl = folderNames.slice(1, folderNames.length).join("/");
              createFolderInternal(curFolder, subFolderUrl, success2);
            } else {
              success2(curFolder);
            }
          },
          function(sender, args) {
            console.error("error creating new folder");
            console.error(sender);
            console.error(error);
          }
        );
      };
      createFolderInternal(oList.get_rootFolder(), folderUrl, success);
    }
    function setFolderPermissionsAsync(folderPath, valuePairs, reset) {
      return new Promise((resolve, reject2) => {
        setFolderPermissions(folderPath, valuePairs, resolve, reset);
      });
    }
    function setFolderPermissions(relFolderPath, valuePairs, callback, reset) {
      reset = reset === void 0 ? false : reset;
      var users = [];
      var resolvedGroups = [];
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      const currCtx = new SP.ClientContext.get_current();
      const web = currCtx.get_web();
      const folder = web.getFolderByServerRelativeUrl(serverRelFolderPath);
      valuePairs.forEach(function(vp) {
        var resolvedGroup = sal.getSPSiteGroupByName(vp[0]);
        if (resolvedGroup?.oGroup) {
          resolvedGroups.push([resolvedGroup.oGroup, vp[1]]);
        } else {
          users.push([currCtx.get_web().ensureUser(vp[0]), vp[1]]);
        }
      });
      function onFindFolderSuccess() {
        var currCtx2 = new SP.ClientContext.get_current();
        var web2 = currCtx2.get_web();
        var folderItem = this.folder.get_listItemAllFields();
        if (reset) {
          folderItem.resetRoleInheritance();
          folderItem.breakRoleInheritance(false, false);
          folderItem.get_roleAssignments().getByPrincipal(sal.globalConfig.currentUser).deleteObject();
        } else {
          folderItem.breakRoleInheritance(false, false);
        }
        this.resolvedGroups.forEach(function(groupPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(groupPairs[1])
          );
          folderItem.get_roleAssignments().add(groupPairs[0], roleDefBindingColl);
        });
        this.users.forEach(function(userPairs) {
          var roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(currCtx2);
          roleDefBindingColl.add(
            web2.get_roleDefinitions().getByName(userPairs[1])
          );
          folderItem.get_roleAssignments().add(userPairs[0], roleDefBindingColl);
        });
        var data3 = { folderItem, callback };
        function onSetFolderPermissionsSuccess() {
          console.log("Successfully set permissions");
          this.callback(folderItem);
        }
        function onSetFolderPermissionsFailure(sender, args) {
          console.error(
            "Failed to update permissions on item: " + args.get_message(),
            args
          );
        }
        currCtx2.load(folderItem);
        currCtx2.executeQueryAsync(
          Function.createDelegate(data3, onSetFolderPermissionsSuccess),
          Function.createDelegate(data3, onSetFolderPermissionsFailure)
        );
      }
      function onFindFolderFailure(sender, args) {
        console.error(
          "Something went wrong setting perms on library folder",
          args
        );
      }
      var data2 = {
        folder,
        users,
        callback,
        resolvedGroups,
        valuePairs,
        reset
      };
      users.map(function(user) {
        currCtx.load(user[0]);
      });
      currCtx.load(folder);
      currCtx.executeQueryAsync(
        Function.createDelegate(data2, onFindFolderSuccess),
        Function.createDelegate(data2, onFindFolderFailure)
      );
    }
    function deleteFolderByPathAsync(relFolderPath) {
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      const url = `/web/GetFolderByServerRelativeUrl('${serverRelFolderPath}')`;
      const headers = {
        "If-Match": "*",
        "X-HTTP-Method": "DELETE"
      };
      return spFetch(url, "POST", headers);
    }
    function showModal(formName, title, args, callback) {
      var id = "";
      if (args.id) {
        id = args.id;
      }
      const options = SP.UI.$create_DialogOptions();
      var listPath = self.config.def.isLib ? "/" + self.config.def.name + "/" : "/Lists/" + self.config.def.name + "/";
      var rootFolder = "";
      if (args.rootFolder) {
        rootFolder = sal.globalConfig.siteUrl + listPath + args.rootFolder;
      }
      var formsPath = self.config.def.isLib ? "/" + self.config.def.name + "/Forms/" : "/Lists/" + self.config.def.name + "/";
      Object.assign(options, {
        title,
        dialogReturnValueCallback: callback,
        args: JSON.stringify(args),
        url: sal.globalConfig.siteUrl + formsPath + formName + "?ID=" + id + "&Source=" + location.pathname + "&RootFolder=" + rootFolder
      });
      SP.UI.ModalDialog.showModalDialog(options);
    }
    function uploadNewDocumentAsync(folderPath, title, args) {
      return new Promise((resolve, reject2) => {
        const currCtx = new SP.ClientContext.get_current();
        const web = currCtx.get_web();
        const oList = web.get_lists().getByTitle(self.config.def.title);
        currCtx.load(oList);
        currCtx.executeQueryAsync(
          function() {
            var siteString = sal.globalConfig.siteUrl == "/" ? "" : sal.globalConfig.siteUrl;
            const options = SP.UI.$create_DialogOptions();
            Object.assign(options, {
              title,
              dialogReturnValueCallback: resolve,
              args: JSON.stringify(args),
              url: siteString + "/_layouts/Upload.aspx?List=" + oList.get_id().toString() + "&RootFolder=" + siteString + "/" + self.config.def.name + "/" + encodeURI(folderPath) + "&Source=" + location.pathname + "&args=" + encodeURI(JSON.stringify(args))
            });
            SP.UI.ModalDialog.showModalDialog(options);
          },
          function(sender, args2) {
            console.error("Error showing file modal: ");
            console.error(sender);
            console.error(args2);
          }
        );
      });
    }
    const UPLOADCHUNKSIZE = 10485760;
    const uploadchunkActionTypes = {
      start: "startupload",
      continue: "continueupload",
      finish: "finishupload"
    };
    async function uploadFileRestChunking(file, relFolderPath, fileName, progress) {
      const blob = file;
      const chunkSize = UPLOADCHUNKSIZE;
      const fileSize = file.size;
      const totalBlocks = parseInt((fileSize / chunkSize).toString(), 10) + (fileSize % chunkSize === 0 ? 1 : 0);
      const fileRef = relFolderPath + "/" + fileName;
      const jobGuid = getGUID();
      let currentPointer;
      progress({ currentBlock: 0, totalBlocks });
      currentPointer = await startUpload(
        jobGuid,
        file.slice(0, chunkSize),
        fileRef,
        relFolderPath
      );
      for (let i = 2; i < totalBlocks; i++) {
        progress({ currentBlock: i, totalBlocks });
        currentPointer = await continueUpload(
          jobGuid,
          file.slice(currentPointer, currentPointer + chunkSize),
          currentPointer,
          fileRef
        );
      }
      progress({ currentBlock: totalBlocks - 1, totalBlocks });
      const result = await finishUpload(
        jobGuid,
        file.slice(currentPointer),
        currentPointer,
        fileRef
      );
      progress({ currentBlock: totalBlocks, totalBlocks });
      return result;
    }
    async function startUpload(uploadId, chunk, fileRef, relFolderPath) {
      const url = `/web/getFolderByServerRelativeUrl(@folder)/files/getByUrlOrAddStub(@file)/StartUpload(guid'${uploadId}')?&@folder='${relFolderPath}'&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await spFetch(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return parseFloat(result.d.StartUpload);
    }
    async function continueUpload(uploadId, chunk, fileOffset, fileRef) {
      const url = `/web/getFileByServerRelativeUrl(@file)/ContinueUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})?&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await spFetch(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return parseFloat(result.d.ContinueUpload);
    }
    async function finishUpload(uploadId, chunk, fileOffset, fileRef) {
      const url = `/web/getFileByServerRelativeUrl(@file)/FinishUpload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})?&@file='${fileRef}'`;
      const headers = {
        "Content-Type": "application/octet-stream"
      };
      const opts = {
        body: chunk
      };
      const result = await spFetch(url, "POST", headers, opts);
      if (!result) {
        console.error("Error starting upload!");
        return;
      }
      return result;
    }
    async function uploadFileRest(file, relFolderPath, fileName) {
      return await fetch(
        _spPageContextInfo.webServerRelativeUrl + `/_api/web/GetFolderByServerRelativeUrl('${relFolderPath}')/Files/add(url='${fileName}',overwrite=true)`,
        {
          method: "POST",
          credentials: "same-origin",
          body: file,
          headers: {
            Accept: "application/json; odata=verbose",
            "Content-Type": "application/json;odata=nometadata",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value
          }
        }
      ).then((response) => {
        if (!response.ok) {
          console.error("Error Uploading File", response);
          return;
        }
        return response.json();
      });
    }
    async function uploadFileToFolderAndUpdateMetadata(file, fileName, relFolderPath, payload, progress = null) {
      if (!progress) {
        progress = () => {
        };
      }
      const serverRelFolderPath = getServerRelativeFolderPath(relFolderPath);
      let result = null;
      if (file.size > UPLOADCHUNKSIZE) {
        const job = () => uploadFileRestChunking(file, serverRelFolderPath, fileName, progress);
        result = await uploadQueue.addJob(job);
      } else {
        progress({ currentBlock: 0, totalBlocks: 1 });
        result = await uploadFileRest(file, serverRelFolderPath, fileName);
        progress({ currentBlock: 1, totalBlocks: 1 });
      }
      await updateUploadedFileMetadata(result.d, payload);
      await checkinWithComment(serverRelFolderPath + "/" + fileName, "");
      let itemUri = result.d.ListItemAllFields.__deferred.uri + "?$select=ID";
      const listItem = await spFetch(itemUri);
      return listItem.d.ID;
    }
    async function updateUploadedFileMetadata(fileResult, payload) {
      var result = await fetch(fileResult.ListItemAllFields.__deferred.uri, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json; odata=nometadata",
          "Content-Type": "application/json;odata=nometadata",
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
          "X-HTTP-Method": "MERGE",
          "If-Match": "*"
        }
      }).then((response) => {
        if (!response.ok) {
          console.error("Error Updating File", response);
          return;
        }
        return response;
      });
      return result;
    }
    function copyFiles(sourceFolderPath, destFolderPath, callback, onError) {
      const sourcePath = getServerRelativeFolderPath(sourceFolderPath);
      const destPath = getServerRelativeFolderPath(destFolderPath);
      var context2 = new SP.ClientContext.get_current();
      var web = context2.get_web();
      var folderSrc = web.getFolderByServerRelativeUrl(sourcePath);
      context2.load(folderSrc, "Files");
      context2.executeQueryAsync(
        function() {
          var files = folderSrc.get_files();
          var e = files.getEnumerator();
          var dest = [];
          while (e.moveNext()) {
            var file = e.get_current();
            var destLibUrl = destPath + "/" + file.get_name();
            dest.push(destLibUrl);
            file.copyTo(destLibUrl, true);
          }
          console.log(dest);
          context2.executeQueryAsync(
            function() {
              console.log("Files moved successfully!");
              callback();
            },
            function(sender, args) {
              console.log("error: ") + args.get_message();
              onError;
            }
          );
        },
        function(sender, args) {
          console.error("Unable to copy files: ", args.get_message());
          console.error(sender);
          console.error(args);
          reject(args);
        }
      );
    }
    function copyFilesAsync(sourceFolder, destFolder) {
      return new Promise((resolve, reject2) => {
        copyFiles(sourceFolder, destFolder, resolve, reject2);
      });
    }
    async function ensureList() {
      const listInfo = await spFetch(
        `/web/lists/GetByTitle('${self.config.def.title}')`
      );
    }
    function checkinWithComment(fileRef, comment) {
      const url = `/web/GetFileByServerRelativeUrl('${fileRef}')/CheckIn(comment='${comment}',checkintype=0)`;
      return spFetch(url, "POST");
    }
    const publicMembers = {
      findByIdAsync,
      getById,
      findByColumnValueAsync,
      loadNextPage,
      getListItemsAsync,
      createListItemAsync,
      updateListItemAsync,
      deleteListItemAsync,
      setItemPermissionsAsync,
      getItemPermissionsAsync,
      getFolderContentsAsync,
      upsertFolderPathAsync,
      deleteFolderByPathAsync,
      getServerRelativeFolderPath,
      setFolderReadonlyAsync,
      setFolderPermissionsAsync,
      ensureFolderPermissionsAsync,
      uploadFileToFolderAndUpdateMetadata,
      uploadNewDocumentAsync,
      copyFilesAsync,
      showModal
    };
    return publicMembers;
  }
  async function spFetch(uri, method = "GET", headers = {}, opts = {}) {
    const siteEndpoint = uri.startsWith("http") ? uri : sal.globalConfig.siteUrl + "/_api" + uri;
    const response = await fetch(siteEndpoint, {
      method,
      headers: {
        Accept: "application/json; odata=verbose",
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        ...headers
      },
      ...opts
    });
    if (!response.ok) {
      if (response.status == 404) {
        return;
      }
      console.error(response);
    }
    try {
      const result = await response.json();
      return result;
    } catch (e) {
      return;
    }
  }
  window.spFetch = spFetch;
  function getGUID() {
    if (crypto.randomUUID) return crypto.randomUUID();
    let d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : r & 3 | 8).toString(16);
    });
  }
  var JobProcessor = class {
    constructor(maxConcurrency) {
      this.maxConcurrency = maxConcurrency;
      this.runningJobs = 0;
      this.queue = [];
    }
    addJob(asyncFunction) {
      return new Promise((resolve, reject2) => {
        const job = async () => {
          try {
            const result = await asyncFunction();
            resolve(result);
          } catch (error2) {
            reject2(error2);
          } finally {
            this.runningJobs--;
            this.processQueue();
          }
        };
        this.queue.push(job);
        this.processQueue();
      });
    }
    processQueue() {
      while (this.runningJobs < this.maxConcurrency && this.queue.length > 0) {
        const job = this.queue.shift();
        this.runningJobs++;
        job();
      }
    }
  };
  var uploadQueue = new JobProcessor(5);

  // src/infrastructure/Authorization.js
  var permissions = {
    FullControl: "Full Control",
    Design: "Design",
    Edit: "Edit",
    Contribute: "Contribute",
    Read: "Read",
    LimitedAccess: "Limited Access",
    RestrictedRead: "Restricted Read",
    RestrictedContribute: "Restricted Contribute",
    InitialCreate: "Initial Create"
  };
  var staticGroups = {
    RestrictedReaders: new People({ ID: null, Title: "Restricted Readers" })
  };
  var systemRoles = {
    Admin: "Admin",
    ActionOffice: "ActionOffice"
  };
  var roles = {
    ActionResolver: {
      LookupValue: "Action Resolver",
      description: "Confirms completion of an action.",
      isAssignable: true,
      permissions: permissions.RestrictedContribute,
      initialStatus: assignmentStates.InProgress
    },
    Assigner: {
      LookupValue: "Assigner",
      description: "Can create additional assignments.",
      isAssignable: true,
      permissions: permissions.RestrictedContribute,
      initialStatus: assignmentStates.InProgress
    },
    Approver: {
      LookupValue: "Approver",
      description: "Approves or Rejects the request.",
      isAssignable: true,
      permissions: permissions.RestrictedContribute,
      initialStatus: assignmentStates.InProgress
    },
    Viewer: {
      LookupValue: "Viewer",
      description: "Has view only access to the request.",
      isAssignable: true,
      permissions: permissions.RestrictedRead
    },
    Subscriber: {
      LookupValue: "Subscriber",
      description: "Has view only access to the request and recieves notifications",
      isAssignable: true,
      permissions: permissions.RestrictedRead
    }
  };
  var stageActionRoleMap = {
    "Pending Assignment": roles.Assigner,
    "Pending Approval": roles.Approver,
    "Pending Action": roles.ActionResolver,
    "Pending Resolution": roles.ActionResolver,
    Notification: roles.Subscriber
  };
  var currentUser = ko.observable();
  var User = class _User extends People {
    constructor({
      ID,
      Title,
      LoginName = null,
      LookupValue = null,
      WorkPhone = null,
      EMail = null,
      IsGroup = null,
      IsEnsured = false,
      Groups = null,
      Department = null
    }) {
      super({ ID, Title, LookupValue, LoginName, IsGroup, IsEnsured });
      this.WorkPhone = WorkPhone;
      this.EMail = EMail;
      this.OfficeSymbol = Department ?? "CGFS/EX";
      this.Groups = Groups;
    }
    OfficeSymbol;
    Groups = [];
    isInGroup(group) {
      if (!group?.ID) return false;
      return this.getGroupIds().includes(group.ID);
    }
    getGroupIds() {
      return this.Groups.map((group) => group.ID);
    }
    isInRequestOrg = (reqOrg) => {
      return this.RequestOrgs().find((userReqOrg) => userReqOrg.ID == reqOrg.ID);
    };
    RequestOrgs = ko.pureComputed(() => {
      const groupIds = this.getGroupIds();
      return requestOrgStore2().filter(
        (reqOrg) => reqOrg.Everyone || groupIds.includes(reqOrg.UserGroup?.ID)
      );
    });
    RequestingOffices = ko.pureComputed(() => {
      return this.RequestOrgs().filter(
        (reqOrg) => reqOrg.OrgType == OrgTypes2.RequestingOffice
      );
    });
    ActionOffices = ko.pureComputed(() => {
      return this.RequestOrgs().filter(
        (reqOrg) => reqOrg.OrgType == OrgTypes2.ActionOffice
      );
    });
    IsActionOffice = ko.pureComputed(() => this.ActionOffices().length);
    IsSiteOwner = ko.pureComputed(
      () => this.isInGroup(getDefaultGroups().owners)
    );
    hasSystemRole = (systemRole) => {
      const userIsOwner = this.IsSiteOwner();
      switch (systemRole) {
        case systemRoles.Admin:
          return userIsOwner;
          break;
        case systemRoles.ActionOffice:
          return userIsOwner || this.ActionOffices().length;
        default:
      }
    };
    static Create = async function() {
      const userProps = await getUserPropsAsync();
      return new _User(userProps);
    };
  };
  function getRequestFolderPermissions(request2) {
    const defaultGroups = getDefaultGroups();
    const requestor = request2.RequestorInfo.Requestor();
    const requestorOffice = request2.RequestorInfo.Office();
    const folderPermissions = [
      [new People(defaultGroups.owners), permissions.FullControl],
      [staticGroups.RestrictedReaders, permissions.RestrictedRead]
    ];
    folderPermissions.push([requestor, permissions.RestrictedContribute]);
    if (requestorOffice && !requestorOffice.BreakAccess) {
      folderPermissions.push([
        requestorOffice.UserGroup,
        permissions.RestrictedContribute
      ]);
    }
    request2.Pipeline.Stages()?.forEach((stage) => {
      const stageOrg = RequestOrg.FindInStore(stage.RequestOrg);
      if (stageOrg) {
        folderPermissions.push([
          stageOrg.UserGroup,
          permissions.RestrictedContribute
        ]);
      }
      if (stage.AssignmentFunction && AssignmentFunctions[stage.AssignmentFunction]) {
        try {
          const assignments = AssignmentFunctions[stage.AssignmentFunction](
            request2,
            stage
          );
          assignments.forEach((assignment) => {
            const people = assignment.Assignee;
            if (people && people.Title) {
              folderPermissions.push([people, permissions.RestrictedContribute]);
            }
          });
        } catch (e) {
          console.warn("Error creating stage assignments", stage);
        }
      }
    });
    return folderPermissions;
  }
  async function getUsersByGroupName(groupName) {
    const users = await getGroupUsers(groupName);
    if (!users) return [];
    return users.map((userProps) => new People(userProps));
  }
  var AssignmentFunctions = {
    TestFunc: function() {
      return request.RequestorInfo.Requestor();
    },
    ch_overtimeGovManager: function(request2, stage) {
      const assignee = request2.RequestBodyBlob?.Value()?.GovManager.get();
      if (!assignee) {
        throw new Error("Could not find stage Assignee");
      }
      const newCustomAssignment = new Assignment({
        Assignee: assignee,
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: roles.ActionResolver,
        CustomComponent: "GovManagerActions"
      });
      return [newCustomAssignment];
    },
    ch_overtimeAPM: function(request2, stage) {
      const assignee = request2.RequestBodyBlob?.Value()?.FieldMap.APM.get();
      if (!assignee) {
        throw new Error("Could not find stage Assignee");
      }
      const newCustomAssignment = new Assignment({
        Assignee: assignee,
        RequestOrg: stage.RequestOrg,
        PipelineStage: stage,
        IsActive: true,
        Role: roles.ActionResolver,
        CustomComponent: "APMActions"
      });
      return [newCustomAssignment];
    },
    getGTM: function(request2, stage) {
      const assignee = request2.RequestBodyBlob?.Value()?.FieldMap.GTM.get();
      if (!assignee) {
        throw new Error("Could not find stage Assignee");
      }
      return [
        new Assignment({
          Assignee: assignee,
          RequestOrg: stage.RequestOrg,
          PipelineStage: stage,
          IsActive: true,
          Role: roles.Approver
        })
      ];
    },
    getCOR: function(request2, stage) {
      const assignee = request2.RequestBodyBlob?.Value()?.FieldMap.COR.get();
      if (!assignee) {
        throw new Error("Could not find stage Assignee");
      }
      return [
        new Assignment({
          Assignee: assignee,
          RequestOrg: stage.RequestOrg,
          PipelineStage: stage,
          IsActive: true,
          Role: roles.Approver
        })
      ];
    },
    getSupervisor: function(request2, stage) {
      return [
        new Assignment({
          Assignee: getPersonFromRequestBody(request2, "Supervisor"),
          RequestOrg: stage.RequestOrg,
          PipelineStage: stage,
          IsActive: true,
          Role: roles.Approver
        })
      ];
    },
    getWildcard: function(request2, stage, wildcard) {
      return [
        new Assignment({
          Assignee: getPersonFromRequestBody(request2, wildcard),
          RequestOrg: stage.RequestOrg,
          PipelineStage: stage,
          IsActive: true,
          Role: roles.Approver,
          CustomComponent: stage.ActionComponentName
        })
      ];
    }
  };
  function getPersonFromRequestBody(request2, fieldName) {
    const assignee = request2.RequestBodyBlob?.Value()?.FieldMap[fieldName]?.get();
    if (!assignee) {
      throw new Error(
        `Could not find assignee field on current request: ${fieldName}`
      );
    }
    return assignee;
  }

  // src/components/BaseComponent.js
  var html2 = String.raw;
  var BaseComponent = class {
    constructor() {
    }
    static name = "base-component";
    static template = html2`<div>No Component Registered!</div>`;
  };

  // src/components/AssignmentActions/ApprovalTemplate.js
  var approvalTemplate = html2`
  <!-- ko if: assignment.Status == assignmentStates.InProgress -->
  <div
    class="m-1 card"
    data-bind="css: {'text-bg-success': assignment.Status == assignmentStates.Approved }"
  >
    <div class="card-body">
      <h6>Your approval has been requested:</h6>
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
        <div class="d-flex justify-content-start">
          <button class="btn btn-success" data-bind="click: approveHandler">
            Approve
          </button>
          <button class="ms-3 btn btn-danger" data-bind="click: showReject">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Approved -->
  <div class="alert alert-success">
    <strong>Thank you for approving!</strong>
    <button class="btn btn-link" data-bind="click: showReject">
      Reject Instead
    </button>
  </div>
  <!-- /ko -->
  <!-- ko if: assignment.Status == assignmentStates.Rejected -->
  <div class="alert alert-danger">
    <strong>This request has been rejected</strong>
  </div>
  <!-- /ko -->
  <dialog class="" data-bind="attr: {id: rejectModalId}">
    <div class="d-flex flex-column justify-content-between h-100">
      <h4>Please Provide a Rejection Reason:</h4>
      <div class="alert alert-warning mb-3">
        Note: Rejecting this request will close the record! Closed requests
        cannot be re-opened!
      </div>
      <textarea
        class="form-control mb-3 flex-grow-1"
        data-bind="textInput: RejectReason"
      ></textarea>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-danger me-2"
          data-bind="click: reject, enable: RejectReason"
        >
          Reject
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-bind="click: cancelReject"
        >
          Cancel
        </button>
      </div>
    </div>
  </dialog>
`;

  // src/components/AssignmentActions/ApprovalModule.js
  var ApprovalActions = class extends BaseComponent {
    constructor(params) {
      super();
      this.assignment = params.assignment;
      this.completeAssignment = params.completeAssignment;
    }
    assignmentStates = assignmentStates;
    approve = async () => {
      this.completeAssignment(this.assignment, assignmentStates.Approved);
    };
    approveHandler = async () => {
      console.log("approved");
      if (this.assignment.userIsDirectlyAssigned(currentUser())) {
        this.approve();
        return;
      }
      if (this.assignment.userIsInRequestOrg(currentUser())) {
        if (confirm(
          `This approval is assigned to ${this.assignment.Assignee.Title}. Do you want to approve on their behalf? `
        )) {
          this.approve();
        }
        return;
      }
      alert("You are not authorized to approve this request!");
    };
    rejectModalId = ko.pureComputed(() => "reject-modal-" + this.assignment.ID);
    RejectReason = ko.observable();
    reject = async () => {
      console.log("reject");
      this.assignment.Comment = this.RejectReason();
      this.completeAssignment(this.assignment, assignmentStates.Rejected);
      document.getElementById(this.rejectModalId()).close();
    };
    showReject = () => {
      const rejectModal = document.getElementById(this.rejectModalId());
      if (this.assignment.userIsDirectlyAssigned(currentUser())) {
        rejectModal.showModal();
        return;
      }
      if (this.assignment.userIsInRequestOrg(currentUser())) {
        if (confirm(
          `This approval is assigned to ${this.assignment.Assignee.Title}. Do you want to reject on their behalf? `
        )) {
          rejectModal.showModal();
        }
        return;
      }
      alert("You are not authorized to reject this request!");
    };
    cancelReject = () => {
      document.getElementById(this.rejectModalId()).close();
    };
    undo = async () => {
    };
    static name = "approver-actions";
    static template = approvalTemplate;
  };

  // src/components/AssignmentActions/AssignTemplate.js
  var assignTemplate = html2`
  <div class="card m-1">
    <div class="card-body">
      <div>
        <h6>You have been designated as an action office assigner:</h6>
      </div>
      <div>
        Assignee: <span data-bind="text: assignment.Assignee?.Title"></span>
      </div>
      <div>
        Request Org:
        <span data-bind="text: assignment.RequestOrg?.Title"></span>
      </div>
      <!-- ko if: assignment.Status == assignmentStates.Completed -->
      <div class="badge text-bg-success">Complete!</div>
      <!-- <div>Assignments:</div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Assignee</th>
          <th>Role</th>
          <th>Stage</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: NewAssignments">
        <tr>
          <td data-bind="text: Assignee?.Title"></td>
          <td data-bind="text: Role"></td>
          <td data-bind="text: PipelineStage?.Title"></td>
        </tr>
      </tbody>
    </table> -->
      <div>Add another assignment:</div>
      <!-- /ko -->
      <div
        data-bind="component: { name: 'new-assignment', params: newAssignmentParams }"
      ></div>
    </div>
  </div>
`;

  // src/components/AssignmentActions/AssignModule.js
  var AssignModule = class extends BaseComponent {
    constructor({ request: request2, assignment, addAssignment, completeAssignment }) {
      super();
      this.allAssignments = request2.Assignments.list.All;
      this.assignment = assignment;
      this.addAssignment = addAssignment;
      this.completeAssignment = completeAssignment;
      this.NextStage = request2.Pipeline.getNextStage();
    }
    assignmentStates = assignmentStates;
    // TODO: How can we show who was assigned by this request,
    NewAssignments = ko.pureComputed(() => {
      return this.allAssignments().filter(
        (assignment) => assignment.PipelineStage.ID == this.NextStage?.ID
      );
    });
    // TODO: how should stage be determined?
    newAssignmentParams = ko.pureComputed(() => {
      return {
        addAssignment: async (newAssignment) => {
          newAssignment.RequestOrg = this.assignment.RequestOrg;
          this.addAssignment(newAssignment);
          this.completeAssignment(this.assignment, assignmentStates.Completed);
        },
        stage: this.NextStage
      };
    });
    // this is the callback function we pass to the new assignments subcomponent
    static name = "assigner-actions";
    static template = assignTemplate;
  };

  // src/components/AssignmentActions/ResolverTemplate.js
  var resolverTemplate = html2`
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
          <div>Please confirm you have completed any necessary actions!</div>
          <div class="d-flex justify-content-start">
            <button
              class="ms-3 btn btn-success"
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

  // src/components/AssignmentActions/ResolverModule.js
  var ResolverModule = class extends BaseComponent {
    constructor(params) {
      super();
      console.log("hello from resolver module", params);
      this.assignment = params.assignment;
      this.completeAssignment = params.completeAssignment;
    }
    assignmentStates = assignmentStates;
    complete = async () => {
      console.log("complete");
      this.completeAssignment(this.assignment, assignmentStates.Completed);
    };
    completeHandler = () => {
      console.log("approved");
      const assignment = this.assignment;
      if (assignment.userIsDirectlyAssigned(currentUser())) {
        this.complete();
        return;
      }
      if (assignment.userIsInRequestOrg(currentUser())) {
        if (confirm(
          `This assignment is assigned to ${assignment.Assignee.Title}. Do you want to complete on their behalf? `
        )) {
          this.complete();
        }
        return;
      }
      alert("You are not authorized to approve this request!");
    };
    static name = "resolver-actions";
    static template = resolverTemplate;
  };

  // src/primitives/ConstrainedEntity.js
  var defaultComponents = {
    view: "default-constrained-view",
    edit: "default-constrained-edit",
    new: "default-constrained-edit"
  };
  var ConstrainedEntity = class extends Entity {
    constructor(params) {
      super(params);
    }
    toJSON = () => {
      const out = {};
      Object.keys(this.FieldMap).map(
        (key) => out[key] = this.FieldMap[key]?.get()
      );
      return out;
    };
    fromJSON(inputObj) {
      if (window.DEBUG)
        console.log("Setting constrained entity from JSON", inputObj);
      Object.keys(inputObj).map((key) => this.FieldMap[key]?.set(inputObj[key]));
    }
    FormFields = ko.pureComputed(() => {
      return Object.values(this.FieldMap).filter((field) => field?.Visible());
    });
    FormFieldKeys = ko.pureComputed(
      () => Object.keys(this.FieldMap).filter((key) => this.FieldMap[key]?.Visible())
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
      return Object.values(this.FieldMap).filter((field) => field?.Errors && field.Errors()).flatMap((field) => field.Errors());
    });
    IsValid = ko.pureComputed(() => !this.Errors().length);
    components = defaultComponents;
  };

  // src/components/ConstrainedEntity/DefaultEdit.js
  var constrainedEntityEditTemplate = html2`
  <div>
    <div class="row mb-2 form-fields" data-bind="foreach: FormFields">
      <div
        class="col pb-3 form-field-component"
        data-bind="component: {
        name: components.edit, params: $data}, 
        class: width"
      ></div>
    </div>
  </div>
`;

  // src/components/ConstrainedEntity/DefaultView.js
  var constrainedEntityViewTemplate = html2`
  <div>
    <div class="row row-cols-1 row-cols-md-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}, class: width"
      ></div>
    </div>
  </div>
`;

  // src/components/ConstrainedEntity/ConstrainedEntityModules.js
  var ConstrainedEntityBaseModule = class extends BaseComponent {
    constructor({ Entity: Entity2 }) {
      super();
      Object.assign(this, Entity2);
    }
  };
  var ConstrainedEntityViewModule = class extends ConstrainedEntityBaseModule {
    constructor(params) {
      super(params);
    }
    static name = defaultComponents.view;
    static template = constrainedEntityViewTemplate;
  };
  var ConstrainedEntityEditModule = class extends ConstrainedEntityBaseModule {
    constructor(params) {
      super(params);
    }
    static name = defaultComponents.edit;
    static template = constrainedEntityEditTemplate;
  };

  // src/entities/PipelineStage.js
  var stageActionTypes = {
    PendingAssignment: "Pending Assignment",
    PendingApproval: "Pending Approval",
    PendingAction: "Pending Action",
    PendingResolution: "Pending Resolution",
    Notification: "Notification",
    Closed: "Closed"
  };
  var PipelineStage = class _PipelineStage {
    constructor({ ID, Title }) {
      this.ID = ID;
      this.Title = Title;
      this.LookupValue = Title;
    }
    static Create = function({ ID, LookupValue }) {
      return new _PipelineStage({ ID, Title: LookupValue });
    };
    static FindInStore = function(props) {
      if (!props || !props.ID) return null;
      return pipelineStageStore().find((stage) => stage.ID == props.ID);
    };
    static GetCompletedStage = function() {
      return pipelineStageStore().find(
        (stage) => stage.ActionType == stageActionTypes.Closed
      );
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "ServiceType",
        "Step",
        "ActionType",
        "ActionTargetStage",
        "Assignee",
        "WildCardAssignee",
        "RequestOrg",
        "AssignmentFunction",
        "ActionComponentName"
      ]
    };
    static ListDef = {
      name: "ConfigPipelines",
      title: "ConfigPipelines",
      fields: _PipelineStage.Views.All
    };
  };
  var pipelineStageStore = ko.observableArray();

  // src/entities/Action.js
  var actionTypes = {
    Paused: "Paused",
    Resumed: "Resumed",
    Assigned: "Assigned",
    Unassigned: "Unassigned",
    Created: "Created",
    Advanced: "Advanced",
    Approved: "Approved",
    Completed: "Completed",
    Rejected: "Rejected",
    Closed: "Closed"
  };
  var Action = class {
    constructor() {
    }
    PipelineStage;
    //   FieldMap = {
    //     Description: {
    //       get: () => encodeURIComponent(this.Description),
    //       set: (val) => (this.Description = decodeURIComponent(val)),
    //     },
    //   };
    FieldMap = {
      PipelineStage: {
        get: () => this.PipelineStage,
        set: (val) => {
          this.PipelineStage = PipelineStage.FindInStore(val);
        }
      }
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "PipelineStage",
        "ActionType",
        "Description",
        "Author",
        "Created"
      ]
    };
    static ListDef = {
      name: "Actions",
      title: "Actions",
      fields: this.Views.All
    };
  };

  // src/entities/Attachment.js
  var Attachment = class {
    constructor() {
    }
    static Views = {
      // All: ["Title", "IsActive"],
      All: [
        "ID",
        "Title",
        "IsActive",
        "Request",
        "FileLeafRef",
        "FileRef",
        "Author",
        "Created"
      ]
    };
    static ListDef = {
      name: "Attachments",
      title: "Attachments",
      fields: this.Views.All,
      isLib: true
    };
  };

  // src/entities/Comment.js
  var Comment = class {
    constructor() {
    }
    static Views = {
      All: [
        "ID",
        "Title",
        "Comment",
        "NotificationSent",
        "Author",
        "IsActive",
        "Created"
      ]
    };
    static ListDef = {
      name: "Comments",
      title: "Comments",
      fields: this.Views.All
    };
  };

  // src/entities/Holiday.js
  var holidayStore = ko.observable();
  var Holiday = class _Holiday {
    static Views = {
      All: ["ID", "Title", "Date", "Repeating"]
    };
    static ListDef = {
      name: "ConfigHolidays",
      title: "ConfigHolidays",
      fields: _Holiday.Views.All
    };
  };

  // src/entities/Notification.js
  var Notification = class {
    constructor() {
    }
    static Views = {
      All: [
        "ID",
        "Title",
        "To",
        "ToString",
        "CC",
        "CCString",
        "BCC",
        "Body",
        "Sent",
        "DateSent",
        "Request",
        "DateToSend"
      ]
    };
    static ListDef = {
      name: "Notifications",
      title: "Notifications",
      fields: this.Views.All
    };
  };

  // src/constants/RequestStates.js
  var requestStates = {
    draft: "Draft",
    open: "Open",
    paused: "Paused",
    fulfilled: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected"
  };
  var requestInternalStates = {
    inProgress: "In Progress",
    waitingOnCustomer: "Waiting on Customer",
    researching: "Researching"
  };

  // src/env.js
  var Tabs = {
    MyRequests: "my-requests-tab",
    NewRequest: "new-request-tab",
    RequestDetail: "request-detail-tab"
  };
  var assetsPath = "/sites/CGFS/Style Library/apps/wo/src";
  var siteTitle = _spPageContextInfo.webTitle;

  // src/servicetypes/index.js
  var servicetypes_exports = {};
  __export(servicetypes_exports, {
    Access: () => Access,
    AccessFletc: () => AccessFletc,
    BaseServiceDetail: () => BaseServiceDetail,
    CH_Access: () => CH_Access,
    CH_Conference: () => CH_Conference,
    CH_Equip_Repair: () => CH_Equip_Repair,
    CH_Furniture: () => CH_Furniture,
    CH_HR_Training: () => CH_HR_Training,
    CH_Mobile: () => CH_Mobile,
    CH_Notice: () => CH_Notice,
    CH_Overtime: () => CH_Overtime,
    CH_Reconfig: () => CH_Reconfig,
    CH_Supplies: () => CH_Supplies,
    CH_Telework: () => CH_Telework,
    CH_Transport: () => CH_Transport,
    CH_Voicemail: () => CH_Voicemail,
    CashMgmtRequest: () => CashMgmtRequest,
    CashierOperationsRequest: () => CashierOperationsRequest,
    CollectionsRequest: () => CollectionsRequest,
    ContractorSupplement: () => ContractorSupplement,
    DVCSetup: () => DVCSetup,
    DiplomaticPassportVisa: () => DiplomaticPassportVisa,
    FPCodesRequest: () => FPCodesRequest,
    FPTravelRequest: () => FPTravelRequest,
    FiscalIrregularities: () => FiscalIrregularities,
    ITHardware: () => ITHardware,
    ITSoftware: () => ITSoftware,
    Ironkey: () => Ironkey,
    Locksmith: () => Locksmith,
    Mobile: () => Mobile,
    MotorPool: () => MotorPool,
    Overtime: () => Overtime,
    Presentation: () => Presentation,
    PropertySpace: () => PropertySpace,
    Requisition: () => Requisition,
    SDMAdminRequest: () => SDMAdminRequest,
    Telework: () => Telework,
    TemplateRequest: () => TemplateRequest,
    TierIRequest: () => TierIRequest,
    getApmOrg: () => getApmOrg,
    getCorOrg: () => getCorOrg,
    getGtmOrg: () => getGtmOrg
  });

  // src/fields/BaseField.js
  var BaseField = class {
    constructor({
      displayName,
      instructions = null,
      isRequired = false,
      width,
      Visible = ko.pureComputed(() => true)
    }) {
      this.displayName = displayName;
      this.instructions = instructions;
      this.isRequired = isRequired;
      this.Visible = Visible;
      this.width = width ? "col-md-" + width : "col-md-6";
      this.addFieldRequirement(isRequiredValidationRequirement(this));
    }
    Value = ko.observable();
    get = () => this.Value();
    set = (val) => this.Value(val);
    toString = ko.pureComputed(() => this.Value());
    toJSON = () => this.Value();
    fromJSON = (val) => this.Value(val);
    validate = (showErrors = true) => {
      this.ShowErrors(showErrors);
      return this.Errors();
    };
    _fieldValidationRequirements = ko.observableArray();
    Errors = ko.pureComputed(() => {
      if (!this.Visible()) return [];
      const errors = this._fieldValidationRequirements().filter((req) => req.requirement()).map((req) => req.error);
      return errors;
    });
    addFieldRequirement = (requirement) => this._fieldValidationRequirements.push(requirement);
    IsValid = ko.pureComputed(() => !this.Errors().length);
    ShowErrors = ko.observable(false);
    ValidationClass = ko.pureComputed(() => {
      if (!this.ShowErrors()) return;
      return this.Errors().length ? "is-invalid" : "is-valid";
    });
  };
  function isRequiredValidationRequirement(field) {
    return {
      requirement: ko.pureComputed(() => {
        const isRequired = ko.unwrap(field.isRequired);
        if (!isRequired) return false;
        const value = ko.unwrap(field.Value);
        if (value?.constructor == Array) return !value.length;
        return value === null || value === void 0;
      }),
      error: new ValidationError2(
        "text-field",
        "required-field",
        `${ko.utils.unwrapObservable(field.displayName)} is required!`
      )
    };
  }

  // src/components/Fields/BaseFieldModule.js
  var html3 = String.raw;
  function registerFieldComponents(constructor) {
    ko.components.register(constructor.edit, {
      template: constructor.editTemplate,
      viewModel: constructor
    });
    ko.components.register(constructor.view, {
      template: constructor.viewTemplate,
      viewModel: constructor
    });
  }
  var BaseFieldModule = class {
    constructor(params) {
      Object.assign(this, params);
    }
    _id;
    getUniqueId = () => {
      if (!this._id) {
        this._id = "field-" + Math.floor(Math.random() * 1e4);
      }
      return this._id;
    };
    Errors = ko.pureComputed(() => {
      if (!this.ShowErrors()) return [];
      if (!this.isRequired) return [];
      return this.Value() ? [] : [
        new ValidationError(
          "text-field",
          "required-field",
          this.displayName + ` is required!`
        )
      ];
    });
    ShowErrors = ko.observable(false);
    ValidationClass = ko.pureComputed(() => {
      if (!this.ShowErrors()) return;
      return this.Errors().length ? "is-invalid" : "is-valid";
    });
    static viewTemplate = html3`
    <div class="fw-semibold" data-bind="text: displayName"></div>
    <div data-bind="text: toString()"></div>
  `;
    static editTemplate = html3`<div>Uh oh!</div>`;
  };

  // src/components/Fields/BlobModule.js
  var editTemplate = html3`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="component: {name: Value()?.components.edit, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
        <th>Actions</th>
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString"></td>
        <!-- /ko -->
        <td>
          <i
            title="remove item"
            class="fa-solid fa-trash pointer"
            data-bind="click: $parent.remove.bind(row)"
          ></i>
        </td>
      </tr>
      <!-- /ko -->
      <tr>
        <!-- ko foreach: NewItem()?.FormFields -->
        <td>
          <div
            data-bind="component: {name: components.edit, params: $data}"
          ></div>
        </td>
        <!-- /ko -->
        <td class="align-bottom">
          <button
            title="add and new"
            type="button"
            data-bind="click: submit"
            class="btn btn-success"
          >
            Add +
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`;
  var viewTemplate = html3`
  <h5>
    <span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </h5>
  <!-- ko ifnot: entityType -->
  <div class="alert alert-danger">Missing entity type</div>
  <!-- /ko -->
  <!-- ko if: entityType -->
  <!-- ko ifnot: multiple -->
  <!-- ko if: Value -->
  <div
    data-bind="component: {name: Value().components.view, params: {Entity: Value()}}"
  ></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko if: multiple -->
  <table class="table">
    <thead>
      <tr data-bind="">
        <!-- ko foreach: Cols -->
        <th data-bind="text: displayName"></th>
        <!-- /ko -->
      </tr>
    </thead>
    <tbody data-bind="">
      <!-- ko foreach: {data: Value, as: 'row'} -->
      <tr data-bind="">
        <!-- ko foreach: {data: row.FormFields, as: 'col'} -->
        <td data-bind="text: col.toString()"></td>
        <!-- /ko -->
      </tr>
      <!-- /ko -->
    </tbody>
  </table>
  <!-- /ko -->
  <!-- /ko -->
`;
  var BlobModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static viewTemplate = viewTemplate;
    static editTemplate = editTemplate;
    static view = "blob-view";
    static edit = "blob-edit";
    static new = "blob-edit";
  };
  registerFieldComponents(BlobModule);

  // src/components/Fields/CheckboxModule.js
  var editTemplate2 = html3`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
      />
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
    </label>
  </div>
`;
  var viewTemplate2 = html3`
  <div class="form-check form-switch">
    <label class="form-check-label"
      ><span class="fw-semibold" data-bind="text: displayName"></span>
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        data-bind="checked: Value"
        disabled
      />
    </label>
  </div>
`;
  var CheckboxModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static viewTemplate = viewTemplate2;
    static editTemplate = editTemplate2;
    static view = "checkbox-view";
    static edit = "checkbox-edit";
    static new = "checkbox-edit";
  };
  registerFieldComponents(CheckboxModule);

  // src/components/Fields/DateModule.js
  var editTemplate3 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="value: inputBinding, class: ValidationClass, attr: {'type': type}"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var DateModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate3;
    static view = "date-view";
    static edit = "date-edit";
    static new = "date-edit";
  };
  registerFieldComponents(DateModule);

  // src/components/Fields/LookupModule.js
  var editTemplate4 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: isSearch -->
    <div data-bind="text: toString()"></div>
    <input class="form-control" data-bind="" />
    <!-- /ko -->
    <!-- ko ifnot: isSearch -->
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
  optionsCaption: 'Select...', 
  selectedOptions: Value,
  optionsText: optionsText,
  class: ValidationClass"
    ></select>
    <div class="fst-italic fw-light">Hold ctrl to select multiple.</div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
    optionsCaption: 'Select...', 
    value: Value,
    optionsText: optionsText,
    class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var LookupModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate4;
    static view = "lookup-view";
    static edit = "lookup-edit";
    static new = "lookup-edit";
  };
  registerFieldComponents(LookupModule);

  // src/components/Fields/PeopleModule.js
  var editTemplate5 = html3`
  <label class="fw-semibold w-100"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko ifnot: spGroupId -->
    <div
      data-bind="attr: {id: getUniqueId()}, 
      people: Value, 
      pickerOptions: pickerOptions,
      class: ValidationClass"
    ></div>
    <!-- /ko -->
    <!-- ko if: ShowUserSelect -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: userOpts, 
        optionsCaption: 'Select...', 
        optionsText: 'Title',
        value: ValueFunc,
        class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var viewTemplate3 = html3`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: toString -->
  <!-- ko ifnot: multiple -->
  <div
    data-bind="text: toString, 
      attr: {title: Value()?.LoginName}"
  ></div>
  <!-- /ko -->
  <!-- ko if: multiple -->
  <ul data-bind="foreach: Value">
    <li data-bind="attr: {title: LoginName}, text: Title"></li>
  </ul>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: toString -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`;
  var PeopleModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    ValueFunc = ko.pureComputed({
      read: () => {
        if (!this.Value()) return;
        const userOpts = ko.unwrap(this.userOpts);
        return userOpts.find((opt) => opt.ID == this.Value().ID);
      },
      write: (opt) => {
        const userOpts = ko.unwrap(this.userOpts);
        if (!userOpts) return;
        this.Value(opt);
      }
    });
    ShowUserSelect = ko.pureComputed(() => {
      const groupName = this.spGroupName;
      if (!groupName) return false;
      const options = ko.unwrap(this.userOpts);
      return options.length;
    });
    static viewTemplate = viewTemplate3;
    static editTemplate = editTemplate5;
    static view = "people-view";
    static edit = "people-edit";
    static new = "people-edit";
  };
  registerFieldComponents(PeopleModule);

  // src/components/Fields/SearchSelectModule.js
  var editTemplate6 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
  </label>
  <div class="row row-cols-auto" data-bind="foreach: GetSelectedOptions">
    <div class="col pb-1">
      <div class="input-group input-group-sm">
        <div
          class="input-group-text"
          data-bind="text: $parent.optionsText($data)"
        ></div>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          style="min-width: 1.5rem"
          data-bind="click: $parent.removeSelection"
        >
          <svg
            class="position-absolute top-50 start-50 translate-middle"
            style="width: 1rem; height: 1rem"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div
    tabindex="-1"
    data-bind="event: {
  focusin: setInputGroupFocus,
  focusout: removeInputGroupFocus,
  }"
    class="position-relative"
  >
    <input
      placehold="Search to select..."
      class="form-control form-control-sm"
      data-bind="textInput: FilterText"
    />
    <div
      data-bind="foreach: FilteredOptions, visible: InputGroupFocused"
      class="list-group overflow-y-scroll position-absolute w-100"
      style="max-height: 200px"
    >
      <button
        type="button"
        class="list-group-item list-group-item-action z-3"
        data-bind="click: $parent.addSelection, 
      text: $parent.optionsText($data)"
      ></button>
    </div>
  </div>
  <!-- ko if: instructions -->
  <div
    class="fw-lighter fst-italic text-secondary"
    data-bind="html: instructions"
  ></div>
  <!-- /ko -->
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var SearchSelectModule = class extends BaseFieldModule {
    constructor(field) {
      super(field);
      this.Options = field.Options;
      this.Value = field.Value;
      this.optionsText = field.optionsText ?? ((val) => {
        return val;
      });
      this.multiple = field.multiple;
      this.OptionsCaption = field.OptionsCaption ?? "Select...";
    }
    GetSelectedOptions = ko.pureComputed(() => {
      if (this.multiple) return this.Value();
      return this.Value() ? [this.Value()] : [];
    });
    InputGroupFocused = ko.observable();
    setFocus = () => this.InputGroupFocused(true);
    FilterText = ko.observable();
    FilteredOptions = ko.pureComputed(
      () => this.Options().filter((option) => {
        if (this.GetSelectedOptions().indexOf(option) >= 0) return false;
        if (this.FilterText())
          return this.optionsText(option).toLowerCase().includes(this.FilterText().toLowerCase());
        return true;
      })
    );
    addSelection = (option, e) => {
      console.log("selected", option);
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.focus();
      }
      if (this.multiple) {
        this.Value.push(option);
      } else {
        this.Value(option);
      }
    };
    removeSelection = (option) => this.multiple ? this.Value.remove(option) : this.Value(null);
    setInputGroupFocus = () => {
      this.InputGroupFocused(true);
      clearTimeout(this.focusOutTimeout);
    };
    removeInputGroupFocus = (data2, e) => {
      this.focusOutTimeout = window.setTimeout(() => {
        this.InputGroupFocused(false);
      }, 0);
    };
    static editTemplate = editTemplate6;
    static view = "search-select-view";
    static edit = "search-select-edit";
    static new = "search-select-new";
  };
  registerFieldComponents(SearchSelectModule);

  // src/components/Fields/SelectModule.js
  var editTemplate7 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <!-- ko if: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      multiple="true"
      data-bind="options: Options, 
  optionsCaption: 'Select...', 
  selectedOptions: Value,
  class: ValidationClass"
    ></select>
    <div class="fst-italic fw-light">Hold ctrl to select multiple.</div>
    <!-- /ko -->
    <!-- ko ifnot: multiple -->
    <select
      class="form-select"
      name=""
      id=""
      data-bind="options: Options, 
    optionsCaption: 'Select...', 
    value: Value,
    class: ValidationClass"
    ></select>
    <!-- /ko -->
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var SelectModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate7;
    static view = "select-view";
    static edit = "select-edit";
    static new = "select-edit";
  };
  registerFieldComponents(SelectModule);

  // src/components/Fields/TextAreaModule.js
  var editTemplate8 = html3`
  <div class="component field">
    <!-- ko if: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span
      >:</label
    >
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
    <div
      class="richtext-field"
      data-bind="childrenComplete: childrenHaveLoaded"
    >
      <!-- Create the editor container -->
      <div
        class="form-control"
        data-bind="attr: {'id': getUniqueId()}, class: ValidationClass"
        style="height: 150px"
      >
        <div data-bind="html: Value"></div>
      </div>
    </div>
    <!-- /ko -->
    <!-- ko ifnot: isRichText -->
    <label class="fw-semibold"
      ><span data-bind="text: displayName"></span
      ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
      <!-- ko if: instructions -->
      <div
        class="fw-lighter fst-italic text-secondary"
        data-bind="html: instructions"
      ></div>
      <!-- /ko -->
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-control"
        data-bind="textInput: Value, class: ValidationClass, attr: attr"
      ></textarea>
    </label>
    <!-- /ko -->
    <!-- ko if: ShowErrors -->
    <!-- ko foreach: Errors -->
    <div class="fw-semibold text-danger" data-bind="text: description"></div>
    <!-- /ko -->
    <!-- /ko -->
  </div>
`;
  var viewTemplate4 = html3`
  <div class="fw-semibold" data-bind="text: displayName"></div>
  <!-- ko if: Value -->
  <!-- ko if: isRichText -->
  <div data-bind="html: Value"></div>
  <!-- /ko -->
  <!-- ko ifnot: isRichText -->
  <div data-bind="text: Value"></div>
  <!-- /ko -->
  <!-- /ko -->
  <!-- ko ifnot: Value -->
  <div class="fst-italic">Not provided.</div>
  <!-- /ko -->
`;
  var TextAreaModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    childrenHaveLoaded = (nodes) => {
      this.initializeEditor();
    };
    getToolbarId = () => "toolbar-" + this.getUniqueId();
    initializeEditor() {
      const toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        // toggled buttons
        ["link"],
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }],
        // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }],
        // outdent/indent
        [{ direction: "rtl" }],
        // text direction
        [{ size: ["small", false, "large", "huge"] }],
        // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["clean"]
        // remove formatting button
      ];
      var editor = new Quill("#" + this.getUniqueId(), {
        modules: { toolbar: toolbarOptions },
        theme: "snow"
      });
      const Value = this.Value;
      Value.subscribe((val) => {
        if (val == "") {
          editor.setText("");
        }
      });
      editor.on("text-change", function(delta, oldDelta, source) {
        Value(editor.root.textContent ? editor.root.innerHTML : "");
      });
    }
    static viewTemplate = viewTemplate4;
    static editTemplate = editTemplate8;
    static view = "text-area-view";
    static edit = "text-area-edit";
    static new = "text-area-edit";
  };
  registerFieldComponents(TextAreaModule);

  // src/components/Fields/TextModule.js
  var editTemplate9 = html3`
  <label class="fw-semibold"
    ><span data-bind="text: displayName"></span
    ><span data-bind="if: isRequired" class="fw-bold text-danger">*</span>:
    <input
      class="form-control"
      data-bind="textInput: Value, class: ValidationClass, attr: attr"
    />
    <!-- ko if: instructions -->
    <div
      class="fw-lighter fst-italic text-secondary"
      data-bind="html: instructions"
    ></div>
    <!-- /ko -->
  </label>
  <!-- ko if: ShowErrors -->
  <!-- ko foreach: Errors -->
  <div class="fw-semibold text-danger" data-bind="text: description"></div>
  <!-- /ko -->
  <!-- /ko -->
`;
  var TextModule = class extends BaseFieldModule {
    constructor(params) {
      super(params);
    }
    static editTemplate = editTemplate9;
    static view = "text-view";
    static edit = "text-edit";
    static new = "text-edit";
  };
  registerFieldComponents(TextModule);

  // src/fields/BlobField.js
  var BlobField2 = class _BlobField extends BaseField {
    constructor(params) {
      super(params);
      this.entityType = params.entityType;
      this.multiple = params.multiple;
      if (this.multiple) {
        this.Value = ko.observableArray();
      }
      if (ko.isObservable(this.entityType)) {
        this.entityType.subscribe(this.updateEntityTypeHandler);
      }
      this.updateEntityTypeHandler(ko.unwrap(this.entityType));
    }
    toString = ko.pureComputed(() => `${this.Value()?.length ?? "0"} items`);
    toJSON = ko.pureComputed(() => {
      if (!this.multiple) return this.Value()?.toJSON();
      return this.Value().map((value) => value.toJSON());
    });
    fromJSON = (input) => {
      if (!input) return;
      if (!this.multiple) {
        this.Value()?.fromJSON(input);
        return;
      }
      this.Value.removeAll();
      input.map((obj) => {
        const newEntity = new this.entityConstructor();
        newEntity.fromJSON(obj);
        this.Value.push(newEntity);
      });
    };
    // TypedValues = ko.observableArray();
    // TypedValue = ko.observable();
    // Value = ko.pureComputed(() =>
    //   this.multiple ? this.TypedValues() : this.TypedValue()
    // );
    get = () => {
      return JSON.stringify(this.toJSON());
    };
    blob;
    set = (val) => {
      if (window.DEBUG) console.log(val);
      this.blob = val;
      if (val?.constructor == _BlobField) {
        return;
      }
      this.fromJSON(JSON.parse(val));
    };
    get entityConstructor() {
      return ko.utils.unwrapObservable(this.entityType);
    }
    // use purecomputed for memoization, fields shouldn't change
    Cols = ko.pureComputed(() => {
      const entityType = ko.unwrap(this.entityType);
      if (!entityType) return [];
      const newEntity = new this.entityConstructor();
      return newEntity.FormFields();
    });
    // ColKeys = ko.pureComputed(() =>
    //   new this.entityConstructor()?.FormFieldKeys()
    // );
    // Support multiple items
    NewItem = ko.observable();
    submit = () => {
      const errors = this.NewItem()?.validate();
      if (errors.length) return;
      this.Value.push(this.NewItem());
      this.NewItem(new this.entityConstructor());
    };
    add = (item) => this.Value.push(item);
    remove = (item) => this.Value.remove(item);
    updateEntityTypeHandler = (newType) => {
      if (!newType) return;
      if (!this.multiple) {
        this.Value(new this.entityConstructor());
      } else {
        this.NewItem(new this.entityConstructor());
      }
      if (this.blob) this.fromJSON(JSON.parse(this.blob));
    };
    applyValueToTypedValues = () => {
      if (!this.Value() || !this.TypedValue()) return;
      if (!this.multiple) {
        mapObjectToEntity(this.Value(), this.TypedValue());
        return;
      }
      const typedItems = this.Value()?.map((item) => {
        const newEntity = new this.entityConstructor();
        mapObjectToEntity(item, newEntity);
        return newEntity;
      });
      this.TypedValues(typedItems);
    };
    // Errors = ko.pureComputed(() => {
    //   if (!this.Visible()) return [];
    //   // const isRequired = ko.unwrap(this.isRequired);
    //   const isRequired =
    //     typeof this.isRequired == "function"
    //       ? this.isRequired()
    //       : this.isRequired;
    //   if (!isRequired) return [];
    //   const currentValue = this.multiple ? this.TypedValues() : this.TypedValue();
    //   return currentValue
    //     ? []
    //     : [
    //         new ValidationError(
    //           "text-field",
    //           "required-field",
    //           (typeof this.displayName == "function"
    //             ? this.displayName()
    //             : this.displayName) + ` is required!`
    //         ),
    //       ];
    // });
    components = BlobModule;
  };

  // src/fields/CheckboxField.js
  var CheckboxField = class extends BaseField {
    constructor(params) {
      super(params);
    }
    components = CheckboxModule;
  };

  // src/fields/DateField.js
  var dateFieldTypes = {
    date: "date",
    datetime: "datetime-local"
  };
  var DateField = class extends BaseField {
    constructor(params) {
      super(params);
      this.type = params.type ?? dateFieldTypes.date;
    }
    toString = ko.pureComputed(() => {
      switch (this.type) {
        case dateFieldTypes.date:
          return this.toLocaleDateString();
        case dateFieldTypes.datetime:
          return this.toLocaleString();
        default:
          return "";
      }
    });
    toSortableDateString = () => this.Value()?.format("yyyy-MM-dd");
    toLocaleDateString = () => this.Value()?.toLocaleDateString();
    toLocaleString = () => this.Value()?.toLocaleString();
    toInputDateString = () => {
      const d = this.Value();
      return [
        d.getUTCFullYear().toString().padStart(4, "0"),
        (d.getUTCMonth() + 1).toString().padStart(2, "0"),
        d.getUTCDate().toString().padStart(2, "0")
      ].join("-");
    };
    toInputDateTimeString = () => this.Value().format("yyyy-MM-ddThh:mm");
    get = ko.pureComputed(() => {
      if (!this.Value() || isNaN(this.Value().valueOf())) {
        return null;
      }
      return this.Value().toISOString();
    });
    set = (newDate) => {
      if (!newDate) return null;
      if (newDate.constructor.getName() != "Date") {
        newDate = new Date(newDate);
      }
      if (newDate.getTimezoneOffset()) {
      }
      this.Value(newDate);
    };
    inputBinding = ko.pureComputed({
      read: () => {
        if (!this.Value()) return null;
        switch (this.type) {
          case dateFieldTypes.date:
            return this.toInputDateString();
          case dateFieldTypes.datetime:
            return this.toInputDateTimeString();
          default:
            return null;
        }
      },
      write: (val) => {
        if (!val) return;
        this.Value(new Date(val));
      }
    });
    components = DateModule;
  };

  // src/fields/LookupField.js
  var LookupField = class extends BaseField {
    constructor({
      displayName,
      type: entityType,
      isRequired = false,
      Visible,
      Options = null,
      optionsText = null,
      multiple = false,
      lookupCol = null
    }) {
      super({ Visible, displayName, isRequired });
      Options ? this.Options = Options : this.isSearch = true;
      this.multiple = multiple;
      this.Value = multiple ? ko.observableArray() : ko.observable();
      this.entityType = entityType;
      this.entitySet = ApplicationDbContext.Set(entityType);
      this.lookupCol = lookupCol ?? "Title";
      this.optionsText = optionsText ?? ((item) => item[this.lookupCol]);
    }
    isSearch = false;
    Options = ko.observableArray();
    IsLoading = ko.observable(false);
    HasLoaded = ko.observable(false);
    // TODO: Started this, should really go in the entity base class if we're doing active record
    // create = async () => {
    //   const newItems = this.multiple ? this.Value() : [this.Value()]
    //   newItems.map(item => this.entitySet.AddEntity(newItems))
    // }
    refresh = async () => {
      if (!!!this.Value()) {
        return;
      }
      this.IsLoading(true);
      if (!this.multiple) {
        await this.entitySet.LoadEntity(this.Value());
        this.IsLoading(false);
        this.HasLoaded(true);
        return;
      }
      await Promise.all(
        this.Value().map(
          async (entity) => await this.entitySet.LoadEntity(entity)
        )
      );
      this.IsLoading(false);
      this.HasLoaded(true);
    };
    ensure = async () => {
      if (this.HasLoaded()) return;
      if (this.IsLoading()) {
        return new Promise((resolve, reject2) => {
          const isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
            if (!isLoading) {
              isLoadingSubscription.dispose();
              resolve();
            }
          });
        });
      }
      await this.refresh();
    };
    toString = ko.pureComputed(() => {
      if (!!!this.Value()) {
        return "";
      }
      if (this.multiple) {
        return this.Value().map((val) => getEntityPropertyAsString(val, this.lookupCol)).join(", ");
      }
      return getEntityPropertyAsString(this.Value(), this.lookupCol);
    });
    get = () => {
      if (!this.Value()) return;
      if (this.multiple) {
        return this.Value().map((entity2) => {
          return {
            ID: entity2.ID,
            LookupValue: entity2.LookupValue,
            Title: entity2.Title
          };
        });
      }
      const entity = this.Value();
      return {
        ID: entity.ID,
        LookupValue: entity.LookupValue,
        Title: entity.Title
      };
    };
    set = (val) => {
      if (!val) {
        this.Value(val);
        return;
      }
      if (this.multiple) {
        const valArr = Array.isArray(val) ? val : val.results ?? val.split("#;");
        this.Value(valArr.map((value) => this.findOrCreateNewEntity(value)));
        return;
      }
      this.Value(this.findOrCreateNewEntity(val));
      if (val && !this.toString()) {
        this.ensure();
      }
    };
    findOrCreateNewEntity = (val) => {
      if (this.entityType.FindInStore) {
        const foundEntity = this.entityType.FindInStore(val);
        if (foundEntity) return foundEntity;
        console.warn(
          `Could not find entity in store: ${this.entityType.name}`,
          val
        );
      }
      if (this.entityType.Create) {
        return this.entityType.Create(val);
      }
      return new this.entityType(val);
    };
    components = LookupModule;
  };
  function getEntityPropertyAsString(entity, column) {
    if (entity.FieldMap && entity.FieldMap[column]) {
      const field = entity.FieldMap[column];
      if (typeof field == "function") {
        return field();
      }
      if (field.toString && typeof field.toString == "function") {
        return field.toString();
      }
      if (field.get && typeof field.get == "function") {
        return field.get();
      }
      if (field.obs) {
        return field.obs();
      }
      return field;
    }
    return entity[column] ?? "";
  }

  // src/common/EntityUtilities.js
  var sortByTitle = (a, b) => {
    if (a.Title > b.Title) {
      return 1;
    }
    if (a.Title < b.Title) {
      return -1;
    }
    return 0;
  };
  var sortByField = (field) => (a, b) => {
    if (a[field] > b[field]) {
      return 1;
    }
    if (a[field] < b[field]) {
      return -1;
    }
    return 0;
  };
  var createNewRequestTitle = () => {
    const ts = /* @__PURE__ */ new Date();
    return ts.format("yyMMdd") + "-" + ts.getTime() % 1e5;
  };

  // src/fields/PeopleField.js
  var PeopleField = class extends BaseField {
    constructor(params) {
      super(params);
      this.spGroupName = params.spGroupName ?? null;
      this.multiple = params.multiple ?? false;
      this.Value = this.multiple ? ko.observableArray() : ko.observable();
      if (ko.isObservable(this.spGroupName)) {
        this.spGroupName.subscribe(this.spGroupNameChangedHandler);
      }
      if (ko.unwrap(this.spGroupName)) {
        this.spGroupNameChangedHandler(ko.unwrap(this.spGroupName));
      }
    }
    spGroupId = ko.observable();
    userOpts = ko.observableArray();
    expandUsers = ko.observable(false);
    spGroupNameChangedHandler = async (groupName) => {
      if (!groupName) {
        this.userOpts.removeAll();
        this.spGroupId(null);
      }
      const group = await ensureUserByKeyAsync(groupName);
      this.spGroupId(group.ID);
      const users = await getUsersByGroupName(groupName);
      this.userOpts(users.sort(sortByTitle));
    };
    pickerOptions = ko.pureComputed(() => {
      const groupId = ko.unwrap(this.spGroupId);
      const opts = {
        AllowMultipleValues: this.multiple
      };
      if (groupId) opts.SharePointGroupID = groupId;
      return opts;
    });
    toString = ko.pureComputed(() => {
      if (!this.multiple) return this.Value()?.Title;
      return this.Value()?.map((user) => user.Title);
    });
    set = (val) => {
      if (!this.multiple) {
        this.Value(People.Create(val));
        return;
      }
      if (!val) {
        this.Value.removeAll();
        return;
      }
      const vals = val.results ?? val;
      if (!vals.length) {
        this.Value.removeAll();
        return;
      }
      this.Value(vals.map((u) => People.Create(u)));
    };
    components = PeopleModule;
  };

  // src/fields/SelectField.js
  var SelectField = class extends BaseField {
    constructor({
      displayName,
      isRequired = false,
      Visible,
      options,
      multiple = false,
      optionsText
    }) {
      super({ Visible, displayName, isRequired });
      this.Options(options);
      this.multiple = multiple;
      this.Value = multiple ? ko.observableArray() : ko.observable();
      this.optionsText = optionsText;
    }
    toString = ko.pureComputed(
      () => this.multiple ? this.Value().join(", ") : this.Value()
    );
    get = () => this.Value();
    set = (val) => {
      if (val && this.multiple) {
        if (Array.isArray(val)) {
          this.Value(val);
        } else {
          this.Value(val.results ?? val.split(";#"));
        }
        return;
      }
      this.Value(val);
    };
    Options = ko.observableArray();
    components = SelectModule;
  };

  // src/fields/TextAreaField.js
  var TextAreaField = class extends BaseField {
    constructor(params) {
      super(params);
      this.isRichText = params.isRichText;
      this.attr = params.attr ?? {};
    }
    components = TextAreaModule;
  };

  // src/fields/TextField.js
  var TextField = class extends BaseField {
    constructor(params) {
      super(params);
      this.attr = params.attr ?? {};
    }
    components = TextModule;
  };

  // src/primitives/Task.js
  var taskStates = {
    pending: "Pending",
    aging: "Aging",
    completed: "Completed"
  };
  var Task = class {
    constructor({ msg, blocking }) {
      this.msg = msg;
      this.blocking = blocking;
      this.Status(taskStates.pending);
      this.timeout = this.setTimeout();
    }
    msg;
    blocking;
    Status = ko.observable();
    timeout;
    timeoutPeriod = 5e3;
    setTimeout = () => window.setTimeout(() => {
      console.warn("this task is aging:", this);
      this.Status(taskStates.aging);
    }, this.timeoutPeriod);
    resetTimeout = () => {
      window.clearTimeout(this.timeout);
      this.timeout = this.setTimeout();
    };
    markComplete = () => {
      window.clearTimeout(this.timeout);
      this.Status(taskStates.completed);
    };
    // Should this task block user input?
    IsBlocking = ko.pureComputed(
      () => this.blocking && this.Status() != taskStates.completed
    );
  };
  var ProgressTask = class extends Task {
    constructor({ msg, blocking }) {
      super({ msg, blocking });
    }
    timeoutPeriod = 8e3;
    updateProgress = ({ percentDone }) => {
      this.Status(`${parseInt(percentDone * 100)}%`);
    };
  };

  // src/servicetypes/BaseServiceDetail.js
  var BaseServiceDetail = class extends ConstrainedEntity {
    constructor(params) {
      super(params);
      if (params?.Request) this.Request = params.Request;
    }
    Request;
    FieldMap = {
      ...this.FieldMap,
      Request: this.Request
    };
  };

  // src/servicetypes/AccessDetail.js
  var Access = class _Access extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    accessTypeOpts = ["Normal work day", "24/7", "FLETC", "Other"];
    employeeTypeOpts = ["CGFS Government", "CGFS Contractor", "Other"];
    AccessType = new SelectField({
      isRequired: true,
      displayName: "Access Type",
      options: this.accessTypeOpts
    });
    EmployeeType = new SelectField({
      isRequired: true,
      displayName: "Employee Type",
      options: this.employeeTypeOpts
    });
    FullName = new TextField({ displayName: "Full Name", isRequired: true });
    BadgeNum = new TextField({ displayName: "Badge Num", isRequired: true });
    ExpirationDate = new DateField({
      displayName: "Expiration Date",
      isRequired: true
    });
    Locations = new TextField({ displayName: "Locations", isRequired: true });
    FieldMap = {
      ...this.FieldMap,
      AccessType: this.AccessType,
      EmployeeType: this.EmployeeType,
      FullName: this.FullName,
      BadgeNum: this.BadgeNum,
      ExpirationDate: this.ExpirationDate,
      Locations: this.Locations
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "AccessType",
        // CHS
        "EmployeeType",
        "FullName",
        "BadgeNum",
        "ExpirationDate",
        // DC
        "Locations",
        "Request"
      ]
    };
    static ListDef = {
      name: "st_access",
      title: "st_access",
      isServiceType: true,
      fields: _Access.Views.All
    };
    static uid = "access";
  };

  // src/servicetypes/CHAccessDetail.js
  var CH_Access = class _CH_Access extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    accessTypeOpts = ["Normal work day", "24/7", "Permanant", "Temporary"];
    employeeTypeOpts = ["CGFS Government", "CGFS Contractor", "Other"];
    AccessDates = new BlobField2({
      displayName: "Access Dates",
      entityType: AccessDate,
      multiple: true,
      width: 12,
      isRequired: true
    });
    AccessType = new SelectField({
      isRequired: true,
      displayName: "Access Type",
      options: this.accessTypeOpts
    });
    BadgeNum = new TextField({ displayName: "Badge Num", isRequired: true });
    EmployeeType = new SelectField({
      isRequired: true,
      displayName: "Employee Type",
      options: this.employeeTypeOpts
    });
    // FullName = new TextField({ displayName: "Full Name", isRequired: true });
    // Locations = new TextField({ displayName: "Locations", isRequired: true });
    Supervisor = new PeopleField({
      displayName: "Supervisor",
      isRequired: true
    });
    FieldMap = {
      ...this.FieldMap,
      AccessDates: this.AccessDates,
      AccessType: this.AccessType,
      BadgeNum: this.BadgeNum,
      EmployeeType: this.EmployeeType,
      FullName: this.FullName,
      Locations: this.Locations,
      Supervisor: this.Supervisor
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "AccessType",
        // CHS
        "AccessDates",
        "BadgeNum",
        "EmployeeType",
        "FullName",
        "Locations",
        "Supervisor",
        "Request"
      ]
    };
    static ListDef = {
      name: "st_ch_access",
      title: "st_ch_access",
      isServiceType: true,
      fields: _CH_Access.Views.All
    };
    static uid = "ch_access";
  };
  var AccessDate = class extends ConstrainedEntity {
    FieldMap = {
      StartDate: new DateField({
        displayName: "Start Date",
        type: dateFieldTypes.date,
        isRequired: true
      }),
      EndDate: new DateField({
        displayName: "End Date",
        type: dateFieldTypes.date,
        isRequired: true
      })
    };
  };

  // src/servicetypes/CHAccessFLETCDetail.js
  var AccessFletc = class _AccessFletc extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Supervisor: new PeopleField({
        displayName: "Supervisor",
        isRequired: true
      }),
      EmployeeType: new SelectField({
        displayName: "Employee Type",
        options: ["Direct Hire", "Contractor", "Visitor"],
        isRequired: true
      }),
      FullName: new TextField({
        displayName: "Full Name",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "Supervisor", "EmployeeType", "FullName"]
    };
    static ListDef = {
      name: "st_ch_access_fletc",
      title: "st_ch_access_fletc",
      fields: _AccessFletc.Views.All
    };
    static uid = "ch_accessFletc";
  };

  // src/servicetypes/CHConferenceDetail.js
  var CH_Conference = class extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      ConferenceDates: new BlobField2({
        displayName: "Conference Dates",
        entityType: ConferenceDate,
        multiple: true,
        width: 12,
        isRequired: true
      }),
      AVNeeds: new TextAreaField({
        displayName: "A/V Needs",
        isRequired: true
      }),
      ConferenceRoom: new SelectField({
        displayName: "Conference Room",
        options: [
          "Bldg. F Auditorium (Side A & B)",
          "Bldg. F Auditorium (Side A Only)",
          "Bldg. F Auditorium (Side B Only)",
          "Bldg. F Dining Rooms",
          "Bldg. C VTC Room (C128)",
          "Bldg. C Auditorium (C171)"
        ],
        isRequired: true
      })
    };
    static uid = "ch_conference";
  };
  var ConferenceDate = class extends ConstrainedEntity {
    FieldMap = {
      StartDate: new DateField({
        displayName: "Start Date",
        type: dateFieldTypes.datetime,
        isRequired: true
      }),
      EndDate: new DateField({
        displayName: "End Date",
        type: dateFieldTypes.datetime,
        isRequired: true
      })
    };
  };

  // src/servicetypes/CHEquipRepairDetail.js
  var CH_Equip_Repair = class _CH_Equip_Repair extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Location: new TextField({
        displayName: "Location",
        isRequired: true
      }),
      RepairType: new SelectField({
        isRequired: true,
        displayName: "Type",
        options: ["Copier", "Fax Machine", "Appliance", "Furniture", "Other"]
      })
    };
    static Views = {
      All: ["ID", "Title", "Location", "RepairType"]
    };
    static ListDef = {
      name: "st_ch_equip_repair",
      title: "st_ch_equip_repair",
      fields: _CH_Equip_Repair.Views.All
    };
    static uid = "ch_equip_repair";
  };

  // src/servicetypes/CHFurnitureDetail.js
  var CH_Furniture = class _CH_Furniture extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Location: new TextField({
        isRequired: true,
        displayName: "Location"
      }),
      FurnitureType: new SelectField({
        isRequired: true,
        displayName: "Type",
        options: [
          "Desk Adjustment",
          "Chair Adjustment",
          "Filing Cabinet",
          "Other"
        ]
      }),
      Supervisor: new PeopleField({
        displayName: "Supervisor",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "Location", "FurnitureType", "Supervisor"]
    };
    static ListDef = {
      name: "st_ch_furniture",
      title: "st_ch_furniture",
      fields: _CH_Furniture.Views.All
    };
    static uid = "ch_furniture";
  };

  // src/servicetypes/CHHRTrainingDetail.js
  var CH_HR_Training = class _CH_HR_Training extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      EmployeeType: new SelectField({
        displayName: "Employee Type",
        options: ["Direct Hire", "Contractor"],
        isRequired: true
      }),
      CourseTitle: new TextField({
        displayName: "Course Title",
        isRequired: true
      }),
      CourseNumber: new TextField({
        displayName: "Course Number"
      }),
      Vendor: new TextField({
        displayName: "Training Provider/Vendor",
        isRequired: true
      }),
      Date1: new DateField({ displayName: "Course Date", isRequired: true }),
      Cost: new TextField({
        displayName: "Training Cost"
      }),
      HiringManager: new PeopleField({
        displayName: "Hiring Manager",
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "EmployeeType",
        "CourseTitle",
        "CourseNumber",
        "Vendor",
        "Date1",
        "Cost",
        "HiringManager"
      ]
    };
    static ListDef = {
      name: "st_ch_hr_training",
      title: "st_ch_hr_training",
      fields: _CH_HR_Training.Views.All
    };
    static uid = "ch_hr_training";
  };

  // src/servicetypes/CHMobileDetail.js
  var CH_Mobile = class _CH_Mobile extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Supervisor: new PeopleField({
        displayName: "Supervisor",
        isRequired: true
      }),
      PhoneNum: new TextField({
        displayName: "Phone Number"
      }),
      ServiceType: new SelectField({
        displayName: "Service Type",
        options: [
          "New Temporary (include dates in Justification)",
          "Replacement/Upgrade",
          "Return/Deactivation",
          "Other"
        ],
        isRequired: true
      }),
      Serial: new TextField({
        displayName: "Serial Number"
      }),
      Carrier: new TextField({
        displayName: "Carrier",
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "Supervisor",
        "PhoneNum",
        "ServiceType",
        "Serial",
        "Carrier"
      ]
    };
    static ListDef = {
      name: "st_ch_mobile",
      title: "st_ch_mobile",
      fields: _CH_Mobile.Views.All
    };
    static uid = "ch_mobile";
  };

  // src/servicetypes/CHNoticeDetail.js
  var CH_Notice = class _CH_Notice extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      DistributionGroup: new SelectField({
        displayName: "Distribution Group",
        options: [
          "CGFS Offices",
          "DOS Offices in Charleston",
          "Both (CGFS and DOS Offices)"
        ],
        isRequired: true
      }),
      NoticeDates: new TextAreaField({
        displayName: "Notification Dates",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "DistributionGroup", "NoticeDates"]
    };
    static ListDef = {
      name: "st_ch_notice",
      title: "st_ch_notice",
      fields: _CH_Notice.Views.All
    };
    static uid = "ch_notice";
  };

  // src/servicetypes/CHReconfigDetail.js
  var CH_Reconfig = class _CH_Reconfig extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      ReconfigType: new SelectField({
        displayName: "Service Type",
        options: [
          "Office Furniture",
          "Construction",
          "Electrical Cabling",
          "Other"
        ],
        isRequired: true
      }),
      Location: new TextField({
        displayName: "Location",
        isRequired: true
      }),
      Supervisor: new PeopleField({
        displayName: "Supervisor",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "Location", "ReconfigType", "Supervisor"]
    };
    static ListDef = {
      name: "st_ch_reconfig",
      title: "st_ch_reconfig",
      fields: _CH_Reconfig.Views.All
    };
    static uid = "ch_reconfig";
  };

  // src/servicetypes/CHSuppliesDetail.js
  var CH_Supplies = class _CH_Supplies extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Vendor: new TextField({
        displayName: "Supplies Requested",
        isRequired: true
      }),
      ItemNum: new TextField({
        displayName: "Item/Product Num"
      }),
      Quantity: new TextField({
        displayName: "Quantity",
        isRequired: true
      }),
      InStock: new CheckboxField({
        displayName: "In Stock"
      }),
      SpecialOrder: new CheckboxField({
        displayName: "Special Order"
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "Vendor",
        "ItemNum",
        "Quantity",
        "InStock",
        "SpecialOrder"
      ]
    };
    static ListDef = {
      name: "st_ch_supplies",
      title: "st_ch_supplies",
      fields: _CH_Supplies.Views.All
    };
    static uid = "ch_supplies";
  };

  // src/servicetypes/CHTeleworkDetail.js
  var CH_Telework = class _CH_Telework extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    departmentOptions = requestOrgStore().filter((org) => org.OrgType == OrgTypes.Department).map((org) => org.Title);
    FieldMap = {
      ...this.FieldMap,
      FullName: new PeopleField({
        displayName: "Contractor",
        isRequired: true
      }),
      ManagerDept: new PeopleField({
        displayName: "Dept Manager"
      }),
      ManagerTask: new PeopleField({
        displayName: "Task Manager",
        isRequired: true
      }),
      Department: new SelectField({
        displayName: "Department",
        options: this.departmentOptions,
        isRequired: true
      }),
      RequisitionOrder: new TextField({
        displayName: "Requisition Number/Task Order",
        isRequired: true
      }),
      LaborCategory: new TextField({
        displayName: "Labor Category (LCAT)",
        isRequired: true
      }),
      ContractorType: new SelectField({
        displayName: "Contractor Type",
        options: ["SCA", "Non-SCA"],
        isRequired: true
      }),
      TeleworkType: new SelectField({
        displayName: "Telework Type",
        options: ["Core", "Situational"],
        isRequired: true
      }),
      MaxEligibility: new SelectField({
        displayName: "Max Eligibility",
        options: ["80%", "60%", "40%", "20%", "None"],
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "FullName",
        "ManagerDept",
        "ManagerTask",
        "Department",
        "RequisitionOrder",
        "LaborCategory",
        "ContractorType",
        "TeleworkType",
        "MaxEligibility"
      ]
    };
    static ListDef = {
      name: "st_ch_telework",
      title: "st_ch_telework",
      fields: _CH_Telework.Views.All
    };
    static uid = "ch_telework";
  };

  // src/servicetypes/CHTransportDetail.js
  var CH_Transport = class _CH_Transport extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      InvoiceNum: new TextField({
        displayName: "Invoice Num",
        isRequired: true
      }),
      InvoiceAmount: new TextField({
        displayName: "Invoice Amount",
        isRequired: true
      }),
      InvoiceDate: new DateField({
        displayName: "Invoice Date",
        isRequired: true
      }),
      InvoiceReceivedDate: new DateField({
        displayName: "Invoice Received Date",
        isRequired: true
      }),
      Vendor: new TextField({
        displayName: "Vendor",
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "InvoiceNum",
        "InvoiceAmount",
        "InvoiceDate",
        "InvoiceReceivedDate",
        "Vendor"
      ]
    };
    static ListDef = {
      name: "st_ch_transport",
      title: "st_ch_transport",
      fields: _CH_Transport.Views.All
    };
    static uid = "ch_transport";
  };

  // src/servicetypes/CHVoicemailDetail.js
  var CH_Voicemail = class _CH_Voicemail extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Employee: new PeopleField({
        displayName: "Employee Name",
        isRequired: true
      }),
      Phone: new TextField({
        displayName: "Phone Number",
        isRequired: true
      }),
      Location: new TextField({
        displayName: "Location"
      })
    };
    static Views = {
      All: ["ID", "Title", "Employee", "Phone", "Location"]
    };
    static ListDef = {
      name: "st_ch_voicemail",
      title: "st_ch_voicemail",
      fields: _CH_Voicemail.Views.All
    };
    static uid = "ch_voicemail";
  };

  // src/servicetypes/ContractorSupplementDetail.js
  var ContractorSupplement = class _ContractorSupplement extends BaseServiceDetail {
    constructor(params) {
      super(params);
      if (window.DEBUG) console.log("new contractor supplement", params);
    }
    ContractorTypeOptsArr = ["SCA", "Non-SCA"];
    TaskOrderNumber = new TextField({
      displayName: "Task Order Number",
      isRequired: true
    });
    RequisitionNumber = new TextField({
      displayName: "Requisition Number",
      isRequired: true
    });
    LaborCategory = new TextField({
      displayName: "Labor Category",
      isRequired: true
    });
    ContractorType = new SelectField({
      displayName: "Contractor Type",
      options: ["SCA", "Non-SCA"],
      isRequired: true
    });
    Contractor = new PeopleField({
      displayName: "Contractor",
      isRequired: true,
      Visible: ko.observable(false)
    });
    FieldMap = {
      ...this.FieldMap,
      TaskOrderNumber: this.TaskOrderNumber,
      RequisitionNumber: this.RequisitionNumber,
      LaborCategory: this.LaborCategory,
      ContractorType: this.ContractorType,
      Contractor: this.Contractor
    };
    // IsValid = ko.pureComputed(() => {
    //   return (
    //     this.ContractorType() &&
    //     this.LaborCategory() &&
    //     this.RequisitionNumber() &&
    //     this.TaskOrderNumber()
    //   );
    // });
    static Views = {
      All: [
        "ID",
        "Title",
        "TaskOrderNumber",
        "LaborCategory",
        "RequisitionNumber",
        "ContractorType",
        "Request",
        "Contractor"
      ],
      APMUpdate: [
        "TaskOrderNumber",
        "LaborCategory",
        "ContractorType",
        "RequisitionNumber"
      ]
    };
    static ListDef = {
      name: "st_ch_overtime_supplement",
      title: "st_ch_overtime_supplement",
      fields: _ContractorSupplement.Views.All
    };
    static uid = "contractor_supplement";
  };

  // src/servicetypes/DVCSetupDetail.js
  var DVCSetup = class _DVCSetup extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      DateOfDVC: new DateField({
        displayName: "Date of DVC",
        isRequired: true
      }),
      Location: new TextField({
        displayName: "Location",
        isRequired: true
      }),
      Duration: new TextField({
        displayName: "Duration",
        isRequired: true
      }),
      FarEndPOC: new TextField({
        displayName: "Far End POC",
        isRequired: true
      }),
      ConnectionType: new SelectField({
        displayName: "Connection Type",
        options: ["OpenNet", "ISDN", "IP"],
        isRequired: true
      }),
      CallType: new SelectField({
        displayName: "Call Type",
        options: ["Incoming", "Outgoing"],
        isRequired: true
      }),
      DVCDialInNum: new TextField({
        displayName: "DVC Dial-in Number",
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "DateOfDVC",
        "Location",
        "Duration",
        "FarEndPOC",
        "ConnectionType",
        "CallType",
        "DVCDialInNum"
      ]
    };
    static ListDef = {
      name: "st_dvc_setup",
      title: "st_dvc_setup",
      fields: _DVCSetup.Views.All
    };
    static uid = "dvc_setup";
  };

  // src/servicetypes/FPCashMgmtDetail.js
  var CashMgmtRequest = class _CashMgmtRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subcategory: new SelectField({
        displayName: "Subcategory",
        options: [
          "Accommodation Exchange",
          "Annual Cash Waivers",
          "Debt Collection",
          "Fiscal Irregularities",
          "One-Time Cash Waivers",
          "Proceeds of Sale",
          "Suspense Deposits Abroad"
        ],
        isRequired: true
      })
    };
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title", "Subcategory"]
    };
    static ListDef = {
      name: "st_fp_cash_mgmt",
      title: "st_fp_cash_mgmt",
      fields: _CashMgmtRequest.Views.All
    };
    static uid = "fp_cash_mgmt";
  };

  // src/servicetypes/FPCashierOperationsDetail.js
  var CashierOperationsRequest = class _CashierOperationsRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    Subcategory = new SelectField({
      displayName: "Subcategory",
      options: [
        "Annual Cash Waivers",
        "Class B Cashiering",
        "Occasional Money Holders",
        "One-Time Cash Waivers",
        "United States Treasury Checks"
      ],
      isRequired: true
    });
    MRN = new TextField({
      displayName: "MRN"
    });
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subcategory: this.Subcategory,
      MRN: this.MRN
    };
    fromEmail = (emailContent) => fromEmail(this, emailContent);
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title", "Subcategory"]
    };
    static ListDef = {
      name: "st_fp_cash_mgmt",
      title: "st_fp_cash_mgmt",
      fields: _CashierOperationsRequest.Views.All
    };
    static uid = "fp_cashier_operations";
  };
  function fromEmail(serviceType, emailContent) {
    serviceType.FieldMap.Subcategory.set("Annual Cash Waivers");
    const d = document.createElement("div");
    d.innerHTML = emailContent;
    const trs = d.querySelectorAll("tr");
    for (const tr of trs) {
      if (!tr.innerText?.includes("MRN:")) continue;
      console.log(tr);
      const td = tr.querySelector("td:nth-child(2) a");
      const mrnValue = td.innerText;
      serviceType.FieldMap.MRN.set(mrnValue);
    }
  }

  // src/servicetypes/FPCodesDetail.js
  var FPCodesRequest = class _FPCodesRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subcategory: new SelectField({
        displayName: "Subcategory",
        options: [
          "Allotment and Allowance Codes",
          "Domestic Organization Structure and Codes",
          "Function Classification Codes",
          "Fund Symbols",
          "Object Classification Codes",
          "Overseas Organization Classification Codes",
          "Revenue Source Codes"
        ],
        isRequired: true
      })
    };
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title", "Subcategory"]
    };
    static ListDef = {
      name: "st_fp_codes",
      title: "st_fp_codes",
      fields: _FPCodesRequest.Views.All
    };
    static uid = "fp_codes";
  };

  // src/servicetypes/FPCollectionsDetail.js
  var CollectionsRequest = class _CollectionsRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subcategory: new SelectField({
        displayName: "Subcategory",
        options: [
          "Debt Collection",
          "Proceeds of Sale",
          "Suspense Deposits Abroad (SDA)"
        ],
        isRequired: true
      })
    };
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title", "Subcategory"]
    };
    static ListDef = {
      name: "st_fp_collections",
      title: "st_fp_collections",
      fields: _CollectionsRequest.Views.All
    };
    static uid = "fp_collections";
  };

  // src/servicetypes/FPTravelDetail.js
  var FPTravelRequest = class _FPTravelRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subcategory: new SelectField({
        displayName: "Subcategory",
        options: [
          "Advances",
          "Claims",
          "Gifts of Travel",
          "Mileage Rates (general topic)",
          "Travel Card Program"
        ],
        isRequired: true
      })
    };
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title", "Subcategory"]
    };
    static ListDef = {
      name: "st_fp_travel",
      title: "st_fp_travel",
      fields: _FPTravelRequest.Views.All
    };
    static uid = "fp_travel";
  };

  // src/servicetypes/ITHardwareDetail.js
  var ITHardware = class _ITHardware extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Name: new TextField({
        displayName: "Hardware Name",
        isRequired: true
      }),
      Quantity: new TextField({
        displayName: "Quantity",
        isRequired: true
      }),
      POCName: new TextField({
        displayName: "POC",
        isRequired: true
      }),
      Cost: new TextField({
        displayName: "Cost",
        isRequired: true
      }),
      RequestType: new SelectField({
        displayName: "Request Type",
        options: ["New", "Maintenance Renewal"],
        isRequired: true
      }),
      PurchaseFrequency: new SelectField({
        displayName: "Purchase Frequency",
        options: ["One Time", "Recurring"],
        isRequired: true
      }),
      ApprovedPurchase: new SelectField({
        displayName: "Approved Purchase",
        options: ["Yes", "No"],
        isRequired: true
      }),
      FundingSource: new SelectField({
        displayName: "Funding Source",
        options: ["Project", "Contract", "Other"],
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "Name",
        "Quantity",
        "POCName",
        "Cost",
        "RequestType",
        "PurchaseFrequency",
        "ApprovedPurchase",
        "FundingSource"
      ]
    };
    static ListDef = {
      name: "st_IT_hardware",
      title: "st_IT_hardware",
      fields: _ITHardware.Views.All
    };
    static uid = "it_hardware";
  };

  // src/servicetypes/IronKeyDetail.js
  var Ironkey = class _Ironkey extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      UserName: new PeopleField({
        displayName: "User Name",
        isRequired: true
      }),
      EmployeeType: new SelectField({
        displayName: "Employee Type",
        options: ["Direct Hire", "Contractor"],
        isRequired: true
      }),
      RequestType: new SelectField({
        displayName: "Request Type",
        options: ["New", "Replacement"],
        isRequired: true
      }),
      Supervisor: new PeopleField({
        displayName: "COR/Supervisor",
        isRequired: true
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "UserName",
        "EmployeeType",
        "RequestType",
        "Supervisor"
      ]
    };
    static ListDef = {
      name: "st_ironkey",
      title: "st_ironkey",
      fields: _Ironkey.Views.All
    };
    static uid = "ironkey";
  };

  // src/servicetypes/LocksmithDetail.js
  var Locksmith = class _Locksmith extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      Location: new TextField({
        displayName: "Location",
        isRequired: true
      }),
      LockType: new TextField({
        displayName: "Lock Type",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title"]
    };
    static ListDef = {
      name: "st_locksmith",
      title: "st_locksmith",
      fields: _Locksmith.Views.All
    };
    static uid = "locksmith";
  };

  // src/servicetypes/MobileDetail.js
  var Mobile = class _Mobile extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      User: new PeopleField({
        displayName: "User Name",
        isRequired: true
      }),
      EmployeeType: new SelectField({
        displayName: "Employee Type",
        options: ["FTE", "Contractor"],
        isRequired: true
      }),
      RequestType: new SelectField({
        displayName: "Request Type",
        options: ["New", "Broken/Lost/Stolen", "Accessories"],
        isRequired: true
      }),
      PlanType: new SelectField({
        displayName: "Plan Type",
        options: ["Domestic", "Global"],
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "User", "EmployeeType", "RequestType", "PlanType"]
    };
    static ListDef = {
      name: "st_mobile_phone",
      title: "st_mobile_phone",
      fields: _Mobile.Views.All
    };
    static uid = "mobile";
  };

  // src/servicetypes/MotorPoolDetail.js
  var MotorPool = class _MotorPool extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      DateAndTime: new DateField({
        displayName: "Date and Time",
        type: dateFieldTypes.datetime,
        isRequired: true
      }),
      DriverPOC: new TextField({
        displayName: "Driver POC",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "DateAndTime", "DriverPOC"]
    };
    static ListDef = {
      name: "st_motor_pool",
      title: "st_motor_pool",
      fields: _MotorPool.Views.All
    };
    static uid = "motor_pool";
  };

  // src/servicetypes/OvertimeDetail.js
  var Overtime = class _Overtime extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      FullName: new PeopleField({
        displayName: "Contractor",
        isRequired: true
      }),
      ManagerGov: new PeopleField({
        displayName: "Gov Manager",
        isRequired: true
      }),
      ManagerGTM: new PeopleField({
        displayName: "COR/GTM",
        isRequired: true
      }),
      Office: new SelectField({
        displayName: "Department",
        options: currentUser().RequestingOffices().map((office) => office.Title),
        isRequired: true
      }),
      RequisitionNumber: new TextField({
        displayName: "Requisition Number/Task Order",
        isRequired: true
      }),
      Task: new TextField({
        displayName: "Project Task",
        isRequired: true
      }),
      Hours: new TextField({
        displayName: "Overtime Hours Total",
        isRequired: true
      }),
      ContractorType: new SelectField({
        displayName: "Contractor Type",
        options: ["SCA", "Non-SCA"],
        isRequired: true
      }),
      DatesRaw: new BlobField({
        displayName: "Overtime Dates",
        isRequired: true,
        width: 12,
        multiple: true,
        entityType: ko.observable(DatesBlob)
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "FullName",
        "ManagerGov",
        "ManagerGTM",
        "Office",
        "RequisitionNumber",
        "Task",
        "Hours",
        "ContractorType",
        "DatesRaw"
      ]
    };
    static ListDef = {
      name: "st_overtime",
      title: "st_overtime",
      fields: _Overtime.Views.All
    };
    static uid = "overtime";
  };
  var DatesBlob = class extends ConstrainedEntity {
    constructor() {
      super();
    }
    FieldMap = {
      date: new DateField({
        displayName: "Date",
        isRequired: true
      }),
      hours: new TextField({
        displayName: "# of Hours",
        isRequired: true
      }),
      label: new TextField({
        displayName: "Note/Label",
        isRequired: false
      })
    };
  };

  // src/servicetypes/PresentationDetail.js
  var Presentation = class _Presentation extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    FieldMap = {
      ...this.FieldMap,
      PresentationDate: new DateField({
        displayName: "Presentation Date and Time",
        type: dateFieldTypes.datetime,
        isRequired: true
      }),
      Location: new TextField({
        displayName: "Location",
        isRequired: true
      }),
      Duration: new TextField({
        displayName: "Duration",
        isRequired: true
      }),
      POC: new TextField({
        displayName: "POC",
        isRequired: true
      })
    };
    static Views = {
      All: ["ID", "Title", "PresentationDate", "Location", "Duration", "POC"]
    };
    static ListDef = {
      name: "st_presentation",
      title: "st_presentation",
      fields: _Presentation.Views.All
    };
    static uid = "presentation";
  };

  // src/servicetypes/RequisitionDetail.js
  var Requisition = class _Requisition extends BaseServiceDetail {
    constructor(request2) {
      super(request2);
      this.Request = request2;
    }
    Type = ko.observable();
    Quantity = ko.observable();
    Items = ko.observableArray();
    FieldMap = {
      ...this.FieldMap,
      RequisitionType: new SelectField({
        displayName: "Requisition Type",
        isRequired: false,
        options: ["Requisition", "De-Obligation", "Re-Alignment"]
      }),
      Quantity: new TextField({
        displayName: "Quantity of requisitions",
        isRequired: false
      }),
      ItemsBlob: new BlobField({
        displayName: "Procurement Items",
        isRequired: false,
        width: 12,
        multiple: true,
        entityType: ko.observable(RequisitionItem)
      })
    };
    static Views = {
      All: ["ID", "Title", "RequisitionType", "Quantity", "ItemsBlob"]
    };
    static ListDef = {
      name: "st_requisition",
      title: "st_requisition",
      fields: _Requisition.Views.All
    };
    static uid = "requisition";
  };
  var RequisitionItem = class extends ConstrainedEntity {
    constructor() {
      super();
    }
    FieldMap = {
      title: new TextField({ displayName: "Title", isRequired: true })
      // vendor: new TextField({ displayName: "Vendor", isRequired: true }),
      // description: new TextField({
      //   displayName: "Description",
      //   isRequired: true,
      // }),
      // quantity: new TextField({
      //   displayName: "Quantity",
      //   isRequired: true,
      //   attr: { type: "number" },
      // }),
      // unit: new TextField({
      //   displayName: "Unit",
      //   isRequired: true,
      // }),
      // price: new TextField({ displayName: "Price", isRequired: true }),
      // Amount: new TextField({ displayName: "Amount", isRequired: true }),
    };
  };

  // src/servicetypes/SDMAdminRequestDetail.js
  var SDMAdminRequest = class _SDMAdminRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Category: new SelectField({
        displayName: "Category",
        options: ["Category 1", "Category 2", "Category 3"],
        isRequired: false
      }),
      DatePromised: new DateField({
        displayName: "Date Promised",
        type: dateFieldTypes.date,
        isRequired: false
      }),
      DateCompleted: new DateField({
        displayName: "Date Completed",
        type: dateFieldTypes.date,
        isRequired: false
      })
    };
    // components = components;
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title"]
    };
    static ListDef = {
      name: "st_sdm_admin_request",
      title: "st_sdm_admin_request",
      fields: _SDMAdminRequest.Views.All
    };
    static uid = "sdm_admin_request";
  };

  // src/servicetypes/SDMTierIDetail.js
  var TierIRequest = class _TierIRequest extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      Subject: new TextField({
        displayName: "Title",
        instructions: `Brief one line summary identifying the issue.<br>
      (Team Name - Action Name - Brief description of Issue)`,
        isRequired: true
      }),
      EmployeeId: new TextField({
        displayName: "Employee ID",
        instructions: `Required if applicable. Please do NOT include employee SSN.`,
        isRequired: true
      }),
      AnalystPOC: new PeopleField({
        displayName: "Analyst POC",
        instructions: "Name of the incident reporter.",
        isRequired: true
      }),
      QWINumber: new TextField({
        displayName: "QWI Number",
        instructions: `(example: GFS-WI-APP-###)`,
        isRequired: true
      }),
      QWIStep: new TextField({
        displayName: "QWI Step",
        instructions: `What step in the QWI were you not able to complete successfully?`,
        isRequired: true
      }),
      IssueDate: new DateField({
        displayName: "Issue Date/Pay-Period of Action",
        type: dateFieldTypes.date,
        instructions: `(Needed to allow determination of software version being used)`,
        isRequired: true
      }),
      DISAction: new TextField({
        displayName: "DIS Action",
        instructions: `Required if applicable - if associated with a particular employee, this will be applicable`,
        isRequired: true
      }),
      DISRequestCode: new TextField({
        displayName: "DIS Request Code",
        instructions: `Required if applicable - if associated with a particular action in DIS, this will be applicable`,
        isRequired: true
      }),
      PayImpacting: new CheckboxField({
        displayName: "Pay Impacting",
        instructions: `Does the action impact an employee's pay if the issue is not resolved immediately? Please provide any necessary information in the instructions.`
      }),
      ImpactCount: new TextField({
        displayName: "Number of Employees Impacted",
        isRequired: true
      }),
      ResolutionDate: new DateField({
        displayName: "Required Date for Resolution",
        instructions: `Enter date required for resolution. What is the last day this action needs to be successfully completed before the employee's pay is negatively impacted?`,
        type: dateFieldTypes.date,
        isRequired: false
      }),
      PayrollOpIssue: new CheckboxField({
        displayName: "Payroll Operational Issue - Yes/No",
        instructions: `Process did not finish or unexpected processing results - from OPS`
      }),
      NewRequirement: new TextField({
        displayName: "New Requirement or request to modify existing functionality?",
        instructions: `What changed or is expected to change?`,
        isRequired: false
      }),
      CompliancePolicy: new TextField({
        displayName: "Compliance and Policy",
        instructions: `Did policy change? Is GFACS not compliant?`,
        isRequired: false
      }),
      SecurityRoleChange: new TextField({
        displayName: "Security Role Change?",
        isRequired: false
      }),
      DataUpdateRequest: new TextField({
        displayName: "Data Update/Execution Form (EF) request",
        instructions: `What needs to be update? Specific fields, dates? When is it needed by?`,
        isRequired: false
      }),
      QueryRequest: new TextAreaField({
        displayName: "Query Request",
        instructions: `What needs to be update? Specific fields, dates? When is it needed by?`,
        isRequired: false
      }),
      DatabaseIssues: new TextAreaField({
        displayName: "Database operation/output issues",
        instructions: `e.g. error message clarification`,
        isRequired: false
      })
    };
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title"]
    };
    static ListDef = {
      name: "st_sdm_tier_I",
      title: "st_sdm_tier_I",
      fields: _TierIRequest.Views.All
    };
    static uid = "sdm_tier_I";
  };

  // src/servicetypes/TeleworkDetail.js
  var Telework = class _Telework extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    OfficeOptions = currentUser().RequestingOffices().map((office) => office.Title);
    FieldMap = {
      ...this.FieldMap,
      FullName: new PeopleField({
        displayName: "Contractor",
        isRequired: true
      }),
      ManagerDept: new PeopleField({
        displayName: "Dept Manager",
        isRequired: false
      }),
      ManagerTechnical: new PeopleField({
        displayName: "Government Technical Monitor",
        isRequired: true,
        Visible: ko.pureComputed(() => !this.FieldMap.NoGTM.Value())
      }),
      NoGTM: new CheckboxField({
        displayName: "Check here if no GTM for this contract"
      }),
      COR: new PeopleField({
        displayName: "COR",
        isRequired: true
      }),
      Office: new SelectField({
        displayName: "Office",
        options: this.OfficeOptions,
        isRequired: true
      }),
      RequisitionOrder: new TextField({
        displayName: "Requisition Number/Task Order",
        isRequired: true
      }),
      LaborCategory: new TextField({
        displayName: "Labor Category (LCAT)",
        isRequired: true
      }),
      ContractorType: new SelectField({
        displayName: "Contractor Type",
        options: ["SCA", "Non-SCA"],
        isRequired: true
      }),
      TeleworkType: new SelectField({
        displayName: "Telework Type",
        options: ["Core", "Situational"],
        isRequired: true
      }),
      MaxEligibility: new SelectField({
        displayName: "Max Eligibility",
        options: ["80%", "60%", "40%", "20%", "None"],
        isRequired: true
      }),
      DaysWeek1: new SelectField({
        displayName: "Week 1",
        options: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
        multiple: true,
        isRequired: false
      }),
      DaysWeek2: new SelectField({
        displayName: "Week 2",
        options: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        multiple: true,
        isRequired: false
      })
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "FullName",
        "ManagerDept",
        "ManagerTechnical",
        "NoGTM",
        "COR",
        "Office",
        "RequisitionOrder",
        "LaborCategory",
        "ContractorType",
        "TeleworkType",
        "MaxEligibility",
        "DaysWeek1",
        "DaysWeek2"
      ]
    };
    static ListDef = {
      name: "st_telework",
      title: "st_telework",
      fields: _Telework.Views.All
    };
    static uid = "telework";
  };

  // src/servicetypes/ch_overtime/views/View.js
  var chOvertimeViewTemplate = html2`
  <div data-bind="using: FieldMap">
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: FullName.Visible,
        component: {name: FullName.components.view, params: FullName}, 
        class: FullName.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: GovManager.Visible,
        component: {name: GovManager.components.view, params: GovManager}, 
        class: GovManager.width"
      ></div>
    </div>
    <div class="py-2">
      <h6 class="">Overtime Dates (within month estimate):</h6>
      <div class="row">
        <div
          class="col pb-2"
          data-bind="
        visible: DateStart.Visible,
        component: {name: DateStart.components.view, params: DateStart}, 
        class: DateStart.width"
        ></div>
        <div
          class="col pb-2"
          data-bind="
        visible: DateEnd.Visible,
        component: {name: DateEnd.components.view, params: DateEnd}, 
        class: DateEnd.width"
        ></div>
      </div>
    </div>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: Hours.Visible,
        component: {name: Hours.components.view, params: Hours}, 
        class: Hours.width"
      ></div>
    </div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: APM.Visible,
    component: {name: APM.components.view, params: APM}, 
    class: APM.width"
    ></div>
    <div
      class="col pb-2"
      data-bind="
  visible: GTM.Visible,
  component: {name: GTM.components.view, params: GTM}, 
  class: GTM.width"
    ></div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: COR.Visible,
    component: {name: COR.components.view, params: COR}, 
    class: COR.width"
    ></div>
  </div>
  <!-- ko if: ContractorSupplementField.Value()?.Title -->
  <div class="py-3">
    <h5 class="text-secondary">Contractor Supplemental Information</h5>
    <div
      data-bind="component: {name: supplementComponents.view, params: {Entity: ContractorSupplementField.Value()} }"
    ></div>
  </div>
  <!-- /ko -->
`;

  // src/servicetypes/ch_overtime/views/Edit.js
  var chOvertimeEditTemplate = html2`
  <div data-bind="using: FieldMap">
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: FullName.Visible,
        component: {name: FullName.components.edit, params: FullName}, 
        class: FullName.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: GovManager.Visible,
        component: {name: GovManager.components.edit, params: GovManager}, 
        class: GovManager.width"
      ></div>
    </div>
    <h6>Overtime Dates (within month estimate):</h6>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: DateStart.Visible,
        component: {name: DateStart.components.edit, params: DateStart}, 
        class: DateStart.width"
      ></div>
      <div
        class="col pb-2"
        data-bind="
        visible: DateEnd.Visible,
        component: {name: DateEnd.components.edit, params: DateEnd}, 
        class: DateEnd.width"
      ></div>
    </div>
    <div class="row">
      <div
        class="col pb-2"
        data-bind="
        visible: Hours.Visible,
        component: {name: Hours.components.edit, params: Hours}, 
        class: Hours.width"
      ></div>
    </div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: APM.Visible,
    component: {name: APM.components.edit, params: APM}, 
    class: APM.width"
    ></div>
    <div
      class="col pb-2"
      data-bind="
  visible: GTM.Visible,
  component: {name: GTM.components.edit, params: GTM}, 
  class: GTM.width"
    ></div>
  </div>
  <div class="row">
    <div
      class="col pb-2"
      data-bind="
    visible: COR.Visible,
    component: {name: COR.components.edit, params: COR}, 
    class: COR.width"
    ></div>
  </div>
  <!-- ko if: ContractorSupplementField.Value -->
  <div
    data-bind="component: {name: supplementComponents.view, params: {Entity: ContractorSupplementField.Value()} }"
  ></div>
  <!-- /ko -->
`;

  // src/servicetypes/ch_overtime/components/APMActionsTemplate.js
  var apmActionsTemplate = html2`
  <div class="card m-1">
    <div class="card-body">
      <h6>Please provide the GTM and COR:</h6>
      <!-- ko if: HasLoaded -->
      <div data-bind="using: newEntity">
        <div class="row">
          <div
            class="col pb-2"
            data-bind="component: {name: GTM.components[$parent.DisplayMode()], params: GTM}"
          ></div>
          <div
            class="col pb-2"
            data-bind="component: {name: COR.components[$parent.DisplayMode()], params: COR}"
          ></div>
        </div>
        <!-- Only show the addtional fields after GTM and COR have been provided -->
        <!-- ko if:  $parent.ShowSupplementComponent-->
        <div
          data-bind="component: {name: supplementComponents[$parent.DisplayMode()], params: {Entity: ContractorSupplementField.Value() }}"
        ></div>
        <!-- /ko -->
        <div>
          <!-- ko if: $parent.Editing -->
          <!-- ko if: $parent.IsCompleted -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: $parent.update, enable: ContractorSupplementField.Value().IsValid"
          >
            Update
          </button>
          <button
            class="btn btn-outline-danger"
            type="button"
            data-bind="click: () => $parent.Editing(false)"
          >
            Cancel
          </button>
          <!-- /ko -->
          <!-- ko ifnot: $parent.IsCompleted -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: $parent.submit, enable: ContractorSupplementField.Value().IsValid"
          >
            Save and Approve
          </button>
          <!-- /ko -->
          <button
            type="button"
            class="btn fluid btn-danger"
            data-bind="click: $parent.showReject"
          >
            Reject
          </button>
          <!-- /ko -->
          <!-- ko ifnot: $parent.Editing -->
          <button
            class="btn btn-primary"
            type="button"
            data-bind="click: () => $parent.Editing(true)"
          >
            Edit
          </button>
          <!-- /ko -->
        </div>
      </div>
      <!-- /ko -->
    </div>
  </div>
  <dialog class="" data-bind="attr: {id: rejectModalId}">
    <div class="d-flex flex-column justify-content-between h-100">
      <h4>Please Provide a Rejection Reason:</h4>
      <div class="alert alert-warning mb-3">
        Note: Rejecting this request will close the record! Closed requests
        cannot be re-opened!
      </div>
      <textarea
        class="form-control mb-3 flex-grow-1"
        data-bind="textInput: RejectReason"
      ></textarea>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-danger me-2"
          data-bind="click: reject, enable: RejectReason"
        >
          Reject
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-bind="click: cancelReject"
        >
          Cancel
        </button>
      </div>
    </div>
  </dialog>
`;

  // src/servicetypes/ch_overtime/components/APMActions.js
  var CH_OvertimeAPMActions = class extends ApprovalActions {
    constructor(params) {
      super(params);
      if (window.DEBUG) console.log("Hello from APM Actions module.");
      this._context = getAppContext();
      this.ServiceType = params.request.RequestBodyBlob?.Value();
      this.Errors = params.errors;
      this.Request = params.request;
      this.newEntity = new CH_Overtime();
      this.newEntity.fromJSON(this.ServiceType.toJSON());
      this.init();
    }
    newEntity = null;
    HasLoaded = ko.observable(false);
    Editing = ko.observable(true);
    DisplayMode = ko.pureComputed(() => {
      return this.Editing() ? "edit" : "view";
    });
    init = async () => {
      if (window.DEBUG) console.log("setting supplement");
      await this.newEntity.setRequestContext(this.Request);
      if (!this.newEntity.ContractorSupplementField.Value())
        this.newEntity.ContractorSupplementField.Value(
          new ContractorSupplement({
            Title: this.Request.Title,
            Request: this.Request
          })
        );
      const isValid = this.validate(false);
      if (this.assignment.Status != assignmentStates.InProgress)
        this.Editing(false);
      this.IsCompleted(!isValid.length);
      this.HasLoaded(true);
    };
    hasBeenValidated = ko.observable(false);
    hasBeenSaved = ko.observable(false);
    IsCompleted = ko.observable(false);
    validate = (showErrors = true) => {
      if (!this.newEntity) return [];
      const errors = [];
      if (this.newEntity.GTM.validate(showErrors).length) {
        errors.push(
          new ValidationError2(
            errorSource,
            "required-field",
            "Please provide a GTM."
          )
        );
      }
      if (this.newEntity.COR.validate(showErrors).length) {
        errors.push(
          new ValidationError2(
            errorSource,
            "required-field",
            "Please provide a COR."
          )
        );
      }
      if (this.newEntity.ContractorSupplementField.Value().validate(showErrors).length) {
        errors.push(
          new ValidationError2(
            errorSource,
            "required-field",
            "Please provide the contractor supplemental information."
          )
        );
      }
      this.Errors(
        this.Errors().filter((e) => e.source != errorSource).concat(errors)
      );
      return errors;
    };
    // gtmWatcher = (user) => {
    //   if (!this.GTM()) {
    //     this.GTM(user);
    //   }
    // };
    ShowSupplementComponent = ko.pureComputed(
      () => this.newEntity.GTM.IsValid() && this.newEntity.COR.IsValid()
    );
    submit = async () => {
      this.hasBeenValidated(true);
      if (this.validate().length) return;
      this.newEntity.ContractorSupplementField.Value().Request = this.Request;
      await this.newEntity.ContractorSupplement.create(
        this.newEntity.ContractorSupplementField.Value()
      );
      this.Request.RequestBodyBlob.Value(this.newEntity);
      await this._context.Requests.UpdateEntity(this.Request, [
        "RequestBodyBlob"
      ]);
      if (this.assignment.Status != assignmentStates.Approved) ;
      await this.completeAssignment(this.assignment, assignmentStates.Approved);
      this.hasBeenSaved(true);
      this.IsCompleted(true);
    };
    update = async () => {
      this.hasBeenValidated(true);
      if (this.validate().length) return;
      this.Request.RequestBodyBlob.Value(this.newEntity);
      await this._context.Requests.UpdateEntity(this.Request, [
        "RequestBodyBlob"
      ]);
      await this.newEntity.ContractorSupplement.update(
        ContractorSupplement.Views.APMUpdate
      );
      this.hasBeenSaved(true);
      this.Editing(false);
    };
    static name = "APMActions";
    static template = apmActionsTemplate;
  };
  var errorSource = "apm-actions";

  // src/servicetypes/ch_overtime/components/GovManagerActionsTemplate.js
  var govManagerActionsTemplate = html2`
  <div class="card m-1">
    <div class="card-body">
      <h6>Please provide the APM and GTM (opt):</h6>
      <!-- ko if: Editing -->
      <div class="row">
        <div
          class="col pb-2"
          data-bind="component: {name: APM.components.edit, params: APM}"
        ></div>
        <div
          class="col pb-2"
          data-bind="component: {name: GTM.components.edit, params: GTM}"
        ></div>
      </div>
      <button
        type="button"
        class="btn fluid btn-primary"
        data-bind="click: submit"
      >
        Save and Approve
      </button>
      <button
        type="button"
        class="btn fluid btn-danger"
        data-bind="click: showReject"
      >
        Reject
      </button>
      <!-- /ko -->
      <!-- ko ifnot: Editing-->
      <div class="row">
        <div
          class="col pb-2"
          data-bind="component: {name: APM.components.view, params: APM}"
        ></div>
        <div
          class="col pb-2"
          data-bind="component: {name: GTM.components.view, params: GTM}"
        ></div>
      </div>
      <button
        type="button"
        class="btn fluid btn-primary"
        data-bind="click: () => Editing(true)"
      >
        Update
      </button>
      <!-- /ko -->
    </div>
  </div>
  <dialog class="" data-bind="attr: {id: rejectModalId}">
    <div class="d-flex flex-column justify-content-between h-100">
      <h4>Please Provide a Rejection Reason:</h4>
      <div class="alert alert-warning mb-3">
        Note: Rejecting this request will close the record! Closed requests
        cannot be re-opened!
      </div>
      <textarea
        class="form-control mb-3 flex-grow-1"
        data-bind="textInput: RejectReason"
      ></textarea>
      <div class="d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-danger me-2"
          data-bind="click: reject, enable: RejectReason"
        >
          Reject
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-bind="click: cancelReject"
        >
          Cancel
        </button>
      </div>
    </div>
  </dialog>
`;

  // src/servicetypes/ch_overtime/components/GovManagerActions.js
  var CH_OvertimeGovManagerActions = class extends ApprovalActions {
    constructor(params) {
      super(params);
      this._context = getAppContext();
      this.ServiceType = params.request.RequestBodyBlob?.Value();
      this.Errors = params.errors;
      this.Request = params.request;
      this.apmWatcher(this.ServiceType?.APM.get());
      this.gtmWatcher(this.ServiceType?.GTM.get());
      const isValid = this.validate(false);
      if (this.assignment.Status != assignmentStates.InProgress)
        this.Editing(false);
    }
    Editing = ko.observable(true);
    APM = new PeopleField({
      displayName: "APM",
      isRequired: true,
      spGroupName: ko.pureComputed(() => {
        const apmOrg = ko.unwrap(getApmOrg);
        return apmOrg?.UserGroup?.Title;
      })
      // instructions: ko.observable(),
      // pickerOptions: ko.pureComputed(() => {
      //   const apmOrg = this.apmGroup();
      //   if (apmOrg?.UserGroup?.ID) {
      //     return {
      //       SharePointGroupID: apmOrg.UserGroup.ID,
      //     };
      //   }
      //   return {};
      // }),
    });
    GTM = new PeopleField({
      displayName: "GTM",
      isRequired: false,
      spGroupName: ko.pureComputed(() => {
        const gtmOrg = ko.unwrap(getGtmOrg);
        return gtmOrg?.UserGroup?.Title;
      })
    });
    hasBeenValidated = ko.observable(false);
    hasBeenSaved = ko.observable(false);
    validate = (showErrors = true) => {
      if (!this.ServiceType) return [];
      const errors = [];
      if (this.APM.validate(showErrors).length) {
        errors.push(
          new ValidationError2(
            errorSource2,
            "gov-manager-actions",
            "Please provide a valid APM."
          )
        );
      }
      this.Errors(
        this.Errors().filter((e) => e.source != errorSource2).concat(errors)
      );
      return errors;
    };
    apmWatcher = (user) => {
      if (!this.APM.get()) {
        this.APM.set(user);
      }
    };
    gtmWatcher = (user) => {
      if (!this.GTM.get()) {
        this.GTM.set(user);
      }
    };
    submit = async () => {
      this.hasBeenValidated(true);
      if (this.validate().length) return;
      console.log(this);
      this.ServiceType.APM.set(this.APM.get());
      if (this.GTM.get()) {
        this.ServiceType.GTM.set(this.GTM.get());
      } else if (this.ServiceType.GTM.get()) {
        this.ServiceType.GTM.set(null);
      }
      await this._context.Requests.UpdateEntity(this.Request, [
        "RequestBodyBlob"
      ]);
      if (this.assignment.Status != assignmentStates.Approved)
        await this.completeAssignment(this.assignment, assignmentStates.Approved);
      this.Editing(false);
      this.hasBeenSaved(true);
    };
    static name = "GovManagerActions";
    static template = govManagerActionsTemplate;
  };
  var errorSource2 = "gov-manager-actions";

  // src/servicetypes/ch_overtime/CHOvertimeDetail.js
  var components = {
    view: "svc-ch_overtime-view",
    edit: "svc-ch_overtime-edit",
    new: "svc-ch_overtime-edit"
  };
  registerComponentFromConstructor(CH_OvertimeAPMActions);
  registerComponentFromConstructor(CH_OvertimeGovManagerActions);
  var getApmOrg = ko.pureComputed(() => {
    return requestOrgStore2().find(
      (org) => org.Title.toUpperCase() == "CGFS/APMS"
    );
  });
  var getGtmOrg = ko.pureComputed(
    () => requestOrgStore2().find((org) => org.Title.toUpperCase() == "CGFS/GTMS")
  );
  var getCorOrg = ko.pureComputed(
    () => requestOrgStore2().find((org) => org.Title.toUpperCase() == "CGFS/CORS")
  );
  var CH_OvertimeViewModule = class extends ConstrainedEntityViewModule {
    constructor(params) {
      super(params);
    }
    static name = components.view;
    static template = chOvertimeViewTemplate;
  };
  var CH_OvertimeEditModule = class extends ConstrainedEntityEditModule {
    constructor(params) {
      super(params);
    }
    static name = components.edit;
    static template = chOvertimeEditTemplate;
  };
  registerComponentFromConstructor(CH_OvertimeEditModule);
  registerComponentFromConstructor(CH_OvertimeViewModule);
  var CH_Overtime = class _CH_Overtime extends BaseServiceDetail {
    constructor(requestContext) {
      super(requestContext);
    }
    setRequestContext = async (request2) => {
      this.Request = request2;
      await this.ContractorSupplement.findByRequest(this.Request);
    };
    RequestSubmitted = ko.pureComputed(() => this.Request?.Pipeline?.Stage());
    RequestStage2 = ko.pureComputed(
      () => this.Request?.Pipeline?.Stage()?.Step == 2
    );
    Contractor = new PeopleField({
      displayName: "Contractor",
      isRequired: true
    });
    GovManager = new PeopleField({
      displayName: "Gov Manager",
      isRequired: true
    });
    GTM = new PeopleField({
      displayName: "GTM",
      isRequired: this.RequestStage2,
      Visible: this.RequestSubmitted,
      spGroupName: ko.pureComputed(() => {
        const gtmOrg = ko.unwrap(getGtmOrg);
        return gtmOrg?.UserGroup?.Title;
      })
    });
    APM = new PeopleField({
      displayName: "APM",
      isRequired: this.RequestSubmitted,
      Visible: this.RequestSubmitted,
      spGroupName: ko.pureComputed(() => {
        const apmOrg = ko.unwrap(getApmOrg);
        return apmOrg?.UserGroup?.Title;
      })
    });
    COR = new PeopleField({
      displayName: "COR",
      isRequired: this.RequestStage2,
      Visible: this.RequestSubmitted,
      spGroupName: ko.pureComputed(() => {
        const org = ko.unwrap(getCorOrg);
        return org?.UserGroup?.Title;
      })
    });
    ContractorSupplementField = new LookupField({
      displayName: "Contractor Supplement",
      Visible: ko.observable(false),
      type: ContractorSupplement,
      lookupCol: "LaborCategory",
      isRequired: false,
      multiple: false
    });
    ContractorSupplement = {
      set: ApplicationDbContext.Set(ContractorSupplement),
      findByRequest: async (request2) => {
        const contractorSupplementResult = await this.ContractorSupplement.set.FindByColumnValue(
          [{ column: "Title", op: "eq", value: request2.Title }],
          {},
          {},
          ContractorSupplement.Views.All,
          false
        );
        const supplement = contractorSupplementResult?.results?.pop();
        if (!supplement) {
          return;
        }
        this.ContractorSupplementField.Value(supplement);
      },
      update: async (fields = null) => {
        await this.ContractorSupplement.set.UpdateEntity(
          this.ContractorSupplementField.Value(),
          fields
        );
      },
      VisibleOnForm: ko.pureComputed(() => {
      }),
      create: async (contractorSupplement = this.ContractorSupplementField.Value()) => {
        const relFolderPath = this.Request.getRelativeFolderPath();
        const folderPerms = this.ContractorSupplement.getPermissions();
        const listFolderId = await this.ContractorSupplement.set.UpsertFolderPath(
          relFolderPath
        );
        await this.ContractorSupplement.set.SetFolderPermissions(
          relFolderPath,
          folderPerms
        );
        contractorSupplement.Contractor.set(this.Contractor.get());
        await this.ContractorSupplement.set.AddEntity(
          contractorSupplement,
          relFolderPath,
          this.Request
        );
        this.ContractorSupplementField.Value(contractorSupplement);
      },
      getPermissions: () => {
        const budgetGroup = requestOrgStore2().find(
          (org) => org.Title.toUpperCase() == "CGFS/EX/BUDGET"
        )?.UserGroup;
        const exGroup = requestOrgStore2().find(
          (org) => org.Title.toUpperCase() == "CGFS/EX"
        )?.UserGroup;
        const corGroup = getCorOrg()?.UserGroup;
        const user = currentUser();
        return [
          [user, permissions.RestrictedContribute],
          [this.APM.get(), permissions.RestrictedContribute],
          [this.GTM.get(), permissions.RestrictedContribute],
          [this.COR.get(), permissions.RestrictedContribute],
          [budgetGroup, permissions.RestrictedContribute],
          [exGroup, permissions.RestrictedContribute],
          [corGroup, permissions.RestrictedContribute]
        ];
      }
    };
    supplementComponents = defaultComponents;
    FieldMap = {
      FullName: this.Contractor,
      GovManager: this.GovManager,
      GTM: this.GTM,
      APM: this.APM,
      COR: this.COR,
      DateStart: new DateField({
        displayName: "Start Date",
        type: dateFieldTypes.date,
        isRequired: true
      }),
      DateEnd: new DateField({
        displayName: "End Date (Within Month Range)",
        type: dateFieldTypes.date,
        isRequired: true
      }),
      Hours: new TextField({
        displayName: "Overtime Hours (Not to Exceed)",
        isRequired: true,
        attr: { type: "number" }
      })
      // ContractorSupplement: this.ContractorSupplementField,
    };
    components = components;
    static Views = {
      All: [
        "ID",
        "Title",
        "FullName",
        "GovManager",
        "GTM",
        "APM",
        "COR",
        "DateStart",
        "DateEnd",
        "Hours",
        "ContractorSupplement",
        "Request"
      ],
      APMUpdate: ["COR", "GTM"]
    };
    static ListDef = {
      name: "st_ch_overtime",
      title: "st_ch_overtime",
      isServiceType: true,
      fields: _CH_Overtime.Views.All
    };
    // static Set = ApplicationDbContext.Set(CH_Overtime);
    static uid = "ch_overtime";
  };

  // src/servicetypes/diplomatic_passport/views/Edit.js
  var diplomaticPassportEditTemplate = html2`
  <div>
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: DocumentType.components.edit, params: DocumentType}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: RequestType.components.edit, params: RequestType}"
      ></div>
    </div>
    <!-- ko if: TypesSelected -->
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: JobTitle.components.edit, params: JobTitle}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: Grade.components.edit, params: Grade}"
      ></div>
    </div>
    <h4>Travel Information</h4>
    <div class="row row-cols-2" data-bind="foreach: TravelFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <h4>Personal Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PersonalFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <!-- ko if: ShowPassportInfo -->
    <h4>Passport Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PassportFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
    <!-- /ko -->
    <div
      class="col col-12 pb-2"
      data-bind="component: {name: FieldMap.Justification.components.edit, params: FieldMap.Justification}"
    ></div>
    <!-- /ko -->
  </div>
`;

  // src/servicetypes/diplomatic_passport/views/View.js
  var diplomaticPassportViewTemplate = html2`
  <div>
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: DocumentType.components.view, params: DocumentType}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: RequestType.components.view, params: RequestType}"
      ></div>
    </div>
    <!-- ko if: TypesSelected -->
    <div class="row row-cols-2" data-bind="using: FieldMap">
      <div
        class="col pb-2"
        data-bind="component: {name: JobTitle.components.view, params: JobTitle}"
      ></div>
      <div
        class="col pb-2"
        data-bind="component: {name: Grade.components.view, params: Grade}"
      ></div>
    </div>
    <h4>Travel Information</h4>
    <div class="row row-cols-2" data-bind="foreach: TravelFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
    <h4>Personal Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PersonalFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
    <!-- ko if: ShowPassportInfo -->
    <h4>Passport Information</h4>
    <div class="row row-cols-2" data-bind="foreach: PassportFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
    <!-- /ko -->
    <div
      class="col col-12 pb-2"
      data-bind="component: {name: FieldMap.Justification.components.view, params: FieldMap.Justification}"
    ></div>
    <!-- /ko -->
  </div>
`;

  // src/servicetypes/diplomatic_passport/DiplomaticPassportDetail.js
  var documentTypes = {
    Passport: "Passport",
    Visa: "Visa"
  };
  var requestTypes = {
    New: "New",
    Renewal: "Renewal"
  };
  var components2 = {
    view: "svc-diplomatic_passport-view",
    edit: "svc-diplomatic_passport-edit",
    new: "svc-diplomatic_passport-edit"
  };
  var DiplomaticPassportEditModule = class extends ConstrainedEntityEditModule {
    constructor(params) {
      super(params);
    }
    static name = components2.edit;
    static template = diplomaticPassportEditTemplate;
  };
  var DiplomaticPassportViewModule = class extends ConstrainedEntityViewModule {
    constructor(params) {
      super(params);
    }
    static name = components2.view;
    static template = diplomaticPassportViewTemplate;
  };
  registerComponentFromConstructor(DiplomaticPassportEditModule);
  registerComponentFromConstructor(DiplomaticPassportViewModule);
  var DiplomaticPassportVisa = class _DiplomaticPassportVisa extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    TypesSelected = ko.pureComputed(
      () => this.FieldMap.RequestType.Value() && this.FieldMap.DocumentType.Value()
    );
    ShowPassportInfo = ko.pureComputed(() => {
      const requestType = this.FieldMap.RequestType.Value();
      const documentType = this.FieldMap.DocumentType.Value();
      if (!requestType || !documentType) return false;
      if (documentType == documentTypes.Passport && requestType == requestTypes.New)
        return false;
      return true;
    });
    FieldMap = {
      ...this.FieldMap,
      DocumentType: new SelectField({
        displayName: "Document Type",
        options: Object.values(documentTypes),
        isRequired: true
      }),
      RequestType: new SelectField({
        displayName: "Request Type",
        options: Object.values(requestTypes),
        isRequired: true
      }),
      Grade: new TextField({
        displayName: "Grade/Rank",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      JobTitle: new TextField({
        displayName: "Job Title",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      DestinationCity: new TextField({
        displayName: "Destination City",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      DestinationCountry: new TextField({
        displayName: "Destination Country",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      Departure: new DateField({
        displayName: "Departure",
        type: dateFieldTypes.date,
        isRequired: true,
        Visible: this.TypesSelected
      }),
      Return: new DateField({
        displayName: "Return",
        type: dateFieldTypes.date,
        isRequired: true,
        Visible: this.TypesSelected
      }),
      BirthLocation: new TextField({
        displayName: "State/Country of Birth",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      DateOfBirth: new DateField({
        displayName: "Date of Birth",
        type: dateFieldTypes.date,
        isRequired: true,
        Visible: this.TypesSelected
      }),
      Gender: new TextField({
        displayName: "Gender",
        isRequired: true,
        Visible: this.TypesSelected
      }),
      PassportDateIssued: new DateField({
        displayName: "Issue Date (of most recent Passport)",
        type: dateFieldTypes.date,
        isRequired: true,
        Visible: this.ShowPassportInfo
      }),
      PassportDateExpiration: new DateField({
        displayName: "Expiration Date (of most recent Passport)",
        type: dateFieldTypes.date,
        isRequired: true,
        Visible: this.ShowPassportInfo
      }),
      FullName: new TextField({
        displayName: "Full Name (as it appears on passport)",
        isRequired: true,
        Visible: this.ShowPassportInfo
      }),
      PassportNum: new TextField({
        displayName: "Passport #",
        isRequired: true,
        Visible: this.ShowPassportInfo
      }),
      Justification: new TextAreaField({
        displayName: "Justification (if passport is expedited)",
        isRequired: false,
        width: 12,
        Visible: this.TypesSelected
      })
    };
    TravelFields = ko.pureComputed(() => [
      this.FieldMap.DestinationCountry,
      this.FieldMap.DestinationCity,
      this.FieldMap.Departure,
      this.FieldMap.Return
    ]);
    PersonalFields = ko.pureComputed(() => [
      this.FieldMap.DateOfBirth,
      this.FieldMap.BirthLocation,
      this.FieldMap.Gender
    ]);
    PassportFields = ko.pureComputed(() => [
      this.FieldMap.PassportDateIssued,
      this.FieldMap.PassportDateExpiration,
      this.FieldMap.FullName,
      this.FieldMap.PassportNum
    ]);
    components = components2;
    static Views = {
      All: ["ID", "Title"]
    };
    static ListDef = {
      name: "st_diplomatic_passport",
      title: "st_diplomatic_passport",
      fields: _DiplomaticPassportVisa.Views.All
    };
    static uid = "diplomatic_passport";
  };

  // src/servicetypes/fp_fiscal_irreg/views/Edit.js
  var fiscalIrregEditTemplate = html2`
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

  // src/servicetypes/fp_fiscal_irreg/FPFiscalIrregDetail.js
  var components3 = {
    ...defaultComponents,
    edit: "svc-fiscal-irreg-edit",
    new: "svc-fiscal-irreg-edit"
  };
  var FiscalIrregularitiesEditModule = class extends ConstrainedEntityEditModule {
    constructor(params) {
      super(params);
    }
    static name = components3.edit;
    static template = fiscalIrregEditTemplate;
  };
  registerComponentFromConstructor(FiscalIrregularitiesEditModule);
  var FiscalIrregularities = class extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    CaseNumber = new TextField({
      displayName: "Case Number",
      isRequired: false
    });
    PostLocation = new TextField({
      displayName: "Post Location",
      isRequired: true
    });
    PointOfContact = new PeopleField({
      displayName: "Point(s) of Contact",
      isRequired: true,
      multiple: true
    });
    CableMRN = new TextField({
      displayName: "Cable MRN",
      isRequired: false
    });
    CableDate = new DateField({
      displayName: "Cable Date",
      type: dateFieldTypes.date,
      isRequired: false
    });
    USDValue = new TextField({
      displayName: "US Dollar Value",
      isRequired: true,
      attr: { type: "number", min: "0" }
    });
    FIType = new SelectField({
      displayName: "Type of Irregularity",
      options: ["Shortage", "Overage"],
      isRequired: true
    });
    ShowShortageDocs = ko.pureComputed(() => {
      return this.USDValue.Value() && this.FIType.Value() == "Shortage";
    });
    FieldMap = {
      ...this.FieldMap,
      CaseNumber: this.CaseNumber,
      PostLocation: this.PostLocation,
      PointOfContact: this.PointOfContact,
      CableMRN: this.CableMRN,
      CableDate: this.CableDate,
      USDValue: this.USDValue,
      FIType: this.FIType
    };
    components = components3;
    static uid = "fp_fiscal_irreg";
  };

  // src/servicetypes/it_software/views/View.js
  var itSoftwareViewTemplate = html2`
  <div>
    <!-- ko if: ShowCreateProcurementButton -->
    <button
      type="button"
      class="btn btn-primary w-100"
      data-bind="click: createProcurement"
    >
      Create Procurement
    </button>
    <!-- /ko -->
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
  </div>
`;

  // src/servicetypes/it_software/ITSoftware.js
  var components4 = {
    ...defaultComponents,
    view: "svc-it_software-view"
  };
  var ITSoftwareViewModule = class extends ConstrainedEntityViewModule {
    constructor(params) {
      super(params);
    }
    static name = components4.view;
    static template = itSoftwareViewTemplate;
  };
  registerComponentFromConstructor(ITSoftwareViewModule);
  var ITSoftware = class _ITSoftware extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    ShowCreateProcurementButton = ko.pureComputed(() => {
      const itOrg = requestOrgStore2().find((org) => org.Title == "CGFS/EX/IT");
      return itOrg && currentUser()?.isInRequestOrg(itOrg);
    });
    createProcurement = async () => {
      let procurementDescription = "<ul>";
      Object.values(this.FieldMap).forEach((field) => {
        if (field) {
          procurementDescription += `<li>${field.displayName}: ${field.toString()}</li>`;
        }
      });
      procurementDescription += "</ul>";
      const procurementServiceTypeDef = serviceTypeStore().find(
        (service) => service.UID == "procurement"
      );
      const newRequest = new RequestEntity({
        ServiceType: procurementServiceTypeDef
      });
      newRequest.FieldMap.RequestDescription.set(procurementDescription);
      newRequest.FieldMap.RequestingOffice.set(
        this.Request.FieldMap.RequestingOffice.get()
      );
      const sourcePath = this.Request.getRelativeFolderPath();
      const targetPath = await newRequest.Attachments.createFolder();
      const _context = getAppContext();
      try {
        await _context.Attachments.CopyFolderContents(sourcePath, targetPath);
        newRequest.Attachments.refresh();
      } catch (e) {
        console.error("Error copying files: ", e);
      }
      window.WorkOrder.App.NewRequest({ request: newRequest });
    };
    CostThreshold = ko.pureComputed(
      () => parseInt(this.FieldMap.Cost.Value()) > 500
    );
    FieldMap = {
      ...this.FieldMap,
      Name: new TextField({
        displayName: "Software Name",
        isRequired: true
      }),
      Quantity: new TextField({
        displayName: "Quantity",
        isRequired: true
      }),
      POCName: new TextField({
        displayName: "POC",
        isRequired: true
      }),
      Cost: new TextField({
        displayName: "Cost (USD)",
        isRequired: true
      }),
      RequestType: new SelectField({
        displayName: "Request Type",
        options: ["New", "Maintenance Renewal"],
        isRequired: true
      }),
      PurchaseFrequency: new SelectField({
        displayName: "Purchase Frequency",
        options: ["One Time", "Recurring"],
        isRequired: this.CostThreshold
      }),
      ApprovedPurchase: new SelectField({
        displayName: "Approved Purchase",
        options: ["Yes", "No"],
        isRequired: this.CostThreshold
      }),
      FundingSource: new SelectField({
        displayName: "Funding Source",
        options: ["Project", "Contract", "Other"],
        isRequired: this.CostThreshold
      })
    };
    components = components4;
    static Views = {
      All: ["ID", "Title", "Request"]
    };
    static ListDef = {
      name: "st_it_software",
      title: "st_it_software",
      fields: _ITSoftware.Views.All
    };
    static uid = "it_software";
  };

  // src/servicetypes/property_space/views/Edit.js
  var propSpaceEditTemplate = html2`
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

  // src/servicetypes/property_space/views/View.js
  var propSpaceViewTemplate = html2`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
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

  // src/servicetypes/property_space/PropertySpaceDetail.js
  var components5 = {
    view: "svc-prop_space-view",
    edit: "svc-prop_space-edit",
    new: "svc-prop_space-edit"
  };
  var PropertySpaceEditModule = class extends ConstrainedEntityEditModule {
    constructor(params) {
      super(params);
    }
    static name = components5.edit;
    static template = propSpaceEditTemplate;
  };
  var PropertySpaceViewModule = class extends ConstrainedEntityViewModule {
    constructor(params) {
      super(params);
    }
    static name = components5.view;
    static template = propSpaceViewTemplate;
  };
  registerComponentFromConstructor(PropertySpaceEditModule);
  registerComponentFromConstructor(PropertySpaceViewModule);
  var PropertySpace = class _PropertySpace extends BaseServiceDetail {
    constructor(params) {
      super(params);
    }
    serviceTypes = {
      Property: "Property",
      Space: "Space"
    };
    // property logic
    propertySvcTypes = {
      Inventory: "Inventory Request",
      Move: "Property move from one space to another",
      Excess: "Property excess request",
      Loanable: "Loanable Property"
    };
    propertyTypeOptions = [
      "Backpack",
      "Computer Monitor",
      "Computer Speakers",
      "Headset",
      "Keyboard",
      "Mouse",
      "PIV Card Reader",
      "Web Camera"
    ];
    // Space Logic
    spaceSvcTypes = {
      Move: "Moving from one space to another",
      New: "Request for new office space"
    };
    ShowEndofLoanAlert = ko.pureComputed(() => {
      return this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property && this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Loanable;
    });
    FieldMap = {
      ...this.FieldMap,
      PropOrSpace: new SelectField({
        displayName: " Type",
        options: Object.values(this.serviceTypes),
        isRequired: true
      }),
      //Property
      PropRequestType: new SelectField({
        displayName: "Property Request Type",
        options: Object.values(this.propertySvcTypes),
        isRequired: true,
        Visible: ko.pureComputed(
          () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property
        )
      }),
      LocationChoice: new SelectField({
        displayName: "Location",
        options: ["On Premise", "Off Premise"],
        isRequired: true,
        Visible: ko.pureComputed(() => {
          return this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property && this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Inventory;
        })
      }),
      // Space
      SpaceRequestType: new SelectField({
        displayName: "Space Request Type",
        options: Object.values(this.spaceSvcTypes),
        isRequired: true,
        Visible: ko.pureComputed(
          () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space
        )
      }),
      NumberEmployees: new TextField({
        displayName: "Number of Employees",
        isRequired: true,
        Visible: ko.pureComputed(
          () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space && this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.New
        )
      }),
      Timeframe: new TextField({
        displayName: "New Location",
        isRequired: true,
        Visible: ko.pureComputed(
          () => this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Space
        )
      }),
      // Shared
      CurrentLocation: new TextField({
        displayName: "Current Location",
        isRequired: true,
        Visible: ko.pureComputed(() => {
          const svcType = this.FieldMap.PropOrSpace.Value();
          if (!svcType) return false;
          if (svcType == this.serviceTypes.Property) {
            return this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Move || this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Excess;
          }
          if (svcType == this.serviceTypes.Space) {
            return this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move;
          }
        })
      }),
      NewLocation: new TextField({
        displayName: "New Location",
        isRequired: true,
        Visible: ko.pureComputed(() => {
          const svcType = this.FieldMap.PropOrSpace.Value();
          if (!svcType) return false;
          if (svcType == this.serviceTypes.Property) {
            return this.FieldMap.PropRequestType.Value() == this.propertySvcTypes.Move;
          }
          if (svcType == this.serviceTypes.Space) {
            return this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move;
          }
        })
      }),
      NumberItems: new TextField({
        displayName: "Number of Items",
        isRequired: true,
        Visible: ko.pureComputed(() => {
          const svcType = this.FieldMap.PropOrSpace.Value();
          if (!svcType) return false;
          if (svcType == this.serviceTypes.Property)
            return this.FieldMap.PropRequestType.Value();
          return this.FieldMap.SpaceRequestType.Value() == this.spaceSvcTypes.Move;
        })
      }),
      // Property Bottom
      //TODO: Minor - This is using a single line of text instead of a lookup, formatting is weird
      PropertyType: new SelectField({
        displayName: "Type of Property",
        options: this.propertyTypeOptions,
        multiple: true,
        isRequired: true,
        Visible: ko.pureComputed(() => {
          return this.FieldMap.PropOrSpace.Value() == this.serviceTypes.Property && this.FieldMap.PropRequestType.Value();
        })
      })
    };
    components = components5;
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
        "PropertyType"
      ]
    };
    static ListDef = {
      name: "st_property_space",
      title: "st_property_space",
      fields: _PropertySpace.Views.All
    };
    static uid = "property_space";
  };

  // src/servicetypes/template/views/View.js
  var templateViewTemplate = html2`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.view, params: $data}"
      ></div>
    </div>
  </div>
`;

  // src/servicetypes/template/views/Edit.js
  var templateEditTemplate = html2`
  <div>
    <div class="row row-cols-2" data-bind="foreach: FormFields">
      <div
        class="col pb-2"
        data-bind="component: {name: components.edit, params: $data}"
      ></div>
    </div>
  </div>
`;

  // src/servicetypes/template/TemplateDetail.js
  var components6 = {
    view: "svc-template-view",
    edit: "svc-template-edit",
    new: "svc-template-edit"
  };
  var getApmOrg2 = ko.pureComputed(() => {
    return requestOrgStore2().find(
      (org) => org.Title.toUpperCase() == "CGFS/APMS"
    );
  });
  var TemplateRequestViewModule = class extends ConstrainedEntityViewModule {
    constructor(params) {
      super(params);
    }
    static name = components6.view;
    static template = templateViewTemplate;
  };
  var TemplateRequestEditModule = class extends ConstrainedEntityEditModule {
    constructor(params) {
      super(params);
    }
    static name = components6.edit;
    static template = templateEditTemplate;
  };
  registerComponentFromConstructor(TemplateRequestEditModule);
  registerComponentFromConstructor(TemplateRequestViewModule);
  var TemplateRequest = class _TemplateRequest extends BaseServiceDetail {
    constructor(entityParams) {
      super(entityParams);
    }
    /* A Service Type must define a fieldmap: 
      Each key corresponds to the SP Column system name
      Each Value should be a predefined field, or should 
      expose a get() and set() function that will be used to
      write and read the value from SharePoint. */
    FieldMap = {
      ...this.FieldMap,
      SamplePeople: new PeopleField({
        displayName: "Supervisor",
        isRequired: false
      }),
      SampleMultiPeople: new PeopleField({
        displayName: "Multiple People",
        isRequired: false,
        multiple: true
      }),
      SampleGroupPeople: new PeopleField({
        displayName: "Group People",
        isRequired: false
      }),
      SampleSelect: new SelectField({
        displayName: " Type",
        options: ["FTE", "Contractor"],
        isRequired: false
      }),
      SampleText: new TextField({
        displayName: "FullName",
        isRequired: false
      }),
      SampleTextArea: new TextAreaField({
        displayName: "NotificationDates",
        isRequired: false
      }),
      SampleDate: new DateField({
        displayName: "ExpirationDate",
        type: dateFieldTypes.date,
        isRequired: false
      }),
      SampleCheckbox: new CheckboxField({
        displayName: "SpecialOrder"
      }),
      SampleLookup: new LookupField({
        displayName: "Request Org",
        type: RequestOrg,
        lookupCol: "Title",
        Options: requestOrgStore2,
        isRequired: false,
        multiple: false
      }),
      SampleMultiLookup: new LookupField({
        displayName: "Service Types",
        type: ServiceType,
        lookupCol: "Title",
        Options: serviceTypeStore,
        isRequired: false,
        multiple: true
      })
    };
    components = components6;
    /* Optional views when querying the EntitySet. 
      By default, all declared columns are used.
      When a view is passed, only the specified columns are loaded. */
    static Views = {
      All: ["ID", "Title"]
    };
    static ListDef = {
      name: "st_template",
      title: "st_template",
      fields: _TemplateRequest.Views.All
    };
    static uid = "template";
  };

  // src/entities/ServiceType.js
  var getServiceDetailByUID = (uid) => {
    let result = null;
    for (const detail in servicetypes_exports) {
      if (servicetypes_exports[detail].uid == uid) {
        result = servicetypes_exports[detail];
        break;
      }
    }
    return result;
  };
  var serviceTypeStore = ko.observableArray();
  var ServiceType = class _ServiceType {
    constructor(serviceType) {
      this.ID = serviceType.ID;
      this.Title = serviceType.Title;
      this.LookupValue = serviceType.Title;
      this.Loaded = false;
      Object.assign(this, serviceType);
    }
    getRepositoryListName = () => `st_${this.UID}`;
    getListDef = () => {
      if (!this.HasTemplate) {
        return null;
      }
      const listName = this.getRepositoryListName();
      return { title: listName, name: listName };
    };
    _listRef = null;
    getListRef = () => {
      if (!this.HasTemplate) {
        return null;
      }
      if (!this._initialized) {
        throw new Error("Accessing constructor before initialization");
      }
      if (!this._listRef)
        this._listRef = ApplicationDbContext.Set(this._constructor);
      return this._listRef;
    };
    _constructor = null;
    instantiateEntity = async (requestContext) => {
      if (!this.HasTemplate || !this.UID) {
        return null;
      }
      if (!this._initialized) {
        await this.initializeEntity();
      }
      return this._constructor ? new this._constructor(requestContext) : null;
    };
    _initialized = false;
    initializeEntity = async () => {
      if (this._initialized) return;
      if (!this.HasTemplate || !this.UID) {
        return;
      }
      if (this._constructor) {
        console.warn("Service type was already initialized");
        this._initialized = true;
        return;
      }
      let serviceModule = null;
      try {
        serviceModule = getServiceDetailByUID(this.UID);
        if (!serviceModule) {
          console.error("Could not find service module", this);
        }
        this._constructor = serviceModule;
      } catch (e) {
        console.error("Cannot import service type module", e, this);
      } finally {
        this._initialized = true;
      }
    };
    // TODO: Minor - this should be in a servicetype manager service
    userCanInitiate = (user) => {
      if (!this.Active) return false;
      if (user.hasSystemRole(systemRoles.Admin)) return true;
      if (this.RequestingOrgs.length > 0) {
        return this.RequestingOrgs.find((ro) => user.isInRequestOrg(ro)) !== void 0;
      }
      return true;
    };
    attachmentsRequiredCntString = () => {
      if (!this.AttachmentsRequiredCnt) return "no";
      if (this.AttachmentsRequiredCnt < 0) return "multiple";
      return this.AttachmentsRequiredCnt;
    };
    static FindInStore = function(serviceType) {
      if (!serviceType || !serviceType.ID) return null;
      return serviceTypeStore().find((service) => service.ID == serviceType.ID);
    };
    // TODO: Major - ReportingRequestOrgs
    static Views = {
      All: [
        "ID",
        "Title",
        "Active",
        "HasTemplate",
        "DescriptionTitle",
        "DescriptionRequired",
        "DescriptionFieldInstructions",
        "Description",
        "Icon",
        "AttachmentsRequiredCnt",
        "AttachmentDescription",
        "DaysToCloseBusiness",
        "UID",
        "ReportingOrgs",
        "RequestingOrgs"
      ]
    };
    static ListDef = {
      name: "ConfigServiceTypes",
      title: "ConfigServiceTypes",
      fields: _ServiceType.Views.All
    };
  };

  // src/entities/RequestIngest.js
  var RequestIngest = class _RequestIngest extends ConstrainedEntity {
    constructor({ ID, Title }) {
      super();
      this.ID = ID;
      this.Title = Title;
      this.LookupValue = Title;
    }
    From = new TextField({
      displayName: "From"
    });
    To = new TextField({
      displayName: "To"
    });
    CC = new TextField({
      displayName: "CC"
    });
    Title = new TextField({
      displayName: "Subject"
    });
    Body = new TextAreaField({
      displayName: "Body",
      isRichText: true
    });
    FieldMap = {
      To: this.To,
      From: this.From,
      CC: this.CC,
      Title: this.Title,
      Body: this.Body
    };
    getStagedAttachmentsFolderPath = () => "Staged/" + this.ID;
    static Views = {
      All: ["ID", "Title", "From", "To", "CC", "Body"]
    };
    static ListDef = {
      name: "RequestIngest",
      title: "RequestIngest",
      fields: _RequestIngest.Views.All
    };
  };

  // src/infrastructure/ApplicationDbContext.js
  var DEBUG = false;
  var context = null;
  function CreateAppContext() {
    if (context) {
      return;
    }
    context = new ApplicationDbContext();
  }
  function getAppContext() {
    return context;
  }
  var virtualSets = /* @__PURE__ */ new Map();
  var ApplicationDbContext = class {
    constructor() {
    }
    Actions = new EntitySet(Action);
    Assignments = new EntitySet(Assignment);
    Attachments = new EntitySet(Attachment);
    Comments = new EntitySet(Comment);
    Notifications = new EntitySet(Notification);
    Requests = new EntitySet(RequestEntity);
    RequestIngests = new EntitySet(RequestIngest);
    ConfigHolidays = new EntitySet(Holiday);
    ConfigRequestOrgs = new EntitySet(RequestOrg);
    ConfigPipelines = new EntitySet(PipelineStage);
    ConfigServiceTypes = new EntitySet(ServiceType);
    static Set = (listDef) => {
      const key = listDef.name;
      if (!virtualSets.has(key)) {
        const newSet = new EntitySet(listDef);
        virtualSets.set(key, newSet);
        return newSet;
      }
      return virtualSets.get(key);
    };
  };
  var EntitySet = class {
    constructor(entityType) {
      if (!entityType.ListDef) {
        console.error("Missing entityType listdef for", entityType);
        return;
      }
      this.entityType = entityType;
      try {
        const allFieldsSet = /* @__PURE__ */ new Set();
        entityType.Views?.All?.map((field) => allFieldsSet.add(field));
        const newEntity = new this.entityType({ ID: null, Title: null });
        if (newEntity.FieldMap) {
          Object.keys(newEntity.FieldMap).map((field) => allFieldsSet.add(field));
        }
        this.AllDeclaredFields = [...allFieldsSet];
      } catch (e) {
        console.warn("Could not instantiate", entityType), console.warn(e);
        this.AllDeclaredFields = entityType.Views?.All ?? [];
      }
      this.ListDef = entityType.ListDef;
      this.Views = entityType.Views;
      this.Title = entityType.ListDef.title;
      this.Name = entityType.ListDef.name;
      this.ListRef = new SPList(entityType.ListDef);
      this.entityConstructor = this.entityType.FindInStore || this.entityType.Create || this.entityType;
    }
    // Queries
    // TODO: Feature - Queries should return options to read e.g. toList, first, toCursor
    FindById = async (id, fields = this.AllDeclaredFields) => {
      const result = await this.ListRef.findByIdAsync(id, fields);
      if (!result) return null;
      const newEntity = new this.entityType(result);
      mapObjectToEntity(result, newEntity);
      return newEntity;
    };
    /**
     * Takes an array of columns and filter values with an optional comparison operator
     * @param {[{column, op?, value}]} columnFilters
     * @param {*} param1
     * @param {*} param2
     * @param {*} fields
     * @param {*} includeFolders
     * @returns
     */
    FindByColumnValue = async (columnFilters, { orderByColumn, sortAsc }, { count = null }, fields = this.AllDeclaredFields, includeFolders = false) => {
      const returnCursor = count != null;
      count = count ?? 5e3;
      const results = await this.ListRef.findByColumnValueAsync(
        columnFilters,
        { orderByColumn, sortAsc },
        { count },
        fields,
        includeFolders
      );
      let cursor = {
        _next: results._next,
        results: results.results.map((item) => {
          const newEntity = new this.entityConstructor(item);
          mapObjectToEntity(item, newEntity);
          return newEntity;
        })
      };
      if (returnCursor) {
        return cursor;
      }
      const resultObj = {
        results: cursor.results
      };
      while (cursor._next) {
        cursor = await this.LoadNextPage(cursor);
        resultObj.results.concat(cursor.results);
      }
      return resultObj;
    };
    LoadNextPage = async (cursor) => {
      const results = await this.ListRef.loadNextPage(cursor);
      return {
        _next: results._next,
        results: results.results.map((item) => {
          const newEntity = new this.entityType(item);
          mapObjectToEntity(item, newEntity);
          return newEntity;
        })
      };
    };
    /**
     * Return all items in list
     */
    ToList = async (fields = this.Views.All) => {
      const results = await this.ListRef.getListItemsAsync({ fields });
      return results.map((item) => {
        const newEntity = new this.entityType(item);
        mapObjectToEntity(item, newEntity);
        return newEntity;
      });
    };
    LoadEntity = async function(entity) {
      if (!entity.ID) {
        console.error("entity missing Id", entity);
        return false;
      }
      const item = await this.ListRef.findByIdAsync(
        entity.ID,
        this.ListDef.fields
      );
      if (!item) {
        console.warn("ApplicationDbContext Could not find entity", entity);
        return false;
      }
      mapObjectToEntity(item, entity);
      return true;
    };
    // Mutators
    AddEntity = async function(entity, folderPath, request2 = null) {
      const creationfunc = mapEntityToObject.bind(this);
      const writeableEntity = creationfunc(entity);
      if (request2) {
        writeableEntity.Title = request2.Title;
        writeableEntity.Request = request2;
      }
      if (DEBUG) console.log(writeableEntity);
      const newId = await this.ListRef.createListItemAsync(
        writeableEntity,
        folderPath
      );
      mapObjectToEntity({ ID: newId }, entity);
      return;
    };
    UpdateEntity = async function(entity, fields = null) {
      const writeableEntity = mapEntityToObject.bind(this)(entity, fields);
      writeableEntity.ID = typeof entity.ID == "function" ? entity.ID() : entity.ID;
      if (DEBUG) console.log(writeableEntity);
      return this.ListRef.updateListItemAsync(writeableEntity);
    };
    RemoveEntity = async function(entity) {
      if (!entity.ID) return false;
      await this.ListRef.deleteListItemAsync(entity.ID);
      return true;
    };
    // Permissions
    SetItemPermissions = async function(entityId, valuePairs, reset = false) {
      const salValuePairs = valuePairs.filter((vp) => vp[0] && vp[1]).map((vp) => [vp[0].getKey(), vp[1]]);
      return this.ListRef.setItemPermissionsAsync(entityId, salValuePairs, reset);
    };
    GetItemPermissions = function(id) {
      return this.ListRef.getItemPermissionsAsync(id);
    };
    // Folder Methods
    GetFolderUrl = function(relFolderPath = "") {
      return this.ListRef.getServerRelativeFolderPath(relFolderPath);
    };
    GetItemsByFolderPath = async function(folderPath, fields = this.AllDeclaredFields) {
      const results = await this.ListRef.getFolderContentsAsync(
        folderPath,
        fields
      );
      return results.map((result) => {
        const newEntity = new this.entityType(result);
        mapObjectToEntity(result, newEntity);
        return newEntity;
      });
    };
    UpsertFolderPath = async function(folderPath) {
      return this.ListRef.upsertFolderPathAsync(folderPath);
    };
    DeleteFolderByPath = function(folderPath) {
      return this.ListRef.deleteFolderByPathAsync(folderPath);
    };
    // Permissions
    SetFolderReadOnly = async function(relFolderPath) {
      return this.ListRef.setFolderReadonlyAsync(relFolderPath);
    };
    SetFolderPermissions = async function(folderPath, valuePairs, reset = true) {
      const salValuePairs = valuePairs.filter((vp) => vp[0] && vp[1]).map((vp) => [vp[0].getKey(), vp[1]]);
      return this.ListRef.setFolderPermissionsAsync(
        folderPath,
        salValuePairs,
        reset
      );
    };
    EnsureFolderPermissions = async function(relFolderPath, valuePairs) {
      const salValuePairs = valuePairs.filter((vp) => vp[0] && vp[1]).map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
      return this.ListRef.ensureFolderPermissionsAsync(
        relFolderPath,
        salValuePairs
      );
    };
    // Other Functions
    UploadFileToFolderAndUpdateMetadata = async function(file, filename, folderPath, updates, progress) {
      const itemId = await this.ListRef.uploadFileToFolderAndUpdateMetadata(
        file,
        filename,
        folderPath,
        updates,
        progress
      );
      const item = await this.ListRef.getById(itemId, this.AllDeclaredFields);
      const newEntity = new this.entityConstructor(item);
      mapObjectToEntity(item, newEntity);
      return newEntity;
    };
    UploadNewDocument = async function(folderPath, args) {
      return this.ListRef.uploadNewDocumentAsync(
        folderPath,
        "Attach a New Document",
        args
      );
    };
    CopyFolderContents = async function(sourceFolder, targetFolder) {
      return this.ListRef.copyFilesAsync(sourceFolder, targetFolder);
    };
    // Form Methods
    ShowForm = async function(name, title, args) {
      return new Promise(
        (resolve, reject2) => this.ListRef.showModal(name, title, args, resolve)
      );
    };
    EnsureList = async function() {
    };
  };
  function mapObjectToEntity(inputObject, targetEntity) {
    if (!inputObject || !targetEntity) return;
    Object.keys(inputObject).forEach((key) => {
      mapValueToEntityProperty(key, inputObject[key], targetEntity);
    });
  }
  function mapValueToEntityProperty(propertyName, inputValue, targetEntity) {
    if (targetEntity.FieldMap && targetEntity.FieldMap[propertyName]) {
      mapObjectToViewField(inputValue, targetEntity.FieldMap[propertyName]);
      return;
    }
    if (targetEntity[propertyName] && typeof targetEntity[propertyName] == "function") {
      targetEntity[propertyName](inputValue);
      return;
    }
    targetEntity[propertyName] = inputValue;
    return;
  }
  function mapObjectToViewField(inVal, fieldMap) {
    if (typeof fieldMap == "function") {
      fieldMap(inVal);
      return;
    }
    if (typeof fieldMap != "object") {
      fieldMap = inVal;
      return;
    }
    if (fieldMap.set && typeof fieldMap.set == "function") {
      fieldMap.set(inVal);
      return;
    }
    if (fieldMap.obs) {
      if (!inVal) {
        fieldMap.obs(null);
        return;
      }
      const outVal = Array.isArray(inVal) ? inVal.map((item) => generateObject(item, fieldMap)) : generateObject(inVal, fieldMap);
      fieldMap.obs(outVal);
      return;
    }
    fieldMap = inVal;
  }
  function generateObject(inVal, fieldMap) {
    return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
  }
  function mapEntityToObject(input, selectedFields = null) {
    const entity = {};
    const allWriteableFieldsSet = /* @__PURE__ */ new Set([]);
    if (this?.ListDef?.fields) {
      this.ListDef.fields.forEach((field) => allWriteableFieldsSet.add(field));
    }
    if (input.FieldMap) {
      Object.keys(input.FieldMap).forEach(
        (field) => allWriteableFieldsSet.add(field)
      );
    }
    const allWriteableFields = [...allWriteableFieldsSet];
    const fields = selectedFields ?? (input.FieldMap ? Object.keys(input.FieldMap) : null) ?? Object.keys(input);
    fields.filter((field) => allWriteableFields.includes(field)).map((field) => {
      if (input.FieldMap && input.FieldMap[field]) {
        entity[field] = mapViewFieldToValue(input.FieldMap[field]);
        return;
      }
      entity[field] = input[field];
    });
    return entity;
  }
  function mapViewFieldToValue(fieldMap) {
    if (typeof fieldMap == "function") {
      return fieldMap();
    }
    if (fieldMap.get && typeof fieldMap.get == "function") {
      return fieldMap.get();
    }
    if (fieldMap.obs) {
      return fieldMap.obs();
    }
    return fieldMap;
  }

  // src/components/ActivityLogComponent.js
  var ActivityLogComponent = class {
    constructor({ addNew, refresh, list, AreLoading }, activityQueue) {
      activityQueue.subscribeAdded(this.activityQueueWatcher);
      this.addNew = addNew;
      this.refresh = refresh;
      this.Actions = list.All;
      this.AreLoading = AreLoading;
    }
    activityQueueWatcher = (activities) => {
      activities.map(({ activity, data: data2 }) => {
        if (this.actionTypeFunctionMap[activity]) {
          this.actionTypeFunctionMap[activity](data2);
        }
      });
    };
    actionTypeFunctionMap = {
      Assigned: this.assignmentAdded.bind(this),
      Unassigned: this.assignmentRemoved.bind(this),
      Created: this.requestCreated.bind(this),
      Advanced: this.requestAdvanced.bind(this),
      Approved: this.requestApproved.bind(this),
      Rejected: this.requestRejected.bind(this),
      Paused: this.requestPaused.bind(this),
      Resumed: this.requestResumed.bind(this),
      Closed: this.requestClosed.bind(this)
    };
    async requestCreated(request2) {
      this.addNew({
        ActionType: actionTypes.Created,
        Description: `The request was submitted with an effective submission date of ${request2.Dates.Submitted.toLocaleDateString()}.`
      });
    }
    async requestAdvanced(stage) {
      this.addNew({
        ActionType: actionTypes.Advanced,
        Description: `The request was advanced to stage ${stage.Step}: ${stage.Title}.`
      });
    }
    requestPaused(reason) {
      this.addNew({
        ActionType: actionTypes.Paused,
        Description: reason
      });
    }
    requestResumed() {
      this.addNew({
        ActionType: actionTypes.Resumed,
        Description: "Request clock has been resumed"
      });
    }
    async requestClosed(request2) {
      this.addNew({
        ActionType: actionTypes.Closed,
        Description: `The request was closed with a status of ${request2.State.Status()}.`
      });
    }
    async assignmentCompleted(assignment) {
      let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
      this.addNew({
        ActionType: assignment.Status,
        Description: actionDescription
      });
    }
    async requestApproved(assignment) {
      let actionDescription = `${assignment.ActionTaker.Title} has ${assignment.Status} an assignment.`;
      this.addNew({
        ActionType: actionTypes.Approved,
        Description: actionDescription
      });
    }
    async requestRejected(assignment) {
      let actionDescription = `${assignment.ActionTaker.Title} has rejected the request and provided the following reason:<br/>` + assignment.Comment;
      this.addNew({
        ActionType: actionTypes.Rejected,
        Description: actionDescription
      });
    }
    async assignmentAdded(assignment) {
      let actionDescription = `The following ${assignment.Role.LookupValue}s have been assigned to this request:<br>`;
      if (assignment.Assignee?.Title) {
        actionDescription += `${assignment.Assignee.Title} - `;
      }
      actionDescription += assignment.RequestOrg?.Title;
      this.addNew({
        ActionType: actionTypes.Assigned,
        Description: actionDescription
      });
    }
    async assignmentRemoved(assignment) {
      let actionDescription = `The following ${assignment.Role.LookupValue ?? assignment.Role}s have been removed from this request:<br>`;
      if (assignment.Assignee?.Title) {
        actionDescription += `${assignment.Assignee.Title} - `;
      }
      actionDescription += assignment.RequestOrg?.Title;
      this.addNew({
        ActionType: actionTypes.Unassigned,
        Description: actionDescription
      });
    }
  };

  // src/common/DateUtilities.js
  function businessDaysFromDate(date, businessDays) {
    var counter = 0, tmp = new Date(date);
    var dayCnt = Math.abs(businessDays);
    var sign = Math.sign(businessDays);
    while (dayCnt >= 0) {
      tmp.setTime(date.getTime() + sign * counter * 864e5);
      if (isBusinessDay(tmp) && !isConfigHoliday(tmp)) {
        --dayCnt;
      }
      ++counter;
    }
    return tmp;
  }
  function calculateBusinessDays(startDate, endDate) {
    var counter = 0;
    var temp = new Date(startDate);
    var stepDir = Math.sign(endDate - startDate);
    while (temp.format("yyyy-MM-dd") != endDate.format("yyyy-MM-dd")) {
      if (isBusinessDay(temp) && !isConfigHoliday(temp)) {
        counter++;
      }
      temp.setDate(temp.getDate() + 1 * stepDir);
    }
    return counter * stepDir;
  }
  function isConfigHoliday(date) {
    var isHoliday = holidayStore().find(function(hol) {
      var day = hol.Date.getUTCDate() == date.getUTCDate();
      var month = hol.Date.getUTCMonth() == date.getUTCMonth();
      var year = hol.Date.getUTCFullYear() == date.getUTCFullYear();
      if (hol.Repeating) {
        year = true;
      }
      return day && month && year;
    });
    return isHoliday;
  }
  function isBusinessDay(date) {
    var dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    const holidays = [
      "12/31+5",
      // New Year's Day on a saturday celebrated on previous friday
      "1/1",
      // New Year's Day
      "1/2+1",
      // New Year's Day on a sunday celebrated on next monday
      "1-3/1",
      // Birthday of Martin Luther King, third Monday in January
      "2-3/1",
      // Washington's Birthday, third Monday in February
      "5~1/1",
      // Memorial Day, last Monday in May
      "7/3+5",
      // Independence Day
      "7/4",
      // Independence Day
      "7/5+1",
      // Independence Day
      "9-1/1",
      // Labor Day, first Monday in September
      "10-2/1",
      // Columbus Day, second Monday in October
      "11/10+5",
      // Veterans Day
      "11/11",
      // Veterans Day
      "11/12+1",
      // Veterans Day
      "11-4/4",
      // Thanksgiving Day, fourth Thursday in November
      "12/24+5",
      // Christmas Day
      "12/25",
      // Christmas Day
      "12/26+1"
      // Christmas Day
    ];
    var dayOfMonth = date.getDate(), month = date.getMonth() + 1, monthDay = month + "/" + dayOfMonth;
    if (holidays.indexOf(monthDay) > -1) {
      return false;
    }
    var monthDayDay = monthDay + "+" + dayOfWeek;
    if (holidays.indexOf(monthDayDay) > -1) {
      return false;
    }
    var weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1, monthWeekDay = month + "-" + weekOfMonth + "/" + dayOfWeek;
    if (holidays.indexOf(monthWeekDay) > -1) {
      return false;
    }
    var lastDayOfMonth = new Date(date);
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    var negWeekOfMonth = Math.floor((lastDayOfMonth.getDate() - dayOfMonth - 1) / 7) + 1, monthNegWeekDay = month + "~" + negWeekOfMonth + "/" + dayOfWeek;
    if (holidays.indexOf(monthNegWeekDay) > -1) {
      return false;
    }
    return true;
  }

  // src/common/Router.js
  var appRoot = webRoot;
  var state = {};
  window.history.replaceState({}, "", document.location.href);
  function setUrlParam(param, newVal) {
    if (getUrlParam(param) == newVal) return;
    const search = window.location.search;
    const regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    const query = search.replace(regex, "$1").replace(/&$/, "");
    const urlParams = (query.length > 2 ? query + "&" : "?") + (newVal ? param + "=" + newVal : "");
    state[param] = newVal;
    window.history.pushState(state, "", urlParams.toString());
  }
  function getUrlParam(param) {
    const results = new RegExp("[?&]" + param + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  }

  // src/infrastructure/Notifications.js
  var requestActionTypeFunctionMap = {
    Created: requestCreatedNotification,
    Advanced: requestAdvancedNotification,
    Assigned: requestAssignedNotification,
    Closed: requestClosedNotification
  };
  async function emitCommentNotification(comment, request2) {
    const toArray = [request2.RequestorInfo.Requestor(), currentUser()];
    const ccArray = [];
    request2.Assignments.list.All().filter((asg) => asg.PipelineStage?.ID == request2.Pipeline.Stage()?.ID).map((asg) => {
      if (asg.Assignee?.LoginName) toArray.push(asg.Assignee);
      ccArray.push(asg.RequestOrg);
    });
    const notification = {
      To: toArray,
      CC: ccArray,
      Request: request2,
      Title: formatNotificationTitle(request2, "New Comment"),
      Body: `${currentUser().Title} has left a new comment on ${request2.getAppLinkElement()}:<br/><br/>`
    };
    await createNotification(notification, request2.getRelativeFolderPath());
  }
  function emitRequestNotification(request2, action) {
    if (window.DEBUG) {
      console.log("Sending Notification: ", action);
      console.log("for request: ", request2);
    }
    if (requestActionTypeFunctionMap[action.activity]) {
      requestActionTypeFunctionMap[action.activity](request2, action);
    }
  }
  async function requestCreatedNotification(request2) {
    if (window.DEBUG)
      console.log("Sending Request Created Notification for: ", request2);
    const actionOffices = [
      ...new Set(
        request2.Pipeline.RequestOrgs()?.map((requestOrg) => requestOrg.Title)
      )
    ];
    let actionOfficeLiString = "";
    actionOffices.forEach((office) => {
      actionOfficeLiString += `<li>${office}</li>`;
    });
    const submitterNotification = {
      To: [request2.RequestorInfo.Requestor(), currentUser()],
      Title: formatNotificationTitle(request2, `New`),
      Body: `<p>Your ${request2.RequestType.Title} request has been successfully submitted.</p><p>${request2.getAppLinkElement()}</p><p>Estimated days to close this request type: ` + request2.RequestType.DaysToCloseBusiness + "</p><p>This request will be serviced by:</br><ul>" + actionOfficeLiString + "</ul></p><p>To view the request, please click the link above, or copy and paste the below URL into your browser:</br>" + request2.getAppLink(),
      Request: request2
    };
    await createNotification(
      submitterNotification,
      request2.getRelativeFolderPath()
    );
    const requestOrgNotification = {
      To: request2.Pipeline.RequestOrgs()?.map(
        (requestOrg) => RequestOrg.FindInStore(requestOrg)
      ),
      Title: formatNotificationTitle(request2, `New`),
      Body: "<p>Greetings Colleagues,<br><br> A new service request has been opened requiring your attention:<br>" + request2.getAppLinkElement() + "</p><p>Estimated days to close this request type: " + request2.RequestType.DaysToCloseBusiness + "</p><p>This request will be serviced by:</br><ul>" + actionOfficeLiString + "</ul></p><p>To view the request, please click the link above, or copy and paste the below URL into your browser:</br>" + request2.getAppLink(),
      Request: request2
    };
    await createNotification(
      requestOrgNotification,
      request2.getRelativeFolderPath()
    );
  }
  function requestAdvancedNotification(request2) {
    if (window.DEBUG)
      console.log("Sending Request Advanced Notification for: ", request2);
  }
  async function requestAssignedNotification(request2, action) {
    if (window.DEBUG)
      console.log("Sending Request Assigned Notification for: ", request2);
    if (window.DEBUG) console.log(action);
    const role = action.data?.Role?.LookupValue;
    let roleBasedMessage = "";
    switch (role) {
      case assignmentRoles.Subscriber:
      case assignmentRoles.Viewer:
        roleBasedMessage = "<p>This notification was generated for information purposes only. You have no pending actions on this request.</p>";
        break;
      default:
    }
    const assignedNotification = {
      Title: formatNotificationTitle(request2, "Assigned"),
      Body: `<p>Greetings Colleagues,<br><br>You have been assigned the role of       <strong>${role}</strong> on the following       request:<br>` + request2.getAppLinkElement() + "</p>" + roleBasedMessage + "<p>To view the request, please click the link above,       or copy and paste the below URL into your browser: <br> " + request2.getAppLink() + "</p>",
      Request: request2
    };
    const assignee = action.data?.Assignee;
    const assignedReqOrg = RequestOrg.FindInStore(action.data?.RequestOrg);
    if (assignee?.ID != assignedReqOrg?.UserGroup.ID) {
      assignedNotification.To = [assignee];
      assignedNotification.CC = [assignedReqOrg];
    } else {
      assignedNotification.To = [assignedReqOrg];
    }
    await createNotification(
      assignedNotification,
      request2.getRelativeFolderPath()
    );
  }
  async function requestClosedNotification(request2, action) {
    if (window.DEBUG)
      console.log("Sending Request Closed Notification for: ", request2);
    const closedNotification = {
      To: [request2.RequestorInfo.Requestor()],
      Title: formatNotificationTitle(request2, "Closed " + request2.State.Status()),
      Body: `<p>Greetings Colleagues,<br><br>The following request has been ${request2.State.Status()}:<br>` + request2.getAppLinkElement() + "</p><p>This request cannot be re-opened.</p>",
      Request: request2
    };
    await createNotification(closedNotification, request2.getRelativeFolderPath());
  }
  async function createNotification(notification, relFolderPath) {
    const context2 = getAppContext();
    notification.ToString = emailStringMapper(notification.To);
    notification.To = entityPeopleMapper(notification.To);
    notification.CCString = emailStringMapper(notification.CC);
    notification.CC = entityPeopleMapper(notification.CC);
    notification.BCCString = emailStringMapper(notification.BCC);
    notification.BCC = entityPeopleMapper(notification.BCC);
    await context2.Notifications.AddEntity(notification, relFolderPath);
  }
  function entityPeopleMapper(entityArr) {
    return entityArr?.filter((entity) => !entity.PreferredEmail)?.map((entity) => {
      if (entity.UserGroup) return entity.UserGroup;
      if (entity.OrgType) {
        console.warn("Trying to email RequestOrg!");
        return;
      }
      return entity;
    });
  }
  function emailStringMapper(entityArr) {
    return entityArr?.filter((entity) => entity.PreferredEmail)?.map((entity) => entity.PreferredEmail).join(";");
  }
  function formatNotificationTitle(request2, content) {
    return `${siteTitle} -${content}- ${request2.RequestType.Title} - ${request2.Title}`;
  }

  // src/stores/Tasks.js
  var runningTasks = ko.observableArray();
  var blockingTasks = ko.pureComputed(() => {
    return runningTasks().filter((task) => task.IsBlocking()) ?? [];
  });
  var taskDefs = {
    init: { msg: "Initializing the Application", blocking: true },
    save: { msg: "Saving Request", blocking: true },
    cancelAction: { msg: "Cancelling Action", blocking: true },
    view: { msg: "Viewing Request", blocking: false },
    refresh: { msg: "Refreshing Request", blocking: false },
    permissions: { msg: "Updating Request Item Permissions", blocking: true },
    lock: { msg: "Locking Request", blocking: true },
    closing: { msg: "Closing Request", blocking: true },
    pipeline: { msg: "Progressing to Next Stage", blocking: true },
    newComment: { msg: "Submitting Comment", blocking: false },
    refreshComments: { msg: "Refreshing Comments", blocking: false },
    notifyComment: { msg: "Sending Comment Email", blocking: false },
    removeComment: { msg: "Removing Comment", blocking: false },
    newAction: { msg: "Submitting Action", blocking: false },
    refreshActions: { msg: "Refreshing Actions", blocking: false },
    newAttachment: { msg: "Submitting Attachment", blocking: false },
    uploadAttachment: (fileName) => {
      return {
        msg: `Uploading Attachment: ` + fileName,
        blocking: true,
        type: ProgressTask
      };
    },
    refreshAttachments: { msg: "Refreshing Attachments", blocking: false },
    approve: { msg: "Approving Request", blocking: true }
  };
  var addTask = (taskDef) => {
    const newTask = taskDef.type ? new taskDef.type(taskDef) : new Task(taskDef);
    runningTasks.push(newTask);
    return newTask;
  };
  var finishTask = function(activeTask) {
    if (activeTask) {
      activeTask.markComplete();
      window.setTimeout(() => removeTask(activeTask), 3e3);
    }
  };
  var removeTask = function(taskToRemove) {
    runningTasks.remove(taskToRemove);
  };

  // src/infrastructure/RequestsByStatusSet.js
  var RequestsByStatusSet = class {
    constructor(status, includeAssignments) {
      this.includeAssignments = includeAssignments;
      this.filter = status;
    }
    IsLoading = ko.observable();
    HasLoaded = ko.observable(false);
    List = ko.observableArray();
    load = async () => {
      this.IsLoading(true);
      const start = /* @__PURE__ */ new Date();
      const requestsByStatus = await getAppContext().Requests.FindByColumnValue(
        [{ column: "RequestStatus", value: this.filter }],
        { orderByColumn: "Title", sortAsc: false },
        {},
        RequestEntity.Views.ByStatus,
        false
      );
      const requests = requestsByStatus.results;
      if (this.includeAssignments) {
        requests.map((request2) => request2.Assignments.refresh());
      }
      this.List(requests);
      const end = /* @__PURE__ */ new Date();
      if (window.DEBUG)
        console.log(
          `Request by status Set - ${this.filter}: ${requests.length} cnt in ${end - start}`
        );
      this.HasLoaded(true);
      this.IsLoading(false);
    };
    init = async () => {
      if (this.HasLoaded()) {
        return;
      }
      if (this.IsLoading()) {
        return new Promise((resolve, reject2) => {
          this.isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
            this.isLoadingSubscription.dispose();
            resolve();
          });
        });
      }
      await this.load();
    };
    dispose() {
      if (this.isLoadingSubscription) this.isLoadingSubscription.dispose();
    }
    includeAssignments = async () => {
    };
  };

  // src/stores/Requests.js
  var requestsByStatusMap = /* @__PURE__ */ new Map();
  requestsByStatusMap.set(
    requestStates.open,
    new RequestsByStatusSet(requestStates.open, true)
  );
  requestsByStatusMap.set(
    requestStates.fulfilled,
    new RequestsByStatusSet(requestStates.fulfilled)
  );
  requestsByStatusMap.set(
    requestStates.cancelled,
    new RequestsByStatusSet(requestStates.cancelled)
  );
  requestsByStatusMap.set(
    requestStates.rejected,
    new RequestsByStatusSet(requestStates.rejected)
  );
  var requestIngests = ko.observableArray();

  // src/views/RequestDetailView.js
  var DisplayModes = {
    New: "New",
    Edit: "Edit",
    View: "View"
  };
  var reqHeaderComponentsMap = {
    New: "request-header-edit",
    View: "request-header-view",
    Edit: "request-header-edit"
  };
  var reqBodyComponentsMap = {
    New: "request-body-edit",
    View: "request-body-view",
    Edit: "request-body-edit"
  };
  var RequestDetailView = class {
    /************************************************************************
        RequestDetail Component Specific Items
    ************************************************************************/
    refreshAll = async () => {
      await this.request.refreshAll();
    };
    Request = ko.observable();
    get request() {
      return this.Request();
    }
    DisplayModes = DisplayModes;
    DisplayMode = ko.observable();
    HeaderComponentName = ko.pureComputed(() => {
      return reqHeaderComponentsMap[this.DisplayMode()];
    });
    BodyComponentName = ko.pureComputed(() => {
      return reqBodyComponentsMap[this.DisplayMode()];
    });
    ShowActionsArea = ko.pureComputed(
      () => this.request.State.IsActive() && !this.request.IsLoading() && !this.request.Assignments.AreLoading() && this.request.Assignments.CurrentStage.list.UserActionAssignments().length
    );
    ShowCloseArea = ko.pureComputed(() => {
      return !this.request.IsLoading() && !this.request.Assignments.AreLoading() && this.request.Authorization.currentUserCanClose();
    });
    newComment = {
      input: new TextAreaField({
        displayName: "Please provide additional comments/instructions here",
        instructions: null,
        isRichText: true
      }),
      submit: async () => {
        const comment = {
          Comment: this.newComment.input.Value()
        };
        await this.request.Comments.addNew(comment);
        this.newComment.input.Value("");
      }
    };
    submitNewRequest = async () => {
      if (!this.request.Validation.validate()) return;
      const serviceType = this.request.RequestType;
      if (!serviceType) {
        throw "no service type provided";
      }
      const saveTask = addTask(taskDefs.save);
      this.DisplayMode(DisplayModes.View);
      this.request.DisplayMode(DisplayModes.View);
      this.request.State.Status(requestStates.open);
      const folderPath = this.request.getRelativeFolderPath();
      createFolders: {
        const breakingPermissionsTask = addTask(taskDefs.permissions);
        const folderPerms = this.request.getFolderPermissions();
        const listRefs = this.request.getInitialListRefs();
        const hasStagedAttachments = this.request.Attachments.list.All().length;
        if (hasStagedAttachments) listRefs.push(this._context.Attachments);
        await Promise.all(
          listRefs.map(async (listRef) => {
            const folderId = await listRef.UpsertFolderPath(folderPath);
            if (!folderId) {
              alert(`Could not create ${listRef.Title} folder ` + folderPath);
              return;
            }
            const result = await listRef.SetFolderPermissions(
              folderPath,
              folderPerms
            );
          })
        );
        finishTask(breakingPermissionsTask);
        if (hasStagedAttachments) {
          const stagingFolderPath = this.request.getRelativeFolderPathStaging();
          await this._context.Attachments.CopyFolderContents(
            stagingFolderPath,
            folderPath
          );
          await this._context.Attachments.DeleteFolderByPath(stagingFolderPath);
        }
      }
      const effectiveSubmissionDate = this.request.calculateEffectiveSubmissionDate();
      this.request.Dates.Submitted.set(effectiveSubmissionDate);
      this.request.Dates.EstClosed.set(
        businessDaysFromDate(
          effectiveSubmissionDate,
          serviceType.DaysToCloseBusiness
        )
      );
      this.request.RequestOrgs(
        this.request.Pipeline.Stages().filter((stage) => null != stage.RequestOrg).map((stage) => stage.RequestOrg)
      );
      this.request.State.InternalStatus(requestInternalStates.inProgress);
      this.request.State.IsActive(true);
      createItems: {
        await this._context.Requests.AddEntity(this.request, folderPath);
      }
      setUrlParam("reqId", this.request.Title);
      this.request.ActivityQueue.push({
        activity: actionTypes.Created,
        data: this.request
      });
      this.request.Pipeline.advance();
      this.request.Validation.reset();
      this.request.LoadedAt(/* @__PURE__ */ new Date());
      const openrequests = requestsByStatusMap.get(requestStates.open);
      openrequests.List.push(this.request);
      finishTask(saveTask);
    };
    editRequestHandler = async () => {
      this.DisplayMode(DisplayModes.Edit);
    };
    updateRequestHandler = async () => {
      this.DisplayMode(DisplayModes.View);
    };
    cancelChangesHandler = async () => {
      this.refreshAll();
      this.DisplayMode(DisplayModes.View);
    };
    promptClose = () => {
      if (confirm("Close and finalize request? This action cannot be undone!")) {
        this.request.closeAndFinalize(requestStates.fulfilled);
      }
    };
    promptFulfill = () => {
      if (this.request.Pipeline.Stage().ActionType == stageActionTypes.Closed && confirm("Close and finalize request? This action cannot be undone!")) {
        this.request.closeAndFinalize(requestStates.fulfilled);
        return;
      }
      const openSteps = this.request.Pipeline.Stages().length - this.request.Pipeline.Stage()?.Step;
      if (openSteps && confirm(
        `This request still has ${openSteps} open steps! Are you sure you want to close and finalize it? This action cannot be undone!`
      )) {
        this.request.closeAndFinalize(requestStates.fulfilled);
        return;
      }
    };
    promptCancel = () => {
      if (confirm("Cancel request? This action cannot be undone!")) {
        this.request.closeAndFinalize(requestStates.cancelled);
      }
    };
    pauseOptions = Object.entries(requestInternalStates).filter(([key, value]) => value != requestInternalStates.inProgress).map(([key, value]) => {
      return { key, value };
    });
    pauseReason = ko.observable();
    showPause = ko.pureComputed(() => {
      return this.request.State.Status() == requestStates.open && this.request.State.InternalStatus() == requestInternalStates.inProgress;
    });
    clickPause = () => {
      const reason = this.pauseReason();
      this.pauseReason(null);
      this.request.pauseRequest(reason);
    };
    showResume = ko.pureComputed(() => {
      return this.request.State.IsPaused();
    });
    clickResume = () => {
      this.request.resumeRequest();
    };
    validationWatcher = (isValid) => {
      if (isValid && this.request.Authorization.currentUserCanAdvance() && !this.request.Assignments.CurrentStage.list.InProgress().length) {
        this.promptAdvance();
      }
    };
    nextStageHandler = () => {
      if (!this.request.Assignments.CurrentStage.list.InProgress().length) {
        this.request.Pipeline.advance();
        return;
      }
      this.promptAdvance();
    };
    promptAdvanceModal;
    promptAdvance = () => {
      if (!this.promptAdvanceModal) {
        this.promptAdvanceModal = new bootstrap.Modal(
          document.getElementById("modal-advance-request"),
          {}
        );
      }
      this.promptAdvanceModal.show();
    };
    confirmAdvanceHandler = () => {
      if (!this.request.Pipeline.getNextStage()) {
        this.promptClose();
        this.promptAdvanceModal.hide();
        return;
      }
      this.request.Pipeline.advance();
      this.promptAdvanceModal.hide();
    };
    approveRequestHandler = () => {
      this.approveRequest();
    };
    async approveRequest() {
      this.promptAdvance();
    }
    serviceTypeDefinitionWatcher = (newSvcType) => {
    };
    createNewRequest = async ({ request: request2 }) => {
      const { Requestor, Phone, Email, OfficeSymbol } = request2.RequestorInfo;
      if (!Requestor()) Requestor(new People(currentUser()));
      if (!Phone()) Phone(currentUser().WorkPhone);
      if (!Email()) Email(currentUser().EMail);
      if (!OfficeSymbol.get()) OfficeSymbol.set(currentUser().OfficeSymbol);
      const { Status, InternalStatus, IsActive } = request2.State;
      if (!Status()) Status(requestStates.draft);
      if (!InternalStatus()) InternalStatus(requestStates.draft);
      if (!IsActive()) IsActive(true);
      request2.LoadedAt(/* @__PURE__ */ new Date());
      request2.Validation.IsValid.subscribe(this.validationWatcher);
      this.Request(request2);
      this.DisplayMode(DisplayModes.New);
    };
    viewRequest = ({ request: request2 }) => {
      request2.Validation.IsValid.subscribe(this.validationWatcher);
      this.Request(request2);
      this.DisplayMode(DisplayModes.View);
      this.refreshAll();
    };
    constructor() {
      this._context = getAppContext();
    }
  };

  // src/entities/Request.js
  var requestStateClasses = {
    Draft: "text-bg-info",
    Open: "text-bg-primary",
    Paused: "text-bg-warning",
    "In Progress": "text-bg-primary",
    Completed: "text-bg-success",
    Cancelled: "text-bg-warning",
    Rejected: "text-bg-danger"
  };
  var RequestEntity = class _RequestEntity {
    constructor({ ID = null, Title = null, ServiceType: RequestType = null }) {
      this.ID = ID;
      this.Title = Title ?? createNewRequestTitle();
      this.LookupValue = Title;
      this._context = getAppContext();
      if (!ID) {
        this.DisplayMode(DisplayModes.New);
        this.State.Status(requestStates.draft);
      }
      if (RequestType) {
        this.RequestType = ServiceType.FindInStore(RequestType);
        if (this.RequestType._constructor) {
          this.RequestBodyBlob = new BlobField2({
            displayName: "Service Type Details",
            isRequired: false,
            width: 12,
            entityType: ko.observable(this.RequestType._constructor)
          });
        }
      }
      this.ActivityQueue.subscribe(
        this.activityQueueWatcher,
        this,
        "arrayChange"
      );
    }
    // static async Create({
    //   ID = null,
    //   Title = null,
    //   ServiceType: RequestType = null,
    // }) {
    //   const serviceType = ServiceType.FindInStore(RequestType);
    //   await serviceType.initializeEntity();
    //   return new RequestEntity({ ID, Title, ServiceType: serviceType });
    // }
    DisplayMode = ko.observable(DisplayModes.View);
    Displaymodes = DisplayModes;
    get ID() {
      return this.ObservableID();
    }
    set ID(id) {
      this.ObservableID(id);
    }
    get Title() {
      return this.ObservableTitle();
    }
    set Title(title) {
      this.ObservableTitle(title);
    }
    ObservableID = ko.observable();
    ObservableTitle = ko.observable();
    RequestSubject = ko.observable();
    RequestDescription = new TextAreaField({
      displayName: ko.pureComputed(
        () => this.RequestType?.DescriptionTitle ?? "Description"
      ),
      instructions: ko.pureComputed(
        () => this.RequestType?.DescriptionFieldInstructions
      ),
      isRichText: true,
      isRequired: ko.pureComputed(
        () => this.RequestType?.DescriptionRequired ?? false
      ),
      width: "12"
    });
    RequestorInfo = {
      Requestor: ko.observable(),
      Phone: ko.observable(),
      Email: ko.observable(),
      Office: ko.observable(),
      OfficeSymbol: new TextField({ displayName: "Office Symbol" })
    };
    State = {
      IsActive: ko.observable(),
      Status: ko.observable(),
      StatusClass: ko.pureComputed(() => {
        return requestStateClasses[this.State.Status()];
      }),
      InternalStatus: ko.observable(),
      InternalStatusClass: ko.pureComputed(() => {
        return requestStateClasses[this.State.InternalStatus()] ?? requestStateClasses.Paused;
      }),
      IsPaused: ko.pureComputed(
        () => this.State.Status() == requestStates.open && this.State.InternalStatus() != requestInternalStates.inProgress
      )
    };
    Reporting = {
      MeetingStandard: ko.pureComputed(() => this.Reporting.AgingDays() <= 0),
      AgingDays: ko.pureComputed(
        () => this.Reporting.OpenDays() - this.RequestType.DaysToCloseBusiness
      ),
      OpenDays: ko.pureComputed(() => {
        const endDate = this.Dates.Closed.Value() ?? /* @__PURE__ */ new Date();
        return calculateBusinessDays(this.Dates.Submitted.Value(), endDate);
      })
    };
    Dates = {
      Submitted: new DateField({ displayName: "Submitted Date" }),
      EstClosed: new DateField({ displayName: "Est. Closed Date" }),
      Closed: new DateField({ displayName: "Closed Date" })
    };
    RequestOrgs = ko.observable();
    // ServiceType = {
    //   IsLoading: ko.observable(false),
    //   Entity: ko.observable(),
    //   // Def: ko.observable(),
    //   refreshEntity: async () => {
    //     return;
    //   },
    // };
    RequestType;
    RequestBodyBlob;
    // = new BlobField({
    //   displayName: "Service Type Details",
    //   isRequired: false,
    //   width: 12,
    //   entityType: ko.observable(),
    // });
    Pipeline = {
      Stage: ko.observable(),
      PreviousStage: ko.observable(),
      Icon: ko.pureComputed(() => this.RequestType?.Icon),
      Stages: ko.pureComputed(() => {
        if (!this.RequestType) return [];
        const typeStages = pipelineStageStore().filter((stage) => stage.ServiceType?.ID == this.RequestType?.ID).sort(sortByField("Step"));
        const completedStage = PipelineStage.GetCompletedStage();
        completedStage.Step = typeStages.length + 1;
        typeStages.push(completedStage);
        return typeStages;
      }),
      RequestOrgs: ko.pureComputed(() => {
        return this.Pipeline.Stages().filter((stage) => stage.RequestOrg).map((stage) => stage.RequestOrg);
      }),
      getNextStage: ko.pureComputed(() => {
        const thisStepNum = this.Pipeline.Stage()?.Step ?? 0;
        const nextStepNum = thisStepNum + 1;
        return this.Pipeline.Stages()?.find((stage) => stage.Step == nextStepNum);
      }),
      advance: async () => {
        const pipelineAdvanceTask = addTask(taskDefs.pipeline);
        if (this.promptAdvanceModal) this.promptAdvanceModal.hide();
        await this.resumeRequest();
        const nextStage = this.Pipeline.getNextStage();
        if (nextStage.ActionType == stageActionTypes.Closed) {
          console.log("Closing Request");
          this.closeAndFinalize(requestStates.fulfilled);
          finishTask(pipelineAdvanceTask);
          return null;
        }
        const thisStage = this.Pipeline.Stage();
        this.Pipeline.PreviousStage(thisStage);
        this.Pipeline.Stage(nextStage);
        await this._context.Requests.UpdateEntity(this, [
          "PipelineStage",
          "PipelineStagePrev"
        ]);
        this.ActivityQueue.push({
          activity: actionTypes.Advanced,
          data: nextStage
        });
        await this.Assignments.createStageAssignments(nextStage);
        if (nextStage.ActionType == stageActionTypes.Notification) {
          this.Pipeline.advance();
        }
        if (nextStage.ActionType == stageActionTypes.Closed) {
          this.closeAndFinalize(requestStates.fulfilled);
        }
        finishTask(pipelineAdvanceTask);
      }
    };
    Attachments = {
      AreLoading: ko.observable(),
      list: {
        All: ko.observableArray(),
        Active: ko.pureComputed(
          () => this.Attachments.list.All().filter((attachment) => attachment.IsActive)
        )
      },
      Validation: {
        Errors: ko.pureComputed(() => {
          let errors = [];
          let minAttachments = this.RequestType?.AttachmentsRequiredCnt ?? 0;
          if (minAttachments < 0) minAttachments = 1;
          const attachmentsCount = this.Attachments.list.Active().length;
          if (attachmentsCount < minAttachments) {
            errors.push(
              new ValidationError2(
                "attachment-count-mismatch",
                "request-header",
                `This request has ${this.RequestType.attachmentsRequiredCntString()} required attachment(s)!`
              )
            );
          }
          return errors;
        })
      },
      userCanAttach: ko.pureComputed(
        () => this.Authorization.currentUserCanSupplement()
      ),
      createFolder: async () => {
        const newAttachmentTask = addTask(taskDefs.newAttachment);
        let folderPath = this.getRelativeFolderPath();
        const folderPerms = this.getFolderPermissions();
        try {
          await this._context.Attachments.UpsertFolderPath(folderPath);
          await this._context.Attachments.SetFolderPermissions(
            folderPath,
            folderPerms
          );
          this.Attachments.refresh();
        } catch (e) {
          console.error("Error creating folder: ", e);
          folderPath = null;
        } finally {
          finishTask(newAttachmentTask);
        }
        return folderPath;
      },
      newAttachmentFiles: ko.observableArray(),
      removeFile: (file) => {
        this.Attachments.newAttachmentFiles.remove(file);
      },
      addNew: async () => {
        const folderPath = await this.Attachments.createFolder();
        if (!folderPath) alert("Unable to create folder");
        await Promise.all(
          this.Attachments.newAttachmentFiles().map(async (file) => {
            const uploadFileTask = addTask(taskDefs.uploadAttachment(file.name));
            const attachmentTitle = file.name.split(".").slice(0, -1).join(".") ?? file.name;
            await this._context.Attachments.UploadFileToFolderAndUpdateMetadata(
              file,
              file.name,
              folderPath,
              {
                Title: attachmentTitle,
                RequestId: this.ID,
                IsActive: true
              },
              ({ currentBlock, totalBlocks }) => {
                uploadFileTask.updateProgress({
                  percentDone: currentBlock / totalBlocks
                });
              }
            );
            finishTask(uploadFileTask);
          })
        );
        this.Attachments.newAttachmentFiles([]);
        this.Attachments.refresh();
      },
      refresh: async () => {
        if (!this.Title) return;
        const refreshAttachmentsTask = addTask(taskDefs.refreshAttachments);
        this.Attachments.AreLoading(true);
        try {
          const attachments = await this._context.Attachments.GetItemsByFolderPath(
            this.getRelativeFolderPath(),
            Attachment.Views.All
          );
          this.Attachments.list.All(attachments);
        } catch (e) {
          console.warn("Looks like there are no attachments", e);
        }
        this.Attachments.AreLoading(false);
        finishTask(refreshAttachmentsTask);
      },
      view: (attachment) => {
        this._context.Attachments.ShowForm(
          "DispForm.aspx",
          "View " + attachment.Title,
          { id: attachment.ID }
        );
      },
      userCanRemove: (attachment) => {
        return ko.pureComputed(() => {
          if (!this.Authorization.currentUserCanSupplement()) return false;
          return true;
        });
      },
      remove: async (attachment) => {
        console.log("removing", attachment);
        attachment.IsActive = false;
        await this._context.Attachments.UpdateEntity(attachment, ["IsActive"]);
        this.Attachments.refresh();
      }
    };
    Comments = {
      AreLoading: ko.observable(),
      list: {
        All: ko.observableArray(),
        Active: ko.pureComputed(() => {
          return this.Comments.list.All().filter((comment) => comment.IsActive);
        })
      },
      userCanComment: ko.pureComputed(() => {
        return this.Authorization.currentUserCanSupplement();
      }),
      addNew: async (comment) => {
        const newCommentTask = addTask(taskDefs.newComment);
        const folderPath = this.getRelativeFolderPath();
        const folderPerms = this.getFolderPermissions();
        try {
          const commentFolderId = await this._context.Comments.UpsertFolderPath(
            folderPath
          );
          await this._context.Comments.SetFolderPermissions(
            folderPath,
            folderPerms
          );
          await this._context.Comments.AddEntity(comment, folderPath);
          this.Comments.refresh();
        } catch (e) {
          console.error("Error creating folder: ");
        } finally {
          finishTask(newCommentTask);
        }
      },
      update: async (comment) => {
      },
      refresh: async () => {
        const refreshCommentsTask = addTask(taskDefs.refreshComments);
        this.Comments.AreLoading(true);
        const folderPath = this.getRelativeFolderPath();
        const comments = await this._context.Comments.GetItemsByFolderPath(
          folderPath,
          Comment.Views.All
        );
        this.Comments.list.All(comments);
        this.Comments.AreLoading(false);
        finishTask(refreshCommentsTask);
      },
      sendNotification: async (comment) => {
        const notifyCommentTask = addTask(taskDefs.newComment);
        await emitCommentNotification(comment, this);
        comment.NotificationSent = true;
        await this._context.Comments.UpdateEntity(comment, ["NotificationSent"]);
        this.Comments.refresh();
        finishTask(notifyCommentTask);
      },
      remove: async (comment) => {
        const removeCommentTask = addTask(taskDefs.removeComment);
        comment.IsActive = false;
        await this._context.Comments.UpdateEntity(comment, ["IsActive"]);
        this.Comments.refresh();
        finishTask(removeCommentTask);
      }
    };
    Assignments = {
      HaveLoaded: ko.observable(false),
      AreLoading: ko.observable(),
      list: {
        All: ko.observableArray(),
        InProgress: ko.pureComputed(() => {
          return this.Assignments.list.All().filter(
            (assignment) => assignment.Status == assignmentStates.InProgress
          );
        }),
        Dashboard: ko.pureComputed(() => {
          return this.Assignments.list.All();
        }),
        CurrentUserAssignments: ko.pureComputed(() => {
          if (!this.Assignments.list.All().length) {
            return [];
          }
          const userGroupIds = currentUser().getGroupIds();
          const userReqOrgIds = currentUser().ActionOffices().map((org) => org.ID);
          const assignments = this.Assignments.list.All().filter(
            (assignment) => assignment.Assignee?.ID == currentUser()?.ID || userGroupIds.includes(assignment.Assignee?.ID) || userReqOrgIds.includes(assignment.RequestOrg?.ID)
          );
          return assignments;
        })
      },
      getFolderUrl: () => this._context.Assignments.GetFolderUrl(this.getRelativeFolderPath()),
      CurrentStage: {
        list: {
          ActionAssignments: ko.pureComputed(() => {
            return this.Assignments.list.All().filter(
              (assignment) => assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID && assignment.isActionable()
            );
          }),
          InProgress: ko.pureComputed(() => {
            return this.Assignments.list.InProgress().filter(
              (assignment) => assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID
            );
          }),
          UserActionAssignments: ko.pureComputed(() => {
            return this.Assignments.list.CurrentUserAssignments().filter(
              (assignment) => assignment.PipelineStage?.ID == this.Pipeline.Stage()?.ID && assignment.isActionable()
            );
          })
        },
        Validation: {
          IsValid: ko.pureComputed(
            () => !this.Assignments.CurrentStage.Validation.ActiveAssignmentsError() && !this.Assignments.CurrentStage.Validation.Errors().length
          ),
          Errors: ko.observableArray(),
          ActiveAssignmentsError: ko.pureComputed(() => {
            const activeAssignments = this.Assignments.CurrentStage.list.UserActionAssignments().find(
              (assignment) => assignment.Status == assignmentStates.InProgress
            );
            if (activeAssignments) {
              if (this.Assignments.CurrentStage.Validation.Errors.indexOf(
                activeAssignmentsError
              ) < 0) {
                this.Assignments.CurrentStage.Validation.Errors.push(
                  activeAssignmentsError
                );
              }
              return true;
            } else {
              this.Assignments.CurrentStage.Validation.Errors.remove(
                activeAssignmentsError
              );
              return false;
            }
          })
        },
        UserCanAdvance: ko.pureComputed(() => {
          return this.Assignments.CurrentStage.list.UserActionAssignments().length;
        }),
        AssignmentComponents: ko.pureComputed(() => {
          return this.Assignments.CurrentStage.list.UserActionAssignments().map((assignment) => {
            return {
              request: this,
              assignment,
              addAssignment: this.Assignments.addNew,
              completeAssignment: this.Assignments.complete,
              errors: this.Assignments.CurrentStage.Validation.Errors,
              actionComponentName: assignment.getComponentName()
            };
          });
        })
      },
      refresh: async () => {
        this.Assignments.AreLoading(true);
        const assignments = await this._context.Assignments.GetItemsByFolderPath(
          this.getRelativeFolderPath(),
          Assignment.Views.All
        );
        assignments.map(
          (asg) => asg.RequestOrg = RequestOrg.FindInStore(asg.RequestOrg) ?? asg.RequestOrg
        );
        this.Assignments.list.All(assignments);
        this.Assignments.HaveLoaded(true);
        this.Assignments.AreLoading(false);
      },
      userCanAssign: ko.pureComputed(() => {
        if (!this.State.IsActive()) return false;
        const assignedOrg = this.Pipeline.Stage()?.RequestOrg;
        if (!assignedOrg) return false;
        const user = currentUser();
        if (user.isInRequestOrg(assignedOrg)) return true;
        return false;
      }),
      addNew: async (assignment = null) => {
        if (!this.ID || !assignment) return;
        assignment.Title = this.Title;
        if (!assignment.RequestOrg) {
          assignment.RequestOrg = this.Pipeline.Stage()?.RequestOrg;
        }
        if (!assignment.PipelineStage) {
          assignment.PipelineStage = this.Pipeline.Stage();
        }
        assignment.Status = assignment.Role.initialStatus;
        const folderPath = this.getRelativeFolderPath();
        await this._context.Assignments.AddEntity(assignment, folderPath, this);
        await this.Assignments.refresh();
        if (!this.RequestOrgs().find((org) => org.ID == assignment.RequestOrg.ID)) {
          this.RequestOrgs.push(assignment.RequestOrg);
          await this._context.Requests.UpdateEntity(this, ["RequestOrgs"]);
        }
        this.ActivityQueue.push({
          activity: actionTypes.Assigned,
          data: assignment
        });
        if (assignment.Role?.permissions) {
          this.Authorization.ensureAccess([
            [assignment.Assignee, assignment.Role.permissions]
          ]);
        }
      },
      view: (assignment) => {
        this._context.Assignments.ShowForm(
          "DispForm.aspx",
          "View " + assignment.Assignee.Title,
          { id: assignment.ID }
        );
      },
      remove: async (assignment) => {
        if (!confirm("Are you sure you want to remove this assignment?")) return;
        try {
          await this._context.Assignments.RemoveEntity(assignment);
        } catch (e) {
          console.error("Unable to remove assignment", e);
          return;
        }
        this.Assignments.refresh();
        this.ActivityQueue.push({
          activity: actionTypes.Unassigned,
          data: assignment
        });
      },
      complete: async (assignment, action, refresh = true) => {
        const updateEntity = {
          ID: assignment.ID,
          Status: assignmentStates[action],
          Comment: assignment.Comment,
          CompletionDate: (/* @__PURE__ */ new Date()).toISOString(),
          ActionTaker: currentUser()
        };
        await this._context.Assignments.UpdateEntity(updateEntity);
        await this.resumeRequest();
        this.ActivityQueue.push({
          activity: actionTypes[action],
          data: updateEntity
        });
        if (refresh) this.Assignments.refresh();
      },
      createStageAssignments: async (stage = this.Pipeline.Stage()) => {
        if (!stage?.ActionType) return;
        if (stage.ActionType == actionTypes.Closed) return;
        if (this.Assignments.list.All().find((assignment) => assignment.PipelineStage?.ID == stage.ID))
          return;
        if (stage.AssignmentFunction && AssignmentFunctions[stage.AssignmentFunction]) {
          try {
            const newAssignments = AssignmentFunctions[stage.AssignmentFunction](
              this,
              stage
            );
            await Promise.all(
              newAssignments.map(
                (newAssignment2) => this.Assignments.addNew(newAssignment2)
              )
            );
          } catch (e) {
            console.warn("Error creating stage assignments", stage);
            alert(e.message);
            return;
          }
          return;
        }
        if (stage.WildCardAssignee) {
          try {
            const newAssignments = AssignmentFunctions.getWildcard(
              this,
              stage,
              stage.WildCardAssignee
            );
            await Promise.all(
              newAssignments.map(
                (newAssignment2) => this.Assignments.addNew(newAssignment2)
              )
            );
          } catch (e) {
            console.warn("Error creating stage assignments", stage);
            alert(e.message);
            return;
          }
          return;
        }
        const newAssignment = new Assignment({
          Assignee: stage.Assignee ?? RequestOrg.FindInStore(stage.RequestOrg)?.UserGroup,
          RequestOrg: stage.RequestOrg,
          PipelineStage: stage,
          IsActive: true,
          Role: stageActionRoleMap[stage.ActionType]
        });
        await this.Assignments.addNew(newAssignment);
      }
    };
    Actions = {
      AreLoading: ko.observable(),
      list: {
        All: ko.observableArray()
      },
      refresh: async () => {
        const refreshActionsTask = addTask(taskDefs.refreshActions);
        if (!this.ID) return;
        this.Actions.AreLoading(true);
        const actions = await this._context.Actions.GetItemsByFolderPath(
          this.getRelativeFolderPath(),
          Action.Views.All
        );
        this.Actions.list.All(actions);
        this.Actions.AreLoading(false);
        finishTask(refreshActionsTask);
      },
      addNew: async (action) => {
        if (!this.ID || !action) return;
        const newActionTask = addTask(taskDefs.newAction);
        const folderPath = this.getRelativeFolderPath();
        action.PipelineStage = action.PipelineStage ?? this.Pipeline.Stage();
        await this._context.Actions.AddEntity(action, folderPath, this.request);
        this.Actions.refresh();
        finishTask(newActionTask);
      },
      showDialog: () => {
        const dialog = document.getElementById("dialog-action-log");
        dialog.showModal();
      },
      closeDialog: () => {
        const dialog = document.getElementById("dialog-action-log");
        dialog.close();
      }
    };
    ActivityQueue = ko.observableArray();
    ActivityLogger = new ActivityLogComponent(this.Actions, this.ActivityQueue);
    IsLoading = ko.observable();
    LoadedAt = ko.observable();
    activityQueueWatcher = (changes) => {
      const activities = changes.filter((change) => change.status == "added").map((change) => change.value);
      activities.map(async (action) => {
        emitRequestNotification(this, action);
        switch (action.activity) {
          case actionTypes.Assigned:
          case actionTypes.Unassigned:
            break;
          case actionTypes.Rejected:
            {
              console.warn("Closing request");
              await this.closeAndFinalize(requestStates.rejected);
            }
            break;
          case actionTypes.Advanced:
            break;
        }
      });
    };
    Validation = {
      validate: () => {
        this.Validation.WasValidated(true);
        this.Validation.validateHeader();
        this.Validation.validateBody();
        return this.Validation.IsValid();
      },
      validateHeader: () => {
        this.FieldMap.RequestDescription.validate();
      },
      validateBody: () => {
        return this.RequestBodyBlob?.Value()?.validate();
      },
      reset: () => this.Validation.WasValidated(false),
      Errors: {
        Request: ko.pureComputed(() => {
          let errors = [];
          errors = errors.concat(this.Attachments.Validation.Errors());
          errors = errors.concat(this.FieldMap.RequestDescription.Errors());
          return errors;
        }),
        ServiceType: ko.pureComputed(() => {
          return this.RequestBodyBlob?.Value()?.Errors() ?? [];
        }),
        All: ko.pureComputed(() => [
          ...this.Validation.Errors.Request(),
          ...this.Validation.Errors.ServiceType(),
          ...this.Validation.CurrentStage.Errors()
        ])
      },
      IsValid: ko.pureComputed(() => !this.Validation.Errors.All().length),
      WasValidated: ko.observable(false),
      CurrentStage: {
        IsValid: () => this.Assignments.CurrentStage.Validation.IsValid(),
        Errors: ko.pureComputed(
          () => this.Assignments.CurrentStage.Validation.Errors()
        )
      }
    };
    Authorization = {
      currentUserIsActionOffice: ko.pureComputed(() => {
        return this.Assignments.list.CurrentUserAssignments().find(
          (assignment) => [assignmentRoles.ActionResolver, assignmentRoles.Approver].includes(
            assignment.ActionType
          )
        );
      }),
      currentUserCanAdvance: ko.pureComputed(() => {
        return this.State.IsActive() && this.Assignments.CurrentStage.list.UserActionAssignments().length;
      }),
      currentUserCanSupplement: ko.pureComputed(() => {
        const user = currentUser();
        if (!user) {
          console.warn("Current user not set!");
          return false;
        }
        if (!this.State.IsActive()) return false;
        if (this.Assignments.list.CurrentUserAssignments().length) return true;
        if (this.RequestorInfo.Requestor()?.ID == user.ID) return true;
      }),
      currentUserCanClose: ko.pureComputed(() => {
        return this.State.IsActive() && this.Assignments.list.CurrentUserAssignments().find((assignment) => assignment.isActionable());
      }),
      ensureAccess: async (accessValuePairs) => {
        const relFolderPath = this.getRelativeFolderPath();
        const listRefs = this.getAllListRefs();
        await Promise.all(
          listRefs.map(async (listRef) => {
            await listRef.EnsureFolderPermissions(
              relFolderPath,
              accessValuePairs
            );
          })
        );
      },
      setReadonly: async () => {
        const relFolderPath = this.getRelativeFolderPath();
        const listRefs = this.getAllListRefs();
        await Promise.all(
          listRefs.map(async (listRef) => {
            await listRef.SetFolderReadOnly(relFolderPath);
          })
        );
      }
    };
    getAppLink = () => `${appRoot}?reqId=${this.Title}&tab=${Tabs.RequestDetail}`;
    getAppLinkElement = () => `<a href="${this.getAppLink()}" target="blank">${this.Title}</a>`;
    /**
     * Returns the generic relative path without the list/library name
     * e.g. EX/2929-20199
     */
    getRelativeFolderPath = ko.pureComputed(() => {
      if (this.State.Status() == requestStates.draft)
        return this.getRelativeFolderPathStaging();
      const requestorOffice = this.RequestorInfo.Office()?.Title.replace(
        "/",
        "_"
      );
      return `${requestorOffice}/${this.ObservableTitle()}`;
    });
    getRelativeFolderPathStaging = () => {
      return `Staged/${this.ObservableTitle()}`;
    };
    getFolderUrl = ko.pureComputed(
      () => this._context.Requests.GetFolderUrl(this.getRelativeFolderPath())
    );
    getFolderPermissions = () => getRequestFolderPermissions(this);
    calculateEffectiveSubmissionDate = () => {
      const submissionDate = this.Dates.Submitted.get() ?? /* @__PURE__ */ new Date();
      if (submissionDate.getUTCHours() >= 19 || submissionDate.getUTCHours() < 4) {
        console.log("its after 3, this is submitted tomorrow");
        const tomorrow = businessDaysFromDate(submissionDate, 1);
        tomorrow.setUTCHours(13);
        tomorrow.setUTCMinutes(0);
        return tomorrow;
      } else {
        return submissionDate;
      }
    };
    // Controls
    refreshAll = async () => {
      const refreshId = addTask(taskDefs.refresh);
      this.IsLoading(true);
      await this.refreshRequest();
      const relatedRecordPromises = [
        this.Attachments.refresh(),
        this.Actions.refresh(),
        this.Comments.refresh(),
        this.Assignments.refresh()
      ];
      await Promise.all(relatedRecordPromises);
      this.LoadedAt(/* @__PURE__ */ new Date());
      this.IsLoading(false);
      finishTask(refreshId);
    };
    refreshRequest = async () => {
      if (!this.ID) return;
      await this._context.Requests.LoadEntity(this);
    };
    getAllListRefs() {
      const listRefs = this.getInitialListRefs().concat([
        this._context.Comments,
        this._context.Attachments
      ]);
      return listRefs;
    }
    getInitialListRefs() {
      const listRefs = [
        this._context.Requests,
        this._context.Actions,
        this._context.Assignments,
        this._context.Notifications
      ];
      return listRefs;
    }
    pauseRequest = async (reason = "Not Provided") => {
      this.State.InternalStatus(reason);
      await this._context.Requests.UpdateEntity(this, ["InternalStatus"]);
      this.ActivityQueue.push({
        activity: actionTypes.Paused,
        data: reason
      });
    };
    resumeRequest = async () => {
      if (!this.State.IsPaused()) return;
      this.State.InternalStatus(requestInternalStates.inProgress);
      await this._context.Requests.UpdateEntity(this, ["InternalStatus"]);
      this.ActivityQueue.push({
        activity: actionTypes.Resumed,
        data: this
      });
    };
    closeAndFinalize = async (status) => {
      const closeId = addTask(taskDefs.closing);
      this.Assignments.list.InProgress().map((assignment) => {
        this.Assignments.complete(assignment, assignmentStates.Cancelled, false);
      });
      const closedStage = PipelineStage.GetCompletedStage();
      const thisStage = this.Pipeline.Stage();
      this.Pipeline.PreviousStage(thisStage);
      this.Pipeline.Stage(closedStage);
      this.State.Status(status);
      this.State.InternalStatus(status);
      this.State.IsActive(false);
      this.Dates.Closed.set(/* @__PURE__ */ new Date());
      await this._context.Requests.UpdateEntity(this, [
        "PipelineStage",
        "PipelineStagePrev",
        "RequestStatus",
        "InternalStatus",
        "IsActive",
        "ClosedDate"
      ]);
      this.ActivityQueue.push({
        activity: actionTypes.Closed,
        data: this
      });
      await this.Authorization.setReadonly();
      this.refreshAll();
      finishTask(closeId);
    };
    // FieldMaps are used by the ApplicationDbContext and define
    // how to store and retrieve the entity properties
    FieldMap = {
      ID: this.ObservableID,
      Title: this.ObservableTitle,
      RequestSubject: this.RequestSubject,
      RequestDescription: this.RequestDescription,
      Requestor: {
        set: (val) => this.RequestorInfo.Requestor(People.Create(val)),
        get: this.RequestorInfo.Requestor
      },
      RequestorPhone: this.RequestorInfo.Phone,
      RequestorEmail: this.RequestorInfo.Email,
      RequestorOfficeSymbol: this.RequestorInfo.OfficeSymbol,
      RequestingOffice: {
        set: (val) => this.RequestorInfo.Office(RequestOrg.Create(val)),
        get: this.RequestorInfo.Office
      },
      IsActive: this.State.IsActive,
      PipelineStage: {
        factory: PipelineStage.FindInStore,
        obs: this.Pipeline.Stage
      },
      PipelineStagePrev: {
        factory: PipelineStage.FindInStore,
        obs: this.Pipeline.PreviousStage
      },
      RequestStatus: this.State.Status,
      InternalStatus: this.State.InternalStatus,
      RequestSubmitted: this.Dates.Submitted,
      EstClosedDate: this.Dates.EstClosed,
      ClosedDate: this.Dates.Closed,
      RequestOrgs: {
        set: (inputArr) => this.RequestOrgs(
          (inputArr.results ?? inputArr).map((val) => RequestOrg.Create(val))
        ),
        get: this.RequestOrgs
      },
      ServiceType: {
        set: (val) => {
          const type = ServiceType.FindInStore(val);
          this.RequestType = type;
        },
        get: () => this.RequestType
      },
      // {id, title},
      RequestBodyBlob: {
        get: () => this.RequestBodyBlob?.get(),
        set: (val) => {
          if (!this.RequestBodyBlob) return;
          this.RequestBodyBlob.set(val);
          const requestBodyEntity = this.RequestBodyBlob.Value();
          if (requestBodyEntity?.setRequestContext)
            requestBodyEntity.setRequestContext(this);
        }
      }
    };
    static Views = {
      All: [
        "ID",
        "Title",
        "RequestDescription",
        "Requestor",
        "RequestorPhone",
        "RequestorEmail",
        "RequestorOfficeSymbol",
        "RequestingOffice",
        "IsActive",
        "PipelineStage",
        "PipelineStagePrev",
        "RequestStatus",
        "InternalStatus",
        "RequestSubmitted",
        "EstClosedDate",
        "ClosedDate",
        "RequestOrgs",
        "ServiceType",
        "RequestBodyBlob"
      ],
      ByStatus: [
        "ID",
        "Title",
        "ServiceType",
        "RequestorOfficeSymbol",
        "RequestingOffice",
        "RequestOrgs",
        "Requestor",
        "RequestSubmitted",
        "PipelineStage",
        "EstClosedDate",
        "ClosedDate",
        "RequestStatus",
        "InternalStatus",
        "RequestOrgs"
      ],
      ByServiceType: [
        "ID",
        "Title",
        "ServiceType",
        "RequestorOfficeSymbol",
        "RequestingOffice",
        "Requestor",
        "RequestStatus",
        "RequestBodyBlob"
      ]
    };
    static ListDef = {
      name: "Requests",
      title: "Requests",
      fields: _RequestEntity.Views.All
    };
  };

  // src/components/PendingRequestIngests/PendingRequestIngestsTemplate.js
  var pendingRequestsIngestTemplate = html2`
  <!-- ko if: PendingRows().length -->
  <div class="card">
    <div class="card-body">
      <div
        class="card-title d-flex justify-content-between align-items-center accordion-header"
      >
        <h4
          class="mx-0 px-2 flex-grow-1 pointer accordion-title collapsed d-flex align-items-center justify-content-between"
          data-bs-toggle="collapse"
          data-bs-target="#pending-ingest-body"
        >
          (<span data-bind="text: PendingRows().length"></span>) Pending
          Conversion
          <i class="indicator fa fa-caret-down"></i>
        </h4>
      </div>
      <div id="pending-ingest-body" class="accordion-collapse collapse">
        <table class="table table-sm hover">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Convert To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: PendingRows">
            <tr data-bind="">
              <td>
                <button
                  type="button"
                  class="btn btn-link"
                  title="Toggle additional details"
                  data-bind="text: requestIngest.Title.toString(), 
                    toggles: ShowBody"
                ></button>
              </td>
              <td>
                <select
                  data-bind="options: $parent.ConvertToOptions, 
            optionsText: 'Title',
            optionsCaption: 'Select...',
            value: ConvertTo"
                ></select>
              </td>
              <td>
                <button
                  type="button"
                  title="Delete Item"
                  class="btn btn-link"
                  data-bind="click: $parent.deleteItem"
                >
                  <span class="fas fa-trash pointer"></span>
                </button>
              </td>
            </tr>
            <!-- ko if: ShowBody -->
            <!-- ko using: requestIngest -->
            <tr>
              <td colspan="3">
                <div class="d-flex justify-content-start gap-5 w-full">
                  <div
                    data-bind="component: {
                      name: To.components.view, 
                      params: To}"
                  ></div>
                  <div
                    data-bind="component: {
                      name: CC.components.view, 
                      params: CC}"
                  ></div>
                  <div
                    data-bind="component: {
                      name: From.components.view, 
                      params: From}"
                  ></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <div
                  style="max-height: 75vh"
                  class="overflow-auto"
                  data-bind="component: {
                    name: Body.components.view, 
                    params: Body}"
                ></div>
              </td>
            </tr>
            <!-- /ko -->
            <!-- /ko -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- /ko -->
`;

  // src/components/PendingRequestIngests/PendingRequestIngestsModule.js
  var PendingRequestIngestsModule = class extends BaseComponent {
    PendingRows = ko.pureComputed(() => {
      return requestIngests().map((item) => new RequestIngestItem(item));
    });
    ConvertToOptions = ko.pureComputed(
      () => serviceTypeStore().filter(
        (serviceType) => serviceType.userCanInitiate(currentUser())
      )
    );
    deleteItem = async ({ requestIngest }) => {
      const context2 = getAppContext();
      const folderPath = requestIngest.getStagedAttachmentsFolderPath();
      await context2.Attachments.DeleteFolderByPath(folderPath);
      await context2.RequestIngests.RemoveEntity(requestIngest);
      requestIngests(await context2.RequestIngests.ToList());
    };
    static name = "pending-request-ingests";
    static template = pendingRequestsIngestTemplate;
  };
  var RequestIngestItem = class {
    constructor(requestIngest) {
      this.requestIngest = requestIngest;
      this.ConvertTo.subscribe(this.onConvertToChangeHandler);
    }
    ShowBody = ko.observable(false);
    ConvertTo = ko.observable();
    onConvertToChangeHandler = (convertTo) => {
      if (!convertTo) return null;
      this.ConvertTo(null);
      this.ShowBody(false);
      console.log("converting to...", convertTo);
      convertToServiceType(convertTo, this.requestIngest);
    };
  };
  async function convertToServiceType(serviceType, requestIngest) {
    await serviceType.initializeEntity();
    const newRequest = new RequestEntity({
      ServiceType: serviceType
    });
    const emailBody = requestIngest.Body.Value();
    if (newRequest.RequestBodyBlob?.Value()?.fromEmail) {
      newRequest.RequestBodyBlob?.Value()?.fromEmail(emailBody);
    }
    newRequest.RequestDescription.Value(emailBody);
    const context2 = getAppContext();
    const requestIngestAttachmentPath = requestIngest.getStagedAttachmentsFolderPath();
    const attachmentCount = await context2.Attachments.GetItemsByFolderPath(
      requestIngestAttachmentPath,
      Attachment.Views.All
    );
    if (attachmentCount.length) {
      console.log("Copying attachments");
      const folderPath = await newRequest.Attachments.createFolder();
      await context2.Attachments.CopyFolderContents(
        requestIngestAttachmentPath,
        folderPath
      );
      await newRequest.Attachments.refresh();
    }
    window.WorkOrder.App.NewRequest({ request: newRequest });
  }

  // src/common/DataTableExtensions.js
  function makeDataTable(tableId) {
    tableId = tableId.startsWith("#") ? tableId : "#" + tableId;
    return new DataTable(tableId, {
      dom: "<'ui stackable grid'<'row'<'eight wide column'l><'right aligned eight wide column'f>><'row dt-table'<'sixteen wide column'tr>><'row'<'six wide column'i><'d-flex justify-content-center'B><'right aligned six wide column'p>>>",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      order: [[0, "desc"]],
      iDisplayLength: 25,
      deferRender: true,
      bDestroy: true,
      // columnDefs: [{ width: "10%", targets: 0 }],
      initComplete: function() {
        this.api().columns().every(function() {
          var column = this;
          var tbl = $(column.header()).closest("table");
          var filterCell = $(column.footer());
          var select = $(
            '<search-select class=""><option value=""></option></search-select>'
          );
          switch (filterCell.attr("data-filter")) {
            case "select-filter":
              select.attr("multiple", "true");
            case "single-select-filter":
              select.appendTo(filterCell.empty()).on("change", function() {
                var vals = this.selectedOptions.map((opt) => opt.value);
                if (!vals) {
                  vals = [];
                } else {
                  vals = vals.map(function(value) {
                    return value ? "^" + $.fn.dataTable.util.escapeRegex(value) + "$" : null;
                  });
                }
                var val = vals.join("|");
                column.search(val, true, false).draw();
              });
              let options = "";
              column.data().unique().sort().each(function(optionText, j) {
                try {
                  let parsedElement = $(optionText);
                  if (parsedElement.is("a")) {
                    optionText = parsedElement.text();
                  }
                } catch (e) {
                }
                options += `<option value="${optionText}" title="${optionText}">${optionText}</option>`;
              });
              select.append(options);
              break;
            case "search-filter":
              $(
                '<div class=""><input class="form-control" type="text" placeholder="Search..." style="width: 100%"/></div>'
              ).appendTo(filterCell.empty()).on("keyup change clear", function() {
                const inputSearchText = this.getElementsByTagName("input")[0].value;
                if (column.search() !== inputSearchText) {
                  column.search(inputSearchText).draw();
                }
              });
              break;
            case "bool-filter":
              var checkbox = $('<input type="checkbox"></input>').appendTo(filterCell.empty()).change(function() {
                if (this.checked) {
                  column.search("true").draw();
                } else {
                  column.search("").draw();
                }
              });
              break;
            default:
          }
          if (filterCell.attr("clear-width")) {
            tbl.find("thead tr:eq(0) th").eq(column.index()).width("");
          }
        });
      }
    });
  }

  // src/stores/Assignments.js
  var AssignmentsSet = class {
    constructor() {
    }
    IsLoading = ko.observable();
    HasLoaded = ko.observable(false);
    AllOpenRequests = requestsByStatusMap.get(requestStates.open).List;
    MyAssignedRequests = ko.pureComputed(
      () => this.AllOpenRequests().filter(
        (request2) => request2.Assignments.CurrentStage.list.UserActionAssignments().length
      )
    );
    MyActiveAssignments = ko.pureComputed(
      () => this.MyAssignedRequests().flatMap(
        (request2) => request2.Assignments.CurrentStage.list.UserActionAssignments()
      ).filter(
        (assignment) => assignment.Status == assignmentStates.InProgress && assignment.userIsDirectlyAssigned(currentUser())
      )
    );
    // List = ko.pureComputed(() =>
    //   this.AllOpenRequests().flatMap(request.Assignments.list.All())
    // );
    List = ko.observableArray();
    getByRequest = (request2) => {
      return this.List().filter(
        (assignment) => assignment.Request.ID == request2.ID
      );
    };
    getOpenByRequest = ko.pureComputed(() => {
      const openAssignments = [];
      const openRequests = requestsByStatusMap.get(requestStates.open)?.List() ?? [];
      const inProgress = this.List().filter(
        (assignment) => assignment.Status == assignmentStates.InProgress
      );
      openRequests.map((request2) => {
        openAssignments.push(
          ...assignmentsStore.getByRequest(request2).filter((assignment) => {
            return assignment.Status == assignmentStates.InProgress && assignment.userIsDirectlyAssigned(currentUser());
          })
        );
      });
      return openAssignments;
    });
    getOpenByUser = (user) => ko.pureComputed(
      () => this.List().filter(
        (assignment) => assignment.Status == assignmentStates.InProgress && assignment.userIsDirectlyAssigned(user)
      )
    );
    remove = (assignmentToRemove) => {
      this.List.remove((assignment) => assignment.ID == assignmentToRemove);
    };
    load = async () => {
      this.IsLoading(true);
      const start = /* @__PURE__ */ new Date();
      const allAssignments = await getAppContext().Assignments.FindByColumnValue(
        [{ column: "Status", op: "eq", value: assignmentStates.InProgress }],
        { orderByColumn: "Title", sortAsc: false },
        {},
        Assignment.Views.Dashboard,
        false
      );
      this.List(allAssignments.results);
      const end = /* @__PURE__ */ new Date();
      if (window.DEBUG)
        console.log(
          `All Assignments loaded: ${allAssignments.results.length} cnt in ${end - start}`
        );
      this.HasLoaded(true);
      this.IsLoading(false);
    };
    init = async () => {
      if (this.HasLoaded()) {
        return;
      }
      if (this.IsLoading()) {
        return new Promise((resolve, reject2) => {
          this.isLoadingSubscription = this.IsLoading.subscribe((isLoading) => {
            this.isLoadingSubscription.dispose();
            resolve();
          });
        });
      }
      await this.load();
    };
    dispose = () => {
      if (this.isLoadingSubscription) this.isLoadingSubscription.dispose();
    };
  };
  var assignmentsStore = new AssignmentsSet();

  // src/components/RequestsByStatus/ClosedRequestsTableTemplate.js
  var closedRequestsTableTemplate = html2`
  <div data-bind="">
    <div class="d-flex justify-content-between">
      <h2 class="mx-0" data-bind="text: filter.Title"></h2>
      <i class="fa fa-sync pointer" data-bind="click: refresh"></i>
    </div>

    <!-- <input type="checkbox" data-bind="checked: ShowAssignees" /> -->
    <!-- <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bind="click: loadAssignments"
    >
      Show Assignees
    </button>
  </div> -->
    <table
      class="table table-striped table-hover w-100"
      data-bind="attr: {id: getTableElementId() } "
    >
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Service Type</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Submitted Date</th>
          <th>Est. Completion Date</th>
          <th>Closed Date</th>
        </tr>
      </thead>
      <!-- ko if: IsLoading -->
      <tbody data-bind="">
        <tr class="">
          <td colspan="7" class="p-0">
            <progress class="w-100"></progress>
          </td>
        </tr>
      </tbody>
      <!-- /ko -->
      <!-- ko ifnot: IsLoading -->
      <tbody data-bind="childrenComplete: tableBodyComplete">
        <!-- ko foreach: FilteredRequests -->
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestType.Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: Dates.Submitted.toSortableDateString()"></td>
          <td data-bind="text: Dates.EstClosed.toSortableDateString()"></td>
          <td data-bind="text: Dates.Closed.toSortableDateString()"></td>
        </tr>
        <!-- /ko -->
      </tbody>
      <!-- /ko -->
      <tfoot>
        <tr>
          <th clear-width data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- <button class="btn btn-primary" data-bind="click: loadMore">
    Load More...
  </button> -->
`;

  // src/components/RequestsByStatus/OpenOfficeRequestsTableTemplate.js
  var openOfficeRequestsTableTemplate = html2`
  <div data-bind="">
    <div class="d-flex justify-content-between">
      <h2 class="mx-0" data-bind="text: filter.Title"></h2>
      <i class="fa fa-sync pointer" data-bind="click: refresh"></i>
    </div>
    <!-- <input type="checkbox" data-bind="checked: ShowAssignees" /> -->
    <!-- <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bind="click: loadAssignments"
    >
      Show Assignees
    </button>
  </div> -->
    <table
      class="table table-striped table-hover w-100"
      data-bind="attr: {id: getTableElementId() } "
    >
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Service Type</th>
          <th>Current Stage</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Submitted Date</th>
          <th>Est. Completion Date</th>
          <th>Assignments</th>
        </tr>
      </thead>
      <!-- ko if: IsLoading -->
      <tbody data-bind="">
        <tr class="">
          <td colspan="8" class="p-0">
            <progress class="w-100"></progress>
          </td>
        </tr>
      </tbody>
      <!-- /ko -->
      <!-- ko ifnot: IsLoading -->
      <tbody data-bind="childrenComplete: tableBodyComplete">
        <!-- ko foreach: FilteredRequests -->
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestType.Title"></td>
          <td data-bind="text: Pipeline.Stage()?.Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: Dates.Submitted.toSortableDateString()"></td>
          <td
            data-bind="text: Dates.EstClosed.toSortableDateString(), class: $parent.requestDateBackground($data) "
          ></td>
          <td>
            <table class="table table-sm m-0">
              <tbody data-bind="foreach: Assignments.list.All">
                <tr>
                  <td data-bind="text: Assignee?.Title"></td>
                  <td data-bind="text: Role"></td>
                  <td data-bind="text: Status"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <!-- /ko -->
      </tbody>
      <!-- /ko -->
      <tfoot>
        <tr>
          <th clear-width data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="search-filter"></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- <button class="btn btn-primary" data-bind="click: loadMore">
    Load More...
  </button> -->
`;

  // src/components/RequestsByStatus/OpenRequestsTableTemplate.js
  var openRequestsTableTemplate = html2`
  <div data-bind="">
    <div class="d-flex justify-content-between">
      <h2 class="mx-0" data-bind="text: filter.Title"></h2>
      <i class="fa fa-sync pointer" data-bind="click: refresh"></i>
    </div>
    <table
      class="table table-striped table-hover w-100"
      data-bind="attr: {id: getTableElementId() } "
    >
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Service Type</th>
          <th>Current Stage</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Submitted Date</th>
          <th>Est. Completion Date</th>
        </tr>
      </thead>
      <!-- ko if: IsLoading -->
      <tbody>
        <tr class="">
          <td colspan="7" class="p-0">
            <progress class="w-100"></progress>
          </td>
        </tr>
      </tbody>
      <!-- /ko -->
      <!-- ko ifnot: IsLoading -->
      <tbody data-bind="childrenComplete: tableBodyComplete">
        <!-- ko foreach: FilteredRequests -->
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestType.Title"></td>
          <td data-bind="text: Pipeline.Stage()?.Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: Dates.Submitted.toSortableDateString()"></td>
          <td data-bind="text: Dates.EstClosed.toSortableDateString()"></td>
        </tr>
        <!-- /ko -->
      </tbody>
      <!-- /ko -->
      <tfoot>
        <tr>
          <th clear-width data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
          <th data-filter="select-filter"></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- <button class="btn btn-primary" data-bind="click: loadMore">
    Load More...
  </button> -->
`;

  // src/components/RequestsByStatus/RequestsByStatusTableModules.js
  var RequestsByStatusTableModule = class extends BaseComponent {
    constructor({ activeRequestSet, filteredRequests = null, key = "office" }) {
      super();
      this.key = key;
      this.ActiveSet = activeRequestSet;
      this.filter = this.ActiveSet.filter;
      this.FilteredRequests = filteredRequests ?? this.ActiveSet.List;
      this.IsLoading = this.ActiveSet.IsLoading;
      this.HasLoaded = this.ActiveSet.HasLoaded;
      this.init();
    }
    hasInitialized = false;
    requestDateBackground = (request2) => {
      if (/* @__PURE__ */ new Date() > request2.Dates.EstClosed.Value()) return "table-danger";
    };
    getTableElementId = () => "tbl-requests-status-" + this.key + this.filter?.toLowerCase();
    refresh = async () => {
      await this.ActiveSet.load();
    };
    // getRequestAssignments = assignmentsStore.getByRequest;
    tableBodyComplete = (nodes) => {
      if (this.Table) this.Table.clear().destroy();
      this.Table = makeDataTable(this.getTableElementId());
    };
    init = async () => {
      await this.ActiveSet.init();
      this.hasInitialized = true;
    };
    dispose = () => {
    };
  };
  var OpenRequestsTableModule = class extends RequestsByStatusTableModule {
    constructor(params) {
      super(params);
    }
    static name = "open-requests-table";
    static template = openRequestsTableTemplate;
  };
  var OpenOfficeRequestsTableModule = class extends RequestsByStatusTableModule {
    constructor(params) {
      super(params);
    }
    static name = "open-office-requests-table";
    static template = openOfficeRequestsTableTemplate;
  };
  var ClosedRequestsTableModule = class extends RequestsByStatusTableModule {
    constructor(params) {
      super(params);
    }
    static name = "closed-requests-table";
    static template = closedRequestsTableTemplate;
  };

  // src/components/RequestsByServiceType/RequestsServiceTypeTemplate.js
  var requestsByServiceTypeTemplate = html2`
  <select
    class="form-select"
    data-bind="value: SelectedService, 
options: ServiceTypes, 
optionsCaption: 'Select...', 
optionsText: 'Title'"
  ></select>
  <!-- ko if: SelectedService -->
  <div
    data-bind="component: {name: 'requests-by-service-type-table', params: {key, service: SelectedService()}}"
  ></div>
  <!-- /ko -->
`;

  // src/components/RequestsByServiceType/RequestsByServiceTypeModule.js
  var RequestsByServiceTypeModule = class extends BaseComponent {
    constructor(params) {
      super();
      this.key = params.key;
    }
    ServiceTypes = ko.pureComputed(
      () => serviceTypeStore().filter(
        (serviceType) => serviceType.userCanInitiate(currentUser())
      )
    );
    SelectedService = ko.observable();
    static name = "requests-by-service-type";
    static template = requestsByServiceTypeTemplate;
  };

  // src/components/RequestsByServiceType/RequestsServiceTypeTableTemplate.js
  var requestsByServiceTypeTableTemplate = html2`
  <!-- ko if: HasInitialized -->
  <div class="my-3">
    <table
      class="table table-striped table-hover"
      data-bind="childrenComplete: tableHasRendered, attr: {'id': getTableElementId()}"
    >
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Requesting Office</th>
          <th>Requestor</th>
          <th>Request Status</th>
          <!-- ko foreach: SupplementCols -->
          <th data-bind="text: displayName"></th>
          <!-- /ko -->
        </tr>
      </thead>
      <tbody data-bind="foreach: {data: AllRequests, as: 'rmap'}">
        <tr class="pointer" data-bind="click: $root.ViewRequest">
          <td data-bind="text: Title"></td>
          <td data-bind="text: RequestorInfo.Office()?.Title"></td>
          <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
          <td data-bind="text: State.Status"></td>
          <!-- ko foreach: $parent.SupplementCols -->
          <td
            data-bind="text: rmap.RequestBodyBlob?.Value().FieldMap[key]?.toString()"
          ></td>
          <!-- /ko -->
        </tr>
      </tbody>
    </table>
  </div>
  <!-- /ko -->
`;

  // src/components/RequestsByServiceType/RequestsByServiceTypeTableModule.js
  var RequestsByServiceTypeTableModule = class extends BaseComponent {
    constructor({ service, key }) {
      super();
      if (window.DEBUG) console.log("New Service Type Table", service.Title);
      this.ServiceType = service;
      this.key = key;
      this._context = getAppContext();
      this.init();
    }
    HasInitialized = ko.observable();
    AllRequests = ko.observableArray();
    Supplements = ko.observableArray();
    requestMap = {};
    _context;
    requestCols = [
      "Title",
      "RequestingOffice",
      "Requestor",
      "RequestStatus",
      "RequestDescription"
    ];
    SupplementCols = ko.observableArray();
    getSupplementByRequestId = (request2) => {
      const supplement = this.Supplements().find(
        (supplement2) => supplement2.Request?.ID == request2.ID
      );
      if (!supplement) return null;
      return supplement;
    };
    getTableElementId = () => `tbl-requests-type-${this.key}-${this.ServiceType.UID}`;
    async init() {
      const requestMap = this.requestMap;
      const requestsPromise = await this._context.Requests.FindByColumnValue(
        [{ column: "ServiceType", value: this.ServiceType.ID }],
        { orderByColumn: "Title", sortAsc: false },
        {},
        RequestEntity.Views.ByServiceType
      ).then((requests) => {
        this.AllRequests(requests.results);
        requests.results.map((req) => {
          requestMap[req.Title] ? requestMap[req.Title].request = req : requestMap[req.Title] = { request: req };
        });
      });
      if (!this.ServiceType._constructor) {
        await requestsPromise;
        this.HasInitialized(true);
        return;
      }
      const sampleEntity = await this.ServiceType.instantiateEntity();
      Object.keys(sampleEntity.FieldMap).map(
        (key) => this.SupplementCols.push({
          key,
          displayName: sampleEntity.FieldMap[key]?.displayName ?? key
        })
      );
      this.HasInitialized(true);
    }
    tableHasRendered = () => {
      this.Table = makeDataTable(this.getTableElementId());
    };
    static name = "requests-by-service-type-table";
    static template = requestsByServiceTypeTableTemplate;
  };

  // src/components/MyAssignments/MyAssignmentsTemplate.js
  var myAssignmentsTemplate = html2`
  <table
    id="my-assignments-table"
    class="table table-striped table-hover w-100"
  >
    <thead>
      <tr>
        <th>Request</th>
        <th>Service Type</th>
        <th>Requesting Office</th>
        <th>Requestor</th>
        <th>Est Closed</th>
        <!-- <th>Role(s)</th> -->
      </tr>
    </thead>
    <!-- ko if: IsLoading -->
    <tbody data-bind="">
      <tr class="">
        <td colspan="6" class="p-0">
          <progress class="w-100"></progress>
        </td>
      </tr>
    </tbody>
    <!-- /ko -->
    <!-- ko ifnot: IsLoading -->
    <tbody
      data-bind="childrenComplete: myPostProcessingLogic, foreach: MyAssignedRequests"
    >
      <tr class="pointer" data-bind="click: () => $root.ViewRequest($data)">
        <td data-bind="text: Title"></td>
        <td data-bind="text: RequestType.Title"></td>
        <td data-bind="text: RequestorInfo.Office()?.Title"></td>
        <td data-bind="text: RequestorInfo.Requestor()?.Title"></td>
        <td data-bind="text: Dates.EstClosed.toSortableDateString()"></td>
        <!-- ko if: false -->
        <td>
          <!-- ko foreach: Assignments.list.CurrentUserAssignments -->
          <div
            class="position-relative my-1 py-1 alert"
            data-bind="class: $parents[1].assignmentStatusClass($data)"
          >
            <span data-bind="text: Role"> </span>
          </div>
          <!-- /ko -->
        </td>
        <!-- /ko -->
      </tr>
    </tbody>
    <!-- /ko -->
  </table>

  <!-- <div>
  <p>Legend:</p>
  <div class="badge rounded-pill text-bg-warning">In Progress</div>
  <div class="badge rounded-pill text-bg-success">Completed</div>
  <div class="badge rounded-pill text-bg-secondary">No Action</div>
</div> -->
`;

  // src/components/MyAssignments/MyAssignmentsModule.js
  var MyAssignmentsModule = class extends BaseComponent {
    constructor(Assignments) {
      super();
    }
    HasLoaded = ko.observable(false);
    IsLoading = requestsByStatusMap.get(requestStates.open).IsLoading;
    AllOpenRequests = requestsByStatusMap.get(requestStates.open).List;
    MyAssignedRequests = assignmentsStore.MyAssignedRequests;
    assignmentStatusClass = (assignment) => {
      switch (assignment.Status) {
        case assignmentStates.InProgress:
          return "alert-warning";
        default:
          return "alert-secondary";
      }
    };
    assignmentBadgeText = (assignment) => {
      switch (assignment.Status) {
        case assignmentStates.InProgress:
          return "In Progress";
        case assignmentStates.Completed:
          return "Completed";
        default:
          return null;
      }
    };
    assignmentBadgeClass = (assignment) => {
      switch (assignment.Status) {
        case assignmentStates.InProgress:
          return "bg-warning";
        case assignmentStates.Completed:
          return "bg-success";
        default:
          break;
      }
    };
    listBeforeChangeWatcher = () => {
      if (window.DEBUG) console.log("destroying table");
      if (!this.Table) return;
      this.Table.clear().destroy();
    };
    listAfterChangeWatcher = () => {
      if (window.DEBUG) console.log("creating table");
      setTimeout(() => this.Table = makeDataTable("my-assignments-table"), 20);
    };
    myPostProcessingLogic = (nodes) => {
      this.Table = makeDataTable("my-assignments-table");
    };
    init = async () => {
      this.HasLoaded(true);
    };
    dispose = () => {
      this.listAfterChangeSubscription.dispose();
      this.listAfterChangeSubscription.dispose();
    };
    static name = "my-assignments-table";
    static template = myAssignmentsTemplate;
  };

  // src/components/RequestHeader/RequestHeaderEditTemplate.js
  var requestHeaderEditTemplate = html2`
  <div class="container-fluid">
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Request Status:</h6>
        <p class="state-draft">Draft</p>
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <label
          ><h6>Request ID:</h6>
          <p data-bind="text: ObservableTitle"></p
        ></label>
      </div>
      <div class="col-6 pb-2">
        <div class="form-group">
          <label><h6>Requesting Org:</h6></label>
          <select
            class="form-control"
            data-bind="value: RequestorInfo.Office,
        options: AvailableRequestorOffices,
        optionsText: (ro) => ro.Title"
          ></select>
          <!-- <p>
            GTM:
            <span
              data-bind="text: RequestorInfo.Office()?.GTM?.LookupValue"
            ></span>
          </p> -->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Requestor:</h6>
        <div
          id="people-requestor"
          data-bind="people: RequestorInfo.Requestor"
        ></div>
      </div>
      <div class="col-6 pb-2">
        <h6>Requestor Office:</h6>
        <input
          class="form-control"
          data-bind="value: RequestorInfo.OfficeSymbol.Value"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-6 pb-2">
        <h6>Requestor Phone:</h6>
        <input
          type="tel"
          class="form-control"
          data-bind="value: RequestorInfo.Phone"
        />
      </div>
      <div class="col-6 pb-2">
        <h6>Requestor Email:</h6>
        <input
          type="email"
          class="form-control"
          class="fluid"
          data-bind="value: RequestorInfo.Email"
        />
      </div>
      <div class="col-12 pb-2">
        <h6>Service Type:</h6>
        <p data-bind="text: RequestType.Title"></p>
      </div>
    </div>
  </div>
`;

  // src/components/RequestHeader/RequestHeaderViewTemplate.js
  var requestHeaderViewTemplate = html2`
  <div class="container-fluid">
    <div class="row">
      <div class="col-6">
        <h6>Request Status:</h6>
        <p
          data-bind="text: State.Status, class: 'state-' + State.Status()?.toLowerCase()"
        ></p>
      </div>
      <!-- ko if: Dates.Closed.get -->
      <div class="col-6">
        <h6>Closed:</h6>
        <p data-bind="text: Dates.Closed.toLocaleDateString()"></p>
      </div>
      <!-- /ko -->
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Request ID:</h6>
        <p data-bind="text: ObservableTitle"></p>
      </div>
      <div class="col-6">
        <h6>Requesting Org:</h6>
        <p data-bind="text: RequestorInfo.Office()?.Title"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Requestor:</h6>
        <p data-bind="text: RequestorInfo.Requestor()?.Title"></p>
      </div>
      <div class="col-6">
        <h6>Requestor Office:</h6>
        <p data-bind="text: RequestorInfo.OfficeSymbol.Value"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h6>Requestor Phone:</h6>
        <p data-bind="text: RequestorInfo.Phone"></p>
      </div>
      <div class="col-6">
        <h6>Requestor Email:</h6>
        <p data-bind="text: RequestorInfo.Email"></p>
      </div>
      <div class="col-6">
        <h6>Submitted Date:</h6>
        <p data-bind="text: Dates.Submitted.toLocaleString()"></p>
      </div>
      <div class="col-6">
        <h6>Service Type:</h6>
        <p data-bind="text: RequestType.Title"></p>
      </div>
    </div>
  </div>
`;

  // src/components/RequestHeader/RequestHeaderModules.js
  var RequestHeaderModule = class extends BaseComponent {
    constructor(request2) {
      super();
      Object.assign(this, request2);
    }
    AvailableRequestorOffices = ko.pureComputed(() => {
      return currentUser()?.RequestingOffices();
    });
    AvailableServiceTypes = ko.pureComputed(() => {
      return serviceTypeStore().filter(
        (serviceType) => serviceType.userCanInitiate(currentUser())
      );
    });
  };
  var RequestHeaderViewModule = class extends RequestHeaderModule {
    constructor(request2) {
      super(request2);
    }
    static name = "request-header-view";
    static template = requestHeaderViewTemplate;
  };
  var RequestHeaderEditModule = class extends RequestHeaderModule {
    constructor(request2) {
      super(request2);
    }
    static name = "request-header-edit";
    static template = requestHeaderEditTemplate;
  };

  // src/components/Pipeline/PipelineTemplate.js
  var pipelineTemplate = html2`
  <div class="card pipeline-module">
    <div class="card-body p-0">
      <div class="card-title d-flex m-0" data-bind="">
        <div class="d-flex flex-column justify-content-center mx-3 p-1">
          <i class="fa fa-3x" data-bind="class: Pipeline.Icon"></i>
        </div>
        <div class="flex-grow-1 bg-light-gray">
          <ol class="p-0 m-0 mt-4 d-flex">
            <!-- ko foreach: Pipeline.Stages -->
            <li
              class="d-flex stage-item flex-column justify-content-center px-3 py-1"
              data-bind="class: $parent.listItemTypeClass($data),
            click: $parent.setSelected"
            >
              <div class="d-flex align-items-center" data-bind="">
                <h4 style="color: inherit" data-bind="text: Step"></h4>
                <div class="mx-2"></div>
                <div>
                  <div class="fw-bold" data-bind="text: Title"></div>
                  <p data-bind="text: $parent.listItemSubText($data)"></p>
                </div>
              </div>
            </li>
            <!-- /ko -->
          </ol>
        </div>
      </div>
      <!-- ko if: ShowActionsArea -->
      <div class="">
        <div class="p-3">
          <div data-bind="using: SelectedStageDetail">
            <!-- ko if: IsCurrentStage() && CurrentUserActionableAssignments().length -->
            <div>
              <p class="text-secondary">
                Please complete the following assignment actions to advance this
                request.
              </p>
              <!-- ko foreach: CurrentUserActionableAssignments -->
              <div data-bind="foreach: Errors">
                <div
                  class="alert alert-warning"
                  role="alert"
                  data-bind="text: description"
                ></div>
              </div>
              <!-- ko using: getComponent({request: $parent.request}) -->
              <div
                data-bind="component: { name: actionComponentName, params: $data }"
              ></div>
              <!-- /ko -->
              <!-- /ko -->
            </div>
            <!-- /ko -->
            <div class="mt-4 accordion-item">
              <div class="accordion-header pointer">
                <h5
                  class="accordion-title collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#stage-assignment-body"
                  aria-expanded="false"
                >
                  Stage Assignments <i class="indicator fa fa-caret-down"></i>
                </h5>
              </div>
              <div
                id="stage-assignment-body"
                class="accordion-collapse collapse"
                style=""
              >
                <p class="text-secondary">
                  View and manage all assignments for this stage.
                </p>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Assigned To</th>
                      <th>Request Org</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Completed By</th>
                      <th>Completed On</th>
                      <!-- ko if: IsCurrentStage -->
                      <th>Action</th>
                      <!-- /ko -->
                    </tr>
                  </thead>
                  <tbody>
                    <!-- ko foreach: AllStageAssignments -->
                    <!-- <tr
                  data-bind="
                  css: {'pointer': isUserActionable()},
                  click: toggleExpanded
                  "
                > -->
                    <tr>
                      <td data-bind="text: Assignee?.Title"></td>
                      <td data-bind="text: RequestOrg?.Title"></td>
                      <td data-bind="text: Role"></td>
                      <td data-bind="text: Status"></td>
                      <td data-bind="text: ActionTaker?.Title ?? 'N/A'"></td>
                      <td
                        data-bind="text: CompletionDate?.toLocaleString() ?? 'N/A'"
                      ></td>
                      <!-- ko if: $parent.IsCurrentStage -->
                      <td>
                        <!-- ko if: $parent.userCanAssign -->
                        <i
                          class="fas fa-search pointer"
                          data-bind="click: $parent.view"
                        ></i>
                        <i
                          class="fa fa-trash pointer"
                          data-bind="click: $parent.remove"
                        ></i>
                        <!-- /ko -->
                      </td>
                      <!-- /ko -->
                    </tr>
                    <!-- ko if: false && $parent.IsCurrentStage() && isUserActionable() && isExpanded() -->
                    <tr>
                      <td colspan="7" data-bind=""></td>
                    </tr>
                    <!-- /ko -->
                    <!-- /ko -->
                  </tbody>
                </table>
                <!-- ko if: userCanAssign() -->
                <div
                  data-bind="component: { name: 'new-assignment', params: {addAssignment: addNew } }"
                ></div>
                <!-- /ko -->
              </div>
            </div>
          </div>
          <!-- ko if: false -->
          <div>
            <!-- ko using: request.Assignments.CurrentStage -->
            <!-- ko if: AssignmentComponents().length -->
            <div data-bind="foreach: Validation.Errors">
              <div
                class="alert alert-warning"
                role="alert"
                data-bind="text: description"
              ></div>
            </div>
            <div class="">
              <!-- ko foreach: AssignmentComponents -->
              <div
                data-bind="component: {name: actionComponentName, params: $data }"
              ></div>
              <!-- /ko -->
            </div>
            <!-- /ko -->
            <!-- /ko -->
          </div>
          <!-- /ko -->
        </div>
      </div>
      <!-- /ko -->
    </div>
  </div>
`;

  // src/components/Pipeline/PipelineModule.js
  var PipelineModule = class extends BaseComponent {
    constructor({ request: request2 }) {
      super();
      this.request = request2;
      this.Pipeline = request2.Pipeline;
      this.allPipelineDetails = this.request.Pipeline.Stages().filter((stage) => stage.ActionType != stageActionTypes.Closed).map((stage) => new PipelineStageDetail({ request: request2, stage }));
      this.Pipeline.Stage.subscribe(this.SelectedStage);
      this.SelectedStage(this.Pipeline.Stage());
    }
    ShowActionsArea = ko.pureComputed(() => this.SelectedStageDetail());
    // TODO: Minor - Show the completion date of each stage
    listItemShowBorderlessBottom = (stage) => {
      return this.Pipeline.Stage()?.Step == stage.Step && this.ShowActionsArea();
    };
    listItemTypeClass = (stage) => {
      if (this.SelectedStage()?.ID == stage.ID && stage.ActionType != stageActionTypes.Closed) {
        return "bg-primary text-white pointer active";
      }
      if (stage.Step < this.Pipeline.Stage()?.Step)
        return "bg-secondary text-white pointer";
      if (this.Pipeline.Stage()?.ID == stage.ID) {
        switch (this.request.State.Status()) {
          case requestStates.open:
            return "bg-primary-subtle pointer";
          case requestStates.cancelled:
          case requestStates.rejected:
            return "bg-danger text-white pointer";
          case requestStates.fulfilled:
            return "bg-success text-white pointer";
          default:
            break;
        }
      }
    };
    listItemSubText = (stage) => {
      const stageAction = ko.unwrap(stage?.ActionType);
      if (!stageAction) return "";
      if (stageActionTypes.Closed == stageAction) {
        return stageAction;
      }
      const thisStepNum = stage.Step ?? 0;
      const nextStepNum = thisStepNum + 1;
      const nextStage = this.Pipeline.Stages()?.find(
        (nStage) => nStage.Step == nextStepNum
      );
      const advancedAction = this.request.Actions.list.All().find((action) => {
        if (nextStage.ActionType == stageActionTypes.Closed)
          return action.ActionType == actionTypes.Closed;
        return action.PipelineStage?.Step == nextStage.Step && action.ActionType == actionTypes.Advanced;
      });
      if (!advancedAction) return stageAction;
      return "Completed: " + advancedAction.Created?.toLocaleDateString();
    };
    setSelected = (stage) => {
      if (!this.Pipeline.Stage() || stage.Step > this.Pipeline.Stage()?.Step)
        return;
      this.SelectedStage(stage);
    };
    SelectedStage = ko.observable();
    SelectedStageDetail = ko.pureComputed(
      () => this.allPipelineDetails.find(
        (detail) => detail.stage.ID == this.SelectedStage()?.ID
      )
      // new PipelineStageDetail({
      //   request: this.request,
      //   stage: this.SelectedStage(),
      // })
    );
    StageDetail;
    static name = "pipeline-component";
    static template = pipelineTemplate;
  };
  var PipelineStageDetail = class {
    constructor({ request: request2, stage }) {
      this.request = request2;
      this.stage = stage;
    }
    IsCurrentStage = ko.pureComputed(
      () => this.request.Pipeline.Stage()?.ID == this.stage.ID
    );
    AllStageAssignments = ko.pureComputed(() => {
      return this.request.Assignments.list.All().filter((assignment) => assignment.PipelineStage.ID == this.stage.ID);
    });
    CurrentUserActionableAssignments = ko.pureComputed(
      () => this.AllStageAssignments().filter(
        (assignment) => assignment.isUserActionable()
      )
    );
    view = (assignment) => this.request.Assignments.view(assignment);
    remove = (assignment) => this.request.Assignments.remove(assignment);
    addNew = (assignment) => this.request.Assignments.addNew(assignment);
    userCanAssign = ko.pureComputed(() => {
      const user = currentUser();
      return this.IsCurrentStage() && user.isInRequestOrg(this.stage.RequestOrg);
    });
  };

  // src/components/QuickInfo/QuickInfoTemplate.js
  var quickInfoTemplate = html2`
  <div id="quick-info" class="d-flex justify-content-between mb-3">
    <div class="action-group d-flex flex-column justify-content-end">
      <!-- ko if: ShowActionOfficeToggle -->
      <div class="form-check form-switch">
        <label class="form-check-label"
          >Enable System Action Office Features
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            data-bind="checked: ToggleActionOfficeFeatures"
        /></label>
      </div>
      <!-- /ko -->
      <button
        class="btn btn-primary mb-3"
        data-bind="click: $root.SelectNewRequest"
        type="button"
      >
        New Request <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="ms-auto status-cards" style="min-width: 20rem">
      <div class="status-info open-assignments">
        <div
          class="card info-header"
          title="Toggle Open Assignments"
          data-bind="click: toggleInfoContainer"
        >
          <div class="card-body">
            <img
              src="/sites/CGFS/Style Library/apps/wo/assets/Direct Assignments.svg"
            />
            <h5 data-bind="text: MyOpenAssignments().length"></h5>
            Open Assignments
          </div>
        </div>
        <div
          class="info-table-container alert"
          data-bind="class: MyOpenAssignments().length > 0 ? 'alert-warning' : 'alert-success'"
        >
          <div class="card-body">
            <!-- ko ifnot: MyOpenAssignments().length -->
            <p>Nothing to Show!</p>
            <!-- /ko -->
            <!-- ko if: MyOpenAssignments().length -->
            <table class="table table-warning table-sm table-hover m-0">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Assignee</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody data-bind="foreach: MyOpenAssignments">
                <tr
                  title="Go to Request"
                  class="pointer"
                  data-bind="click: () => $root.viewRequestByTitle($data.Request.Title)"
                >
                  <td data-bind="text: Request.Title"></td>
                  <td data-bind="text: Assignee?.Title"></td>
                  <td data-bind="text: Role"></td>
                </tr>
              </tbody>
            </table>
            <!-- /ko -->
          </div>
        </div>
      </div>
      <!-- ko if: ShowActionOfficeFeatures -->
      <div class="status-info late-requests">
        <div
          class="card info-header"
          title="Toggle Team Late Requests"
          data-bind="click: toggleInfoContainer"
        >
          <div class="card-body">
            <img
              src="/sites/CGFS/Style Library/apps/wo/assets/Late Requests.svg"
            />
            <h5 data-bind="text: LateRequests().length"></h5>
            Late Requests
          </div>
        </div>
        <div
          class="info-table-container alert"
          data-bind="class: LateRequests().length > 0 ? 'alert-danger' : 'alert-success'"
        >
          <div class="card-body">
            <!-- ko ifnot: LateRequests().length -->
            <p>Nothing to Show!</p>
            <!-- /ko -->
            <!-- ko if: LateRequests().length -->
            <table class="table table-danger table-sm table-hover m-0">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Service Type</th>
                  <th>Est. Closed Date</th>
                </tr>
              </thead>
              <tbody data-bind="foreach: LateRequests">
                <tr
                  class="pointer"
                  title="Go to Request"
                  data-bind="click: $root.ViewRequest"
                >
                  <td data-bind="text: Title"></td>
                  <td data-bind="text: RequestType.Title"></td>
                  <td
                    data-bind="text: Dates.EstClosed.toLocaleDateString()"
                  ></td>
                </tr>
              </tbody>
            </table>
            <!-- /ko -->
          </div>
        </div>
      </div>
      <div
        class="w-full"
        data-bind='component: "pending-request-ingests"'
      ></div>
      <!-- /ko -->
    </div>
  </div>

  <style>
    #quick-info {
      gap: 1rem;
    }

    #quick-info .action-group {
      min-width: 224px;
      width: 224px;
      padding: 1rem;
    }

    #quick-info .status-cards {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: end;
    }

    #quick-info img {
      width: 2.5rem;
      height: 2.5rem;
      background-color: white;
      border-radius: 6px;
      margin-bottom: 8px;
      padding: 0.25rem;
    }

    .status-info {
      display: flex;
      flex-direction: row;
      justify-content: end;
    }

    .status-info .info-header {
      height: 138px;
      width: 230px;
      color: white;
      cursor: pointer;
      z-index: 5;
    }

    .status-info .info-header:hover {
      filter: brightness(0.9);
    }

    .status-info.open-assignments .info-header {
      background: linear-gradient(145deg, #4d547e, #303346);
    }

    .status-info.late-requests .info-header {
      background: linear-gradient(145deg, #fc6f7f, #ec1719);
    }

    .status-info .info-table-container {
      /* display: none; */
      border-radius: 6px;
      position: relative;
      left: -34px;
      z-index: 4;
      overflow: hidden;
      max-height: 0px;
      transition: max-height 0.35s ease-out;
      max-width: 0px;
      transition: max-width 0.35s ease-out;
    }

    .status-info.active .info-table-container {
      padding: 1rem 1rem 1rem 50px;
      max-height: 450px;
      transition: max-height 0.35s ease-in;
      max-width: 500px;
      transition: max-width 0.35s ease-in;
    }

    .status-info .info-table-container .card-body {
      max-height: 198px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .status-info .info-table-container table thead {
      position: sticky;
      top: 0;
      text-wrap: nowrap;
    }
    /* #quick-info .status-info {
    display: block;
  } */
  </style>
`;

  // src/components/QuickInfo/QuickInfoModule.js
  var QuickInfoModule = class extends BaseComponent {
    constructor({ ShowActionOfficeFeatures, ToggleActionOfficeFeatures }) {
      super();
      this.ShowActionOfficeFeatures = ShowActionOfficeFeatures;
      this.ToggleActionOfficeFeatures = ToggleActionOfficeFeatures;
    }
    ShowActionOfficeToggle = ko.pureComputed(() => {
      return currentUser()?.IsActionOffice() && false;
    });
    MyOpenAssignments = assignmentsStore.MyActiveAssignments;
    LateRequests = ko.pureComputed(() => {
      return requestsByStatusMap.get(requestStates.open)?.List()?.filter((request2) => {
        return request2.Dates.EstClosed.Value() <= /* @__PURE__ */ new Date();
      }) ?? [];
    });
    toggleInfoContainer = (data2, event) => {
      event.target.closest(".status-info").classList.toggle("active");
    };
    static name = "quick-info";
    static template = quickInfoTemplate;
  };

  // src/components/NewAssignment/NewAssignmentTemplate.js
  var newAssignmentTemplate = html2`
  <div class="input-group">
    <span class="input-group-text">Add New Assignment</span>
    <div
      class="people-new-assignee"
      data-bind="attr: {id: getAsigneeElementID()}, people: Assignee"
    ></div>
    <select
      name=""
      id=""
      class="form-select"
      data-bind="value: Role,
      options: Roles,
      optionsText: (role) => role.LookupValue,
      optionsCaption: 'Select...'"
    ></select>
    <button
      type="button"
      class="btn btn-primary"
      data-bind="click: submit,
    enable: Role() && Assignee()"
    >
      Submit
    </button>
  </div>
  <!-- ko if: Role -->
  <div class="mt-2 p-1 ps-2 alert alert-info">
    <strong><span data-bind="text: Role().LookupValue"></span>:</strong>
    <span data-bind="text: Role().description"></span>
  </div>
  <!-- /ko -->
`;

  // src/components/NewAssignment/NewAssignmentModule.js
  var NewAssignmentModule = class extends BaseComponent {
    constructor({ addAssignment, stage = null }) {
      super();
      this.stage = stage;
      this.addAssignment = addAssignment;
      this.uniqueInt = Math.floor(Math.random() * 100);
      if (this.stage) {
        this.Role(stageActionRoleMap[this.stage.ActionType]);
      }
    }
    getAsigneeElementID = () => `people-new-assignee-${this.uniqueInt}`;
    Assignee = ko.observable();
    Role = ko.observable();
    Roles = Object.values(roles);
    // .map((key) => {
    //   return {
    //     key,
    //     value: roles[key].LookupValue,
    //   };
    // });
    submit = async () => {
      const assignment = {
        Role: this.Role(),
        Assignee: this.Assignee(),
        PipelineStage: this.stage,
        RequestOrg: this.stage?.RequestOrg
      };
      try {
        await this.addAssignment(assignment);
      } catch (e) {
        console.error("Unable to save assignment", e);
        alert("Something went wrong saving the assignment");
        return;
      }
      this.Assignee(null);
      this.Role(null);
    };
    static name = "new-assignment";
    static template = newAssignmentTemplate;
  };

  // src/components/Toasts/TaskToastTemplate.js
  var taskToastTemplate = html2`
  <div
    class="toast show align-items-center"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body" data-bind="text: FormatMessage"></div>
      <button
        type="button"
        class="btn-close me-1 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
`;

  // src/components/Toasts/TaskToastModule.js
  var TaskToastModule = class extends BaseComponent {
    constructor(task) {
      Object.assign(this, task);
    }
    FormatMessage = ko.pureComputed(() => `${this.msg}... ${this.Status()}`);
    static name = "task-toast";
    static template = taskToastTemplate;
  };

  // src/infrastructure/RegisterComponents.js
  var html4 = String.raw;
  function RegisterComponents() {
    for (const key in components_exports) {
      const component = components_exports[key];
      if (component.prototype instanceof BaseComponent) {
        registerComponentFromConstructor(component);
      }
    }
  }
  function registerComponentFromConstructor(constructor) {
    ko.components.register(constructor.name, {
      template: constructor.template,
      viewModel: constructor
    });
  }

  // src/views/NewRequestView.js
  var NewRequestView = class {
    templateId = "tmpl-request-detail";
    ServiceTypeStore = serviceTypeStore;
    SelectedServiceType = ko.observable();
    ActiveServiceTypes = ko.pureComputed(
      () => serviceTypeStore().filter(
        (serviceType) => serviceType.userCanInitiate(currentUser())
      )
    );
    formatAttachmentDescription = () => {
      const desc = this.SelectedServiceType()?.AttachmentDescription;
      if (desc && Boolean(desc.trim())) {
        return desc;
      }
      return "<i>Not applicable.</i>";
    };
    getDescriptionModal = () => document.getElementById("dialog-new-request-detail");
    selectServiceTypeHandler = (data2, e) => {
      this.SelectedServiceType(data2);
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 460);
    };
    cancelCreateServiceType = () => {
      this.SelectedServiceType(null);
    };
    confirmCreateServiceType = async () => {
      const serviceType = this.SelectedServiceType();
      this.SelectedServiceType(null);
      await serviceType.initializeEntity();
      const newRequest = new RequestEntity({
        ServiceType: serviceType
      });
      window.WorkOrder.App.NewRequest({ request: newRequest });
    };
    constructor() {
      console.log("new");
    }
  };

  // src/views/OfficeRequestsView.js
  var byServiceTypeKey = "By Service Type";
  var tableComponentMap = {};
  tableComponentMap[requestStates.open] = "open-office-requests-table";
  tableComponentMap[requestStates.fulfilled] = "closed-requests-table";
  tableComponentMap[requestStates.cancelled] = "closed-requests-table";
  tableComponentMap[requestStates.rejected] = "closed-requests-table";
  tableComponentMap[byServiceTypeKey] = "requests-by-service-type";
  var OfficeRequestsView = class {
    constructor() {
      this.RequestsByStatusMap = requestsByStatusMap;
      this.ShowAssignments.subscribe(this.showAssignmentsWatcher);
      this.ActiveKey(requestStates.open);
    }
    async init() {
      const openRequests = this.RequestsByStatusMap.get(requestStates.open);
      await openRequests.init();
      await assignmentsStore.init();
      this.HasLoaded(true);
    }
    byServiceTypeKey = byServiceTypeKey;
    HasLoaded = ko.observable(false);
    ShowAssignments = ko.observable(false);
    ActiveKey = ko.observable();
    ActiveTableComponentName = ko.pureComputed(
      () => tableComponentMap[this.ActiveKey()]
    );
    ActiveTableParams = ko.pureComputed(() => {
      if (this.RequestsByStatusMap.has(this.ActiveKey())) {
        const activeRequestSet = this.RequestsByStatusMap.get(this.ActiveKey());
        const filteredRequests = ko.pureComputed(
          () => activeRequestSet.List().filter(
            (request2) => request2.RequestOrgs().find(currentUser().isInRequestOrg)
          )
        );
        return {
          activeRequestSet,
          filteredRequests,
          key: "office"
        };
      }
      return {
        key: "office"
      };
    });
    showAssignmentsWatcher = (showAssignments) => {
      console.log("assignments toggled");
    };
    StatusOptions = ko.pureComputed(() => {
      return [...this.RequestsByStatusMap.keys()];
    });
  };

  // src/views/MyRequestsView.js
  var byServiceTypeKey2 = "By Service Type";
  var tableComponentMap2 = {};
  tableComponentMap2[requestStates.open] = "open-requests-table";
  tableComponentMap2[requestStates.fulfilled] = "closed-requests-table";
  tableComponentMap2[requestStates.cancelled] = "closed-requests-table";
  tableComponentMap2[requestStates.rejected] = "closed-requests-table";
  tableComponentMap2[byServiceTypeKey2] = "requests-by-service-type";
  var MyRequestsView = class {
    constructor() {
      this.RequestsByStatusMap = requestsByStatusMap;
      this.ActiveKey(requestStates.open);
    }
    async init() {
      const openRequests = this.RequestsByStatusMap.get(requestStates.open);
      await openRequests.init();
      this.HasLoaded(true);
    }
    HasLoaded = ko.observable(false);
    ActiveKey = ko.observable();
    ActiveTableComponentName = ko.pureComputed(
      () => tableComponentMap2[this.ActiveKey()]
    );
    ActiveTableParams = ko.pureComputed(() => {
      if (this.RequestsByStatusMap.has(this.ActiveKey())) {
        const activeRequestSet = this.RequestsByStatusMap.get(this.ActiveKey());
        return {
          activeRequestSet,
          filteredRequests: activeRequestSet.List,
          key: "my"
        };
      }
      return {
        key: "my"
      };
    });
    StatusOptions = ko.pureComputed(() => {
      return [...this.RequestsByStatusMap.keys()];
    });
  };

  // src/common/KnockoutExtensions.js
  ko.subscribable.fn.subscribeChanged = function(callback) {
    var oldValue;
    this.subscribe(
      function(_oldValue) {
        oldValue = _oldValue;
      },
      this,
      "beforeChange"
    );
    this.subscribe(function(newValue) {
      callback(newValue, oldValue);
    });
  };
  ko.observableArray.fn.subscribeAdded = function(callback) {
    this.subscribe(
      function(arrayChanges) {
        const addedValues = arrayChanges.filter((value) => value.status == "added").map((value) => value.value);
        callback(addedValues);
      },
      this,
      "arrayChange"
    );
  };
  ko.bindingHandlers.dateField = {
    init: function(element, valueAccessor, allBindingsAccessor) {
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
  };
  ko.bindingHandlers.files = {
    init: function(element, valueAccessor) {
      function addFiles(fileList) {
        var value = valueAccessor();
        if (!fileList.length) {
          value.removeAll();
          return;
        }
        const existingFiles = ko.unwrap(value);
        const newFileList = [];
        for (let file of fileList) {
          if (!existingFiles.find((exFile) => exFile.name == file.name))
            newFileList.push(file);
        }
        ko.utils.arrayPushAll(value, newFileList);
        return;
      }
      ko.utils.registerEventHandler(element, "change", function() {
        addFiles(element.files);
      });
      const label = element.closest("label");
      if (!label) return;
      ko.utils.registerEventHandler(label, "dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
      ko.utils.registerEventHandler(label, "dragenter", function(event) {
        event.preventDefault();
        event.stopPropagation();
        label.classList.add("dragging");
      });
      ko.utils.registerEventHandler(label, "dragleave", function(event) {
        event.preventDefault();
        event.stopPropagation();
        label.classList.remove("dragging");
      });
      ko.utils.registerEventHandler(label, "drop", function(event) {
        event.preventDefault();
        event.stopPropagation();
        let dt = event.originalEvent.dataTransfer;
        let files = dt.files;
        addFiles(files);
      });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const value = valueAccessor();
      if (!value().length && element.files.length) {
        element.value = null;
        return;
      }
      return;
    }
  };
  ko.bindingHandlers.toggles = {
    init: function(element, valueAccessor) {
      var value = valueAccessor();
      ko.utils.registerEventHandler(element, "click", function() {
        value(!value());
      });
    }
  };
  ko.bindingHandlers.people = {
    init: function(element, valueAccessor, allBindings) {
      const pickerOptions = allBindings.get("pickerOptions") ?? {};
      if (ko.isObservable(pickerOptions)) {
        pickerOptions.subscribe(initPickerElement);
      }
      initPickerElement(ko.unwrap(pickerOptions));
      function initPickerElement(pickerOptions2) {
        var schema = {};
        schema["PrincipalAccountType"] = "User";
        schema["SearchPrincipalSource"] = 15;
        schema["ShowUserPresence"] = true;
        schema["ResolvePrincipalSource"] = 15;
        schema["AllowEmailAddresses"] = true;
        schema["AllowMultipleValues"] = false;
        schema["MaximumEntitySuggestions"] = 50;
        Object.assign(schema, pickerOptions2);
        schema["OnUserResolvedClientScript"] = async function(elemId, userKeys) {
          const multiple = schema.AllowMultipleValues;
          var pickerControl = SPClientPeoplePicker.SPClientPeoplePickerDict[elemId];
          var observable = valueAccessor();
          var userJSObjects = pickerControl.GetControlValueAsJSObject();
          if (!userJSObjects.length) {
            multiple ? observable.removeAll() : observable(null);
            return;
          }
          if (!multiple) {
            const userObj = userJSObjects[0];
            if (userObj.IsResolved) {
              if (userObj.Key == observable()?.LoginName) return;
              var user = await ensureUserByKeyAsync(userObj.Key);
              var person = new People(user);
              observable(person);
            }
            return;
          }
          const currentUserKeys = observable().map((u) => u.LoginName);
          const people = await Promise.all(
            userJSObjects.filter((userObj) => userObj.IsResolved).map(async (userObj) => {
              const existingUser = observable().find(
                (u) => u.LoginName == userObj.Key
              );
              if (existingUser) return existingUser;
              var user2 = await ensureUserByKeyAsync(userObj.Key);
              return new People(user2);
            })
          );
          observable(people);
        };
        SPClientPeoplePicker_InitStandaloneControlWrapper(
          element.id,
          null,
          schema
        );
        for (const input of document.getElementById(element.id).querySelectorAll("input")) {
          input.setAttribute("autocomplete", "off");
          input.setAttribute("aria-autocomplete", "none");
        }
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      const pickerOptions = ko.unwrap(allBindings.get("pickerOptions") ?? {});
      var pickerControl = SPClientPeoplePicker.SPClientPeoplePickerDict[element.id + "_TopSpan"];
      var userValue = ko.unwrap(valueAccessor());
      if (!pickerOptions.AllowMultipleValues) {
        if (!userValue) {
          pickerControl?.DeleteProcessedUser();
          return;
        }
        if (userValue && !pickerControl.GetAllUserInfo().find((pickerUser) => pickerUser.DisplayText == userValue.LookupValue)) {
          pickerControl.AddUserKeys(
            userValue.LoginName ?? userValue.LookupValue ?? userValue.Title
          );
        }
        return;
      }
      if (!userValue.length) {
        pickerControl?.DeleteProcessedUser();
        return;
      }
      userValue.map((u) => {
        if (!pickerControl.GetAllUserInfo().find((pickerUser) => pickerUser.DisplayText == u.LookupValue)) {
          pickerControl.AddUserKeys(u.LoginName ?? u.LookupValue ?? u.Title);
        }
      });
      pickerControl.GetAllUserInfo().map((pickerUser) => {
        if (!userValue.find((u) => u.LookupValue == pickerUser.DisplayText)) {
        }
      });
    }
  };
  var fromPathTemplateLoader = {
    loadTemplate: function(name, templateConfig, callback) {
      if (templateConfig.fromPath) {
        fetch(assetsPath + templateConfig.fromPath).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error Fetching HTML Template - ${response.statusText}`
            );
          }
          return response.text();
        }).catch((error2) => {
          if (!templateConfig.fallback) return;
          console.warn(
            "Primary template not found, attempting fallback",
            templateConfig
          );
          fetch(assetsPath + templateConfig.fallback).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error Fetching fallback HTML Template - ${response.statusText}`
              );
            }
            return response.text();
          }).then(
            (text) => ko.components.defaultLoader.loadTemplate(name, text, callback)
          );
        }).then(
          (text) => text ? ko.components.defaultLoader.loadTemplate(name, text, callback) : null
        );
      } else {
        callback(null);
      }
    }
  };
  ko.components.loaders.unshift(fromPathTemplateLoader);
  var fromPathViewModelLoader = {
    loadViewModel: function(name, viewModelConfig, callback) {
      if (viewModelConfig.viaLoader) {
        const module = import(assetsPath + viewModelConfig.viaLoader).then(
          (module2) => {
            const viewModelConstructor = module2.default;
            ko.components.defaultLoader.loadViewModel(
              name,
              viewModelConstructor,
              callback
            );
          }
        );
      } else {
        callback(null);
      }
    }
  };
  ko.components.loaders.unshift(fromPathViewModelLoader);

  // src/views/MyAssignmentsView.js
  var MyAssignmentsView = class {
    constructor() {
      this.init();
      this.IsLoading = assignmentsStore.IsLoading;
    }
    HasLoaded = ko.observable(false);
    init = async () => {
      await assignmentsStore.init();
      this.HasLoaded(true);
    };
  };

  // src/app.js
  window.WorkOrder = window.WorkOrder || {};
  async function CreateApp() {
    ko.options.deferUpdates = true;
    await InitSal();
    RegisterComponents();
    CreateAppContext();
    window.WorkOrder.App = await App.Create();
    ko.applyBindings(window.WorkOrder.App);
  }
  var App = class _App {
    constructor() {
      this.Tab.subscribe(tabWatcher);
      window.addEventListener("popstate", this.popStateHandler);
    }
    RunningTasks = runningTasks;
    BlockingTasks = blockingTasks;
    ToggleActionOfficeFeatures = ko.observable(true);
    ShowActionOfficeFeatures = ko.pureComputed(
      () => this.CurrentUser()?.IsActionOffice() && this.ToggleActionOfficeFeatures()
    );
    HasLoaded = ko.observable(false);
    CurrentUser = currentUser;
    context = getAppContext();
    Tab = ko.observable();
    TabClicked = (data2, e) => this.Tab(e.target.getAttribute("id"));
    popStateHandler = (event) => {
      if (event.state) {
        if (event.state.tab) this.Tab(event.state.tab);
      }
    };
    MyActiveAssignments = assignmentsStore.MyActiveAssignments;
    //   MyOpenAssignments = ko.pureComputed(() =>
    //   this.CurrentUser()
    //     ? assignmentsStore.getOpenByUser(this.CurrentUser())()
    //     : []
    // );
    Config = {
      pipelineStageStore,
      requestOrgStore: requestOrgStore2,
      serviceTypeStore,
      holidayStore
    };
    // Views
    OfficeRequestsView = new OfficeRequestsView();
    MyRequestsView = new MyRequestsView();
    MyAssignmentsView = new MyAssignmentsView();
    NewRequestView = new NewRequestView();
    RequestDetailView = new RequestDetailView();
    // RequestDetailView = ko.observable();
    Authorization = {
      currentUserIsAdmin: ko.pureComputed(() => {
        return currentUser()?.hasSystemRole(systemRoles.Admin);
      })
    };
    Init = async function() {
      configLists: {
        var pipelinesPromise = this.context.ConfigPipelines.ToList().then(
          this.Config.pipelineStageStore
        );
        var requestOrgsPromise = this.context.ConfigRequestOrgs.ToList().then(
          (arr) => this.Config.requestOrgStore(arr.sort(sortByTitle))
        );
        var serviceTypePromise = this.context.ConfigServiceTypes.ToList().then(
          async (arr) => {
            await Promise.all(
              arr.map(async (service) => service.initializeEntity())
            );
            this.Config.serviceTypeStore(arr.sort(sortByTitle));
          }
        );
        const holidaysPromise = this.context.ConfigHolidays.ToList().then(
          this.Config.holidayStore
        );
        const configResults = await Promise.all([
          requestOrgsPromise,
          pipelinesPromise,
          serviceTypePromise,
          holidaysPromise
        ]);
      }
      user: {
        this.CurrentUser(await User.Create());
      }
      routing: {
        var startTab = getUrlParam("tab") || Tabs.MyRequests;
        var reqId = getUrlParam("reqId");
        if (reqId && startTab == Tabs.RequestDetail) {
          this.viewRequestByTitle(reqId);
        } else if (startTab == Tabs.RequestDetail) {
          startTab = Tabs.NewRequest;
        }
        this.Tab(startTab);
      }
      requestIngests(await this.context.RequestIngests.ToList());
      this.HasLoaded(true);
    };
    SelectNewRequest = (data2, e) => {
      this.Tab(Tabs.NewRequest);
    };
    NewRequest = ({ request: request2 = null, serviceType = null }) => {
      const props = {
        request: request2 ?? new RequestEntity({}),
        displayMode: DisplayModes.New
      };
      setUrlParam("reqId", "");
      this.RequestDetailView.createNewRequest(props);
      this.Tab(Tabs.RequestDetail);
    };
    viewRequestByTitle = async (title) => {
      const results = await this.context.Requests.FindByColumnValue(
        [{ column: "Title", value: title }],
        {},
        {},
        RequestEntity.Views.All,
        false
      );
      if (!results.results.length) {
        console.warn("Request not found: ", title);
        return;
      }
      this.ViewRequest(results.results[0]);
    };
    ViewRequest = async (request2) => {
      setUrlParam("reqId", request2.Title);
      this.RequestDetailView.viewRequest({
        request: request2
      });
      this.Tab(Tabs.RequestDetail);
    };
    static Create = async function() {
      const report = new _App();
      await report.Init();
      return report;
    };
  };
  var tabWatcher = (newTab) => {
    if (!newTab) {
      return;
    }
    var tabTriggerElement = document.getElementById(newTab);
    var tab = new bootstrap.Tab(tabTriggerElement);
    setUrlParam("tab", newTab);
    tab.show();
  };
  if (document.readyState === "ready" || document.readyState === "complete") {
    CreateApp();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete" || document.readyState === "ready") {
        ExecuteOrDelayUntilScriptLoaded(function() {
          SP.SOD.executeFunc("sp.js", "SP.ClientContext", CreateApp);
        }, "sp.js");
      }
    };
  }

  // src/app_bundle.js
  document.getElementById("app").innerHTML = app_default;
})();
