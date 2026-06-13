import { Command } from 'commander'

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action((options) => {
    console.log("User prompt is ..." + options.prompt)
  })

