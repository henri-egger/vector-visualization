import { range, compile } from "mathjs";
import Plotly from "plotly.js-dist-min";
import { lsGet } from "./localstorage";

const x_min = -1,
  x_max = 1,
  x_num = 10;
const y_min = -1,
  y_max = 1,
  y_num = 10;
const z_min = -1,
  z_max = 1,
  z_num = 10;

const x_vals = range(
  x_min,
  x_max,
  (x_max - x_min) / (x_num - 1),
  true
).toArray();
const y_vals = range(
  y_min,
  y_max,
  (y_max - y_min) / (y_num - 1),
  true
).toArray();
const z_vals = range(
  z_min,
  z_max,
  (z_max - z_min) / (z_num - 1),
  true
).toArray();

function evaluateExpression(expr, parseConfig) {
  try {
    const code = compile(expr);
    return code.evaluate(parseConfig);
  } catch (err) {
    alert("Error in expression: " + expr + "\n" + err);
    throw err;
  }
}

function generateVectorField(u_expr, v_expr, w_expr) {
  const x = [];
  const y = [];
  const z = [];
  const u = [];
  const v = [];
  const w = [];

  for (let xi of x_vals) {
    for (let yi of y_vals) {
      for (let zi of z_vals) {
        const parseConfig = { x: xi, y: yi, z: zi, pi: Math.PI, e: Math.E };

        x.push(xi);
        y.push(yi);
        z.push(zi);

        u.push(evaluateExpression(u_expr, parseConfig));
        v.push(evaluateExpression(v_expr, parseConfig));
        w.push(evaluateExpression(w_expr, parseConfig));
      }
    }
  }

  return { x, y, z, u, v, w };
}

export function renderPlot() {
  const data = lsGet("formData");
  if (!data) return;
  const { exprs } = data;

  const [u_expr, v_expr, w_expr] = exprs;

  let fieldData;
  try {
    fieldData = generateVectorField(u_expr, v_expr, w_expr);
  } catch (err) {
    // Error already handled in evaluateExpression
    return;
  }

  const trace = {
    type: "cone",
    x: fieldData.x,
    y: fieldData.y,
    z: fieldData.z,
    u: fieldData.u,
    v: fieldData.v,
    w: fieldData.w,
    colorscale: "Viridis",
    sizemode: "absolute",
    sizeref: 2,
    showscale: false,
    anchor: "tail",
  };

  const layout = {
    scene: {
      xaxis: { title: "X", range: [x_min, x_max] },
      yaxis: { title: "Y", range: [y_min, y_max] },
      zaxis: { title: "Z", range: [z_min, z_max] },
      aspectmode: "cube",
      camera: {
        up: { x: 0, y: 0, z: 1 },
        eye: { x: 1.25, y: 1.25, z: 1.25 },
      },
    },
    margin: { t: 50 },
  };

  Plotly.newPlot("plot", [trace], layout);
}
