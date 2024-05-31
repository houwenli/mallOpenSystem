// prettier配置项说明 https://blog.csdn.net/peade/article/details/103865934
module.exports = {
  //使用tab缩进，默认false
  useTabs: true,
  // tab缩进大小,默认为2
  tabWidth: 4,
  // 换行长度，默认80
  printWidth: 120,
  // 字符串使用单引号
  singleQuote: true,
  // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  trailingComma: 'none',
  // 对象中打印空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // 每行末尾自动添加分号;false->不添加
  semi: false,
  //解决格式化插件Prettier，格式化操作后，结束标签＞跑到下一行的问题
  htmlWhitespaceSensitivity: 'ignore',
  endOfLine: 'auto'
}
