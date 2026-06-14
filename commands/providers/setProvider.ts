import { Command } from 'commander';
import { homedir } from 'node:os'
import { join } from 'node:path'

const homeDir = homedir()
const targetFilePath = join(homeDir, ".coding-harness", "config.json")
const myFile = Bun.file(targetFilePath, { type: "application/json" })
export const setProviderCommand = new Command("setprovider")
  .description('Lets user set the default provider')
  .option(`-p, --provider <providerName>`, 'Name of the provider', '')
  .action((options) => {
    const userProvider = JSON.stringify({ provider: options.provider })
    Bun.write(myFile, userProvider)
    console.log("provider is  " + JSON.stringify(options))
  })

