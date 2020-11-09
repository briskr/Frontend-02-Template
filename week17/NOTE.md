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
- 加入 launch.json 调试项，以 mocha 为入口测试
- runtimeArgs 向 node 传递参数，args 向被运行的脚本传递参数
- 分别在 `launch.json` 中、`.babelrc` 中启用 sourceMaps ，帮助调试断点定位转译前后的代码
- 反复迭代添加测试用例、调试测试用例、修改代码 bug、验证覆盖率的循环，直到达到足够的函数覆盖率、代码行覆盖率等

作业目前完成到消除完红色问题行，尚有黄色问题行

### 集成各项工具到 generator

- 在 week16 的 generator-vue 基础上，增加 mocha, nyc 相关的依赖、scripts 和 配置文件

具体代码见 generate-toytool 目录
