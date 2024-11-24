// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { renderPlot } from './render';
import { handleSubmit } from './form';

const componentsForm = document.getElementById("components-form");
componentsForm.addEventListener("submit", handleSubmit);
