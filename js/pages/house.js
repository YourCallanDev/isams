import { Storage } from '../core/storage.js';

const lbEl = document.getElementById('leaderboard');
const sEl = document.getElementById('hpStudent');
const pEl = document.getElementById('hpPoints');
const btn = document.getElementById('hpAward');

const students = Storage.load(Storage.keys.students, []);
const points = Storage.load(Storage.keys.housePoints, { Fraser:0, Morrison:0, Arthur:0, Temple:0 });

function renderLB() {
  lbEl.innerHTML = `
    <ul>
      <li>Fraser: ${points.Fraser}</li>
      <li>Morrison: ${points.Morrison}</li>
      <li>Arthur: ${points.Arthur}</li>
      <li>Temple: ${points.Temple}</li>
    </ul>
  `;
}

btn.onclick = ()=>{
  const q = (sEl.value||'').toLowerCase();
  const st = students.find(s=>`${s.first} ${s.last}`.toLowerCase().includes(q));
  if (!st) { alert('Student not found'); return; }
  const val = parseInt(pEl.value||'1',10);
  points[st.house] = (points[st.house]||0) + val;
  Storage.save(Storage.keys.housePoints, points);
  renderLB();
};
renderLB();
