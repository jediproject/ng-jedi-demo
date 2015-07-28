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
				message: 'What\'s the app\'s name?'
			},
			{
				name: 'appTitle',
				message: 'What\'s the app\'s title?'
			},
			{
				name: 'moduleName',
				message: 'What\'s the principal module name?',
				default: 'core'
			},
			{
				name: 'defaultLang',
				message: 'What\'s the principal language?',
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
			done();
		}.bind(this));
	},

	writing: function () {
		//----
		// structure

		mkdirp('mocks');

		mkdirp('assets');
		mkdirp('assets/fonts');
		mkdirp('assets/css');
		mkdirp('assets/js');
		mkdirp('assets/img');

		mkdirp('app');
		mkdirp('app/common');
		mkdirp('app/common/components');
		mkdirp('app/common/components/exceptions');
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

		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath('index.html'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('assetsfiles.json'),
			this.destinationPath('assetsfiles.json'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('app/app.js'),
			this.destinationPath('app/app.js'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('app/common/common-app.js'),
			this.destinationPath('app/common/common-app.js'),
			this
		);

		if (this.props.useI18n) {
			this.fs.copyTpl(
				this.templatePath('app/common/i18n/resources.json'),
				this.destinationPath('app/common/i18n/resources_' + (this.props.defaultLang != 'en' ? 'en' : 'pt') + '.json'),
				this
			);
		}

		this.fs.copyTpl(
			this.templatePath('app/common/components/components.js'),
			this.destinationPath('app/common/components/components.js'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('app/common/components/header/header.html'),
			this.destinationPath('app/common/components/header/header.html'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('_bower.json'),
			this.destinationPath('bower.json'),
			this
		);

		this.fs.copyTpl(
			this.templatePath('mocks/config.json'),
			this.destinationPath('mocks/config.json'),
			this
		);

		// //----
		// // statics
		
		this.fs.copy(
			this.templatePath('version.tpl.json'),
			this.destinationPath('version.tpl.json')
		);
		
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

			// mocks
			this.fs.copy(
				this.templatePath('mocks/auth/admin.json'),
				this.destinationPath('mocks/auth/admin.json')
			);
			this.fs.copy(
				this.templatePath('mocks/auth/fail.json'),
				this.destinationPath('mocks/auth/fail.json')
			);
			this.fs.copy(
				this.templatePath('mocks/auth/user.json'),
				this.destinationPath('mocks/auth/user.json')
			);
		}

		this.fs.copy(
			this.templatePath('app/common/env/common-env.develop.json'),
			this.destinationPath('app/common/env/common-env.develop.json')
		);
		this.fs.copy(
			this.templatePath('app/common/env/common-env.release.json'),
			this.destinationPath('app/common/env/common-env.release.json')
		);
		this.fs.copy(
			this.templatePath('app/common/env/common-env.master.json'),
			this.destinationPath('app/common/env/common-env.master.json')
		);
		this.fs.copy(
			this.templatePath('app/common/env/common-env.tpl.json'),
			this.destinationPath('app/common/env/common-env.tpl.json')
		);

		this.fs.copy(
			this.templatePath('app/common/components/exceptions/exceptions.js'),
			this.destinationPath('app/common/components/exceptions/exceptions.js')
		);

		this.fs.copy(
			this.templatePath('assets/css/app.css'),
			this.destinationPath('assets/css/app.css')
		);

		this.fs.copy(
			this.templatePath('assets/img/en-US.png'),
			this.destinationPath('assets/img/en-US.png')
		);

		this.fs.copy(
			this.templatePath('assets/img/pt-BR.png'),
			this.destinationPath('assets/img/pt-BR.png')
		);

		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath('.gitignore')
		);

		this.fs.copy(
			this.templatePath('_Gruntfile.js'),
			this.destinationPath('Gruntfile.js')
		);
	},

	end: function () {
		this.composeWith('ciandt-angularjs-ref-arch:module', {args: [this.props.moduleName + ':' + this.props.useI18n + ':' + this.props.defaultLang]});
		this.composeWith('ciandt-angularjs-ref-arch:controller', {args: ['My Feature 1:' + this.props.moduleName + ':mysubmodule:myfeature1']});
		this.composeWith('ciandt-angularjs-ref-arch:controller', {args: ['My Feature 2:' + this.props.moduleName + ':mysubmodule:myfeature2']});
	},

	install: function () {
		//this.installDependencies();
	}
});