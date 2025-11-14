import { Storage } from '../core/storage.js';
import { OutOfSchool } from '../models/outOfSchool.js';

const exp = (filename, data) => {
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
};

document.getElementById('exportStudents').onclick = ()=>exp('students.json', Storage.load(Storage.keys.students, []));
document.getElementById('exportClasses').onclick = ()=>exp('classes.json', Storage.load(Storage.keys.classes, []));

document.getElementById('reset').onclick = ()=>{
  Storage.resetAll();
  alert('LocalStorage cleared. Reload page to reseed.');
};

const studentSelectDiv = document.getElementById('studentSelect');
function renderStudentCheckboxes(){
  const students = Storage.load(Storage.keys.students, []);
  studentSelectDiv.innerHTML = students.map(s=>{
    return `<label style="display:inline-block;margin-right:8px">
      <input type="checkbox" class="oosStudent" value="${s.id}"> ${s.last}, ${s.first} (${s.tutorGroup})
    </label>`;
  }).join('');
}
renderStudentCheckboxes();

document.getElementById('applyOOS').onclick = ()=>{
  const date = document.getElementById('oosDate').value;
  const periodSel = document.getElementById('oosPeriods');
  const periods = Array.from(periodSel.selectedOptions).map(o=>o.value);
  const studentIds = Array.from(document.querySelectorAll('.oosStudent:checked')).map(c=>c.value);
  if (!date || periods.length===0 || studentIds.length===0) { alert('Select date, periods and students.'); return; }
  OutOfSchool.set(studentIds, date, periods);
  alert('Out-of-School applied.');
};
