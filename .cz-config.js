module.exports = {
  // 可选类型
  types: [
    { value: ':sparkles: feat', name: '✨ feat: 一项新功能' },
    { value: ':bug: fix', name: '🐛 fix: 修复Bug' },
    { value: ':tada: init', name: '🎉 init: 项目初始化' },
    { value: ':memo: docs', name: '📝 docs: 文档变更' },
    { value: ':lipstick: style', name: '💄 style: 代码风格，格式修复' },
    { value: ':recycle: refactor', name: '♻️ refactor: 代码重构，注意和feat、fix区分开' },
    { value: ':zap: perf', name: '⚡️ perf: 代码优化,改善性能' },
    { value: ':white_check_mark: test', name: '✅ test: 测试' },
    { value: ':rocket: chore', name: '🚀 chore: 变更构建流程或辅助工具' },
    { value: ':rewind: revert', name: '⏪ revert: 代码回退' },
    { value: ':construction_worker: ci', name: '👷 对CI配置文件和脚本的更改' },
    { value: ':package: build', name: '📦️ build: 变更项目构建或外部依赖' },
    { value: ':construction: WIP', name: '🚧 WIP: 进行中的工作' }
  ],
  scopes: [
    { name: 'component' },
    { name: 'config' },
    { name: 'src' },
    { name: 'store' },
    { name: 'router' },
    { name: 'docs' }
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型(必填):',
    customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n)'
  },
  // 跳过问题
  skipQuestions: ['body', 'footer'],
  // subject文字长度默认是72
  subjectLimit: 72
}
