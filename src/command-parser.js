export function parseCommand(input) {
  if (!input || input.trim() === '') {
    return null;
  }

  const tokens = input.match(/"([^"]+)"|\S+/g);

  // Special case: HELP command (single token)
  if (tokens.length === 1 && tokens[0].toUpperCase() === 'HELP') {
    return {
      command: 'HELP',
      subcommand: null,
      args: [],
    };
  }

  // Normal commands require at least command + subcommand
  if (!tokens || tokens.length < 2) {
    return { error: 'INVALID_COMMAND' };
  }

  const command = tokens[0].toUpperCase();
  const subcommand = tokens[1].toUpperCase();

  const args = tokens.slice(2).map((token) => {
    if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    return token;
  });

  return { command, subcommand, args };
}
