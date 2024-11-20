import numpy as np
import plotly.graph_objects as go

# Function to safely evaluate user input
def safe_eval(expr, variables):
    allowed_names = {
        'np': np,
        'sin': np.sin,
        'cos': np.cos,
        'tan': np.tan,
        'arcsin': np.arcsin,
        'arccos': np.arccos,
        'arctan': np.arctan,
        'sinh': np.sinh,
        'cosh': np.cosh,
        'tanh': np.tanh,
        'exp': np.exp,
        'log': np.log,
        'log10': np.log10,
        'sqrt': np.sqrt,
        'abs': np.abs,
        'pi': np.pi,
        'e': np.e
    }
    code = compile(expr, "<string>", "eval")
    for name in code.co_names:
        if name not in allowed_names and name not in variables:
            raise NameError(f"Use of '{name}' is not allowed.")
    return eval(code, {**allowed_names, **variables})

# Get the vector components as input
print("Enter the vector field components as functions of x, y, z.")
print("Available functions: sin, cos, tan, exp, log, sqrt, etc.")
# u_str = input("Enter the x-component function u(x,y,z): ")
# v_str = input("Enter the y-component function v(x,y,z): ")
# w_str = input("Enter the z-component function w(x,y,z): ")

u_str = "-x"
v_str = "-z"
w_str = "z"

# Define the grid
x_min, x_max, x_num = -1, 1, 10
y_min, y_max, y_num = -1, 1, 10
z_min, z_max, z_num = -1, 1, 10

x_vals = np.linspace(x_min, x_max, x_num)
y_vals = np.linspace(y_min, y_max, y_num)
z_vals = np.linspace(z_min, z_max, z_num)

x, y, z = np.meshgrid(x_vals, y_vals, z_vals)

variables = {'x': x, 'y': y, 'z': z}

# Evaluate the vector components safely
try:
    u = safe_eval(u_str, variables)
    v = safe_eval(v_str, variables)
    w = safe_eval(w_str, variables)
except Exception as e:
    print(f"Error evaluating functions: {e}")
    exit()

# Flatten the arrays for plotting
x_flat = x.flatten()
y_flat = y.flatten()
z_flat = z.flatten()
u_flat = u.flatten()
v_flat = v.flatten()
w_flat = w.flatten()

# Create the 3D quiver plot
fig = go.Figure(data=go.Cone(
    x=x_flat,
    y=y_flat,
    z=z_flat,
    u=u_flat,
    v=v_flat,
    w=w_flat,
    colorscale='agsunset',
    sizemode='absolute',
    sizeref=1.5
))

# Set the layout
fig.update_layout(
    scene=dict(
        xaxis_title='X',
        yaxis_title='Y',
        zaxis_title='Z',
        aspectratio=dict(x=1, y=1, z=1),
        camera=dict(
            up=dict(x=0, y=0, z=1),
            eye=dict(x=1.25, y=1.25, z=1.25)
        )
    ),
    title='3D Vector Field Visualization'
)

# Show the plot
fig.show()
