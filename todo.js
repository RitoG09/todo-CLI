import { Command } from "commander";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

const filepath = path.join(os.homedir(), "todos.json");

program.name("counter").description("CLI to manage TODOs").version("0.8.0");

//Read todo list from file
function readTodos() {
  try {
    const data = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

//Write todo list from file
function writeTodos(todos) {
  fs.writeFileSync(filepath, JSON.stringify(todos, null, 2), "utf8");
}

//Adding a todo
program
  .command("add <task>")
  .description("Adding a new todo")
  //   .argument("<add>", "todo added")
  .action((task) => {
    const todos = readTodos();
    todos.push({ task, completed: false });
    writeTodos(todos);
    console.log(chalk.green(`Todo successfully added: ${task}`));
  });

//Command to list all todo
program
  .command("list")
  .description("List all todos")
  .action(() => {
    const todos = readTodos();
    if (todos.length === 0) {
      console.log(chalk.yellow("No todos found"));
    } else {
      todos.forEach((todo, index) => {
        const status = todo.completed
          ? chalk.green("✅")
          : chalk.red("pending");
        const taskColor = todo.completed ? chalk.dim : chalk.white;
        console.log(`${index + 1}. ${taskColor(todo.task)} [${status}]`);
      });
    }
  });

// Command to mark a todo as complete
program
  .command("complete <index>")
  .description("Mark a todo as completed")
  .action((index) => {
    const todos = readTodos();
    if (todos[index - 1]) {
      todos[index - 1].completed = true;
      writeTodos(todos);
      console.log(chalk.blue(`Task ${index} marked as completed.`));
    } else {
      console.log(chalk.red("Invalid task index."));
    }
  });

// Command to delete a todo
program
  .command("delete <index>")
  .description("Delete a todo")
  .action((index) => {
    const todos = readTodos();
    if (todos[index - 1]) {
      const removed = todos.splice(index - 1, 1);
      writeTodos(todos);
      console.log(chalk.red(`Deleted task: ${removed[0].task}`));
    } else {
      console.log(chalk.red("Invalid task index."));
    }
  });

program
  .command("update <index> <newTodo>")
  .description("Update a todo")
  .action((index, newTodo) => {
    const todos = readTodos();
    if (todos[index - 1]) {
      const oldTodo = todos[index - 1].task;
      todos[index - 1].task = newTodo;
      writeTodos(todos);
      console.log(
        chalk.blue(`Updated task ${index} from "${oldTodo}" to "${newTodo}".`)
      );
    } else {
      console.log(chalk.pink("Invalid task index."));
    }
  });

program.parse(process.argv);
