export function parseCommand(userInput) {
  // TODO: Implement the logic to parse the user input and return an object with the command, subcommand, and arguments
} /**
 * Parses a raw CLI input string into:
 *  - command     (e.g., "TRAINEE")
 *  - subcommand  (e.g., "ADD")
 *  - args[]      (remaining parameters)
 *
 * This parser supports:
 *  - case‑insensitive commands (converted to UPPERCASE)
 *  - quoted arguments ("JavaScript Basics")
 *  - variable number of arguments
 *
 * Returns:
 *  { command, subcommand, args }
 *
 * Returns null for empty input.
 * Returns { error: 'INVALID_COMMAND' } when command or subcommand is missing.
 */
export function parseCommand(input) {
  // Reject empty or whitespace-only input
  if (!input || input.trim() === '') {
    return null;
  }

  // Split by spaces to extract command and subcommand
  const parts = input.trim().split(' ');
  const rawCommand = parts[0];
  const rawSubcommand = parts[1];

  // Both command and subcommand must exist
  if (!rawCommand || !rawSubcommand) {
    return { error: 'INVALID_COMMAND' };
  }

  // Normalize to uppercase for consistent routing
  const command = rawCommand.toUpperCase();
  const subcommand = rawSubcommand.toUpperCase();

  /**
   * Extract everything after command + subcommand.
   * Example:
   *   "trainee add John Doe"
   * parts.slice(2) → ["John", "Doe"]
   */
  const rawArgs = parts.slice(2).join(' ').trim();

  let args = [];

  // No arguments provided
  if (!rawArgs) {
    return { command, subcommand, args };
  }

  /**
   * Handle quoted arguments:
   * Example:
   *   COURSE ADD "JavaScript Basics" 2025-01-01
   * rawArgs starts with a quote → treat the quoted text as a single argument
   */
  if (rawArgs.startsWith('"')) {
    const closing = rawArgs.indexOf('"', 1);

    // No closing quote found → fallback to simple split
    if (closing === -1) {
      args = rawArgs.split(' ').filter(Boolean);
    } else {
      // Extract the quoted argument without the quotes
      const quoted = rawArgs.slice(1, closing);

      // Remaining arguments after the closing quote
      const after = rawArgs.slice(closing + 1).trim();

      // Combine quoted argument with any additional parameters
      args = after ? [quoted, ...after.split(' ').filter(Boolean)] : [quoted];
    }
  } else {
    // No quotes → simple space-based split
    args = rawArgs.split(' ').filter(Boolean);
  }

  return { command, subcommand, args };
}
