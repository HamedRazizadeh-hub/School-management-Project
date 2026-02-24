import { describe, test, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { handleCourseCommand } from '../src/courseCommands.js';
import { loadCourseData, loadTraineeData } from '../src/storage.js';

// Absolute paths to ensure consistent test behavior
const COURSE_DATA_FILE_PATH = path.resolve('data/courses.json');
const TRAINEE_DATA_FILE_PATH = path.resolve('data/trainees.json');

/**
 * Reset both course and trainee data before each test.
 * Ensures isolation and prevents ID collisions or leftover participants.
 */
beforeEach(() => {
  fs.writeFileSync(COURSE_DATA_FILE_PATH, '[]', 'utf-8');
  fs.writeFileSync(TRAINEE_DATA_FILE_PATH, '[]', 'utf-8');
});

describe('Course Commands', () => {
  /**
   * ---------------- ADD TEST ----------------
   * Ensures that a new course is created with:
   * - correct name
   * - correct start date
   * - empty participants array
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
   * ---------------- GETALL TEST ----------------
   * Ensures that GETALL returns all stored courses.
   */
  test('GETALL should return all courses', () => {
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

    // Join trainee 10
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

  /**
   * ---------------- CAPACITY TEST ----------------
   * Ensures that a course cannot exceed 20 participants.
   */
  test('JOIN should not allow more than 20 participants', () => {
    // Create 20 fake trainees
    const trainees = [];
    for (let i = 1; i <= 20; i++) {
      trainees.push({ id: i, firstName: 'T', lastName: String(i) });
    }
    fs.writeFileSync(TRAINEE_DATA_FILE_PATH, JSON.stringify(trainees, null, 2));

    // Create course
    handleCourseCommand('ADD', ['Docker', '2025-07-01']);
    let courses = loadCourseData();
    const courseId = courses[0].id;

    // Fill course with 20 trainees
    for (let i = 1; i <= 20; i++) {
      handleCourseCommand('JOIN', [String(courseId), String(i)]);
    }

    // Attempt to add trainee 21
    fs.writeFileSync(
      TRAINEE_DATA_FILE_PATH,
      JSON.stringify(
        [...trainees, { id: 21, firstName: 'Extra', lastName: 'User' }],
        null,
        2
      )
    );

    handleCourseCommand('JOIN', [String(courseId), '21']);

    courses = loadCourseData();
    expect(courses[0].participants.length).toBe(20);
  });
});
