const { defineConfig } = require('@vue/cli-service')
const packageName = require('./package.json').name

const isProduction = process.env.NODE_ENV === 'production'

const path = require('path')
const resolve = (p) => {
  return path.resolve(__dirname, p)
}
const VUE_APP_SYSTEM = process.env.VUE_APP_SYSTEM
const publicPath = VUE_APP_SYSTEM.length > 1 ? `/child-${VUE_APP_SYSTEM.replace(/\//g, '')}/` : '/'

let isDebug = false

let transpileDependencies = []

// 因为vue-cli5 是已经配置babel 可以编译jsx 所有，可以debug node_modules/vue-plugin
if (isDebug) {
  transpileDependencies = ['vue-plugin']
}

module.exports = defineConfig({
  lintOnSave: false,
  assetsDir: 'static',
  chainWebpack: (config) => {
    config.resolve.alias.set('assets', resolve('./src/assets')).set('components', resolve('./src/components')).end()

    config.output.library(`${packageName}-[name]`).libraryTarget('umd')

    // webpack5 的设置方式，webpack4设置的是 jsonpFunction: `webpackJsonp_${packageName}`
    config.output.chunkLoadingGlobal = `webpackJsonp_${packageName}`

    if (!isProduction) {
      config.devtool('source-map')
    }
  },
  publicPath,
  devServer: {
    port: process.env.VUE_APP_PORT,
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    },
    hot: true
  },

  // 编译node_modules里面的包
  transpileDependencies,

  productionSourceMap: !isProduction
})
