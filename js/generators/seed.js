export function buildSubjects(subjectsJson) {
  return {
    core: subjectsJson.core,
    language: subjectsJson.language,
    social: subjectsJson.social,
    science: subjectsJson.science,
    electives: subjectsJson.electives,
    teacherBinding: subjectsJson.teacherBinding || {},
    roomBinding: subjectsJson.roomBinding || {}
  };
}

function randomTeacherExcluding(exclusions = []) {
  const names = [
    'a.smith','b.jones','d.brown','e.wilson','f.taylor','g.clark','h.lewis','i.walker',
    'j.hall','k.allen','l.young','m.king','n.wright','o.scott','p.green','q.miller','r.moore'
  ];
  const pool = names.filter(n => !exclusions.includes(n));
  return pool[Math.floor(Math.random()*pool.length)];
}

function randomRoom() { return `R${String(1 + Math.floor(Math.random()*40)).padStart(2,'0')}`; }

function codeMap(sub) {
  const map = {
    'Maths':'MA','English':'EN','PSE':'PSE','PE':'PE',
    'Spanish':'SP','French':'FR','Mandarin':'MN','Latin':'LA','Additional Languages':'AL',
    'History':'HI','Modern Studies':'MS','Business Management':'BM',
    'Biology':'BI','Chemistry':'CH','Physics':'PH',
    'Drama':'DR','Computing Science':'CS','National PE':'NP','Home Economics':'HE',
    'Further Mathematics':'FM','Design & Manufacture':'DM','Drama Tech':'DT'
  };
  return map[sub] || sub.slice(0,2).toUpperCase();
}

export function buildClassPool(catalog, {year, maxClassSize, you}) {
  const classes = [];
  const codeCounter = {};
  const pushClass = (subject, codePrefix, teacher, room=null) => {
    codeCounter[codePrefix] = (codeCounter[codePrefix] || 0) + 1;
    const code = `${codePrefix}-${codeCounter[codePrefix]}`;
    const finalRoom = room || (catalog.roomBinding[subject]?.[codeCounter[codePrefix] % (catalog.roomBinding[subject].length||1)] || randomRoom());
    classes.push({ code, subject, teacher, room: finalRoom, year, max: maxClassSize });
  };

  // Maths/English sets
  for (let i=0;i<8;i++) pushClass('Maths','MA',randomTeacherExcluding());
  for (let i=0;i<8;i++) pushClass('English','EN',randomTeacherExcluding());

  // PSE (2) to you
  pushClass('PSE','PSE',you); pushClass('PSE','PSE',you);

  // PE pool
  for (let i=0;i<6;i++) pushClass('PE','PE',randomTeacherExcluding());

  // Languages, Social, Science pools
  ['Spanish','French','Mandarin','Latin','Additional Languages'].forEach(sub=>{
    for (let i=0;i<5;i++) pushClass(sub, codeMap(sub), catalog.teacherBinding[sub] || randomTeacherExcluding());
  });
  ['History','Modern Studies','Business Management'].forEach(sub=>{
    for (let i=0;i<5;i++) pushClass(sub, codeMap(sub), randomTeacherExcluding());
  });
  ['Biology','Chemistry','Physics'].forEach(sub=>{
    for (let i=0;i<5;i++) pushClass(sub, codeMap(sub), randomTeacherExcluding());
  });

  // Electives (Drama/Drama Tech to you; use studios)
  catalog.electives.forEach(sub=>{
    const teacher = (sub==='Drama'||sub==='Drama Tech') ? you : randomTeacherExcluding();
    const count = (sub==='Drama'||sub==='Drama Tech') ? 8 : 5;
    for (let i=0;i<count;i++) pushClass(sub, codeMap(sub), teacher);
  });

  return classes;
}
