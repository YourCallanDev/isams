import { Storage } from '../core/storage.js';

const dateEl = document.getElementById('ttDate');
const gridEl = document.getElementById('grid');
dateEl.valueAsDate = new Date();

function renderGrid() {
  const classes = Storage.load(Storage.keys.classes, []).filter(c=>c.teacher==='c.chesser');
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(dateEl.value).getDay()];
  const periods = ['TUTOR','P1','P2','P3','P4','P5','P6'];
  gridEl.innerHTML = `
    <table class="roll">
      <thead><tr>${periods.map(p=>`<th>${p}</th>`).join('')}</tr></thead>
      <tbody>
        <tr>
          ${periods.map(p=>{
            const c = classes[Math.floor(Math.random()*classes.length)]; // simple placeholder view
            return `<td>
              ${c ? `${c.code}<br><small>${c.subject}</small><br>${c.room}` : '—'}
              ${c ? `<div><a href="attendance.html">Attendance</a> • <a href="behaviour.html">Notes</a></div>` : ''}
            </td>`;
          }).join('')}
        </tr>
      </tbody>
    </table>
  `;
}
dateEl.onchange = renderGrid; renderGrid();
