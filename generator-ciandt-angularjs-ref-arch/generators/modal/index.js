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
      'Welcome to the CI&T Angular Reference Architecture generator to modal!'
    ));

    var prompts = [{
      name: 'title',
      message: 'What\'s the modal title?'
    },
  	{
        name: 'module',
        message: 'What\'s the module?',
  	  default: 'core'
      },
  	{
        name: 'submodule',
        message: 'What\'s the submodule (*)?',
  	  default: ''
      },
    	{
        name: 'controller',
        message: 'What\'s the controller name (e.g.: SelectCustomer)?'
      },
	   {
      name: 'params',
      message: 'What are the parameters (*, e.g.: name, group)?',
	  default: ''
    }];

    this.prompt(prompts, function (props) {
      this.s = s;
	  this.props = props;
	  this.props.directiveName = 'app' + this.props.module.toLowerCase().capitalize();
	  if (this.props.submodule) {
	    this.props.directiveName += props.submodule.toLowerCase().capitalize();
	  }
	  this.props.directiveName += this.props.controller.toLowerCase().capitalize();
	  if (this.props.params) {
		this.props.params = "'" + s(this.props.params).trim().value().split(',').join("', '") + "'";
	  }
      done();
    }.bind(this));
  },

  writing: function () {
    var dest = 'app/' + this.props.module.toLowerCase() + '/features/';
	if (this.props.submodule) {
		dest += this.props.submodule.toLowerCase() + '/';
	}
	dest += this.props.controller.toLowerCase();
	mkdirp(dest);
    
	// controller
	this.fs.copyTpl(
      this.templatePath('ctrl.js'),
      this.destinationPath(dest + '/' + this.props.controller.toLowerCase() + '-ctrl.js'),
	  this
    );
	// view
	this.fs.copyTpl(
      this.templatePath('view.html'),
      this.destinationPath(dest + '/' + this.props.controller.toLowerCase() + '.html'),
	  this
    );
  }
});