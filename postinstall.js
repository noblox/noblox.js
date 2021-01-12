const chalk = require('chalk')
const figlet = require('figlet')

console.log(chalk.yellow(figlet.textSync('noblox.js', {
  font: 'Big',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})))

console.log(`
${chalk.underline('Thank you for installing noblox.js.')}

${chalk.bold('Documentation:')} https://noblox.js.org/ 
${chalk.bold('GitHub:')} https://github.com/suufi/noblox.js
${chalk.bold('Support:')} https://discord.gg/R5GVSyTVGv

${chalk.bold.blue('noblox.js is maintained with the help of its users but sometimes Roblox silently updates its API endpoints breaking noblox.js out of the blue.')}
${chalk.green('We have created a request for Roblox to implement a change log to help keep the project\'s endpoints updated which you can find here: https://devforum.roblox.com/t/introduce-change-logs-to-roblox-api-endpoints/524783.')}
${chalk.bgGreen('We also have our very own discord.js for support and informational purposes. To stay updated on new updates and bugs, you can join our Discord server with the following link: https://discord.gg/R5GVSyTVGv')}
`)
