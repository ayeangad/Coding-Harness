import { Command } from 'commander';
import { homedir } from 'node:os'
import { join } from 'node:path'

const homeDir = homedir()
const targetFilePath = join(homeDir, ".coding-harness", "config.json")
const myFile = Bun.file(targetFilePath, { type: "application/json" })
export const loginCommand = new Command("login")
  .description('Let user login into the provider (use it as default)')
  .option('-p, --provider <providerName>', 'Name of the provider', '')
  .option('-a, --api_key <apiKey>', 'Your api key', '')
  .action((options) => {
    const userLogin = JSON.stringify({ provider: options.provider, api_key: options.api_key })
    Bun.write(myFile, userLogin)
    console.log(JSON.stringify({ logging: options }))
  })


