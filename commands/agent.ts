import { Command } from 'commander'
import { agentLoop } from './agent-loop.ts'
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    while (true) {
      const answer = await ask("You: ")
      await agentLoop(answer)
    }
  }
  )


async function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question("You: ", (answer) => {
      resolve(answer)
    })
  })
}
