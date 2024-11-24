import { range, compile } from "mathjs";
import Plotly from "plotly.js-dist-min";
import { lsGet } from "./localstorage";

function computeAxisVals(axisRange, arrowDensity) {
  const min = -axisRange;
  const max = axisRange;
  console.log(axisRange, arrowDensity);
  const xVals = range(
    min,
    max,
    (max - min) / (arrowDensity - 1),
    true
  ).toArray();
  const yVals = range(
    min,
    max,
    (max - min) / (arrowDensity - 1),
    true
  ).toArray();
  const zVals = range(
    min,
    max,
    (max - min) / (arrowDensity - 1),
    true
  ).toArray();

  return [xVals, yVals, zVals];
}

function evaluateExpression(expr, parseConfig) {
  try {
    const code = compile(expr);
    return code.evaluate(parseConfig);
  } catch (err) {
    alert("Error in expression: " + expr + "\n" + err);
    throw err;
  }
}

function generateVectorField(u_expr, v_expr, w_expr, axisRange, arrowDensity) {
  const [xVals, yVals, zVals] = computeAxisVals(axisRange, arrowDensity);

  const x = [];
  const y = [];
  const z = [];
  const u = [];
  const v = [];
  const w = [];

  for (let xi of xVals) {
    for (let yi of yVals) {
      for (let zi of zVals) {
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
  const { exprs, axisRange, arrowSize, arrowDensity } = data;

  const [u_expr, v_expr, w_expr] = exprs;

  let fieldData;
  try {
    fieldData = generateVectorField(
      u_expr,
      v_expr,
      w_expr,
      axisRange,
      arrowDensity
    );
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
    sizeref: arrowSize,
    showscale: false,
    anchor: "tail",
  };

  const layout = {
    scene: {
      xaxis: { title: "X", range: [-axisRange, axisRange] },
      yaxis: { title: "Y", range: [-axisRange, axisRange] },
      zaxis: { title: "Z", range: [-axisRange, axisRange] },
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
