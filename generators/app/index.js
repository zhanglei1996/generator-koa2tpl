"use strict";
const Generator = require("yeoman-generator");
const path = require('path')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("project", {
      type: String,
      required: false,
    });

    this.name = path.basename(process.cwd());
  }

  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "project",
        message: "Your project name",
        default: this.name,
      },
    ]).then(answers => {
        this.project = answers.project || this.options.project;
    })
  }

  writing() {
      const templates = ['./','./.*']
      templates.forEach(item => {
        this.fs.copyTpl(this.templatePath(item), this.destinationPath("./"), {
            project: this.project
          });
      })
  }
};
