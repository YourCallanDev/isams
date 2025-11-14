import { Storage } from '../core/storage.js';

const dateEl = document.getElementById('dashDate');
const todayList = document.getElementById('todayList');
const statusEl = document.getElementById('periodStatus');

dateEl.valueAsDate = new Date();

function getTeacherClasses(teacher='c.chesser') {
  const classes = Storage.load(Storage.keys.classes, []);
  return classes.filter(c=>c.teacher===teacher);
}

function renderToday() {
  const classes = getTeacherClasses();
  const date = new Date(dateEl.value);
  const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
  // Simple view: list all classes taught by you; click to open attendance quickly
  todayList.innerHTML = `
    <ul>
      ${classes.map(c=>`<li>${weekday} • ${c.code} • ${c.subject} • ${c.room}
        <a href="attendance.html" style="margin-left:8px">Take attendance</a>
      </li>`).join('')}
    </ul>
  `;
}

function renderPeriodStatus() {
  const att = Storage.load(Storage.keys.attendance, {});
  const dateISO = dateEl.value;
  const periods = ['TUTOR','P1','P2','P3','P4','P5','P6'];
  const row = periods.map(p=>{
    const marks = att[dateISO]?.[p] || {};
    const total = Object.keys(marks).length;
    const color = total ? '#16a34a' : '#ef4444'; // green if marked, red if missing
    return `<span style="display:inline-block;margin:6px;padding:6px 10px;border-radius:6px;background:${color};color:#fff">${p}</span>`;
  }).join('');
  statusEl.innerHTML = row;
}

dateEl.onchange = () => { renderToday(); renderPeriodStatus(); };
renderToday(); renderPeriodStatus();
