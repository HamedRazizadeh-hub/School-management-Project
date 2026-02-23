import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve('data');
const TRAINEE_DATA_FILE_PATH = path.join(DATA_DIR, 'trainees.json');
const COURSE_DATA_FILE_PATH = path.join(DATA_DIR, 'courses.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function safeLoadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (!content) return [];
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadTraineeData() {
  ensureDataDir();
  return safeLoadJson(TRAINEE_DATA_FILE_PATH);
}

export function saveTraineeData(data) {
  ensureDataDir();
  fs.writeFileSync(
    TRAINEE_DATA_FILE_PATH,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

export function loadCourseData() {
  ensureDataDir();
  return safeLoadJson(COURSE_DATA_FILE_PATH);
}

export function saveCourseData(data) {
  ensureDataDir();
  fs.writeFileSync(
    COURSE_DATA_FILE_PATH,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}
