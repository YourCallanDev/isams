import { Storage } from '../core/storage.js';

const dateEl = document.getElementById('rDate');
const runBtn = document.getElementById('rRun');
const outEl = document.getElementById('rOut');
dateEl.valueAsDate = new Date();

runBtn.onclick = ()=>{
  const att = Storage.load(Storage.keys.attendance, {});
  const date = dateEl.value;
  const periods = ['TUTOR','P1','P2','P3','P4','P5','P6'];
  const rows = periods.map(p=>{
    const entries = att[date]?.[p] || {};
    const total = Object.keys(entries).length;
    const present = Object.values(entries).filter(e=>e.status==='Present').length;
    const late = Object.values(entries).filter(e=>e.status==='Late').length;
    const unauth = Object.values(entries).filter(e=>e.status==='Unauthorized').length;
    return `<tr><td>${p}</td><td>${total}</td><td>${present}</td><td>${late}</td><td>${unauth}</td></tr>`;
  }).join('');
  outEl.innerHTML = `
    <table class="roll">
      <thead><tr><th>Period</th><th>Total marked</th><th>Present</th><th>Late</th><th>Unauthorised</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};
