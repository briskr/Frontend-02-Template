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
  - 如果要使用 webpack-dev-server 调试，相应引入 `webpack-cli@3` (最新的 v4.x 报错，可能跟 webpack@4 不兼容) 和 `webpack-dev-server@3`
  - 如果创建 Vue 实例采用 template 属性，而不是用 render 函数，浏览器能显示 index.html 内容，但是 App.vue 组件的内容没显示出来，控制台报错
    - `You are using the runtime-only build of Vue`
    - webpack 打包引入的 vue 库默认是未包含模板编译功能的精简版本
    - 参照这篇文章增加了配置 `resolve` 进行 `vue` 引用版本的替换，不知道有没有更干净的办法 [vue.runtime.esm.js 改为含 template compiler 完整版](https://medium.com/@stefanledin/solve-the-you-are-using-the-runtime-only-build-of-vue-error-e675031f2c50)
