import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prompt-sync to simulate user input
const mockPrompt = vi.fn();
vi.mock('prompt-sync', () => ({
  default: () => mockPrompt,
}));

// Import CLI after mocks
import { startCLI } from '../src/index.js';

// Capture console output
let output = [];
const storeLog = (...args) => output.push(args.join(' '));

beforeEach(() => {
  output = [];
  vi.spyOn(console, 'log').mockImplementation(storeLog);
  mockPrompt.mockReset();
});

describe('CLI Logical Behavior', () => {
  it('CLI exits immediately when user types "exit"', () => {
    mockPrompt.mockReturnValueOnce('exit');

    startCLI();

    expect(output.some((line) => line.includes('Exiting CLI'))).toBe(true);
  });

  it('TRAINEE commands are routed correctly', () => {
    mockPrompt
      .mockReturnValueOnce('trainee add John Doe')
      .mockReturnValueOnce('exit');

    startCLI();

    // We expect trainee creation output to appear
    expect(output.some((line) => line.includes('CREATED'))).toBe(true);
  });

  it('COURSE commands are routed correctly', () => {
    mockPrompt
      .mockReturnValueOnce('course add Math 2025-01-01')
      .mockReturnValueOnce('exit');

    startCLI();

    // We expect course creation output to appear
    expect(output.some((line) => line.includes('CREATED'))).toBe(true);
  });

  it('Invalid commands trigger an error message', () => {
    mockPrompt
      .mockReturnValueOnce('invalidCommand')
      .mockReturnValueOnce('exit');

    startCLI();

    expect(output.some((line) => line.includes('ERROR: Invalid command'))).toBe(
      true
    );
  });

  it('HELP command prints the help menu', () => {
    mockPrompt.mockReturnValueOnce('help').mockReturnValueOnce('exit');

    startCLI();

    expect(output.some((line) => line.includes('Available commands'))).toBe(
      true
    );
  });
});
