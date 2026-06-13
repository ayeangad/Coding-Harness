import { Command } from "commander";

export const logoutCommand = new Command("logout")
  .description('Let user logout from the provider')
  .option('-p, --provider <providerName', 'Name of the provider', '')
  .action((options) => {
    console.log("logging out for provider " + options.providerName)
  })

