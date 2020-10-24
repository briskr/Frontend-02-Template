学习笔记

本周进入工具链部分

### Yeoman 基础

脚手架 / generator - 自动生成项目的初始结构

[Yeoman](https://yeoman.io/authoring/) - 脚手架生成器

- 创建一个 yeoman-generator 项目

  - 新建项目，命名要求以 `generator-` 打头
  - 项目中安装依赖: yeoman-generator
  - 要求的目录结构: generators / app (默认的子模块) / index.js
  - 自己的类继承 yeoman-generator 模块导出的 Generator 类
  - 项目根目录下执行 `npm link` - 在 npm 全局库目录下创建链接
  - 全局安装 `npm i -g yo`
  - 命令行 `yo <name>`
  - yeoman 会顺次执行该类中定义的方法

- Generator 类提供的常用功能

  - this.log
    - 标签和值，会被自动加上颜色等
  - this.prompt()
    - 可传入多个提示参数对象，通过 await 逐个执行
    - 显示 message 内容，提示输入
    - 具有 input / confirm 等类型
  - 文件模板
    - generator 子模块下建立 templates 目录
    - `this.fs.copyTpl()` 函数可将 templates 下的文件进行变量替换后，复制到目标目录
  - 管理 npm 依赖
    - `this.fs.extendJSON()` 在目标目录下填充 json 文件
    - `this.npmInstall()` 执行安装(可带参数指定要安装的包，不带参数则按 package.json 执行)

### 实例：应用 yeoman 创建 vue 项目

见 generator-vue 目录下的代码。

- 实际操作中遇到的问题记录
  - 保留了 HtmlWebpackPlugin 来复制 html 文件并注入 bundle 过的脚本，相应配置了其使用 src/index.html 作为输入文件
  - Webpack 当前最新版本为 5.x，遇到报错
    - `Webpack 5: The 'compilation' argument must be an instance of Compilation`
    - 简单查了一下，是 webpack v5 引入的变更引起某个地方不兼容
    - 参考 https://github.com/jantimon/html-webpack-plugin/issues/1451
    - 最后选择降级，调用 `this.npmInstall` 函数时改用 `webpack@4`
  - 如果要使用 `/\.js$/` 应用 babel-loader 转译，相应增加安装 `@babel/core` 和 `@babel/preset-env`
  - 如果要使用 webpack-dev-server 调试，相应引入 `webpack` 和 `webpack-dev-server@3`
  - 如果创建 Vue 实例采用 template 属性，而不是用 render 函数，浏览器能显示 index.html 内容，但是 App.vue 组件的内容没显示出来，控制台报错
    - `You are using the runtime-only build of Vue`
    - webpack 打包引入的 vue 库默认是未包含模板编译功能的精简版本
    - 参照这篇文章增加了配置 `resolve` 进行 `vue` 引用版本的替换，不知道有没有更干净的办法 [vue.runtime.esm.js 改为含 template compiler 完整版](https://medium.com/@stefanledin/solve-the-you-are-using-the-runtime-only-build-of-vue-error-e675031f2c50)

### build 阶段工具介绍 - webpack

- 设计思路
  - 最初目的是把 Node 环境可用的代码打包生成浏览器环境可用的代码，未考虑 HTML 处理
  - 实现逻辑是把所有 JS 打包之后，再向 HTML 中加入 JS 引用
  - 多文件合并过程中，通过 loader 和 plugin 配合处理，进行文本转换等

webpack-cli: 命令行外壳

- 两种安装方式
- 模式 1: 全局安装一份 webpack-cli
  - 同时全局安装 webpack 和 webpack-cli 才能在 shell 中全局使用 `webpack` 命令
- (推荐)模式 2: 不全局安装，项目内 --save-dev 安装 webpack-cli，然后 shell 中 `npx webpack` 执行

- 基本配置

  - 采用 js 模块形式
  - entry
    - 单入口 - 路径字符串
    - 多入口 - 配置对象 { 名称 1: 路径 1, ...}
    - 逐个入口进行，对每个文件的依赖树进行打包
  - output
    - path 输出路径
    - filename 文件名

- 对文件进行处理的主体: loader

  - 工作内容 - 文本转换
  - 配置形式 - 配置对象的 module 属性

  ```javascript
  module: {
    rules: [{ test: /\.ext$/, use: '' }];
  }
  ```

  - 根据文件后缀名选择 loader；一个后缀可以配置一系列 loader 依次处理

  ```javascript
  {
    test: /\\.css$/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      },
      { loader: 'sass-loader' }
    ]
  }
  ```

- plugin 是独立工作，进行某种特定处理的单元 - 在 loaders 处理的流程之外起作用

### build 阶段工具介绍 - babel

负责把新版本 js 语法、库函数等转译成旧版本运行环境可接受的版本

- 项目内安装
  - `npm i -D @babel/core @babel/cli`
  - 常规配置文件 .babelrc
    - 简化使用: 预制配置集合 preset - 最常见的 preset-env
  - babel 命令最简单的用法：单个参数:输入文件名，输出到 stdout
  - 在 webpack.config.js 中配置 babel-loader 使用，处理项目中的所有 js 文件
    - babel-loader 的 options 参数中，可以加载 presets 和 plugins
    - 参见 week12 代码中的使用