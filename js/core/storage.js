const LS_KEYS = {
  students: 'mis.students',
  classes: 'mis.classes',
  attendance: 'mis.attendance',
  behaviour: 'mis.behaviour',
  outOfSchool: 'mis.outOfSchool',
  housePoints: 'mis.housePoints'
};

export const Storage = {
  load(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  },
  save(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  resetAll() { Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k)); },
  keys: LS_KEYS
};
