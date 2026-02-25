import fs from 'node:fs';
import path from 'node:path';

/**
 * Absolute paths to the JSON data files.
 * Using path.resolve ensures that the paths remain correct
 * even when Vitest changes the working directory during execution.
 */
const COURSE_DATA_FILE_PATH = path.resolve('data/courses.json');
const TRAINEE_DATA_FILE_PATH = path.resolve('data/trainees.json');

/**
 * Safely loads a JSON file.
 *
 * Behavior:
 * - Returns [] if the file does not exist
 * - Returns [] if the file is empty
 * - Returns [] if JSON parsing fails
 * - Ensures the returned value is always an array
 */
function safeLoadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) return [];

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Any error (invalid JSON, permissions, corrupted file) → return empty array
    return [];
  }
}

/**
 * Loads all course records from courses.json.
 * Always returns an array.
 */
export function loadCourseData() {
  return safeLoadJson(COURSE_DATA_FILE_PATH);
}

/**
 * Saves the given array of course objects to courses.json.
 * Data is formatted with indentation for readability.
 */
export function saveCourseData(data) {
  fs.writeFileSync(
    COURSE_DATA_FILE_PATH,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

/**
 * Loads all trainee records from trainees.json.
 * Always returns an array.
 */
export function loadTraineeData() {
  return safeLoadJson(TRAINEE_DATA_FILE_PATH);
}

/**
 * Saves the given array of trainee objects to trainees.json.
 * Data is formatted with indentation for readability.
 */
export function saveTraineeData(data) {
  fs.writeFileSync(
    TRAINEE_DATA_FILE_PATH,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}
