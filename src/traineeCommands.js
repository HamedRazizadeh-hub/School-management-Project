import chalk from 'chalk';
import { saveTraineeData, loadTraineeData } from './storage.js';
import { loadCourseData, saveCourseData } from './storage.js';

/**
 * Generates a unique numeric ID between 0 and 99999.
 * Ensures no collision with existing trainee IDs.
 */
function generateUniqueId(trainees) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (trainees.some((t) => t.id === id));
  return id;
}

/**
 * ---------------- ADD ----------------
 * Creates a new trainee.
 * Expects: [firstName, lastName]
 */
export function addTrainee(args) {
  if (args.length < 2) {
    console.log(chalk.red('ERROR: Must provide first and last name.'));
    return { error: 'ERROR: Must provide first and last name.' };
  }

  const [firstName, lastName] = args;
  const trainees = loadTraineeData();

  const newTrainee = {
    id: generateUniqueId(trainees),
    firstName,
    lastName,
  };

  trainees.push(newTrainee);
  saveTraineeData(trainees);

  console.log(`CREATED: ${newTrainee.id} ${firstName} ${lastName}`);
  return newTrainee;
}

/**
 * ---------------- UPDATE ----------------
 * Updates an existing trainee.
 * Expects: [id, firstName, lastName]
 */
export function updateTrainee(args) {
  if (args.length < 3) {
    console.log(chalk.red('ERROR: Must provide ID, first name and last name.'));
    return { error: 'ERROR: Must provide ID, first name and last name.' };
  }

  const [idString, firstName, lastName] = args;
  const id = Number(idString);

  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist.`));
    return { error: `ERROR: Trainee with ID ${id} does not exist.` };
  }

  trainee.firstName = firstName;
  trainee.lastName = lastName;
  saveTraineeData(trainees);

  console.log(`UPDATED: ${trainee.id} ${firstName} ${lastName}`);
  return trainee;
}

/**
 * ---------------- DELETE ----------------
 * Deletes a trainee and removes them from all courses.
 * Expects: [id]
 */
export function deleteTrainee(args) {
  if (args.length < 1) {
    console.log(chalk.red('ERROR: Must provide ID.'));
    return { error: 'ERROR: Must provide ID.' };
  }

  const id = Number(args[0]);
  let trainees = loadTraineeData();

  const trainee = trainees.find((t) => t.id === id);
  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist.`));
    return { error: `ERROR: Trainee with ID ${id} does not exist.` };
  }

  trainees = trainees.filter((t) => t.id !== id);
  saveTraineeData(trainees);

  // Remove trainee from all courses
  let courses = loadCourseData();
  let updated = false;

  courses = courses.map((course) => {
    if (course.participants.includes(id)) {
      updated = true;
      return {
        ...course,
        participants: course.participants.filter((pid) => pid !== id),
      };
    }
    return course;
  });

  if (updated) saveCourseData(courses);

  console.log(
    `DELETED: ${trainee.id} ${trainee.firstName} ${trainee.lastName}`
  );
  return true;
}

/**
 * ---------------- GET ----------------
 * Returns a single trainee.
 * Expects: [id]
 */
export function getTrainee(args) {
  if (args.length < 1) {
    console.log(chalk.red('ERROR: Invalid trainee ID.'));
    return { error: 'ERROR: Invalid trainee ID.' };
  }

  const id = Number(args[0]);
  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist.`));
    return { error: `ERROR: Trainee with ID ${id} does not exist.` };
  }

  console.log(`${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
  return trainee;
}

/**
 * ---------------- GETALL ----------------
 * Returns all trainees.
 */
export function getAllTrainees() {
  const trainees = loadTraineeData();

  if (trainees.length === 0) {
    console.log('No trainees found.');
    return [];
  }

  trainees.forEach((t) => {
    console.log(`${t.id} ${t.firstName} ${t.lastName}`);
  });

  console.log(`Total: ${trainees.length}`);
  return trainees;
}

/**
 * ---------------- SEARCH ----------------
 * Performs a case-insensitive partial match on first or last name.
 * Returns matches for tests and prints results for CLI.
 */
export function searchTrainees(args) {
  if (!args || args.length === 0 || !args.join('').trim()) {
    return { error: 'ERROR: Must provide a query' };
  }

  const query = args.join('').toLowerCase().trim();
  const trainees = loadTraineeData();

  const results = trainees.filter((t) => {
    const fullName = (t.firstName + t.lastName).toLowerCase();
    return [...query].every((char) => fullName.includes(char));
  });

  results.forEach((t) => console.log(`${t.id} ${t.firstName} ${t.lastName}`));
  console.log(`Total: ${results.length}`);

  return results;
}

/**
 * ---------------- COMMAND HANDLER ----------------
 * Routes CLI subcommands to the proper function.
 */
export function handleTraineeCommand(subcommand, args) {
  const normalized = subcommand.toUpperCase();

  switch (normalized) {
    case 'ADD':
      return addTrainee(args);
    case 'UPDATE':
      return updateTrainee(args);
    case 'DELETE':
      return deleteTrainee(args);
    case 'GET':
      return getTrainee(args);
    case 'GETALL':
      return getAllTrainees();
    case 'SEARCH':
      return searchTrainees(args);
    default:
      console.log('ERROR: Invalid trainee command');
      return { error: 'ERROR: Invalid trainee command' };
  }
}
