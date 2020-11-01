学习笔记

## 单元测试工具

### 单元测试 Mocha

- 练习[Mocha](https://mochajs.org/)基本用法
- 为了支持 ES Module 语法引入 babel

  - 单元测试常用作 CI 的早期阶段，不适合依赖 dist build 的结果，因此最好不要依赖 webpack 调用 babel
  - [@babel/register](https://babeljs.io/docs/en/babel-register) ([zh](https://www.babeljs.cn/docs/babel-register)) - 附加在 Node 的 require 函数上，require 模块时自动转译
  - 安装 @babel/core, @babel/register, @babel/preset-env 随后执行
    ```
    npx mocha --require @babel/register
    ```

- 在 package.json 的 scripts 中加入测试命令行
  - 会自动向 PATH 中添加 ./node_modules/.bin

### 覆盖率测试 nyc

[nyc on github](https://github.com/istanbuljs/nyc)

- 基本用法：

  - `nyc mocha`

- 增加支持 ES module
  - 安装 `@istanbuljs/nyc-config-babel` `babel-plugin-istanbul`
  - 分别配置 .nycrc 和 .babelrc 添加插件

覆盖率测试可用来验证测试用例的质量；单元测试则是验证业务代码是否满足测试用例的要求。

### 单元测试应用实例

- 引入第 4 周 html parser 代码，搭建 mocha + nyc 测试框架

TODO 尚未完成
