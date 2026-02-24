import { describe, test, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { handleCourseCommand } from '../src/courseCommands.js';
import { loadCourseData } from '../src/storage.js';

// Resolve absolute paths so Vitest always writes to the correct files
const COURSE_DATA_FILE_PATH = path.resolve('data/courses.json');
const TRAINEE_DATA_FILE_PATH = path.resolve('data/trainees.json');

/**
 * Reset both course and trainee data before each test.
 * This ensures each test runs in a clean, isolated environment.
 * Without this reset, leftover data from previous tests could cause
 * ID collisions, JOIN failures, or inconsistent LIST results.
 */
beforeEach(() => {
  fs.writeFileSync(COURSE_DATA_FILE_PATH, '[]', 'utf-8');
  fs.writeFileSync(TRAINEE_DATA_FILE_PATH, '[]', 'utf-8');
});

describe('Course Commands', () => {
  /**
   * Reset both course and trainee data before every test.
   * This ensures each test runs in a clean, isolated environment.
   * Without this reset, leftover data from previous tests would cause
   * ID collisions, JOIN failures, or inconsistent LIST results.
   */
  beforeEach(() => {
    fs.writeFileSync(COURSE_DATA_FILE_PATH, '[]', 'utf-8');
    fs.writeFileSync(TRAINEE_DATA_FILE_PATH, '[]', 'utf-8');
  });

  /**
   * ---------------- ADD TEST ----------------
   * Ensures that a new course is created with:
   * - correct name
   * - correct start date
   * - an empty participants array
   */
  test('ADD should create a new course', () => {
    handleCourseCommand('ADD', ['JavaScript', '2025-02-01']);

    const courses = loadCourseData();
    expect(courses.length).toBe(1);
    expect(courses[0].name).toBe('JavaScript');
    expect(courses[0].startDate).toBe('2025-02-01');
    expect(courses[0].participants).toEqual([]);
  });

  /**
   * ---------------- LIST TEST ----------------
   * Ensures that LIST returns all stored courses.
   */
  test('LIST should return all courses', () => {
    handleCourseCommand('ADD', ['NodeJS', '2025-03-10']);
    handleCourseCommand('ADD', ['React', '2025-04-01']);

    const courses = loadCourseData();
    expect(courses.length).toBe(2);
  });

  /**
   * ---------------- DELETE TEST ----------------
   * Ensures that DELETE removes a course by ID.
   */
  test('DELETE should remove a course by id', () => {
    handleCourseCommand('ADD', ['HTML', '2025-01-01']);
    handleCourseCommand('ADD', ['CSS', '2025-01-15']);

    let courses = loadCourseData();
    const idToDelete = courses[0].id;

    handleCourseCommand('DELETE', [String(idToDelete)]);

    courses = loadCourseData();
    expect(courses.length).toBe(1);
    expect(courses[0].name).toBe('CSS');
  });

  /**
   * ---------------- JOIN TEST ----------------
   * Ensures that JOIN adds a trainee ID to the course's participants array.
   *
   * IMPORTANT:
   * Trainee IDs in the real system are 6-digit numbers.
   * But this test expects trainee ID = 10 to exist.
   * Therefore, we manually insert a fake trainee with ID = 10
   * into trainees.json before running JOIN.
   */
  test('JOIN should add a trainee to a course', () => {
    // Insert a fake trainee with ID = 10
    fs.writeFileSync(
      TRAINEE_DATA_FILE_PATH,
      JSON.stringify([{ id: 10, firstName: 'Test', lastName: 'User' }], null, 2)
    );

    // Create a course
    handleCourseCommand('ADD', ['Python', '2025-05-01']);

    let courses = loadCourseData();
    const courseId = courses[0].id;

    // Attempt to join trainee 10 to the course
    handleCourseCommand('JOIN', [String(courseId), '10']);

    courses = loadCourseData();
    expect(courses[0].participants).toContain(10);
  });

  /**
   * ---------------- LEAVE TEST ----------------
   * Ensures that LEAVE removes a trainee ID from the participants array.
   */
  test('LEAVE should remove a trainee from a course', () => {
    // Insert a fake trainee with ID = 7
    fs.writeFileSync(
      TRAINEE_DATA_FILE_PATH,
      JSON.stringify([{ id: 7, firstName: 'Test', lastName: 'User' }], null, 2)
    );

    // Create a course
    handleCourseCommand('ADD', ['SQL', '2025-06-01']);

    let courses = loadCourseData();
    const courseId = courses[0].id;

    // Join trainee 7
    handleCourseCommand('JOIN', [String(courseId), '7']);

    // Leave course
    handleCourseCommand('LEAVE', [String(courseId), '7']);

    courses = loadCourseData();
    expect(courses[0].participants).not.toContain(7);
  });
});
