import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as traineeCommands from '../src/traineeCommands.js';
import * as storage from '../src/storage.js';

// ---------------- MOCK STORAGE ----------------
let trainees = [];

vi.mock('../src/storage.js', () => ({
  loadTraineeData: vi.fn(() => trainees),
  saveTraineeData: vi.fn((data) => {
    trainees = data;
  }),
  loadCourseData: vi.fn(() => []),
  saveCourseData: vi.fn(),
}));

describe('Trainee Commands', () => {
  beforeEach(() => {
    trainees = [];
    vi.clearAllMocks();
    console.log = vi.fn(); // prevent console output
  });

  it('ADD should generate a unique numeric ID', () => {
    const t1 = traineeCommands.addTrainee(['Ali', 'Rezaei']);
    const t2 = traineeCommands.addTrainee(['Sara', 'Ahmadi']);

    expect(t1.id).not.toBe(t2.id);
    expect(trainees.map((t) => t.id)).toContain(t1.id);
    expect(trainees.map((t) => t.id)).toContain(t2.id);
  });

  it('ADD should create a new trainee', () => {
    const trainee = traineeCommands.addTrainee(['Hamed', 'Razizadeh']);
    expect(trainees).toContain(trainee);
  });

  it('GETALL should return all trainees', () => {
    traineeCommands.addTrainee(['Ali', 'Rezaei']);
    traineeCommands.addTrainee(['Sara', 'Ahmadi']);
    const all = traineeCommands.getAllTrainees();
    expect(all.length).toBe(2);
  });

  it('GET should return a trainee by id', () => {
    const t = traineeCommands.addTrainee(['Nima', 'Karimi']);
    const result = traineeCommands.getTrainee([t.id]);
    expect(result).toEqual(t);
  });

  it('UPDATE should modify trainee fields', () => {
    const t = traineeCommands.addTrainee(['Maryam', 'Jafari']);
    const updated = traineeCommands.updateTrainee([t.id, 'Maryam', 'Moradi']);
    expect(updated.firstName).toBe('Maryam');
    expect(updated.lastName).toBe('Moradi');
  });

  it('DELETE should remove a trainee by id', () => {
    const t1 = traineeCommands.addTrainee(['Reza', 'Mohammadi']);
    const t2 = traineeCommands.addTrainee(['Lida', 'Sadeghi']);
    const deleted = traineeCommands.deleteTrainee([t1.id]);
    expect(deleted).toBe(true);
    expect(trainees.find((t) => t.id === t1.id)).toBeUndefined();
  });

  it('SEARCH should find trainees by partial and case-insensitive match', () => {
    traineeCommands.addTrainee(['Ali', 'Rezaei']);
    traineeCommands.addTrainee(['Sara', 'Ahmadi']);
    const results = traineeCommands.searchTrainees(['ali']);
    expect(results.length).toBe(1);
    expect(results[0].firstName).toBe('Ali');
  });

  it('SEARCH should return error when query is missing', () => {
    const result = traineeCommands.searchTrainees([]);
    expect(result).toHaveProperty('error');
  });
});
