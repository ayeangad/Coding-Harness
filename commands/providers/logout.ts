import { Command } from "commander";
import { homedir } from 'node:os'
import { join } from 'node:path'
import { write } from "bun"

const homeDir = homedir()
const targetFilePath = join(homeDir, ".coding-harness", "config.json")

export const logoutCommand = new Command("logout")
  .description('Let user logout from the provider')
  .option('-p, --provider <providerName', 'Name of the provider', '')
  .action(async (options) => {
    await write(targetFilePath, JSON.stringify({}));
    console.log(JSON.stringify({ logout: options }))
  })

