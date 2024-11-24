// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import { renderPlot } from "./render";
import { updateForm, setupForm } from "./form";

window.onload = () => {
  updateForm();
  setupForm();
  renderPlot();
};
