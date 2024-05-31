## 电商开放平台

> OA子应用 - OA 本地生活


### 运行
```shell
npm install -g nrm
nrm add web http://172.25.66.6:4873/
nrm use web
npm install
```

### 项目架构描述

采用 vue-cli 5.x版本运行, 基于 webpack 5, 相关webpack5 的配置均采用 [webpack-chain](https://www.npmjs.com/package/webpack-chain/v/6.2.0) 写法

- webpack 5支持
  - 支持导出webpack 整个配置
- vue 2.7 版本支持
- debug node_modules中的依赖包
- 项目中jsx的支持
- less 和 sass都支持, 且均为最新版本
- eslint + husky + babel 均为最新版本


##### debug vue-plugin 或者debug node_modules中的任意包

vue.config.js 中将isDebug 设置为 true

加入需要debug的清单， 默认是不编译 node_modules 的， 因为编译node_modules中的包，会增加项目启动时间
```
transpileDependencies = ['vue-plugin', ....等]
```

重启项目， 即可debug vue-plugin


##### 版本查看
```shell
# 查看全局 vue 版本
vue --verison

# 如果版本不是 5.x 建议全局重新安装
npm install -g @vue/cli
```

### scripts 脚本说明
目前系统只能以子应用运行， 需要OA系统中的鉴权， 不可独立运行

```shell
# qiankun 作为子应用运行
npm run serve:qiankun

# qiankun 作为子应用 打包
npm run build:qiankun

# 修复项目语法错误
npm run lint

# 将 vue-cli 脚手架的配置文件导出，以检验我们配置是否正确
npm run inspect

# 格式化整个项目风格
npm run format:code

# 检查运行环境是否符合项目启动要求
node ./src/checkEnv.js
```

### tips

sass 和less  深度选择器

```html
<style lang="scss" scoped>
<!--语法错误-->

/deep/ .box {}

<!---语法警告 能运行 但是不建议这样写-->
::v-deep .box {}

<!--推荐 正确写法-->
:deep(.el-menu) {

}
</style>

```

### git提交日志规范

只接收如下的提交规范

```
feat
fix
docs
style
refactor
test
chore
```

```
# 例如
feat: 新增了一个功能
fix: 修复列表的枚举值问题
docs: 文档增加对xx功能的描述
...
```

