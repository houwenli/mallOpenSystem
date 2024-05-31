module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@vue/babel-preset-jsx',
      {
        // 意思是不要注入 h
        'injectH': false
      }
    ]
  ]
}
