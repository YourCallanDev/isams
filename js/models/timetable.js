export function generateWeeklyTimetables(students, periods, { constraints }) {
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const periodSlots = ['TUTOR','P1','P2','P3','P4','P5','P6']; // ignore BREAK/LUNCH
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
        const candidates = Object.keys(freq).filter(sub=>tally[sub] < freq[sub] && !today.has(sub));
        let chosen = null;
        // PE only on a maths-free day:
        const hasMathToday = [...Object.values(grid[day])].some(v=>v?.sub==='Maths');
        if (!hasMathToday && candidates.includes('PE')) chosen = 'PE';
        else chosen = candidates[0];
        if (!chosen){ grid[day]
