'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var s = require("underscore.string");

module.exports = yeoman.generators.Base.extend({
  initializing: function (args, options) {
    this.argument('moduleName', {
      required: false,
      type: String,
      desc: 'The module name'
    });
  },

  prompting: function () {
    if (this.moduleName) {
      this.moduleName = this.moduleName.split(':');
      this.props = {
        moduleName: this.moduleName[0],
        useI18n: this.moduleName[1],
        defaultLang: this.moduleName[2]
      };
    } else {
      var done = this.async();

      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the CI&T Angular Reference Architecture generator to module!'
      ));

      var prompts = [{
          name: 'moduleName',
          message: 'What\'s the module name?'
        },
      {
        name: 'defaultLang',
        message: 'What\'s your principal language?',
        default: 'en'
      },
        {
          type: 'confirm',
          name: 'useI18n',
          message: 'Would you like to use the i18n component?',
          default: true
        }
      ];

      this.prompt(prompts, function (props) {
        this.props = props;
        done();
      }.bind(this));
    }
  },

  writing: function () {
    //----
    // structure

    mkdirp('app/'+this.props.moduleName.toLowerCase());
    mkdirp('app/'+this.props.moduleName.toLowerCase()+'/components');
    mkdirp('app/'+this.props.moduleName.toLowerCase()+'/env');
    mkdirp('app/'+this.props.moduleName.toLowerCase()+'/features');

    if (this.props.useI18n) {
      mkdirp('app/'+this.props.moduleName.toLowerCase()+'/i18n');
    }

    //----
    // templates

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app/'+this.props.moduleName.toLowerCase()+'/'+this.props.moduleName.toLowerCase()+'-app.js'),
      this
    );

    //----
    // statics

    this.fs.copy(
      this.templatePath('env/env.debug.json'),
      this.destinationPath('app/'+this.props.moduleName.toLowerCase()+'/env/'+this.props.moduleName.toLowerCase()+'-env.debug.json')
    );
    this.fs.copy(
      this.templatePath('env/env.release.json'),
      this.destinationPath('app/'+this.props.moduleName.toLowerCase()+'/env/'+this.props.moduleName.toLowerCase()+'-env.release.json')
    );
    this.fs.copy(
      this.templatePath('env/env.tpl.js'),
      this.destinationPath('app/'+this.props.moduleName.toLowerCase()+'/env/'+this.props.moduleName.toLowerCase()+'-env.tpl.js')
    );

    if (this.props.useI18n) {
      this.fs.copy(
        this.templatePath('i18n/resources.json'),
        this.destinationPath('app/'+this.props.moduleName.toLowerCase()+'/i18n/resources_' + (this.props.defaultLang != 'en' ? 'en' : 'pt') + '.json')
      );
    }
  }
});