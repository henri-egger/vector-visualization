import { renderPlot } from "./render";
import { lsSet, lsGet } from "./localstorage";

export function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
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

  renderPlot();
}

export function updateForm() {
  const data = lsGet("formData");
  if (!data) return;
  const { exprs } = data;

  document.getElementById("input-x").value = exprs[0];
  document.getElementById("input-y").value = exprs[1];
  document.getElementById("input-z").value = exprs[2];
}
