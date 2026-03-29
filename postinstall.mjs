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

${chalk.bold.red('noblox.js is no longer maintained. Do not use it for new work, and stop using it as soon as possible.')}
${chalk.bgGreen('Discord server: https://discord.gg/R5GVSyTVGv')}
`)
