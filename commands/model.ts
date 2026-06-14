import { Command } from "commander";
import { MODELS } from '../data/llm-models.ts'


export const modelsCommand = new Command("models")
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of them model', 'all')
  .action((options) => {
    console.log("Listing models...")

    if (options.model === "all") {
      console.log(MODELS)
    } else if (options.model === "openai") {
      console.log(MODELS.openai)
    } else if (options.model === "anthropic") {
      console.log(MODELS.anthropic)
    }

  })


