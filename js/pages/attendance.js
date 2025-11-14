import { Storage } from '../core/storage.js';
import { Attendance } from '../models/attendance.js';
import { OutOfSchool } from '../models/outOfSchool.js';

const dateEl = document.getElementById('attDate');
const periodEl = document.getElementById('attPeriod');
const classEl = document.getElementById('attClass');
const rollEl = document.getElementById('classRoll');
const autoFillBtn = document.getElementById('autoFill');

function loadClassOptions() {
  const classes = Storage.load(Storage.keys.classes, []);
  classEl.innerHTML = classes.map(c=>`<option value="${c.code}">${c.code} • ${c.subject} • ${c.room} • ${c.teacher}</option>`).join('');
}
function renderRoll() {
  const date = dateEl.value; const period = periodEl.value; const classCode = classEl.value;
  const students = Storage.load(Storage.keys.students, []).filter(s=>Object.values(s.classes).includes(classCode));
  const oosSet = OutOfSchool.get(date, period);
  rollEl.innerHTML = `
    <table class="roll">
      <thead><tr><th>Name</th><th>Status</th><th>OOS</th></tr></thead>
      <tbody>
        ${students.map(s=>{
          const oos = oosSet.has(s.id);
          return `<tr>
            <td>${s.last}, ${s.first}</td>
            <td>
              <select data-id="${s.id}" ${oos ? 'disabled' : ''}>
                <option>Present</option><option>Late</option><option>Authorized</option>
                <option>Unauthorized</option><option>Medical</option><option>Off-site</option><option>Trip</option>
              </select>
            </td>
            <td>${oos ? 'Blocked' : ''}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <button id="saveMarks">Save Marks</button>
  `;
  document.getElementById('saveMarks').onclick = () => {
    const selects = rollEl.querySelectorAll('select[data-id]');
    const date = dateEl.value; const period = periodEl.value;
    selects.forEach(sel=>{
      Attendance.mark(sel.dataset.id, date, period, sel.value);
    });
    alert('Attendance saved.');
  };
}
dateEl.valueAsDate = new Date();
loadClassOptions();
periodEl.onchange = renderRoll; classEl.onchange = renderRoll; dateEl.onchange = renderRoll;
autoFillBtn.onclick = ()=>{
  const date = dateEl.value; const period = periodEl.value;
  Attendance.bulkFill(date, period);
  renderRoll();
};
renderRoll();
