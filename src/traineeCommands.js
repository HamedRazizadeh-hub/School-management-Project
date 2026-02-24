import { saveTraineeData, loadTraineeData } from './storage.js';

/**
 * Generates a unique 6‑digit numeric ID for a trainee.
 * Ensures no collision with existing trainee IDs.
 */
function generateUniqueId(trainees) {
  let id;
  do {
    id = Math.floor(100000 + Math.random() * 900000);
  } while (trainees.some((trainee) => trainee.id === id));
  return id;
}

/**
 * ---------------- ADD ----------------
 * Creates a new trainee with a unique ID.
 * Expects: [firstName, lastName]
 */
function addTrainee(args) {
  if (args.length < 2) {
    console.log('ERROR: Invalid trainee name');
    return { error: 'ERROR: Invalid trainee name' };
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

  console.log(`Trainee ${firstName} ${lastName} added successfully`);
  return newTrainee;
}

/**
 * ---------------- UPDATE ----------------
 * Updates an existing trainee's first and last name.
 * Expects: [id, firstName, lastName]
 */
function updateTrainee(args) {
  if (args.length < 3) {
    console.log('ERROR: Invalid trainee name for update');
    return { error: 'ERROR: Invalid trainee name for update' };
  }

  const [idString, firstName, lastName] = args;
  const id = Number(idString);

  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(`Trainee with ID ${id} not found`);
    return null;
  }

  trainee.firstName = firstName;
  trainee.lastName = lastName;
  saveTraineeData(trainees);

  console.log(`Trainee ${firstName} ${lastName} updated successfully`);
  return trainee;
}

/**
 * ---------------- DELETE ----------------
 * Removes a trainee by ID.
 * Expects: [id]
 */
function deleteTrainee(args) {
  if (args.length < 1) {
    console.log('ERROR: Invalid trainee ID for deletion');
    return { error: 'ERROR: Invalid trainee ID for deletion' };
  }

  const id = Number(args[0]);
  let trainees = loadTraineeData();

  const exists = trainees.some((t) => t.id === id);
  if (!exists) {
    console.log(`Trainee with ID ${id} not found`);
    return null;
  }

  trainees = trainees.filter((t) => t.id !== id);
  saveTraineeData(trainees);

  console.log(`Trainee with ID ${id} deleted successfully`);
  return true;
}

/**
 * ---------------- FETCH ----------------
 * Returns a single trainee by ID.
 * Expects: [id]
 */
function fetchTrainee(args) {
  if (args.length < 1) {
    console.log('ERROR: Invalid trainee ID for fetching');
    return { error: 'ERROR: Invalid trainee ID for fetching' };
  }

  const id = Number(args[0]);
  const trainees = loadTraineeData();
  const trainee = trainees.find((t) => t.id === id);

  if (!trainee) {
    console.log(`Trainee with ID ${id} not found`);
    return null;
  }

  console.log(trainee);
  return trainee;
}

/**
 * ---------------- FETCHALL ----------------
 * Returns all trainees.
 */
function fetchAllTrainees() {
  const trainees = loadTraineeData();

  if (trainees.length === 0) {
    console.log('No trainees found');
    return [];
  }

  trainees.forEach((t) => {
    console.log(`${t.id}: ${t.firstName} ${t.lastName}`);
  });

  return trainees;
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

    case 'FETCH':
      // Retrieves a single trainee by ID
      return fetchTrainee(args);

    case 'FETCHALL':
    case 'LIST':
      // Returns all trainees
      return fetchAllTrainees();

    default:
      // Handles invalid or unknown subcommands
      console.log('ERROR: Invalid trainee command');
      return { error: 'ERROR: Invalid trainee command' };
  }
}
