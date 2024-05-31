const chalk = require('chalk')
const { exit } = require('process')
const exec = require('child_process').exec
const semver = require('semver')

console.log(chalk.cyanBright('========检测当前项目运行所必须的环境========'))

console.log(chalk.green(`node:     14+`))
console.log(chalk.green(`@vue/cli: 5+ \n`))

console.log(`node版本必须14+, 当前node 版本： ${chalk.green(process.versions.node)} \n`)

if (!semver.gte(process.versions.node, '14.0.0')) {
  console.log(chalk.bgRedBright(`node版本不对`))
  console.log(chalk.red(`-- 建议 nvm 切换node版本-- `))
  console.log(chalk.red(`nvm install 14`))
  console.log(chalk.red(`nvm list`))
  console.log(chalk.red(`nvm use 14.x.x \n`))
  exit(0)
}

exec('vue -V', (err, stdout) => {
  if (err) {
    console.log('可能是没有安装全局 @vue/cli')
    console.log(chalk.red(`npm install -g @vue/cli \n`))
    exit(0)
  }


  try {
    let vueVersion = stdout.split(' ')[1]

    if (!semver.gte(vueVersion, '5.0.0')) {
      console.log(chalk.bgRedBright(`vue-cli 版本不对`))
      console.log('建议升级：', chalk.red(`npm install -g @vue/cli \n`))
      exit(0)
    }

    console.log(`${chalk.cyanBright('==================end========================\n')}`)
  } catch (error) {
    console.log(error)
  }
})
