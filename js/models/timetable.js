export function generateWeeklyTimetables(students, periods, { constraints, termDates }) {
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const periodSlots = ['TUTOR','P1','P2','P3','P4','P5','P6']; // BREAK/LUNCH excluded in grid
  const timetables = {};

  const freqFor = s => {
    const f = {'Maths':4,'English':4,'PSE':2,'PE':1};
    f[s.selections.language]=3; f[s.selections.social]=3; f[s.selections.science]=3;
    s.selections.electives.forEach(e=>f[e]=3);
    return f;
  };

  students.forEach(s=>{
    const freq = freqFor(s);
    const tally = Object.fromEntries(Object.keys(freq).map(k=>[k,0]));
    const grid = {}; days.forEach(d=>grid[d]={});
    days.forEach(day=>{
      const today = new Set();
      periodSlots.forEach(slot=>{
        if (slot==='TUTOR'){ grid[day][slot]={ type:'Tutor', code:s.tutorGroup }; return; }
        // candidates with remaining frequency, avoiding doubles in same day
        const candidates = Object.keys(freq).filter(sub=>tally[sub] < freq[sub] && !today.has(sub));
        let chosen = null;

        // PE only on a Maths-free day for the student
        const hasMathToday = [...Object.values(grid[day])].some(v=>v?.sub==='Maths');
        if (!hasMathToday && candidates.includes('PE')) {
          chosen = 'PE';
        } else {
          // prioritize core, then language/social/science, then electives
          const priorityOrder = ['Maths','English','PSE', s.selections.language, s.selections.social, s.selections.science, ...s.selections.electives];
          chosen = priorityOrder.find(p=>candidates.includes(p)) || candidates[0];
        }

        if (!chosen){ grid[day][slot]={ type:'Free' }; return; }
        tally[chosen]++; today.add(chosen);
        grid[day][slot] = { type:'Class', sub: chosen, classCode: s.classes[chosen], room: null };
      });
    });
    timetables[s.id] = grid;
  });

  return timetables;
}
