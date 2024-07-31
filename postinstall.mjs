import {Chalk} from 'chalk'
import figlet from 'figlet'

const chalk = new Chalk();
console.log(chalk.yellow(figlet.textSync('noblox.js', {
  font: 'Big',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})))

console.log(`
${chalk.underline('Thank you for installing noblox.js.')}

${chalk.bold('Documentation:')} https://noblox.js.org/ 
${chalk.bold('GitHub:')} https://github.com/noblox/noblox.js
${chalk.bold('Support:')} https://discord.gg/R5GVSyTVGv

${chalk.bold.blue('noblox.js is maintained with the help of its users but sometimes Roblox silently updates its API endpoints breaking noblox.js out of the blue.')}
${chalk.bgGreen('We have our very own Discord for support and informational purposes. To stay updated on new updates and bugs, you can join our Discord server with the following link: https://discord.gg/R5GVSyTVGv')}
`)
