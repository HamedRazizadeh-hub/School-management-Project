// tests/index.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest';

// ------------------------------------------------------
// 1) DEFINE mockPrompt BEFORE ANY vi.mock()
// ------------------------------------------------------
const mockPrompt = vi.fn();

// ------------------------------------------------------
// 2) MOCK prompt-sync (must come immediately after mockPrompt)
// ------------------------------------------------------
vi.mock('prompt-sync', () => ({
  default: () => mockPrompt,
}));

// ------------------------------------------------------
// 3) MOCK chalk
// ------------------------------------------------------
vi.mock('chalk', () => ({
  default: {
    green: (msg) => msg,
    yellow: (msg) => msg,
    red: (msg) => msg,
    cyan: (msg) => msg,
    gray: (msg) => msg,
  },
}));

// ------------------------------------------------------
// 4) MOCK command-parser
// ------------------------------------------------------
vi.mock('../src/command-parser.js', () => ({
  parseCommand: vi.fn(),
}));

import { parseCommand } from '../src/command-parser.js';

// ------------------------------------------------------
// 5) MOCK trainee & course handlers
// ------------------------------------------------------
vi.mock('../src/traineeCommands.js', () => ({
  handleTraineeCommand: vi.fn(),
}));

vi.mock('../src/courseCommands.js', () => ({
  handleCourseCommand: vi.fn(),
}));

import { handleTraineeCommand } from '../src/traineeCommands.js';
import { handleCourseCommand } from '../src/courseCommands.js';

// ------------------------------------------------------
// 6) IMPORT index.js AFTER ALL MOCKS
// ------------------------------------------------------
import { startCLI } from '../src/index.js';

describe('Index CLI routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('routes trainee commands correctly', () => {
    mockPrompt
      .mockReturnValueOnce('TRAINEE ADD Hamed Razizadeh')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'TRAINEE',
      subcommand: 'ADD',
      args: ['Hamed', 'Razizadeh'],
    });

    startCLI();

    expect(handleTraineeCommand).toHaveBeenCalledWith('ADD', [
      'Hamed',
      'Razizadeh',
    ]);
  });

  test('routes course commands correctly', () => {
    mockPrompt
      .mockReturnValueOnce('COURSE JOIN 12 10')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'COURSE',
      subcommand: 'JOIN',
      args: ['12', '10'],
    });

    startCLI();

    expect(handleCourseCommand).toHaveBeenCalledWith('JOIN', ['12', '10']);
  });

  test('shows error for unknown command', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    mockPrompt
      .mockReturnValueOnce('something wrong')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'UNKNOWN',
      subcommand: '',
      args: [],
    });

    startCLI();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error: unknown primary command. Type "help" for commands.'
    );
  });
});
