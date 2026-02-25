/**
 * command-parser.test.js
 * -----------------------------------------
 * These tests verify the behavior of the parseCommand() function.
 *
 * The parser must:
 *   - Extract command, subcommand, and arguments
 *   - Support quoted arguments as a single token
 *   - Return null for empty input
 *   - Return an error object when command or subcommand is missing
 */

import { describe, expect, test } from 'vitest';
import { parseCommand } from '../src/command-parser.js';

describe('parseCommand', () => {
  /**
   * -----------------------------------------
   * Test: Simple TRAINEE ADD command
   * -----------------------------------------
   */
  test('parses a simple trainee add command', () => {
    const input = 'TRAINEE ADD Hamed Razizadeh';
    const result = parseCommand(input);

    expect(result).toEqual({
      command: 'TRAINEE',
      subcommand: 'ADD',
      args: ['Hamed', 'Razizadeh'],
    });
  });

  /**
   * -----------------------------------------
   * Test: COURSE ADD with quoted argument
   * -----------------------------------------
   */
  test('parses a course add command with quoted name', () => {
    const input = 'COURSE ADD "Intro to JavaScript Course" 2026-01-07';
    const result = parseCommand(input);

    expect(result).toEqual({
      command: 'COURSE',
      subcommand: 'ADD',
      args: ['Intro to JavaScript Course', '2026-01-07'],
    });
  });

  /**
   * -----------------------------------------
   * Test: Empty input returns null
   * -----------------------------------------
   */
  test('returns null for empty input', () => {
    const input = '';
    const result = parseCommand(input);

    expect(result).toBeNull();
  });

  /**
   * -----------------------------------------
   * Test: Missing subcommand triggers error
   * -----------------------------------------
   */
  test('returns error object when command or subcommand is missing', () => {
    const input = 'TRAINEE';
    const result = parseCommand(input);

    expect(result).toEqual({ error: 'INVALID_COMMAND' });
  });
});
