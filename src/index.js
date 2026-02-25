import promptSync from 'prompt-sync';
import chalk from 'chalk';
import { parseCommand } from './command-parser.js';
import { handleCourseCommand } from './courseCommands.js';
import { handleTraineeCommand } from './traineeCommands.js';

/**
 * Prints the help menu.
 */
export function printHelp() {
  console.log(`
Available commands:

TRAINEE COMMANDS:
  trainee add <firstName> <lastName>
  trainee update <id> <firstName> <lastName>
  trainee delete <id>
  trainee get <id>
  trainee getall
  trainee search <query>

COURSE COMMANDS:
  course add <name> <startDate>
  course update <id> <name> <startDate>
  course delete <id>
  course get <id>
  course getall

PARTICIPATION COMMANDS:
  course join <courseId> <traineeId>
  course leave <courseId> <traineeId>

OTHER:
  help
  exit
`);
}

/**
 * Routes parsed commands to the correct handler.
 */
export function handleInput(input) {
  const parsed = parseCommand(input);

  if (!parsed || parsed.error) {
    console.log(chalk.red('ERROR: Invalid command'));
    return;
  }

  const { command, subcommand, args } = parsed;

  switch (command.toUpperCase()) {
    case 'HELP':
      printHelp();
      break;

    case 'TRAINEE':
      handleTraineeCommand(subcommand, args);
      break;

    case 'COURSE':
      handleCourseCommand(subcommand, args);
      break;

    default:
      console.log(chalk.red('ERROR: Invalid command'));
  }
}

/**
 * Starts the CLI loop.
 */
export function startCLI() {
  const prompt = promptSync();

  console.log(chalk.cyan('Welcome to the Training Management CLI!'));
  console.log(chalk.yellow('Type "help" to see available commands.'));
  console.log(chalk.yellow('Type "exit" to quit.'));

  while (true) {
    const input = prompt('> ');

    if (!input || input.toLowerCase() === 'exit') {
      console.log(chalk.yellow('Exiting CLI...'));
      break;
    }

    handleInput(input);
  }
}

// Auto-run only when executed directly
if (process.argv[1].endsWith('index.js')) {
  startCLI();
}
