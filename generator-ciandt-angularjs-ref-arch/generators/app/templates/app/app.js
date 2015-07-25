'use strict';

define([
    //## environment settings
    'json!app-common-env',

    //## Angular modules
    'angularAMD',
    'angular-route',

    //## Commons components
    'app-common',
], function (envSettings, angularAMD) {

    var $routeProviderReference;

    var app = angular.module("app", [
        //## Angular modules
        'ngRoute',

        //## Commons
        'app.common'
    ]);

    // store envSettings as a constant
    app.constant('envSettings', envSettings);

    app.config(['$routeProvider', '$httpProvider', 'authServiceProvider', <% if (props.useRestangular) {%>'RestangularProvider', <%}%>'$provide', 'ngMaskConfig', 'ciandt.components.utilities.UtilitiesProvider'<% if (props.useI18n) {%>, 'ciandt.components.i18n.LocalizeConfig'<%}%>, function ($routeProvider, $httpProvider, authServiceProvider, <% if (props.useRestangular) {%>RestangularProvider, <%}%>$provide, ngMaskConfig, Utilities<% if (props.useI18n) {%>, LocalizeConfig<%}%>) {
        var $log = angular.injector(['ng']).get('$log');

        // store local $routeProviderReference to be used during run, if it work with dynamic route mapping
        $routeProviderReference = $routeProvider;

        // configure default alias to the ngMask (cpf, cnpj, tel, etc)
        ngMaskConfig.alias = Utilities.ngMaskDefaultAlias;

        // configure default headers to work with CORS
        Utilities.enableCors($httpProvider);<% if (props.useRestangular) {%>

        // configure Restangular
        Utilities.configureRestangular(RestangularProvider);<% }%><% if (props.useI18n) {%>

        // configure language
        LocalizeConfig.defaultLanguage = '<%= props.defaultLang%>';<%}%>

        // configure authService
        $log.info('Configurando mecanismo de autenticação.');
        authServiceProvider.config({
            authUrlBase: envSettings.authUrlBase,
            storageKey: 'authData',
            signInUrl: '/auth',
            signOutUrl: '/auth/signout',
            handleTokenResponse: function (response, identity) {
                // complements for a identify
                //identity.name = response.name;
                //identity.email = response.email;
                //identity.cpf = response.cpf;
                return identity;
            }
        });
    }]);

    app.run(['$http', '$route', '$rootScope', '$location', 'authService', 'ciandt.components.dialogs.AlertHelper', '$timeout', '$injector', '$log'<% if (props.useI18n) {%>, 'ciandt.components.i18n.Localize'<%}%>, function ($http, $route, $rootScope, $location, authService, alertHelper, $timeout, $injector, $log<% if (props.useI18n) {%>, localize<%}%>) {
        <% if (props.useI18n) {%>$log.info('Configure i18n');
        localize.addResource('app/common/i18n/resources_{lang}.json');

        <%}%>$log.info('Initializing app context.');

        // store envSettings on rootScope
        $rootScope.envSettings = envSettings;

        // create a app context
        $rootScope.appContext = {
            defaultPageSize: 10
        };

        ////-------

        $log.info('Registry security events');

        function loadUserProfile(ev, identity) {
            // user authenticated
            $rootScope.appContext.identity = identity;

            $log.info('Load modules');

            // load app modules (e.g.: core, billing)
            factory.loadModules(['<%= props.moduleName%>'], <% if (props.useI18n) {%>function (module) {
                // adiciona path para i18n do sistema
                localize.addResource('app/' + module + '/i18n/resources_{lang}.json');
            }, <%}%>function () {
                // after load all modules and its dependencies, it can load routes

                $log.info('Load routes');

                $routeProviderReference
                    .when('/myModule/mySubmodule/myFeature1', angularAMD.route({
                        breadcrumb: ['My Module', 'My Submodule', 'My Feature 1'],
                        templateUrl: factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature1.html'),
                        controllerUrl: factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature1-ctrl.js')
                    })).
                    when('/myModule/mySubmodule/myFeature2', angularAMD.route({
                        breadcrumb: ['My Module', 'My Submodule', 'My Feature 2'],
                        templateUrl: factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature2.html'),
                        controllerUrl: [factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature2-ctrl.js'),
                                        factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature2-filter.js'),
                                        factory.getFileVersion('app/myModule/features/mySubmodule/myFeature2/myFeature2-directive.js')]
                    }));
            });

            if ($location.$$path == '/common/auth/signin' || $location.$$path == '/common/auth/signup') {
                $location.path("/");
            }
        }

        function resetUserProfile(ev, data, status, config, cause) {
            // user unauthenticated
            $routeProviderReference
                .when("/common/auth/signin", angularAMD.route({
                    templateUrl: 'app/common/features/auth/signin/signin.html',
                    controllerUrl: factory.getFileVersion('app/common/features/auth/signin/signin-ctrl.js')
                }));

            $routeProviderReference
                .when("/common/auth/signup", angularAMD.route({
                    templateUrl: 'app/common/features/auth/signup/signup.html',
                    controllerUrl: factory.getFileVersion('app/common/features/auth/signup/signup-ctrl.js')
                }));

            $route.reload();

            $location.path('/common/auth/signin');
        }

        // authenticate events
        $rootScope.$on('auth:login-success', loadUserProfile);
        $rootScope.$on('auth:validation-success', loadUserProfile);

        // unauthenticate events
        $rootScope.$on('auth:login-error', resetUserProfile);
        $rootScope.$on('auth:session-expired', resetUserProfile);
        $rootScope.$on('auth:validation-error', resetUserProfile);
        $rootScope.$on('auth:logout-success', resetUserProfile);
        $rootScope.$on('auth:logout-error', resetUserProfile);
        $rootScope.$on('auth:invalid', resetUserProfile);

        ////-------

        // initialize authService
        $log.info('Initializing authService');
        authService.initialize();
    }]);

    // AppCtrl: possui controles gerais da aplicação, como a parte de locale e também de deslogar
    app.controller("app.common.AppCtrl", [<% if (props.useI18n) {%>"ciandt.components.i18n.Localize", <%}%>'authService', function (<% if (props.useI18n) {%>localize, <%}%>authService) {
        var vm = this;<% if (props.useI18n) {%>

        vm.setLanguage = function (language) {
            localize.setLanguage(language);
        };

        vm.getLanguage = function () {
            return localize.getLanguage();
        };<%}%>

        vm.signout = function () {
            authService.signOut();
        };
    }])

    return angularAMD.bootstrap(app);
});