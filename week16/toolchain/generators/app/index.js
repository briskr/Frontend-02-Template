var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  /* 
  async prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
      {
        type: 'confirm',
        name: 'cool',
        message: 'Would you like to enable the Cool feature?',
      },
    ]);

    this.log('app name:', answers.name);
    this.log('cool feature:', answers.cool);
  }
 */

  initPackageJson() {
    const pkgJson = {
      name: 'generated-demo',
      version: '1.0.0',
      description: 'just a demo',
      author: 'anonymous',
      license: 'ISC',
      devDependencies: {
        eslint: '^3.15.0',
      },
      dependencies: {
        react: '^16.2.0',
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  writing() {
    this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('public/index.html'), {
      title: 'Title by Yeoman',
    });
  }

  install() {
    this.log('Installing dependencies...');
    this.npmInstall();
  }
};
