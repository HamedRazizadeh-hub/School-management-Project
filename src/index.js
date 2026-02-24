// Import modules
import promptSync from 'prompt-sync';
import chalk from 'chalk';
import { parseCommand } from './command-parser.js';
import { handleTraineeCommand } from './traineeCommands.js';
import { handleCourseCommand } from './courseCommands.js';

/**
 * Starts the interactive CLI loop.
 * All logic is inside this function so tests can run without executing the loop automatically.
 */
export function startCLI() {
  const prompt = promptSync({ sigint: true });

  console.log(
    chalk.green(
      'School Manager CLI: type "help" for a list of available commands "exit" to quit.'
    )
  );

  while (true) {
    try {
      const input = prompt('> ').trim();

      // Empty input
      if (!input) {
        console.log(
          chalk.gray(
            'Please enter a command. Type "help" for a list of available commands.'
          )
        );
        continue;
      }

      const normalizedInput = input.toLowerCase();

      // Exit command
      if (normalizedInput === 'exit' || normalizedInput === 'quit') {
        console.log(chalk.yellow('Exiting application. Goodbye.'));
        break;
      }

      // Help command
      if (normalizedInput === 'help') {
        console.log(
          chalk.cyan(`
Basic commands:
  trainee add <firstName> <lastName>         - create a trainee
  trainee update <ID> <firstName> <lastName> - update trainee
  trainee search <query>      - search trainee
  trainee delete <id>         - delete trainee
  trainee get <id>            - view a trainee
  trainee getall              - view all trainees

  course add <name> <startDate>          - create a course
  course update  <ID> <name> <startDate> - update course
  course delete <id>        - delete course
  course get <id>           - view a course
  course getall             - view all courses

  course join <courseID> <traineeID> - add trainee to course
  course join <courseId> <traineeId>   - add trainee to course
  course leave <courseId> <traineeId>  - remove trainee from course

Type "exit" or "quit" to close.
        `)
        );
        continue;
      }

      // Parse the command
      const parsed = parseCommand(input);

      // Invalid parse result
      if (!parsed || parsed.error) {
        console.log(
          chalk.red('Error: unknown primary command. Type "help" for commands.')
        );
        continue;
      }

      let { command, subcommand, args } = parsed;

      // Normalize for routing
      const cmd = command.toUpperCase();
      const sub = subcommand.toUpperCase();

      // Route to trainee or course handlers
      if (cmd === 'TRAINEE') {
        handleTraineeCommand(sub, args);
      } else if (cmd === 'COURSE') {
        handleCourseCommand(sub, args);
      } else {
        console.log(
          chalk.red('Error: unknown primary command. Type "help" for commands.')
        );
      }
    } catch (error) {
      console.log(chalk.red(`Error: ${error}`));
    }
  }
}

startCLI();
