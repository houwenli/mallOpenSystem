const chalk = require('chalk')
console.log('')
console.log(chalk.bgGreenBright('**************** lint-staged启动 ********************'))
console.log('')

module.exports = {
  '*.js': ['prettier --write', 'eslint --fix --ext .{js,vue,ts,jsx}'],
  '*.jsx': ['prettier --write', 'eslint --fix --ext .{js,vue,ts,jsx}'],
  '*.ts': ['prettier --write', 'eslint --fix --ext .{js,vue,ts,jsx}'],
  '*.vue': ['prettier --write', 'eslint --fix --ext .{js,vue,ts,jsx}'],
  '**/*.(scss,less,css)': ['stylelint --fix', 'prettier --write']
}
