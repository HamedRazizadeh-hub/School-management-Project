import { saveCourseData, loadCourseData } from './storage.js';

function addCourse() {
  // TODO: Implement logic
}

function updateCourse() {
  // TODO: Implement logic
}

function deleteCourse() {
  // TODO: Implement logic
}

function joinCourse() {
  // TODO: Implement logic
}

function leaveCourse() {
  // TODO: Implement logic
}

function getCourse() {
  // TODO: Implement logic
}

function getAllCourses() {
  // TODO: Implement logic
}

export function handleCourseCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments
}
import { loadCourseData, saveCourseData, loadTraineeData } from './storage.js';
import chalk from 'chalk';

/**
 * Generates a unique numeric ID for a course.
 * The ID is between 0 and 99999 and must not collide
 * with any existing course ID in the dataset.
 */
function generateUniqueCourseId(courses) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (courses.some((c) => c.id === id));
  return id;
}

/**
 * Validates that a given date string follows the ISO 8601 format: yyyy-MM-dd.
 * Returns true if the format is correct, otherwise false.
 */
function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * ---------------- ADD ----------------
 * Handles the command: COURSE ADD <name> <startDate>
 *
 * Creates a new course with:
 *  - a unique ID
 *  - a name
 *  - a start date in ISO format
 *  - an empty participants list
 *
 * Prints a success message following the project specification.
 */
function addCourse(args) {
  if (args.length < 2) {
    console.log(chalk.red('ERROR: Must provide course name and start date'));
    return;
  }

  const [name, startDate] = args;

  // Validate date format before creating the course
  if (!isValidDate(startDate)) {
    console.log(
      chalk.red('ERROR: Invalid start date. Must be in yyyy-MM-dd format')
    );
    return;
  }

  const courses = loadCourseData();

  // Construct the new course object
  const newCourse = {
    id: generateUniqueCourseId(courses),
    name,
    startDate,
    participants: [], // Required for JOIN/LEAVE operations
  };

  courses.push(newCourse);
  saveCourseData(courses);

  console.log(`CREATED: ${newCourse.id} ${name} ${startDate}`);
}

/**
 * ---------------- UPDATE ----------------
 * Handles the command: COURSE UPDATE <ID> <name> <startDate>
 *
 * Updates the name and start date of an existing course.
 * Ensures:
 *  - ID exists
 *  - date format is valid
 *  - output matches the project specification
 */
function updateCourse(args) {
  if (args.length < 3) {
    console.log(chalk.red('ERROR: Must provide ID, name and start date.'));
    return;
  }

  const [idString, name, startDate] = args;
  const id = Number(idString);

  // Validate date format
  if (!isValidDate(startDate)) {
    console.log(
      chalk.red('ERROR: Invalid start date. Must be in yyyy-MM-dd format')
    );
    return;
  }

  const courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  // Ensure the course exists before updating
  if (!course) {
    console.log(chalk.red(`ERROR: Course with ID ${id} does not exist`));
    return;
  }

  course.name = name;
  course.startDate = startDate;
  saveCourseData(courses);

  console.log(`UPDATED: ${id} ${name} ${startDate}`);
}

/**
 * ---------------- DELETE ----------------
 * Handles the command: COURSE DELETE <ID>
 *
 * Removes a course from the dataset.
 * Prints the deleted course ID and name as required by the specification.
 */
function deleteCourse(args) {
  if (args.length < 1) {
    console.log(chalk.red('ERROR: Must provide ID'));
    return;
  }

  const id = Number(args[0]);
  let courses = loadCourseData();
  const course = courses.find((c) => c.id === id);

  // Cannot delete a non-existing course
  if (!course) {
    console.log(chalk.red(`ERROR: Course with ID ${id} does not exist`));
    return;
  }

  courses = courses.filter((c) => c.id !== id);
  saveCourseData(courses);

  console.log(`DELETED: ${id} ${course.name}`);
}

/**
 * ---------------- JOIN ----------------
 * Handles the command: COURSE JOIN <courseID> <traineeID>
 *
 * Adds a trainee to a course's participants list.
 * Validates:
 *  - both IDs exist
 *  - trainee is not already enrolled
 *  - course capacity (max 20)
 *  - trainee enrollment limit (max 5 courses)
 *
 * Prints a success message using trainee and course names.
 */
function joinCourse(args) {
  if (args.length < 2) {
    console.log(chalk.red('ERROR: Must provide course ID and trainee ID'));
    return;
  }
}
const courseId = Number(args[0]);
const traineeId = Number(args[1]);

const trainees = loadTraineeData();
const courses = loadCourseData();

const trainee = trainees.find((t) => t.id === traineeId);
const course = courses.find((c) => c.id === courseId);

if (!course) {
  console.log(chalk.red(`ERROR: Course with ID ${courseId} does not exist`));
  return;
}

if (!trainee) {
  console.log(chalk.red(`ERROR: Trainee with ID ${traineeId} does not exist`));
  return;
}

// ... (rest of function continues)
