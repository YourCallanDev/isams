export function assignCoreAndOptions(students, catalog) {
  const pickOne = arr => arr[Math.floor(Math.random()*arr.length)];
  const uniq3 = (pool) => {
    const s = new Set(); const out = [];
    while (out.length<3 && s.size < pool.length) {
      const p = pickOne(pool);
      if (!s.has(p)) { s.add(p); out.push(p); }
    }
    return out;
  };
  return students.map(s=>{
    const language = pickOne(catalog.language);
    const social = pickOne(catalog.social);
    const science = pickOne(catalog.science);
    // exclude core picks
    const exclusions = new Set([language, social, science]);
    const electivePool = catalog.electives.filter(e=>!exclusions.has(e));
    const electives = uniq3(electivePool);
    return { ...s, selections: { language, social, science, electives } };
  });
}

export function placeIntoClasses(students, classes, { maxClassSize }) {
  const roster = classes.map(c=>({ ...c, members: [] }));
  const bySubject = subject => roster.filter(c=>c.subject===subject);

  const place = (student, subject, codePrefix=null) => {
    let pool = bySubject(subject);
    if (codePrefix) pool = pool.filter(c=>c.code.startsWith(codePrefix));
    const target = pool.sort((a,b)=>a.members.length - b.members.length).find(c=>c.members.length < maxClassSize);
    if (!target) return null;
    target.members.push(student.id);
    student.classes[subject] = target.code;
    return target.code;
  };

  // Maths/English sets
  students.forEach(s=>{ place(s,'Maths','MA'); place(s,'English','EN'); });

  // PSE (both classes taught by c.chesser; 2x per week handled in timetable generation)
  students.forEach(s=>{ place(s,'PSE','PSE'); });

  // PE
  students.forEach(s=>{ place(s,'PE','PE'); });

  // Language/Social/Science
  students.forEach(s=>{
    const { language, social, science } = s.selections;
    place(s, language); place(s, social); place(s, science);
  });

  // Electives
  students.forEach(s=>{ s.selections.electives.forEach(e=>place(s,e)); });

  return { classRoster: roster, studentsWithClasses: students };
}
