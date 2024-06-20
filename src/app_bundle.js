// CSS Imports
import "../lib/quill/quill.snow.1.3.6.css";
import "../lib/bootstrap-5.3.0/css/bootstrap.min.css";
import "../lib/DataTables/datatables.min.css";
import "../lib/fontawesome-6.4.0/css/all.min.css";
import "./app.css";
// JS Imports
import "../lib/quill/quill.1.3.6.min.js";
import "../lib/bootstrap-5.3.0/js/bootstrap.bundle.min.js";
import "../lib/knockout/knockout-3.5.1.js";
import "../lib/knockout/knockout.mapping-latest.js";
import "../lib/DataTables/datatables.min.js";
import "../lib/webcomponents/searchselect/searchselect.js";
import appTemplate from "./app.txt";
import "./app.js";

document.findElementById("app").innerHTML = appTemplate;
