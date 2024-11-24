export function lsSet(name, object) {
  localStorage.setItem(name, JSON.stringify({ obj: object }));
}

export function lsGet(name) {
  const json = JSON.parse(localStorage.getItem(name));
  if (!json) return null;
  return json.obj;
}
