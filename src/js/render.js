import { range, compile } from "mathjs";
import Plotly from "plotly.js-dist-min";
import { lsGet } from "./localstorage";

function computeAxisVals(axisRange, arrowDensity, origin) {
  const min = -axisRange;
  const max = axisRange;

  const xMin = min + origin[0];
  const xMax = max + origin[0];
  const xVals = range(
    xMin,
    xMax,
    (xMax - xMin) / (arrowDensity - 1),
    true
  ).toArray();

  const yMin = min + origin[1];
  const yMax = max + origin[1];
  const yVals = range(
    yMin,
    yMax,
    (xMax - yMin) / (arrowDensity - 1),
    true
  ).toArray();

  const zMin = min + origin[2];
  const zMax = max + origin[2];
  const zVals = range(
    zMin,
    zMax,
    (xMax - zMin) / (arrowDensity - 1),
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

function generateVectorField(
  u_expr,
  v_expr,
  w_expr,
  axisRange,
  arrowDensity,
  origin
) {
  const [xVals, yVals, zVals] = computeAxisVals(
    axisRange,
    arrowDensity,
    origin
  );

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
  const { exprs, axisRange, arrowSize, arrowDensity, origin } = data;

  const [u_expr, v_expr, w_expr] = exprs;

  let fieldData;
  try {
    fieldData = generateVectorField(
      u_expr,
      v_expr,
      w_expr,
      axisRange,
      arrowDensity,
      origin
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
      xaxis: {
        title: "X",
        range: [-axisRange + origin[0], axisRange + origin[0]],
      },
      yaxis: {
        title: "Y",
        range: [-axisRange + origin[1], axisRange + origin[1]],
      },
      zaxis: {
        title: "Z",
        range: [-axisRange + origin[2], axisRange + origin[2]],
      },
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
