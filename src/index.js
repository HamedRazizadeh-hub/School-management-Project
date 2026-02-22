// Import modules and data used for the CLI program
import promptSync from "prompt-sync";
import chalk from "chalk";
import { parseCommand } from "./command-parser.js";
import { handleTraineeCommand } from "./traineeCommands.js";
import { handleCourseCommand } from "./courseCommands.js";

// Defines prompt variable and allows for exiting using CTRL+C
const prompt = promptSync({ sigint: true });

// Welcome message for CLI program
console.log(
  chalk.green(
    'School Manager CLI: type "help" for a list of available commands "exit" to quit.',
  ),
);

// Main application flow prompting for user input
while (true) {
  try {
    const input = prompt("> ").trim();
    if (!input) {
      console.log(
        chalk.gray(
          'Please enter a command. Type "help" for a list of available commands.',
        ),
      );
      continue;
    }
    // Command to exit the application with goodbye message
    const normalizedInput = input.toLowerCase();
    if (normalizedInput === "exit" || normalizedInput === "quit") {
      console.log(chalk.yellow("Exiting application. Goodbye."));
      break;
    }
    // Show list of available commands
    if (normalizedInput === "help") {
      console.log(
        chalk.cyan(`
Basic commands:
  trainee add <args>        - create a trainee
  trainee update <id> <...> - update trainee
  trainee delete <id>       - delete trainee
  trainee get <id>          - view a trainee
  trainee list              - view all trainees

  course add <args>         - create a course
  course update <id> <...>  - update course
  course delete <id>        - delete course
  course get <id>           - view a course
  course list               - view all courses

  course join <courseId> <traineeId>   - add trainee to course
  course leave <courseId> <traineeId>  - remove trainee from course

Type "exit" or "quit" to close.
      `),
      );
      continue;
    }

    // Destructure input and run function based on user input
    const { command, subcommand, args } = parseCommand(input);

    // Check whether running trainee commands or course commands otherwise return error
    // When running command check for subcommands and passed arguments
    if (command === "trainee") {
      handleTraineeCommand(subcommand, args);
    } else if (command === "course") {
      handleCourseCommand(subcommand, args);
    } else {
      console.log(
        chalk.red('Error: unknown primary command. Type "help" for commands.'),
      );
    }
  } catch (error) {
    console.log(chalk.red(`Error: ${error}`));
  }
}
