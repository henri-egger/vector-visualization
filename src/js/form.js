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

  const data = {
    exprs: [
      formData.get("input-x"),
      formData.get("input-y"),
      formData.get("input-z"),
    ],
    axisRange: formData.get("axis-range"),
    arrowSize: formData.get("arrow-size"),
    arrowDensity: formData.get("arrow-density"),
  };

  lsSet("formData", data);
}

export function updateForm() {
  const data = lsGet("formData");
  if (data) {
    const { exprs, axisRange, arrowSize, arrowDensity } = data;

    document.getElementById("input-x").value = exprs[0];
    document.getElementById("input-y").value = exprs[1];
    document.getElementById("input-z").value = exprs[2];

    document.getElementById("axis-range").value = axisRange;
    document.getElementById("axis-range-display").innerText = axisRange;

    document.getElementById("arrow-size").value = arrowSize;
    document.getElementById("arrow-size-display").innerText = arrowSize;

    document.getElementById("arrow-density").value = arrowDensity;
    document.getElementById("arrow-density-display").innerText = arrowDensity;
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

    document.getElementById(name).addEventListener("change", (e) => {
      handleSubmit(e);
    });
  }
}
