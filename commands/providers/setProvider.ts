import { Command } from 'commander';

export const setProviderCommand = new Command("login")
  .description('Lets user set the default provider')
  .option('-p, --provider <providerName>', 'Name of the provider', '')
  .action((options) => {
    console.log("provider is  " + JSON.stringify(options))
  })
