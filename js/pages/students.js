import { Storage } from '../core/storage.js';

const searchEl = document.getElementById('search');
const listEl = document.getElementById('list');
const profileEl = document.getElementById('profile');

let students = Storage.load(Storage.keys.students, []);

function renderList() {
  const q = searchEl.value.toLowerCase();
  const filtered = students.filter(s=>{
    const text = `${s.first} ${s.last} ${s.tutorGroup} ${s.house}`.toLowerCase();
    return text.includes(q);
  });
  listEl.innerHTML = `
    <table class="roll">
      <thead><tr><th>Name</th><th>House</th><th>Tutor</th><th>Actions</th></tr></thead>
      <tbody>
        ${filtered.map(s=>`
          <tr>
            <td>${s.last}, ${s.first}</td>
            <td>${s.house}</td>
            <td>${s.tutorGroup}</td>
            <td><button data-id="${s.id}" class="viewBtn">View</button></td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
  listEl.querySelectorAll('.viewBtn').forEach(btn=>{
    btn.onclick = ()=> openStudent(btn.dataset.id);
  });
}

function openStudent(id) {
  const s = students.find(x=>x.id===id);
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const periods = ['TUTOR','P1','P2','P3','P4','P5','P6'];

  function cell(day, slot) {
    const entry = s.timetable?.[day]?.[slot];
    if (!entry || entry.type==='Free') return `<td>${slot}<br><small>Free</small></td>`;
    if (slot==='TUTOR') return `<td>${slot}<br><small>${s.tutorGroup}</small></td>`;
    return `<td>${slot}<br><small>${entry.sub}</small><br>${entry.classCode || ''}</td>`;
  }

  profileEl.innerHTML = `
    <div style="display:flex;gap:24px">
      <div style="flex:1">
        <h4>${s.last}, ${s.first} (${s.house} • ${s.tutorGroup})</h4>
        <table class="roll">
          <thead><tr><th></th>${periods.map(p=>`<th>${p}</th>`).join('')}</tr></thead>
          <tbody>
            ${days.map(d=>`<tr><th>${d}</th>${periods.map(p=>cell(d,p)).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="flex:0 0 280px">
        <h4>Edit timetable (assign class by code)</h4>
        <label>Day
          <select id="editDay">${days.map(d=>`<option>${d}</option>`).join('')}</select>
        </label>
        <label>Period
          <select id="editPeriod">${periods.map(p=>`<option>${p}</option>`).join('')}</select>
        </label>
        <label>Class code <input id="editCode" placeholder="e.g., DR-1"></label>
        <button id="applyEdit">Apply</button>
        <div style="margin-top:12px">
          <small>Note: No doubles per day enforced manually; avoid assigning the same subject twice on a day.</small>
        </div>
      </div>
    </div>
  `;
  document.getElementById('applyEdit').onclick = ()=>{
    const day = document.getElementById('editDay').value;
    const slot = document.getElementById('editPeriod').value;
    const code = document.getElementById('editCode').value.trim();
    const classes = Storage.load(Storage.keys.classes, []);
    const cls = classes.find(c=>c.code===code);
    if (!cls) { alert('Class code not found.'); return; }
    s.timetable[day][slot] = { type:'Class', sub: cls.subject, classCode: cls.code, room: cls.room };
    Storage.save(Storage.keys.students, students);
    openStudent(s.id);
  };
}

searchEl.oninput = renderList;
renderList();
