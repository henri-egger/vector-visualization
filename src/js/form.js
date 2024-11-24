// TODO: Store components as cookie

import { renderPlot } from "./render";

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
  }

  localStorage.setItem("formData", JSON.stringify(data));

  renderPlot();
}