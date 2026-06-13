import { Command } from 'commander';

export const loginCommand = new Command("login")
  .description('Let user login into the provider (use it as default)')
  .option('-p, --provider <providerName>', 'Name of the provider', '')
  .option('-a, --api_key <apiKey>', 'Your api key', '')
  .action((options) => {
    console.log("logging into " + options.providerName)
  })


