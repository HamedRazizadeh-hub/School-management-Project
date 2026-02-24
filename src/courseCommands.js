import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

/**
 * Generates a unique 2‑digit numeric ID for a course.
 * Ensures no collision with existing course IDs.
 */
function generateUniqueCourseId(courses) {
  let id;
  do {
    id = Math.floor(10 + Math.random() * 90); // Generates a number between 10–99
  } while (courses.some((c) => c.id === id));
  return id;
}

/**
 * ---------------- ADD ----------------
 * Creates a new course with a unique ID.
 * Expects args: [name, startDate]
 */
function addCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Invalid course name');
    return { error: 'ERROR: Invalid course name' };
  }

  const [name, startDate] = args;
  const courses = loadCourseData();

  const newCourse = {
    id: generateUniqueCourseId(courses),
    name,
    startDate,
    participants: [], // Must always exist for JOIN/LEAVE operations
  };

  courses.push(newCourse);
  saveCourseData(courses);

  console.log(`Course ${name} added successfully`);
  return newCourse;
}

/**
 * ---------------- UPDATE ----------------
 * Updates an existing course's name and start date.
 * Expects args: [id, name, startDate]
 */
function updateCourse(args) {
  if (args.length < 3) {
    console.log('ERROR: Missing arguments for update course');
    return { error: 'ERROR: Missing arguments for update course' };
  }

  const [idString, name, startDate] = args;
  const id = Number(idString);

  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(`Course with ID ${id} not found`);
    return null;
  }

  course.name = name;
  course.startDate = startDate;
  saveCourseData(courses);

  console.log(`Course ${id} updated successfully`);
  return course;
}

/**
 * ---------------- DELETE ----------------
 * Removes a course by ID.
 * Expects args: [id]
 */
function deleteCourse(args) {
  if (args.length < 1) {
    console.log('ERROR: Invalid course ID for deletion');
    return { error: 'ERROR: Invalid course ID for deletion' };
  }

  const id = Number(args[0]);
  let courses = loadCourseData();

  const exists = courses.some((c) => c.id === id);
  if (!exists) {
    console.log(`Course with ID ${id} not found`);
    return null;
  }

  courses = courses.filter((c) => c.id !== id);
  saveCourseData(courses);

  console.log(`Course with ID ${id} deleted successfully`);
  return true;
}

/**
 * ---------------- JOIN ----------------
 * Adds a trainee to a course.
 * Expects args: [courseId, traineeId]
 */
function joinCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Invalid course ID and trainee ID for joining');
    return { error: 'ERROR: Invalid course ID and trainee ID for joining' };
  }

  const courseId = Number(args[0]); // First argument is courseId
  const traineeId = Number(args[1]); // Second argument is traineeId

  const trainees = loadTraineeData();
  const courses = loadCourseData();

  const trainee = trainees.find((t) => t.id === traineeId);
  const course = courses.find((c) => c.id === courseId);

  if (!trainee) {
    console.log(`Trainee with ID ${traineeId} not found`);
    return null;
  }
  if (!course) {
    console.log(`Course with ID ${courseId} not found`);
    return null;
  }

  // Ensure participants array exists
  if (!Array.isArray(course.participants)) {
    course.participants = [];
  }

  if (course.participants.includes(traineeId)) {
    console.log(`Trainee already joined this course`);
    return course;
  }

  course.participants.push(traineeId);
  saveCourseData(courses);

  console.log(`Trainee ${traineeId} joined course ${courseId}`);
  return course;
}

/**
 * ---------------- LEAVE ----------------
 * Removes a trainee from a course.
 * Expects args: [courseId, traineeId]
 */
function leaveCourse(args) {
  if (args.length < 2) {
    console.log('ERROR: Invalid course ID and trainee ID for leaving');
    return { error: 'ERROR: Invalid course ID and trainee ID for leaving' };
  }

  const courseId = Number(args[0]);
  const traineeId = Number(args[1]);

  const courses = loadCourseData();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    console.log(`Course with ID ${courseId} not found`);
    return null;
  }

  if (!course.participants.includes(traineeId)) {
    console.log(`Trainee is not enrolled in this course`);
    return course;
  }

  course.participants = course.participants.filter((id) => id !== traineeId);
  saveCourseData(courses);

  console.log(`Trainee ${traineeId} left course ${courseId}`);
  return course;
}

/**
 * ---------------- GET ----------------
 * Returns a single course by ID.
 * Expects args: [id]
 */
function getCourse(args) {
  if (args.length < 1) {
    console.log('ERROR: Missing course ID');
    return { error: 'ERROR: Missing course ID' };
  }

  const id = Number(args[0]);
  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    console.log(`Course with ID ${id} not found`);
    return null;
  }

  console.log(course);
  return course;
}

/**
 * ---------------- GETALL ----------------
 * Returns all courses.
 */
function getAllCourses() {
  const courses = loadCourseData();

  if (courses.length === 0) {
    console.log('No courses found');
    return [];
  }

  courses.forEach((c) => {
    console.log(`${c.id}: ${c.name} ${c.startDate}`);
  });

  return courses;
}

/**
 * ---------------- COMMAND HANDLER ----------------
 * Routes course subcommands to the correct function.
 * Subcommands are normalized to lowercase for consistency.
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
    case 'list': // Optional alias
      return getAllCourses();

    default:
      console.log('ERROR: Invalid course command');
      return { error: 'ERROR: Invalid course command' };
  }
}
