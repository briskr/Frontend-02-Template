var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async initPackageJson() {
    const answers = await this.prompt({
      type: 'input',
      name: 'projectName',
      message: 'Your project name:',
      default: 'vue-demo',
    });

    const pkgJson = {
      name: answers.projectName,
      version: '1.0.0',
      description: answers.projectName,
      private: true,
      main: 'index.js',
      scripts: {
        test: 'mocha --require @babel/register',
        coverage: 'nyc mocha',
        serve: 'webpack serve',
        build: 'webpack',
      },
      devDependencies: {},
      dependencies: {},
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.log('Installing dependencies...');

    // vue
    this.npmInstall(['vue'], { 'save-dev': false });

    // vue building
    this.npmInstall(
      [
        'webpack',
        'webpack-cli',

        'webpack-dev-server',
        // 运行 webpack-dev-server@3 命令依赖 webpack-cli@3, 不支持目前的 v4
        // (webpack-dev-server@3.11.0 声明依赖 "webpack": "^4.43.0", "webpack-cli": "^3.3.11")
        // 若安装 webpack@5 ，在安装 webpack-dev-server 的基础上，改用 `webpack serve` 命令
        //'webpack@4',
        //'webpack-cli@3',

        'vue-loader',
        'vue-template-compiler',
        'vue-style-loader',
        'css-loader',

        // 引入 ES6+ 语法转译需要这些
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
        // 单元测试 require 转译
        '@babel/register',

        //'copy-webpack-plugin',
        'html-webpack-plugin',

        // 单元测试
        'mocha',

        // nyc coverage
        'nyc',
        '@istanbuljs/nyc-config-babel',
        'babel-plugin-istanbul',
      ],
      {
        'save-dev': true,
      }
    );
  }

  copyFiles() {
    this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('src/index.html'), {
      title: this.appname,
    });
    this.fs.copyTpl(this.templatePath('main.js'), this.destinationPath('src/main.js'), {});
    this.fs.copyTpl(this.templatePath('App.vue'), this.destinationPath('src/App.vue'), {});
    this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'), {});
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
      appname: this.appname,
    });
    this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath('.gitignore'), {});
    this.fs.copyTpl(this.templatePath('.babelrc'), this.destinationPath('.babelrc'), {});
    this.fs.copyTpl(this.templatePath('.nycrc'), this.destinationPath('.nycrc'), {});

    this.fs.copyTpl(this.templatePath('sample-test.js'), this.destinationPath('test/sample-test.js'), {});
  }
};
