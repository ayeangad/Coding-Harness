import { Command } from "commander";

export const modelsCommand = new Command("models")
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of them model', 'all')
  .action((options) => {
    console.log("Listing models...")

    console.log(options)
  })


