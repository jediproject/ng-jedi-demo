'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
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
			'Welcome to the CI&T Angular Reference Architecture generator!'
		));

		var prompts = [{
				name: 'appName',
				message: 'What\'s your app\'s name?'
			},
			{
				name: 'appTitle',
				message: 'What\'s your app\'s title?'
			},
			{
				name: 'moduleName',
				message: 'What\'s your principal module name?',
				default: 'core'
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
			},
			{
				type: 'confirm',
				name: 'useBreadcrumb',
				message: 'Would you like to use the breadcrumb component?',
				default: true
			},
			/*{
				type: 'confirm',
				name: 'useRestangular',
				message: 'Would you like to use the restangular component?',
				default: true
			},*/
			{
				type: 'confirm',
				name: 'generateAuth',
				message: 'Would you like to generate auth pages?',
				default: true
			}
		];

		this.prompt(prompts, function (props) {
			this.props = props;
			this.props.useRestangular = true;
			//this.composeWith('ciandt-angularjs-ref-arch:module', { args: [this.props.moduleName, this.props.useI18n] });
			done();
		}.bind(this));
	},

	writing: function () {
		//----
		// structure

		mkdirp('assets');
		mkdirp('assets/fonts');
		mkdirp('assets/css');
		mkdirp('assets/js');
		mkdirp('assets/img');

		mkdirp('app');
		mkdirp('app/common');
		mkdirp('app/common/components');
		mkdirp('app/common/components/exceptions');
		mkdirp('app/common/components/navigation');
		mkdirp('app/common/components/header');
		mkdirp('app/common/env');

		if (this.props.generateAuth) {
			mkdirp('app/common/features');
			mkdirp('app/common/features/auth');
			mkdirp('app/common/features/auth/signin');
			mkdirp('app/common/features/auth/signup');
		}
		
		if (this.props.useI18n) {
			mkdirp('app/common/i18n');
		}

		//----
		// templates

		this.fs.copyTpl(
			this.templatePath('main.tpl.js'),
			this.destinationPath('main.tpl.js'),
			this
		);
this.log('2');
		this.fs.copyTpl(
			this.templatePath('index.tpl.html'),
			this.destinationPath('index.tpl.html'),
			this
		);
this.log('3');
		this.fs.copyTpl(
			this.templatePath('app/app.js'),
			this.destinationPath('app/app.js'),
			this
		);
this.log('4');
		this.fs.copyTpl(
			this.templatePath('app/common/common-app.js'),
			this.destinationPath('app/common/common-app.js'),
			this
		);
this.log('5');
		if (this.props.useI18n) {
			this.fs.copyTpl(
				this.templatePath('app/common/i18n/resources.json'),
				this.destinationPath('app/common/i18n/resources_' + (this.props.defaultLang != 'en' ? 'en' : 'pt') + '.json'),
				this
			);
		}
this.log('6');
		this.fs.copyTpl(
			this.templatePath('app/common/components/components.js'),
			this.destinationPath('app/common/components/components.js'),
			this
		);
this.log('7');
		this.fs.copyTpl(
			this.templatePath('app/common/components/header/header.html'),
			this.destinationPath('app/common/components/header/header.html'),
			this
		);
this.log('8');
		this.fs.copyTpl(
			this.templatePath('app/common/components/navigation/navigation.html'),
			this.destinationPath('app/common/components/navigation/navigation.html'),
			this
		);
this.log('9');
		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'),
			this
		);
this.log('10');
		this.fs.copyTpl(
			this.templatePath('_bower.json'),
			this.destinationPath('bower.json'),
			this
		);

		// //----
		// // statics
		
		if (this.props.generateAuth) {
			this.fs.copy(
				this.templatePath('app/common/features/auth/signin/signin-ctrl.js'),
				this.destinationPath('app/common/features/auth/signin/signin-ctrl.js')
			);
			this.fs.copyTpl(
				this.templatePath('app/common/features/auth/signin/signin.html'),
				this.destinationPath('app/common/features/auth/signin/signin.html'),
				this
			);
			this.fs.copy(
				this.templatePath('app/common/features/auth/signup/signup-ctrl.js'),
				this.destinationPath('app/common/features/auth/signup/signup-ctrl.js')
			);
			this.fs.copyTpl(
				this.templatePath('app/common/features/auth/signup/signup.html'),
				this.destinationPath('app/common/features/auth/signup/signup.html'),
				this
			);
		}

		this.fs.copy(
			this.templatePath('app/common/env/common-env.debug.json'),
			this.destinationPath('app/common/env/common-env.debug.json')
		);
		this.fs.copy(
			this.templatePath('app/common/env/common-env.release.json'),
			this.destinationPath('app/common/env/common-env.release.json')
		);
		this.fs.copy(
			this.templatePath('app/common/env/common-env.tpl.js'),
			this.destinationPath('app/common/env/common-env.tpl.js')
		);

		this.fs.copy(
			this.templatePath('app/common/components/exceptions/exceptions.js'),
			this.destinationPath('app/common/components/exceptions/exceptions.js')
		);

		this.fs.copy(
			this.templatePath('app/common/components/navigation/navigation-directives.js'),
			this.destinationPath('app/common/components/navigation/navigation-directives.js')
		);

		this.fs.copy(
			this.templatePath('assets/css/app.css'),
			this.destinationPath('assets/css/app.css')
		);

		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath('.gitignore')
		);

		//----
		// generate module
		// var done = this.async();
		// this.invoke("ciandt-angularjs-ref-arch:module", {args: [this.props.moduleName, this.props.useI18n]}, function(){
		// 	done();
		// });
	},

	install: function () {
		//this.installDependencies();
	}
});