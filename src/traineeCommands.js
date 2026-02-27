import chalk from 'chalk';
import { saveTraineeData, loadTraineeData } from './storage.js';

/**
 * Generates a unique 6‑digit numeric ID for a trainee.
 * Ensures no collision with existing trainee IDs.
 */

function generateUniqueId(trainees) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000); // number between 0–99999
  } while (trainees.some((trainee) => trainee.id === id));
  return id;
}

/**
 * ---------------- ADD ----------------
 * Creates a new trainee with a unique ID.
 * Expects: [firstName, lastName]
 */
function addTrainee(args) {
  // expect two parameters for first and last name
  if (args.length < 2) {
    console.log(chalk.red('ERROR: Must provide first and last name'));
    return {
      error: 'ERROR: Must provide first and last name',
    };
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
 * Updates an existing trainee's first and last name.
 * Expects: [id, firstName, lastName]
 */
function updateTrainee(args) {
  // expect three parameters: id, first name, last name
  if (args.length < 3) {
    console.log(chalk.red('ERROR: Must provide ID, first name and last name'));
    return { error: 'ERROR: Must provide ID, first name and last name' };
  }

  const [idString, firstName, lastName] = args;
  const id = Number(idString);

  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist`));
    return { error: 'ERROR: Trainee with ID ${id} does not exist' };
  }

  trainee.firstName = firstName;
  trainee.lastName = lastName;
  saveTraineeData(trainees);

  console.log(`UPDATED: ${trainee.id} ${firstName} ${lastName}`);
  return trainee;
}

/**
 * ---------------- DELETE ----------------
 * Removes a trainee by ID.
 * Expects: [id]
 */
function deleteTrainee(args) {
  if (args.length < 1) {
    console.log(chalk.red('ERROR: Invalid trainee ID for deletion.'));
    return { error: 'ERROR: Invalid trainee ID for deletion.' };
  }

  const id = Number(args[0]);
  let trainees = loadTraineeData();

  // Find trainee before deleting
  const trainee = trainees.find((t) => t.id === id);
  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist.`));
    return { error: `ERROR: Trainee with ID ${id} does not exist.` };
  }

  trainees = trainees.filter((t) => t.id !== id);
  saveTraineeData(trainees);

  console.log(
    `DELETED: ${deleted.id} ${deleted.firstName} ${deleted.lastName}`
  );
  return true;
}

/**
 * ---------------- GET ----------------
 * Returns a single trainee by ID.
 * Expects: [id]
 */
function getTrainee(args) {
  if (args.length < 1) {
    console.log(chalk.red('ERROR: Invalid trainee ID.'));
    return { error: 'ERROR: Invalid trainee ID.' };
  }

  const id = Number(args[0]);
  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(chalk.red(`ERROR: Trainee with ID ${id} does not exist`));
    return null;
  }
  console.log(`${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
  return trainee;
}

/**
 * ---------------- GETALL ----------------
 * Returns all trainees.
 */
function getAllTrainees() {
  const trainees = loadTraineeData();

  if (trainees.length === 0) {
    console.log('No trainees found');
    return [];
  }

  // sort alphabetically by lastName then firstName (case-insensitive)
  trainees.sort((a, b) => {
    const la = a.lastName.toLowerCase();
    const lb = b.lastName.toLowerCase();
    if (la < lb) return -1;
    if (la > lb) return 1;
    // tie-breaker: sort by first name
    const fa = a.firstName.toLowerCase();
    const fb = b.firstName.toLowerCase();
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
  });

  trainees.forEach((t) => {
    console.log(`${t.id}: ${t.firstName} ${t.lastName}`);
  });

  return trainees;
}

// Implement search functionality
// ensure a query is provided; treat whitespace-only as missing
function searchTrainees(args) {
  if (!args || args.length < 1 || String(args[0]).trim() === '') {
    console.log(chalk.red('ERROR: Must provide a query'));
    return { error: 'ERROR: Must provide a query' };
  }

  // allow multi-word queries by joining args with spaces
  const query = String(args.join(' ')).toLowerCase();
  const trainees = loadTraineeData();

  // case-insensitive partial matching against first or last name
  const matches = trainees.filter((t) => {
    return (
      String(t.firstName).toLowerCase().includes(query) ||
      String(t.lastName).toLowerCase().includes(query)
    );
  });

  console.log('Results:');
  matches.forEach((t) => {
    console.log(`${t.id} ${t.firstName} ${t.lastName}`);
  });

  console.log(`Total: ${matches.length}`);
  return matches;
}
/**
 * ---------------- COMMAND HANDLER ----------------
 * Routes trainee subcommands to the correct function.
 * Subcommands are expected to be lowercase (from index.js).
 */
/**
 * Routes trainee-related subcommands to the correct handler function.
 * The subcommand is normalized to uppercase so tests and CLI input
 * work consistently regardless of letter casing.
 *
 * @param {string} subcommand - The trainee subcommand (e.g., "ADD", "UPDATE").
 * @param {Array} args - Arguments passed to the subcommand.
 * @returns {*} The result of the executed trainee command.
 */
export function handleTraineeCommand(subcommand, args) {
  // Normalize subcommand to uppercase to ensure consistent behavior
  const normalizedSub = subcommand.toUpperCase();

  switch (normalizedSub) {
    case 'ADD':
      // Creates a new trainee
      return addTrainee(args);

    case 'UPDATE':
      // Updates an existing trainee
      return updateTrainee(args);

    case 'DELETE':
      // Deletes a trainee by ID
      return deleteTrainee(args);

    case 'GET':
      // Retrieves a single trainee by ID
      return getTrainee(args);

    case 'GETALL':
    case 'LIST':
      // Returns all trainees
      return getAllTrainees();

    case 'SEARCH':
      // Queries for a specific trainee
      return searchTrainees(args);

    default:
      // Handles invalid or unknown subcommands
      console.log('ERROR: Invalid trainee command');
      return { error: 'ERROR: Invalid trainee command' };
  }
}
