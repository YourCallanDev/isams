export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export async function loadBootstrapData() {
  const [periods, subjects, termDates] = await Promise.all([
    fetchJSON('data/periods.json'),
    fetchJSON('data/subjects.json'),
    fetchJSON('data/termDates.json')
  ]);
  return { periods, subjects, termDates };
}
