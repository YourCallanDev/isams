import { Storage } from '../core/storage.js';
export const OutOfSchool = {
  set(studentIds, dateISO, periodCodes) {
    const db = Storage.load(Storage.keys.outOfSchool, {});
    periodCodes.forEach(pc=>{
      const key = `${dateISO}:${pc}`;
      db[key] = Array.from(new Set([...(db[key]||[]), ...studentIds]));
    });
    Storage.save(Storage.keys.outOfSchool, db);
  },
  get(dateISO, periodCode) {
    const db = Storage.load(Storage.keys.outOfSchool, {});
    return new Set(db[`${dateISO}:${periodCode}`] || []);
  }
};
