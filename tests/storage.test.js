/**
 * storage.test.js
 * -----------------------------------------
 * These tests verify the behavior of the storage system.
 *
 * The tests ensure:
 *   - JSON files are read correctly
 *   - Empty files return empty arrays
 *   - Data is written correctly to disk
 *
 * Before each test, both trainee and course files
 * are reset to ensure isolation.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  loadTraineeData,
  saveTraineeData,
  loadCourseData,
  saveCourseData,
} from '../src/storage.js';

// Absolute paths (correct for Vitest)
const TRAINEE_FILE = path.resolve('data/trainees.json');
const COURSE_FILE = path.resolve('data/courses.json');

/**
 * Reset both files before each test.
 */
beforeEach(() => {
  fs.writeFileSync(TRAINEE_FILE, '[]', 'utf-8');
  fs.writeFileSync(COURSE_FILE, '[]', 'utf-8');
});

describe('Storage System', () => {
  /**
   * -----------------------------------------
   * Trainee Storage Tests
   * -----------------------------------------
   */

  test('loadTraineeData should return an empty array when file is empty', () => {
    const data = loadTraineeData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  test('saveTraineeData should write data to file', () => {
    const sample = [{ id: 1, firstName: 'Ali', lastName: 'Rezaei' }];
    saveTraineeData(sample);

    const fileContent = JSON.parse(fs.readFileSync(TRAINEE_FILE, 'utf-8'));
    expect(fileContent.length).toBe(1);
    expect(fileContent[0].firstName).toBe('Ali');
  });

  /**
   * -----------------------------------------
   * Course Storage Tests
   * -----------------------------------------
   */

  test('loadCourseData should return an empty array when file is empty', () => {
    const data = loadCourseData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  test('saveCourseData should write data to file', () => {
    const sample = [{ id: 10, name: 'JavaScript', startDate: '2025-02-01' }];
    saveCourseData(sample);

    const fileContent = JSON.parse(fs.readFileSync(COURSE_FILE, 'utf-8'));
    expect(fileContent.length).toBe(1);
    expect(fileContent[0].name).toBe('JavaScript');
  });
});
