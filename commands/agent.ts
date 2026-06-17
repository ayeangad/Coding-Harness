import { Command } from 'commander'
import { agentLoop } from './agent-loop.ts'

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action((options) => {
    agentLoop(options.prompt)
    console.log("User prompt is ..." + options.prompt)
  })

