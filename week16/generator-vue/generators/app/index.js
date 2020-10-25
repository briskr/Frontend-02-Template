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
        dev: 'webpack-dev-server',
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
    this.npmInstall(['vue'], { 'save-dev': false });
    this.npmInstall(
      [
        'webpack',
        'webpack-cli',

        // 使用 webpack v4 时可启用 dev-server v3
        //'webpack@4',
        //'webpack-cli@3',
        //'webpack-dev-server@3',

        'vue-loader',
        'vue-template-compiler',
        'css-loader',

        // 引入 ES6+ 语法转译需要这些
        //'babel-loader',
        //'@babel/core',
        //'@babel/preset-env',

        'html-webpack-plugin',
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
  }
};
