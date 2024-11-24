export function lsSet(name, object) {
  localStorage.setItem(name, JSON.stringify({ obj: obj }));
}

export function lsGet(name) {
  return JSON.parse(localStorage.getItem(name)).obj;
}