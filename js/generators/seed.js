import { Storage } from '../core/storage.js';
import { loadBootstrapData } from '../core/data.js';
import { buildSubjects, buildClassPool } from '../models/subjects.js';
import { generateStudents, assignTutorGroups } from '../models/students.js';
import { assignCoreAndOptions, placeIntoClasses } from '../models/classes.js';
import { generateWeeklyTimetables } from '../models/timetable.js';

export async function seedIfEmpty() {
  const studentsLS = Storage.load(Storage.keys.students, null);
  const classesLS = Storage.load(Storage.keys.classes, null);
  if (studentsLS && classesLS) return; // already seeded

  const { periods, subjects, termDates } = await loadBootstrapData();
  const subjectCatalog = buildSubjects(subjects);

  // Build class pool sized for ~180 students with max 22 per class
  const classes = buildClassPool(subjectCatalog, {
    year: '9', maxClassSize: 22, you: 'c.chesser'
  });

  // Generate students and assign tutor groups randomly within houses
  let students = generateStudents(180, { year: '9' });
  students = assignTutorGroups(students, { maxPerGroup: 15, randomize: true });

  // Assign each student's core choices and options (no duplicate from core)
  students = assignCoreAndOptions(students, subjectCatalog);

  // Place students into classes respecting caps and subject pools
  const { classRoster, studentsWithClasses } = placeIntoClasses(students, classes, { maxClassSize: 22 });

  // Create weekly timetables: no doubles per day; PE only on a Maths-free day
  const timetables = generateWeeklyTimetables(studentsWithClasses, periods, {
    constraints: { noDoublesPerDay: true, peOnNonMathsDay: true }, termDates
  });

  // Persist to LocalStorage
  const withTT = studentsWithClasses.map(s => ({ ...s, timetable: timetables[s.id] }));
  Storage.save(Storage.keys.students, withTT);
  Storage.save(Storage.keys.classes, classRoster);
  Storage.save(Storage.keys.attendance, {});
  Storage.save(Storage.keys.behaviour, {});
  Storage.save(Storage.keys.outOfSchool, {});
  Storage.save(Storage.keys.housePoints, { Fraser:0, Morrison:0, Arthur:0, Temple:0 });

  // Assign you a Fraser tutor group for convenience
  const fraserGroup = withTT.find(s=>s.house==='Fraser')?.tutorGroup;
  if (fraserGroup) {
    const meta = Storage.load('mis.meta', {});
    meta.myTutorGroup = fraserGroup;
    Storage.save('mis.meta', meta);
  }
}
