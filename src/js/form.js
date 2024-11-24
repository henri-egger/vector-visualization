import { renderPlot } from "./render";
import { lsSet, lsGet } from "./localstorage";

export function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;

  storeFormData(form);

  renderPlot();
}

function storeFormData(form) {
  const formData = new FormData(form);

  const exprs = [
    formData.get("input-x"),
    formData.get("input-y"),
    formData.get("input-z"),
  ];

  const data = {
    exprs: exprs,
  };

  lsSet("formData", data);
}

export function updateForm() {
  const data = lsGet("formData");
  if (!data) {
    setDefaultForm();
    return;
  }
  const { exprs } = data;

  document.getElementById("input-x").value = exprs[0];
  document.getElementById("input-y").value = exprs[1];
  document.getElementById("input-z").value = exprs[2];
}

function setDefaultForm() {
  document.getElementById("input-x").value = "x";
  document.getElementById("input-y").value = "y";
  document.getElementById("input-z").value = "z";

  storeFormData(document.getElementById("config-form"));
}

export function setupForm() {
  const componentsForm = document.getElementById("config-form");
  componentsForm.addEventListener("submit", handleSubmit);
}
