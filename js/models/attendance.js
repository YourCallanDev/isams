import { Storage } from '../core/storage.js';

export const Attendance = {
  mark(studentId, dateISO, periodCode, status, meta={}) {
    const db = Storage.load(Storage.keys.attendance, {});
    db[dateISO] = db[dateISO] || {};
    db[dateISO][periodCode] = db[dateISO][periodCode] || {};
    db[dateISO][periodCode][studentId] = { status, ts: Date.now(), ...meta };
    Storage.save(Storage.keys.attendance, db);
  },
  bulkFill(dateISO, periodCode) {
    const db = Storage.load(Storage.keys.attendance, {});
    db[dateISO] = db[dateISO] || {};
    db[dateISO][periodCode] = db[dateISO][periodCode] || {};
    const dayData = db[dateISO][periodCode];
    const students = Storage.load(Storage.keys.students, []);
    const oos = Storage.load(Storage.keys.outOfSchool, {});
    const blockSet = new Set(oos[`${dateISO}:${periodCode}`] || []);
    students.forEach(st=>{
      if (dayData[st.id]) return;
      if (blockSet.has(st.id)) { dayData[st.id] = { status:'Blocked', auto:true, ts:Date.now() }; return; }
      dayData[st.id] = { status:'Present', auto:true, ts:Date.now() };
    });
    Storage.save(Storage.keys.attendance, db);
  }
};
