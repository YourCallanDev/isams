import { Storage } from '../core/storage.js';

const sInput = document.getElementById('bStudent');
const sevEl = document.getElementById('bSeverity');
const detEl = document.getElementById('bDetails');
const logBtn = document.getElementById('bLog');
const listEl = document.getElementById('bList');

const students = Storage.load(Storage.keys.students, []);
const behaviour = Storage.load(Storage.keys.behaviour, {});

function findStudentByName(query) {
  const q = (query||'').toLowerCase();
  return students.find(s=>`${s.first} ${s.last}`.toLowerCase().includes(q));
}

function notifyTutor(student, record) {
  // In-app notification banner (stored alongside behaviour record)
  record.tutorNotified = true;
}

function renderList() {
  const all = Object.values(behaviour).flat();
  listEl.innerHTML = `
    <table class="roll">
      <thead><tr><th>Student</th><th>Severity</th><th>Details</th><th>Tutor notified</th></tr></thead>
      <tbody>
        ${all.map(r=>`<tr><td>${r.studentName}</td><td>${r.severity}</td><td>${r.details}</td><td>${r.tutorNotified?'Yes':'No'}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

logBtn.onclick = ()=>{
  const st = findStudentByName(sInput.value);
  if (!st) { alert('Student not found'); return; }
  const rec = {
    studentId: st.id,
    studentName: `${st.last}, ${st.first}`,
    severity: sevEl.value,
    details: detEl.value,
    ts: Date.now()
  };
  notifyTutor(st, rec);
  behaviour[st.id] = behaviour[st.id] || [];
  behaviour[st.id].push(rec);
  Storage.save(Storage.keys.behaviour, behaviour);
  renderList();
};

renderList();
