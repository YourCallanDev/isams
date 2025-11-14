const HOUSES = ['Fraser','Morrison','Arthur','Temple'];

export function generateStudents(n, {year}) {
  const students = [];
  for (let i=0;i<n;i++){
    const id = `S${String(i+1).padStart(4,'0')}`;
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i*7) % LAST_NAMES.length];
    const house = HOUSES[(i*3) % HOUSES.length];
    students.push({ id, first, last, year, house, tutorGroup: null, classes: {}, selections:{}, timetable: {} });
  }
  return students;
}

export function assignTutorGroups(students, { maxPerGroup, randomize }) {
  const buckets = { Fraser:[], Morrison:[], Arthur:[], Temple:[] };
  students.forEach(s=>buckets[s.house].push(s));
  const assign = (houseKey, letter) => {
    const list = randomize ? shuffle(buckets[houseKey]) : buckets[houseKey].sort((a,b)=>((a.last+a.first).localeCompare(b.last+b.first)));
    let groupIndex = 1;
    for (let i=0;i<list.length;i+=maxPerGroup){
      const chunk = list.slice(i,i+maxPerGroup);
      const code = `9${letter}${groupIndex++}`;
      chunk.forEach(st=>st.tutorGroup = code);
    }
  };
  assign('Fraser','F'); assign('Morrison','M'); assign('Arthur','A'); assign('Temple','T');
  return students;
}

function shuffle(arr){ return arr.map(a=>({a, r:Math.random()})).sort((x,y)=>x.r-y.r).map(x=>x.a); }

const FIRST_NAMES = ['Alex','Ben','Cara','Dylan','Eva','Finn','Grace','Harry','Isla','Jack','Kara','Leo','Mia','Noah','Olivia','Poppy','Quinn','Ruby','Sam','Tia','Uma','Vera','Will','Xena','Yasmin','Zack'];
const LAST_NAMES  = ['Anderson','Brown','Campbell','Davies','Evans','Ferguson','Gibson','Hughes','Irving','Jackson','Kennedy','Lewis','Martin','Nelson','O\'Connor','Patel','Quinn','Roberts','Stewart','Taylor','Usher','Vaughan','White','Xu','Young','Zhou'];
