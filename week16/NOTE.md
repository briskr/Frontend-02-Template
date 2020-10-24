学习笔记

本周进入工具链部分

##

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
