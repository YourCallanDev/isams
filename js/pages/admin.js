import { Storage } from '../core/storage.js';
import { seedIfEmpty } from '../generators/seed.js';

// Export buttons
document.getElementById('exportStudents').onclick = () => {
  const students = Storage.load(Storage.keys.students, []);
  downloadJSON('students.json', students);
};
document.getElementById('exportClasses').onclick = () => {
  const classes = Storage.load(Storage.keys.classes, []);
  downloadJSON('classes.json', classes);
};

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
}

// NEW: Generate button always runs generator
document.getElementById('generateBtn').onclick = async () => {
  await seedIfEmpty(); // runs generator regardless of existing data
  alert('Student data generated successfully.');
};

// NEW: Clear button wipes everything
document.getElementById('clearBtn').onclick = () => {
  Storage.resetAll();
  alert('All data cleared. You can now press Generate to recreate.');
};

// Existing reset button (if you keep it)
document.getElementById('reset').onclick = () => {
  Storage.resetAll();
  alert('LocalStorage cleared.');
};
