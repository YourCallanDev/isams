import { Storage } from '../core/storage.js';

const myOnlyEl = document.getElementById('myOnly');
const searchEl = document.getElementById('classSearch');
const listEl = document.getElementById('classList');
const currentUser = 'c.chesser';

let classes = Storage.load(Storage.keys.classes, []);
const students = Storage.load(Storage.keys.students, []);

function membersOf(code) {
  return students.filter(s=>Object.values(s.classes).includes(code));
}

function render() {
  const q = (searchEl.value||'').toLowerCase();
  let view = classes.slice();
  if (myOnlyEl.checked) view = view.filter(c=>c.teacher===currentUser);
  if (q) view = view.filter(c=>{
    return `${c.code} ${c.subject} ${c.teacher} ${c.room}`.toLowerCase().includes(q);
  });

  listEl.innerHTML = `
    <table class="roll">
      <thead><tr><th>Code</th><th>Subject</th><th>Teacher</th><th>Room</th><th>Members</th><th>Actions</th></tr></thead>
      <tbody>
        ${view.map(c=>{
          const mems = membersOf(c.code);
          return `<tr>
            <td>${c.code}</td><td>${c.subject}</td><td>${c.teacher}</td><td>${c.room}</td>
            <td>${mems.length}</td>
            <td>
              <button data-code="${c.code}" class="claimBtn">Claim</button>
              <button data-code="${c.code}" class="editBtn">Edit</button>
              <button data-code="${c.code}" class="manageBtn">Manage Students</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div id="editor"></div>
  `;

  listEl.querySelectorAll('.claimBtn').forEach(btn=>{
    btn.onclick = ()=>{
      const code = btn.dataset.code;
      const idx = classes.findIndex(c=>c.code===code);
      classes[idx].teacher = currentUser;
      Storage.save(Storage.keys.classes, classes);
      render();
    };
  });

  listEl.querySelectorAll('.editBtn').forEach(btn=>{
    btn.onclick = ()=> openEditor(btn.dataset.code);
  });

  listEl.querySelectorAll('.manageBtn').forEach(btn=>{
    btn.onclick = ()=> openManager(btn.dataset.code);
  });
}

function openEditor(code) {
  const cls = classes.find(c=>c.code===code);
  document.getElementById('editor').innerHTML = `
    <h4>Edit ${cls.code}</h4>
    <label>Teacher <input id="eTeacher" value="${cls.teacher}"></label>
    <label>Room <input id="eRoom" value="${cls.room}"></label>
    <button id="saveEdit">Save</button>
  `;
  document.getElementById('saveEdit').onclick = ()=>{
    cls.teacher = document.getElementById('eTeacher').value.trim();
    cls.room = document.getElementById('eRoom').value.trim();
    Storage.save(Storage.keys.classes, classes);
    render();
  };
}

function openManager(code) {
  const cls = classes.find(c=>c.code===code);
  const mems = membersOf(code);
  const notIn = students.filter(s=>!mems.includes(s));
  document.getElementById('editor').innerHTML = `
    <h4>Manage ${cls.code} • ${cls.subject}</h4>
    <div style="display:flex; gap:24px">
      <div style="flex:1">
        <h5>Members</h5>
        ${mems.map(s=>`<div>${s.last}, ${s.first} <button class="removeBtn" data-id="${s.id}">Remove</button></div>`).join('')}
      </div>
      <div style="flex:1">
        <h5>Add student</h5>
        <input id="addSearch" placeholder="Search name">
        <div id="addList"></div>
      </div>
    </div>
  `;

  const addList = document.getElementById('addList');
  function renderAddList() {
    const q = (document.getElementById('addSearch').value||'').toLowerCase();
    addList.innerHTML = notIn
      .filter(s=>`${s.first} ${s.last}`.toLowerCase().includes(q))
      .slice(0,50)
      .map(s=>`<div>${s.last}, ${s.first} <button class="addBtn" data-id="${s.id}">Add</button></div>`)
      .join('');
    addList.querySelectorAll('.addBtn').forEach(btn=>{
      btn.onclick = ()=>{
        const s = students.find(x=>x.id===btn.dataset.id);
        // Assign to class and insert into timetable if empty slot exists
        s.classes[cls.subject] = cls.code;
        Storage.save(Storage.keys.students, students);
        render(); openManager(code);
      };
    });
  }
  renderAddList();
  document.getElementById('addSearch').oninput = renderAddList;

  document.querySelectorAll('.removeBtn').forEach(btn=>{
    btn.onclick = ()=>{
      const s = students.find(x=>x.id===btn.dataset.id);
      if (s.classes[cls.subject] === code) {
        delete s.classes[cls.subject];
        Storage.save(Storage.keys.students, students);
        render(); openManager(code);
      }
    };
  });
}

myOnlyEl.onchange = render; searchEl.oninput = render;
render();
