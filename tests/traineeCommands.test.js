import { describe, test, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { handleTraineeCommand } from '../src/traineeCommands.js';
import { loadTraineeData } from '../src/storage.js';

// Resolve absolute paths so Vitest always writes to the correct files
const TRAINEE_DATA_FILE_PATH = path.resolve('data/trainees.json');
const COURSE_DATA_FILE_PATH = path.resolve('data/courses.json');

/**
 * Reset trainee data before every test.
 * This ensures each test runs in a clean, isolated environment.
 * Without this reset, data from previous tests would persist and
 * cause ID collisions, incorrect FETCH results, or JOIN failures.
 */
beforeEach(() => {
  fs.writeFileSync('./data/trainees.json', '[]', 'utf-8');
  fs.writeFileSync('./data/courses.json', '[]', 'utf-8');
});

/**
 * ---------------- UNIQUE ID TEST ----------------
 * Ensures that ADD generates:
 * - a numeric ID
 * - exactly 6 digits
 * - unique values for each trainee
 */
test('ADD should generate a unique 6-digit numeric ID', () => {
  const t1 = handleTraineeCommand('ADD', ['Ali', 'Rezaei']);
  const t2 = handleTraineeCommand('ADD', ['Sara', 'Ahmadi']); // FIXED ARGUMENTS

  expect(typeof t1.id).toBe('number');
  expect(typeof t2.id).toBe('number');

  expect(String(t1.id).length).toBe(6);
  expect(String(t2.id).length).toBe(6);

  expect(t1.id).not.toBe(t2.id);

  const trainees = loadTraineeData();
  const ids = trainees.map((t) => t.id);

  expect(ids).toContain(t1.id);
  expect(ids).toContain(t2.id);
});

/**
 * ---------------- CRUD TESTS ----------------
 * These tests verify that trainee operations behave correctly:
 * ADD, FETCHALL, FETCH, UPDATE, DELETE
 */
describe('Trainee Commands', () => {
  test('ADD should create a new trainee', () => {
    handleTraineeCommand('ADD', ['Hamed', 'Razizadeh']);

    const trainees = loadTraineeData();
    expect(trainees.length).toBe(1);
    expect(trainees[0].firstName).toBe('Hamed');
    expect(trainees[0].lastName).toBe('Razizadeh');
  });

  test('FETCHALL should return all trainees', () => {
    handleTraineeCommand('ADD', ['Ali', 'Rezaei']);
    handleTraineeCommand('ADD', ['Sara', 'Ahmadi']);

    const trainees = handleTraineeCommand('FETCHALL', []);
    expect(trainees.length).toBe(2);
  });

  test('FETCH should return a trainee by id', () => {
    handleTraineeCommand('ADD', ['Nima', 'Karimi']);

    const trainees = loadTraineeData();
    const id = trainees[0].id;

    const result = handleTraineeCommand('FETCH', [String(id)]);
    expect(result.firstName).toBe('Nima');
  });

  test('UPDATE should modify trainee fields', () => {
    handleTraineeCommand('ADD', ['Maryam', 'Jafari']);

    let trainees = loadTraineeData();
    const id = trainees[0].id;

    handleTraineeCommand('UPDATE', [String(id), 'Maryam', 'Moradi']);

    trainees = loadTraineeData();
    expect(trainees[0].lastName).toBe('Moradi');
  });

  test('DELETE should remove a trainee by id', () => {
    handleTraineeCommand('ADD', ['Reza', 'Mohammadi']);
    handleTraineeCommand('ADD', ['Lida', 'Sadeghi']);

    let trainees = loadTraineeData();
    const idToDelete = trainees[0].id;

    handleTraineeCommand('DELETE', [String(idToDelete)]);

    trainees = loadTraineeData();
    expect(trainees.length).toBe(1);
    expect(trainees[0].firstName).toBe('Lida');
  });
});
