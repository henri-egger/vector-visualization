import { renderPlot } from "./render";
import { lsSet, lsGet } from "./localstorage";

export function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("config-form");

  storeFormData(form);

  renderPlot();
}

function storeFormData(form) {
  const formData = new FormData(form);

  console.log(formData.get("origin-x"));

  const data = {
    exprs: [
      formData.get("input-x"),
      formData.get("input-y"),
      formData.get("input-z"),
    ],
    axisRange: Number(formData.get("axis-range")),
    arrowSize: Number(formData.get("arrow-size")),
    arrowDensity: Number(formData.get("arrow-density")),
    origin: [
      Number(formData.get("origin-x")),
      Number(formData.get("origin-y")),
      Number(formData.get("origin-z")),
    ],
  };

  lsSet("formData", data);
}

export function updateForm() {
  const data = lsGet("formData");
  if (data) {
    const { exprs, axisRange, arrowSize, arrowDensity, origin } = data;

    document.getElementById("input-x").value = exprs[0];
    document.getElementById("input-y").value = exprs[1];
    document.getElementById("input-z").value = exprs[2];

    document.getElementById("axis-range").value = axisRange;
    document.getElementById("axis-range-display").innerText = axisRange;

    document.getElementById("arrow-size").value = arrowSize;
    document.getElementById("arrow-size-display").innerText = arrowSize;

    document.getElementById("arrow-density").value = arrowDensity;
    document.getElementById("arrow-density-display").innerText = arrowDensity;

    document.getElementById("origin-x").value = origin[0];
    document.getElementById("origin-y").value = origin[1];
    document.getElementById("origin-z").value = origin[2];
  }

  storeFormData(document.getElementById("config-form"));
}

export function setupForm() {
  const componentsForm = document.getElementById("config-form");
  componentsForm.addEventListener("submit", handleSubmit);

  for (let name of ["axis-range", "arrow-size", "arrow-density"]) {
    document.getElementById(name).addEventListener("input", (_) => {
      document.getElementById(name + "-display").innerText =
        document.getElementById(name).value;
    });
  }

  for (let name of [
    "axis-range",
    "arrow-size",
    "arrow-density",
    "origin-x",
    "origin-y",
    "origin-z",
  ]) {
    document.getElementById(name).addEventListener("change", (e) => {
      handleSubmit(e);
    });
  }
}
