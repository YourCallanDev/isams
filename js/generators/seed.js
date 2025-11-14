import { Storage } from '../core/storage.js';
import { loadBootstrapData } from '../core/data.js';
import { buildSubjects, buildClassPool } from '../models/subjects.js';
import { generateStudents } from '../models/students.js';
import { assignTutorGroups } from '../models/houses.js';
import { assignCoreAndOptions, placeIntoClasses } from '../models/classes.js';
import { generateWeeklyTimetables } from '../models/timetable.js';

export async function seedIfEmpty() {
  const studentsLS = Storage.load(Storage.keys.students, null);
  const classesLS = Storage.load(Storage.keys.classes, null);
  if (studentsLS && classesLS) return;

  const { periods, subjects } = await loadBootstrapData();
  const subjectCatalog = buildSubjects(subjects);

  const classes = buildClassPool(subjectCatalog, {
    year: '9', maxClassSize: 22, you: 'c.chesser'
  });

  let students = generateStudents(180, { year: '9' });
  students = assignTutorGroups(students, { maxPerGroup: 15, randomize: true });
  students = assignCoreAndOptions(students, subjectCatalog);

  const { classRoster, studentsWithClasses } = placeIntoClasses(students, classes, { maxClassSize: 22 });

  const timetables = generateWeeklyTimetables(studentsWithClasses, periods, {
    constraints: { noDoublesPerDay: true, peOnNonMathsDay: true }
  });

  const withTT = studentsWithClasses.map(s => ({ ...s, timetable: timetables[s.id] }));
  Storage.save(Storage.keys.students, withTT);
  Storage.save(Storage.keys.classes, classRoster);
  Storage.save(Storage.keys.attendance, {});
  Storage.save(Storage.keys.behaviour, {});
  Storage.save(Storage.keys.outOfSchool, {});
  Storage.save(Storage.keys.housePoints, { Fraser:0, Morrison:0, Arthur:0, Temple:0 });
}
