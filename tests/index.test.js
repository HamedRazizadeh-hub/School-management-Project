// tests/index.test.js
import { describe, test, expect, vi, beforeEach } from 'vitest';

// ---- MOCK prompt-sync ----
const mockPrompt = vi.fn();
vi.mock('prompt-sync', () => ({
  default: () => mockPrompt,
}));

// ---- MOCK chalk ----
vi.mock('chalk', () => ({
  default: {
    green: (msg) => msg,
    yellow: (msg) => msg,
    red: (msg) => msg,
    cyan: (msg) => msg,
    gray: (msg) => msg,
  },
}));

// ---- MOCK parseCommand ----
import { parseCommand } from '../src/command-parser.js';
vi.mock('../src/command-parser.js', () => ({
  parseCommand: vi.fn(),
}));

// ---- MOCK handlers ----
import { handleTraineeCommand } from '../src/traineeCommands.js';
import { handleCourseCommand } from '../src/courseCommands.js';

vi.mock('../src/traineeCommands.js', () => ({
  handleTraineeCommand: vi.fn(),
}));

vi.mock('../src/courseCommands.js', () => ({
  handleCourseCommand: vi.fn(),
}));

// ---- Import index AFTER mocks ----
import { startCLI } from '../src/index.js';

describe('Index CLI routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('routes trainee commands correctly', () => {
    mockPrompt
      .mockReturnValueOnce('trainee add Ali Rezaei')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'trainee',
      subcommand: 'add',
      args: ['Ali', 'Rezaei'],
    });

    startCLI();

    expect(handleTraineeCommand).toHaveBeenCalledWith('add', ['Ali', 'Rezaei']);
  });

  test('routes course commands correctly', () => {
    mockPrompt
      .mockReturnValueOnce('course join 12 10')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'course',
      subcommand: 'join',
      args: ['12', '10'],
    });

    startCLI();

    expect(handleCourseCommand).toHaveBeenCalledWith('join', ['12', '10']);
  });

  test('shows error for unknown command', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    mockPrompt
      .mockReturnValueOnce('something wrong')
      .mockReturnValueOnce('exit');

    parseCommand.mockReturnValue({
      command: 'unknown',
      subcommand: '',
      args: [],
    });

    startCLI();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error: unknown primary command. Type "help" for commands.'
    );
  });
});
