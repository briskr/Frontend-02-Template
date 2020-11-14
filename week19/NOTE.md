学习笔记

## 持续集成

### 历史发展

- 客户端软件集成

  - 多模块集成联调
  - 实践： daily (nightly) build
  - Build Verification Test, 冒烟测试

- Web 前端集成
  - 构建时间较短；上线周期较短；e2e 测试成本相对较高
  - 实践：
    - build on commit
    - 小提交做 lint ，单元测试
    - 大变更做 e2e 验证 (headless browser)
  - BVT 例子: 图片面积与文件大小不成比例

### git hook

[Pro Git 书中对 Git Hooks 的介绍](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

.git/hooks 中含 hooks 示例

- 客户端常用的 hook
  - pre-commit - 通常在这一步做 lint
  - pre-push - 通常在这一步做 check
- 服务端常用 pre-receive 做检查

实验：在 git-demo/.git/hooks 目录内创建 pre-commit 脚本，验证脚本被执行，及阻止提交的功能

```javascript
#!/usr/bin/env node
const process = require('process');
console.log('hook aborting commit');
process.exit(1);
```

### eslint 简介

- 基本用法

  - 安装 eslint
  - 初始配置: `npx eslint --init`
  - 语法规则集合称为 preset, 可以由插件提供

### 在 git hook 脚本中调用 eslint API

- [ESlint Node.js API](https://eslint.org/docs/developer-guide/nodejs-api)

(vscode 中编辑不带扩展名的 js 文件需要识别一下才能着色)

- 改为检查已 stage 版本，而非 working 版本
  - 检查前 `git stash -k` ( --keep-index )暂存尚未进入 stage 的变更，检查后 `stash pop` 恢复
  - 引入 child_process.exec 来执行上述命令行操作

详见 git-demo 目录内修改历史(pre-commit 脚本内容已复制到外面)

- 服务端 web hooks 由服务方应用程序提供，不是 git 本身的能力，具体用法查文档

### 用 headless browser 进行 DOM 检查

(放弃 PhantomJS 改用 Chrome Headless 模式)

- `chrome --headless`

- [puppeteer](https://github.com/puppeteer/puppeteer#readme)
