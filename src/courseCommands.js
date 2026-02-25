import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

/**
 * Generates a unique 5‑digit numeric ID for a course (0–99999).
 */
function generateUniqueCourseId(courses) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (courses.some((c) => c.id === id));
  return id;
}

/**
 * ---------------- ADD ----------------
 * Creates a new course.
 * Expects: [name, startDate]
 */
function addCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Must provide course name and start date');
    return { error: 'ERROR: Must provide course name and start date' };
  }

  const [name, startDate] = args;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    console.log('ERROR: Invalid start date. Must be in yyyy-MM-dd format');
    return { error: 'ERROR: Invalid start date. Must be in yyyy-MM-dd format' };
  }

  const courses = loadCourseData();

  const newCourse = {
    id: Math.floor(Math.random() * 100000),
    name,
    startDate,
    participants: [],
  };

  courses.push(newCourse);
  saveCourseData(courses);

  console.log(`CREATED: ${newCourse.id} ${name} ${startDate}`);
  return newCourse;
}

/**
 * ---------------- UPDATE ----------------
 * Updates an existing course.
 * Expects: [id, name, startDate]
 */
function updateCourse(args) {
  if (args.length < 3) {
    console.log('ERROR: Must provide ID, name and start date.');
    return { error: 'ERROR: Must provide ID, name and start date.' };
  }

  const [idString, name, startDate] = args;
  const id = Number(idString);

  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return null;
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    console.log('ERROR: Invalid start date. Must be in yyyy-MM-dd format');
    return { error: 'ERROR: Invalid start date. Must be in yyyy-MM-dd format' };
  }

  course.name = name;
  course.startDate = startDate;
  saveCourseData(courses);

  console.log(`UPDATED: ${id} ${name} ${startDate}`);
  return course;
}

/**
 * ---------------- DELETE ----------------
 * Deletes a course by ID.
 * Expects: [id]
 */
function deleteCourse(args) {
  if (args.length < 1) {
    console.log('ERROR: Invalid course ID');
    return { error: 'ERROR: Invalid course ID' };
  }

  const id = Number(args[0]);
  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return null;
  }

  const updated = courses.filter((c) => c.id !== id);
  saveCourseData(updated);

  console.log(`DELETED: ${id} ${course.name}`);
  return true;
}

/**
 * ---------------- JOIN ----------------
 * Adds a trainee to a course.
 * Expects: [courseId, traineeId]
 */
function joinCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Must provide course ID and trainee ID');
    return { error: 'ERROR: Must provide course ID and trainee ID' };
  }

  const courseId = Number(args[0]);
  const traineeId = Number(args[1]);

  const trainees = loadTraineeData();
  const courses = loadCourseData();

  const trainee = trainees.find((t) => t.id === traineeId);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    console.log(`ERROR: Course with ID ${courseId} does not exist`);
    return null;
  }
  if (!trainee) {
    console.log(`ERROR: Trainee with ID ${traineeId} does not exist`);
    return null;
  }

  if (!Array.isArray(course.participants)) {
    course.participants = [];
  }

  if (course.participants.includes(traineeId)) {
    console.log('ERROR: The Trainee has already joined this course');
    return course;
  }

  // Rule: Trainee cannot join more than 5 courses
  const enrolledCourses = courses.filter((c) =>
    c.participants.includes(traineeId)
  );
  if (enrolledCourses.length >= 5) {
    console.log('ERROR: A trainee is not allowed to join more than 5 courses.');
    return {
      error: 'ERROR: A trainee is not allowed to join more than 5 courses.',
    };
  }

  // Rule: Course capacity is 20
  if (course.participants.length >= 20) {
    console.log('ERROR: The course is full.');
    return { error: 'ERROR: The course is full.' };
  }

  course.participants.push(traineeId);
  saveCourseData(courses);

  console.log(`${trainee.firstName} Joined ${course.name}`);
  return course;
}

/**
 * ---------------- LEAVE ----------------
 * Removes a trainee from a course.
 * Expects: [courseId, traineeId]
 */
function leaveCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Must provide course ID and trainee ID');
    return { error: 'ERROR: Must provide course ID and trainee ID' };
  }

  const courseId = Number(args[0]);
  const traineeId = Number(args[1]);

  const trainees = loadTraineeData();
  const courses = loadCourseData();

  const trainee = trainees.find((t) => t.id === traineeId);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    console.log(`ERROR: Course with ID ${courseId} does not exist`);
    return null;
  }
  if (!trainee) {
    console.log(`ERROR: Trainee with ID ${traineeId} does not exist`);
    return null;
  }

  if (!course.participants.includes(traineeId)) {
    console.log('ERROR: The Trainee did not join the course');
    return course;
  }

  course.participants = course.participants.filter((id) => id !== traineeId);
  saveCourseData(courses);

  console.log(`${trainee.firstName} Left ${course.name}`);
  return course;
}

/**
 * ---------------- GET ----------------
 * Shows detailed course info.
 * Expects: [id]
 */
function getCourse(args) {
  if (args.length < 1) {
    console.log('ERROR: Missing course ID');
    return { error: 'ERROR: Missing course ID' };
  }

  const id = Number(args[0]);
  const courses = loadCourseData();
  const trainees = loadTraineeData();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return null;
  }

  console.log(`${course.id} ${course.name} ${course.startDate}`);

  const participantDetails = course.participants.map((tid) => {
    const t = trainees.find((x) => x.id === tid);
    return t ? `- ${t.id} ${t.firstName} ${t.lastName}` : `- ${tid}`;
  });

  console.log(`Participants (${course.participants.length}):`);
  participantDetails.forEach((line) => console.log(line));

  return course;
}

/**
 * ---------------- GETALL ----------------
 * Displays all courses sorted by start date.
 */
function getAllCourses() {
  const courses = loadCourseData();

  console.log('Courses:');

  const sorted = [...courses].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  sorted.forEach((c) => {
    const full = c.participants.length >= 20 ? 'FULL' : '';
    console.log(
      `${c.id} ${c.name} ${c.startDate} ${c.participants.length} ${full}`.trim()
    );
  });

  console.log(`\nTotal: ${sorted.length}`);
  return sorted;
}

/**
 * ---------------- COMMAND HANDLER ----------------
 */
export function handleCourseCommand(subcommand, args) {
  const normalized = subcommand.toLowerCase();

  switch (normalized) {
    case 'add':
      return addCourse(args);
    case 'update':
      return updateCourse(args);
    case 'delete':
      return deleteCourse(args);
    case 'join':
      return joinCourse(args);
    case 'leave':
      return leaveCourse(args);
    case 'get':
      return getCourse(args);
    case 'getall':
    case 'list':
      return getAllCourses();
    default:
      console.log('ERROR: Invalid course command');
      return { error: 'ERROR: Invalid course command' };
  }
}
