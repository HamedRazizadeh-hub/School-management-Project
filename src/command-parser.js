export function parseCommand(input) {
  // Return null for empty or whitespace-only input
  if (!input || input.trim() === '') {
    return null;
  }

  // Split the input by spaces to get the first two tokens
  const parts = input.trim().split(' ');
  const rawCommand = parts[0];
  const rawSubcommand = parts[1];

  // If either command or subcommand is missing, return an error object
  if (!rawCommand || !rawSubcommand) {
    return { error: 'ERROR: Invalid command' };
  }

  // Tests expect UPPERCASE command and subcommand
  const command = rawCommand.toUpperCase();
  const subcommand = rawSubcommand.toUpperCase();

  // The rest of the input after command and subcommand
  // +2 accounts for the two spaces between them
  const rest = input
    .trim()
    .slice(rawCommand.length + rawSubcommand.length + 2)
    .trim();

  let args = [];

  // If there's nothing left after command and subcommand, args is an empty array
  if (!rest) {
    return { command, subcommand, args };
  }

  // If the first argument starts with a quote, we treat everything inside quotes as one argument
  if (rest.startsWith('"')) {
    const closingIndex = rest.indexOf('"', 1);

    // If no closing quote is found, fall back to simple split
    if (closingIndex === -1) {
      args = rest.split(' ').filter(Boolean);
    } else {
      // Extract the quoted part without the quotes
      const quoted = rest.slice(1, closingIndex);

      // Everything after the closing quote
      const after = rest.slice(closingIndex + 1).trim();

      if (after.length > 0) {
        // First arg is the quoted string, rest are split by spaces
        args = [quoted, ...after.split(' ').filter(Boolean)];
      } else {
        // Only one quoted argument
        args = [quoted];
      }
    }
  } else {
    // No quotes: simply split by spaces and remove empty strings
    args = rest.split(' ').filter(Boolean);
  }

  return { command, subcommand, args };
}
