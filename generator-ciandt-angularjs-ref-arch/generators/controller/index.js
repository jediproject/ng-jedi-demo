'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var s = require("underscore.string");

String.prototype.capitalize = function() {
    return s(this).capitalize().value();
}

String.prototype.decapitalize = function() {
    return s(this).decapitalize().value();
}

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the CI&T Angular Reference Architecture generator to controller!'
    ));

    var prompts = [{
      name: 'module',
      message: 'What\'s the module?',
	  default: 'core'
    },
	{
      name: 'submodule',
      message: 'What\'s the submodule (optional)?',
	  default: ''
    },
	{
      name: 'controller',
      message: 'What\'s the controller name (e.g.: OrderManager)?'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var dest = 'app/' + this.props.module.toLowerCase() + '/features/';
	if (this.props.submodule) {
		dest += props.submodule.toLowerCase() + '/';
	}
	dest += this.props.controller.toLowerCase();
	mkdirp(dest);

	// controller
    this.fs.copyTpl(
      this.templatePath('ctrl.js'),
      this.destinationPath(dest + '/' + this.props.controller.toLowerCase() + '-ctrl.js'),
	  this
    );

    this.fs.copyTpl(
      this.templatePath('view.html'),
      this.destinationPath(dest + '/' + this.props.controller.toLowerCase() + '.html'),
    this
    );
  }
});